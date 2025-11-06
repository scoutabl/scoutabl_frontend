import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import BaseAPI from './base';

const QUESTION_URL = "/questions/";

class QuestionAPI extends BaseAPI {
    constructor() {
        super();
    }

    async createQuestion(payload) {
        return (await this.post(QUESTION_URL, payload)).data;
    }

    async getQuestion(questionId) {
        const url = `${QUESTION_URL}${questionId}/`;
        return (await this.get(url)).data;
    }

    async updateQuestion(questionId, payload) {
        const url = `${QUESTION_URL}${questionId}/`;
        return (await this.patch(url, payload)).data;
    }

    async deleteQuestion(questionId) {
        const url = `${QUESTION_URL}${questionId}/`;
        return (await this.delete(url)).data;
    }

    async getQuestionsByType(questionType, params = {}) {
        const queryParams = this.paramsToString({
            question_type: questionType,
            ...params
        });
        const url = `${QUESTION_URL}?${queryParams}`;
        return (await this.get(url)).data;
    }

    async searchQuestions(searchTerm, params = {}) {
        const queryParams = this.paramsToString({
            search: searchTerm,
            ...params
        });
        const url = `${QUESTION_URL}?${queryParams}`;
        return (await this.get(url)).data;
    }

    async duplicateQuestion(questionId) {
        const url = `${QUESTION_URL}${questionId}/duplicate/`;
        return (await this.post(url)).data;
    }

    async getQuestionStats(questionId) {
        const url = `${QUESTION_URL}${questionId}/stats/`;
        return (await this.get(url)).data;
    }

    async getQuestionsByAssessment(assessmentId, params = {}) {
        const queryParams = this.paramsToString({
            assessment_id: assessmentId,
            ...params
        });
        const url = `${QUESTION_URL}?${queryParams}`;
        return (await this.get(url)).data;
    }
}

const questionAPI = new QuestionAPI();

// Export the API instance and individual methods
export { questionAPI };
export const createQuestion = questionAPI.createQuestion.bind(questionAPI);
export const getQuestion = questionAPI.getQuestion.bind(questionAPI);
export const updateQuestion = questionAPI.updateQuestion.bind(questionAPI);
export const deleteQuestion = questionAPI.deleteQuestion.bind(questionAPI);
export const getQuestionsByType = questionAPI.getQuestionsByType.bind(questionAPI);
export const searchQuestions = questionAPI.searchQuestions.bind(questionAPI);
export const duplicateQuestion = questionAPI.duplicateQuestion.bind(questionAPI);
export const getQuestionStats = questionAPI.getQuestionStats.bind(questionAPI);
export const getQuestionsByAssessment = questionAPI.getQuestionsByAssessment.bind(questionAPI);

// Get assessment data
const getAssessment = async (assessmentId) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const { data } = await questionAPI.get(`/assessments/${assessmentId}/`);
  return data;
};

// Get all questions for a specific assessment
export const useAssessmentQuestions = (assessmentId) => {
  return useQuery({
    queryKey: ['assessment-questions', assessmentId],
    queryFn: async () => {
      const assessment = await getAssessment(assessmentId);
      const questionIds = assessment.custom_questions || [];
      const questions = await Promise.all(questionIds.map(getQuestion));
      return questions;
    },
    enabled: !!assessmentId,
  });
};

// Add question to assessment
export const useAddQuestion = (assessmentId, onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuestion,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      queryClient.invalidateQueries(['assessment', assessmentId]);
      queryClient.invalidateQueries(['questions']);
      onSuccess && onSuccess(data);
    },
  });
};

// Update question
export const useUpdateQuestion = (assessmentId, onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, payload }) => updateQuestion(questionId, payload),
    onMutate: async ({ questionId, payload }) => {
      // Cancel outgoing refetches to avoid race conditions
      await queryClient.cancelQueries(['assessment-questions', assessmentId]);
      
      // Snapshot current data for rollback
      const previousQuestions = queryClient.getQueryData(['assessment-questions', assessmentId]);
      
      // Optimistically update the cache
      queryClient.setQueryData(['assessment-questions', assessmentId], (old) => {
        if (!old) return old;
        
        return old.map(question => 
          question.id === questionId 
            ? { ...question, ...payload }
            : question
        );
      });
      
      return { previousQuestions };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousQuestions) {
        queryClient.setQueryData(['assessment-questions', assessmentId], context.previousQuestions);
      }
      toast.error('Failed to update question');
    },
    onSettled: () => {
      // Ensure server state consistency
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
    },
    onSuccess: (data) => {
      onSuccess && onSuccess(data);
    },
  });
};

// Remove question from assessment
export const useRemoveQuestion = (assessmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assessmentId: id, questionId }) => {
     
      return questionAPI.patch(`/assessments/${id}/`, {
        custom_questions: [], // Remove the question
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      queryClient.invalidateQueries(['assessment', assessmentId]);
    },
  });
};

// Delete question permanently
export const useDeleteQuestion = (assessmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      queryClient.invalidateQueries(['assessment', assessmentId]);
      queryClient.invalidateQueries(['questions']);
    },
  });
};

// Duplicate question
export const useDuplicateQuestion = (assessmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId }) => duplicateQuestion(questionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['assessment-questions', assessmentId]);
      queryClient.invalidateQueries(['assessment', assessmentId]);
      queryClient.invalidateQueries(['questions']);
      toast.success('Question duplicated successfully');
    },
    onError: (error) => {
      toast.error('Failed to duplicate question');
    },
  });
};

// Get questions filtered by type
export const useQuestionsByType = (questionType, params = {}) => {
  return useQuery({
    queryKey: ['questions', 'by-type', questionType, params],
    queryFn: () => getQuestionsByType(questionType, params),
    enabled: !!questionType,
  });
};

// Get all questions for a specific assessment
export const useQuestionsByAssessment = (assessmentId, params = {}) => {
  return useQuery({
    queryKey: ['questions', 'by-assessment', assessmentId, params],
    queryFn: () => getQuestionsByAssessment(assessmentId, params),
    enabled: !!assessmentId,
  });
};

// Search questions by title/content
export const useSearchQuestions = (searchTerm, params = {}) => {
  return useQuery({
    queryKey: ['questions', 'search', searchTerm, params],
    queryFn: () => searchQuestions(searchTerm, params),
    enabled: !!searchTerm,
  });
};

// Get question statistics/analytics
export const useQuestionStats = (questionId) => {
  return useQuery({
    queryKey: ['question-stats', questionId],
    queryFn: () => getQuestionStats(questionId),
    enabled: !!questionId,
  });
};