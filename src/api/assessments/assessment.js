import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from "@tanstack/react-query";

import BaseAPI from "@/api/base";

const ASSESSMENT_URL = "/assessments/";

class AssessmentAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getAssessments(params) {
        const url = `${ASSESSMENT_URL}?${this.paramsToString(this.defaultListParams(params))}`;
        return (await this.get(url)).data;
    }

    async getAssessmentsSummary() {
        const url = `${ASSESSMENT_URL}summary/`;
        return (await this.get(url)).data;
    }

    async getAssessment(assessmentId) {
        const url = `${ASSESSMENT_URL}${assessmentId}/`;
        return (await this.get(url)).data;
    }

    async createAssessment(data) {
        const url = `${ASSESSMENT_URL}`;
        return (await this.post(url, data)).data;
    }

    async updateAssessment(assessmentId, data) {
        const url = `${ASSESSMENT_URL}${assessmentId}/`;
        return (await this.patch(url, data)).data;
    }

    async deleteAssessment(assessmentId) {
        const url = `${ASSESSMENT_URL}${assessmentId}/`;
        return (await this.delete(url)).data;
    }
}

export const assesmentAPI = new AssessmentAPI();

export const useAssessmentPage = (params) => {
    return useQuery({
        queryKey: ["assessments", params],
        queryFn: () => assesmentAPI.getAssessments(params),
    });
}

export const useInfiniteAssessmentPages = (params) => {
    return useInfiniteQuery({
        queryKey: ["assessments", params],
        queryFn: async ({ pageParam = 1 }) => {
            // Use pageParam for pagination
            return assesmentAPI.getAssessments({ ...params, page: pageParam });
        },
        getNextPageParam: (lastPage, allPages) => {
            // Use the 'next' field in the API response to determine if there is a next page
            if (lastPage.next) {
                // Increment page number based on loaded pages
                return allPages.length + 1;
            }
            return undefined;
        },
    });
};

export const useAssessmentsSummary = () => {
    return useQuery({
        queryKey: ["assessments_summary"],
        queryFn: () => assesmentAPI.getAssessmentsSummary(),
        enabled: false, 
        retry: 1, 
        retryDelay: 1000, 
        onError: (error) => {
            console.error('Failed to fetch assessments summary:', error);
        },
        refetchOnWindowFocus: false,
    });
};

export const useAssessment = (assessmentId) => {
    return useQuery({
        queryKey: ["assessment", assessmentId],
        queryFn: () => assesmentAPI.getAssessment(assessmentId),
        enabled: !!assessmentId,
    });
}

export const useCreateAssessment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => assesmentAPI.createAssessment(data),
        onSuccess: (data) => {
            queryClient.setQueryData(["assessment", data.id], data);
        },
    });
}

export const useUpdateAssessment = (mutationKey = "updateAssessment") => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({assessmentId, data}) => assesmentAPI.updateAssessment(assessmentId, data),
        mutationKey: [mutationKey],
        onSuccess: (data) => {
            queryClient.setQueryData(["assessment", data.id], data);
        },
    });
}

