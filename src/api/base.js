import axios from "axios";

import { BASE_API_URL, DEFAULT_LIST_API_PARAMS } from "@/lib/constants";

export default class BaseAPI {
    constructor() {
        this.api = axios.create({
            baseURL: BASE_API_URL,
        });
    }

    defaultListParams(params) {
        if (params?.fetch_all === 1) {
            return {
                ...(params || {}),
            }
        }
        return {
            ...DEFAULT_LIST_API_PARAMS,
            ...(params || {}),
        }
    }

    paramsToString(params) {
        return new URLSearchParams(params).toString();
    }

    headers(extraHeaders = {}, data) {
        const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            ...extraHeaders,
        };
        
        // Only set Content-Type for non-FormData
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        
        return headers;
    }

    get(url, config) {
        return this.api.get(url, {
            headers: this.headers(config?.headers),
        });
    }

    post(url, data, config) {
        return this.api.post(url, data, {
            headers: this.headers(config?.headers, data),
        });
    }

    put(url, data, config) {
        return this.api.put(url, data, {
            headers: this.headers(config?.headers, data),
        });
    }

    delete(url, config) {
        return this.api.delete(url, {
            headers: this.headers(config?.headers),
        });
    }

    patch(url, data, config) {
        return this.api.patch(url, data, {
            headers: this.headers(config?.headers, data),
        });
    }
}
