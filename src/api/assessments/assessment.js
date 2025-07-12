import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

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
}

export const assesmentAPI = new AssessmentAPI();

export const useAssessmentPage = (params) => {
    return useQuery({
        queryKey: ["assessments"],
        queryFn: () => assesmentAPI.getAssessments(params),
    });
}
