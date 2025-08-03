import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import BaseAPI from "@/api/base";

const QUESTIONS_URL = "/questions/"


class QuestionAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getQuestions(params) {
        const url = `${QUESTIONS_URL}?${this.paramsToString(this.defaultListParams(params))}`;
        return (await this.get(url)).data;
    }
}

const questionAPI = new QuestionAPI();

export const useQuestions = ({ params, enabled = true }) => {
    return useQuery({
        queryKey: ['questions', params],
        queryFn: () => questionAPI.getQuestions(params).then(data => data?.results || []),
        enabled: enabled,
    });
};

export const useInfiniteQuestionPages = (params) => {
    return useInfiniteQuery({
        queryKey: ['questions', params],
        queryFn: ({ pageParam = 1 }) => questionAPI.getQuestions({ ...params, page: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.next) {
                return allPages.length + 1;
            }
            return undefined;
        },
    });
}
