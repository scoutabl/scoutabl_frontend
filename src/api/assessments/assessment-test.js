import BaseAPI from "@/api/base";
import { useInfiniteQuery } from "@tanstack/react-query";

const ASSESSMENT_TEST_URL = "/assessment-tests/";

class AssessmentTestAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getAssessmentTests(params) {
        // console.log("---", params);
        const url = `${ASSESSMENT_TEST_URL}?${this.paramsToString(this.defaultListParams(params))}`;
        return (await this.get(url)).data;
    }
}

export const assessmentTestAPI = new AssessmentTestAPI();

export const useInfiniteAssessmentTestPages = (params) => {
    return useInfiniteQuery({
        queryKey: ["assessment_tests", params],
        queryFn: async ({ pageParam = 1 }) => {
            // Use pageParam for pagination
            return assessmentTestAPI.getAssessmentTests({ ...params, page: pageParam });
        },
        getNextPageParam: (lastPage, allPages) => {
            // Use the 'next' field in the API response to determine if there is a next page
            // console.log(lastPage)
            if (lastPage.next) {
                // console.log("----", allPages.length+1, lastPage.next)
                // Increment page number based on loaded pages
                return allPages.length + 1;
            }
            return undefined;
        },
    });
};