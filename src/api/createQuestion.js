import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const patchAssessment = async ({ assessmentId, questionId }) => {
  const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  const { data } = await axios.patch(`${BASE_API_URL}/assessments/${assessmentId}/`, {
    custom_questions: [questionId],
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