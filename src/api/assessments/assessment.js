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
    });
}
