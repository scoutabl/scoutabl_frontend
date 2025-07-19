import BaseAPI from "../base";
import { useQuery } from "@tanstack/react-query";

const TAGS_URL = "/tags";

class TagsAPI extends BaseAPI {
    constructor() {
        super();
    }

    async getTags(params) {
        const url = `${TAGS_URL}?${this.paramsToString(this.defaultListParams(params))}`;
        return (await this.get(url)).data;
    }
}

const tagsAPI = new TagsAPI();

const useAllTags = (params) => {
    return useQuery({
        queryKey: ["tags", params],
        queryFn: () => tagsAPI.getTags({ ...params, fetch_all: 1 }).then(res => res?.results || []),
    });
};

export { tagsAPI, useAllTags };
