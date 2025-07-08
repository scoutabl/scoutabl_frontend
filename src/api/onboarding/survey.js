import BaseAPI from "@/api/base";

const ONBOARDING_CONFIG_URL = "/onboarding-config/"

class SurveyAPI extends BaseAPI {
    constructor() {
        super();
    }

    getOnboardingConfig() {
        return this.get(ONBOARDING_CONFIG_URL).then(res => res.data.results?.[0] || null);
    }
}

export const surveyAPI = new SurveyAPI();
