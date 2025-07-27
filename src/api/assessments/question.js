import { useQuery } from "@tanstack/react-query";

import BaseAPI from "@/api/base";

const QUESTIONS_URL = "/questions/"


class QuestionAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getQuestions(params) {
        const url = `${QUESTIONS_URL}?${this.paramsToString(this.defaultListParams(params))}`;
        return (await this.get(url)).data?.results;
    }
}

const questionAPI = new QuestionAPI();

export const useQuestions = ({params, enabled = true}) => {
    return useQuery({
        queryKey: ['questions', params],
        queryFn: () => questionAPI.getQuestions(params),
        enabled: enabled,
    });
};
