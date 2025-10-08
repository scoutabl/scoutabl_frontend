import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL

const createQuestion = async (payload) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  console.log('Access Token:', accessToken);
  console.log('Payload being sent:', payload);
  console.log('Authorization header:', headers.Authorization);
  const { data } = await axios.post(`${BASE_API_URL}/questions/`, payload, { headers });
  return data;
};

const getAssessment = async (assessmentId) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const { data } = await axios.get(`${BASE_API_URL}/assessments/${assessmentId}/`, {
    headers: {
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return data;
};
// const getAssessment = async (assessmentId) => {
//   const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
//   const { data } = await axios.get(`${BASE_API_URL}/assessments/${assessmentId}/`, {
//     headers: {
//       'Authorization': accessToken ? `Bearer ${accessToken}` : '',
//     },
//   });
//   return data;
// };

const getQuestion = async (questionId) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const { data } = await axios.get(`${BASE_API_URL}/questions/${questionId}/`, {
    headers: {
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return data;
};

export const useAssessmentQuestions = (assessmentId) => {
  return useQuery({
    queryKey: ['assessment-questions', assessmentId],
    queryFn: async () => {
      const assessment = await getAssessment(assessmentId);
      const questionIds = assessment.custom_questions || [];
      const questions = await Promise.all(questionIds.map(getQuestion));
      return questions;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes: data is fresh for 5 minutes
    refetchOnWindowFocus: false, // don't refetch when window regains focus
    refetchOnMount: false, // don't refetch on mount if data is fresh
  });
};

const patchAssessment = async ({ assessmentId, questionId }) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  // 1. Fetch current assessment
  const assessment = await getAssessment(assessmentId);
  const currentCustomQuestions = assessment.custom_questions || [];
  // 2. Append new questionId (avoid duplicates)
  const updatedQuestions = Array.from(new Set([...currentCustomQuestions, questionId]));
  // 3. Patch with updated array
  const { data } = await axios.patch(`${BASE_API_URL}/assessments/${assessmentId}/`, {
    custom_questions: updatedQuestions,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return data;
};

//add question to assessment
export const useAddQuestion = (assessmentId, onSuccess) => {
  const queryClient = useQueryClient();

  const patchMutation = useMutation({
    mutationFn: patchAssessment,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      onSuccess?.(data);
    },
  });

  return useMutation({
    mutationFn: createQuestion,
    onSuccess: (questionData) => {
      patchMutation.mutate({ assessmentId, questionId: questionData.id });
    },
    onError: (error) => {
      toast.error('Failed to save question.');
    },
  });
};

//remove question from assessment
const removeQuestionFromAssessment = async ({ assessmentId, questionId }) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  // 1. Fetch current assessment
  const { data: assessment } = await axios.get(`${BASE_API_URL}/assessments/${assessmentId}/`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  const updatedQuestions = (assessment.custom_questions || []).filter(id => id !== questionId);
  // 2. Patch with updated array
  await axios.patch(`${BASE_API_URL}/assessments/${assessmentId}/`, {
    custom_questions: updatedQuestions,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
};

export const useRemoveQuestion = (assessmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId }) => removeQuestionFromAssessment({ assessmentId, questionId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      toast.success("Question deleted"); // <-- Add this line
    },
  });
};

//update question 
const updateQuestion = async ({ questionId, payload }) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
  };
  const { data } = await axios.patch(`${BASE_API_URL}/questions/${questionId}/`, payload, { headers });
  return data;
};

export const useUpdateQuestion = (assessmentId, onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, payload }) => updateQuestion({ questionId, payload }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      onSuccess?.(data);
      toast.success("Question updated");
    },
    onError: () => {
      toast.error("Failed to update question.");
    }
  });
};

// Duplicate a question by fetching its data and creating a new one
export const duplicateQuestion = async ({ questionId, assessmentId }) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
  };

  // 1. Fetch the original question
  const { data: original } = await axios.get(`${BASE_API_URL}/questions/${questionId}/`, { headers });

  // 2. Prepare the payload for the new question (remove id, update title, etc.)
  const { id, created_at, updated_at, polymorphic_ctype, library, ...rest } = original;

  // Clean choices array
  const cleanedChoices = (rest.choices || []).map(choice => ({
    text: choice.text,
    is_correct: choice.is_correct,
    // include other fields only if required by your API, e.g. order
  }));

  const payload = {
    ...rest,
    title: `Copy of ${rest.title || ''}`,
    save_template: false,
    choices: cleanedChoices,
    // Only include other fields if your API requires them
  };

  // 3. Create the new question
  const { data: newQuestion } = await axios.post(`${BASE_API_URL}/questions/`, payload, { headers });

  // 4. Add the new question to the assessment
  await patchAssessment({ assessmentId, questionId: newQuestion.id });

  return newQuestion;
};

export const useDuplicateQuestion = (assessmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId }) => duplicateQuestion({ questionId, assessmentId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      toast.success('Question duplicated');
    },
    onError: () => {
      toast.error('Failed to duplicate question');
    }
  });
};

// New API methods

// Delete question permanently
const deleteQuestion = async (questionId) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const { data } = await axios.delete(`${BASE_API_URL}/questions/${questionId}/`, {
    headers: {
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return data;
};

export const useDeleteQuestion = (assessmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      queryClient.invalidateQueries(['questions']);
      toast.success('Question deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete question');
    }
  });
};

// Get questions filtered by type
const getQuestionsByType = async (questionType, params = {}) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const queryParams = new URLSearchParams({
    question_type: questionType,
    ...params
  });
  
  const { data } = await axios.get(`${BASE_API_URL}/questions/?${queryParams}`, {
    headers: {
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return data;
};

export const useQuestionsByType = (questionType, params = {}) => {
  return useQuery({
    queryKey: ['questions', 'by-type', questionType, params],
    queryFn: () => getQuestionsByType(questionType, params),
    enabled: !!questionType,
  });
};

// Get all questions for a specific assessment
const getQuestionsByAssessment = async (assessmentId, params = {}) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const queryParams = new URLSearchParams({
    assessment_id: assessmentId,
    ...params
  });
  
  const { data } = await axios.get(`${BASE_API_URL}/questions/?${queryParams}`, {
    headers: {
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return data;
};

export const useQuestionsByAssessment = (assessmentId, params = {}) => {
  return useQuery({
    queryKey: ['questions', 'by-assessment', assessmentId, params],
    queryFn: () => getQuestionsByAssessment(assessmentId, params),
    enabled: !!assessmentId,
  });
};

// Search questions by title/content
const searchQuestions = async (searchTerm, params = {}) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const queryParams = new URLSearchParams({
    search: searchTerm,
    ...params
  });
  
  const { data } = await axios.get(`${BASE_API_URL}/questions/?${queryParams}`, {
    headers: {
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return data;
};

export const useSearchQuestions = (searchTerm, params = {}) => {
  return useQuery({
    queryKey: ['questions', 'search', searchTerm, params],
    queryFn: () => searchQuestions(searchTerm, params),
    enabled: !!searchTerm && searchTerm.length > 2, // Only search if term is longer than 2 chars
  });
};

// Get question statistics/analytics
const getQuestionStats = async (questionId) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const { data } = await axios.get(`${BASE_API_URL}/questions/${questionId}/stats/`, {
    headers: {
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  return data;
};

export const useQuestionStats = (questionId) => {
  return useQuery({
    queryKey: ['question-stats', questionId],
    queryFn: () => getQuestionStats(questionId),
    enabled: !!questionId,
  });
};