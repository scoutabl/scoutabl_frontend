import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
  console.log(data)
  return data;
};

export const useAssessmentQuestions = (assessmentId) => {
  return useQuery({
    queryKey: ['assessment-questions', assessmentId],
    queryFn: async () => {
      const assessment = await getAssessment(assessmentId);
      const questionIds = assessment.custom_questions || [];
      // Fetch all questions in parallel
      const questions = await Promise.all(questionIds.map(getQuestion));
      return questions;
    }
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

export const useAddQuestion = (assessmentId, onSuccess) => {
  const queryClient = useQueryClient();

  const patchMutation = useMutation({
    mutationFn: patchAssessment,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['questions']);
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