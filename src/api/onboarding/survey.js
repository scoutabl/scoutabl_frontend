import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import BaseAPI from "@/api/base";

const ONBOARDING_CONFIG_URL = "/onboarding-config/"
const USER_SURVEY_URL = "/user-survey/"

class SurveyAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getOrCreateOnboardingConfig(defaultPage) {
        const config = (await this.get(ONBOARDING_CONFIG_URL)).data.results?.[0] || null;
        if (!config) {
            const res = (await this.post(ONBOARDING_CONFIG_URL, {
                extra: {
                    assessmentOnboarding: {
                        page: defaultPage
                    }
                }
            })).data;
            return res;
        }
        return config;
    }

    async getOrCreateUserSurvey() {
        const survey = (await this.get(USER_SURVEY_URL)).data.results?.[0] || null;
        if (!survey) {
            const res = (await this.post(USER_SURVEY_URL, {})).data;
            return res;
        }
        return survey;
    }

    async updateOnboardingConfig(id, config) {
        return (await this.patch(ONBOARDING_CONFIG_URL + id + "/", config)).data;
    }

    async updateUserSurvey(id, survey) {
        return (await this.patch(USER_SURVEY_URL + id + "/", survey)).data;
    }

    async getAssessmentRecommendation() {
        return (await this.get(USER_SURVEY_URL + "assessment-recommendations/")).data;
    }
}

export const surveyAPI = new SurveyAPI();

export const useOnboardingConfig = (defaultPage) => {
    return useQuery({
        queryKey: ['onboarding-config', defaultPage],
        queryFn: () => surveyAPI.getOrCreateOnboardingConfig(defaultPage),
    });
}

export const useUserSurvey = () => {
    return useQuery({
        queryKey: ['user-survey'],
        queryFn: () => surveyAPI.getOrCreateUserSurvey(),
    });
}

export const useAssessmentRecommendation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        queryKey: ['assessment-recommendation'],
        mutationFn: () => surveyAPI.getAssessmentRecommendation(),
        onSuccess: (data) => {
            queryClient.setQueryData(['onboarding-config'], () => {
                return { ...data };
            });
        },
    });
}

export const useUpdateOnboardingConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, config }) => surveyAPI.updateOnboardingConfig(id, config),
        onSuccess: (data) => {
            queryClient.setQueryData(['onboarding-config'], () => {
                return { ...data };
            });
        },
    });
}

export const useUpdateUserSurvey = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, survey }) => surveyAPI.updateUserSurvey(id, survey),
        onSuccess: (data) => {
            queryClient.setQueryData(['user-survey'], () => {
                return { ...data };
            });
        },
    });
}
