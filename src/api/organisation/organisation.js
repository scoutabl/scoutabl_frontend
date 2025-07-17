import { useQuery } from "@tanstack/react-query";
import BaseAPI from "@/api/base";
import { useAuth } from "@/context/AuthContext";

const ORGANISATION_URL = "/organisations/";

class OrganisationAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getOrganisation() {
        const url = `${ORGANISATION_URL}`;
        return (await this.get(url)).data?.results?.[0];
    }
}

export const organisationAPI = new OrganisationAPI();

export const useOrganisation = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ["organisation"],
        queryFn: () => organisationAPI.getOrganisation(),
        enabled: !!user,
    });
};

