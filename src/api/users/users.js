import BaseAPI from "@/api/base";
import { useQuery } from "@tanstack/react-query";

const USERS_API_URL = "/users/"


class UsersAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getAllUsers(params) {
        const url = `${USERS_API_URL}?${this.paramsToString(this.defaultListParams({ ...params, fetch_all: 1 }))}`;
        return (await this.get(url)).data?.results;
    }
}

export const userAPI = new UsersAPI();

export const useUsers = (params) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => userAPI.getAllUsers(params),
    });
}
