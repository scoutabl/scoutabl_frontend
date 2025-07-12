import axios from "axios";

import { BASE_API_URL, DEFAULT_LIST_API_PARAMS } from "@/lib/constants";

export default class BaseAPI {
    constructor() {
        this.api = axios.create({
            baseURL: BASE_API_URL,
        });
    }

    defaultListParams(params) {
        return {
            ...DEFAULT_LIST_API_PARAMS,
            ...(params || {}),
        }
    }

    paramsToString(params) {
        return new URLSearchParams(params).toString();
    }

    headers(extraHeaders = {}) {
        const accessToken = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            ...extraHeaders,
        }
    }

    get(url, config) {
        return this.api.get(url, {
            headers: this.headers(config?.headers),
        });
    }

    post(url, data, config) {
        return this.api.post(url, data, {
            headers: this.headers(config?.headers),
        });
    }

    put(url, data, config) {
        return this.api.put(url, data, {
            headers: this.headers(config?.headers),
        });
    }

    delete(url, config) {
        return this.api.delete(url, {
            headers: this.headers(config?.headers),
        });
    }

    patch(url, data, config) {
        return this.api.patch(url, data, {
            headers: this.headers(config?.headers),
        });
    }
}
