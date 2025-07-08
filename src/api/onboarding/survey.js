import BaseAPI from "@/api/base";

const ONBOARDING_CONFIG_URL = "/onboarding-config/"
const SURVEY_URL = "/user-survey/"

class SurveyAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getOrCreateOnboardingConfig() {
        const config = (await this.get(ONBOARDING_CONFIG_URL)).data.results?.[0] || null;
        if (!config) {
            const res = await this.post(ONBOARDING_CONFIG_URL, {
                extra: {
                    assessmentOnboarding: {
                        page: "test"
                    }
                }
            });
            return res;
        }
        return config;
    }

    async updateOnboardingConfig(config) {
        return this.patch(ONBOARDING_CONFIG_URL, config);
    }
}

export const surveyAPI = new SurveyAPI();
