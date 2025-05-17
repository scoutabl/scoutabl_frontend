import { LANGUAGE_VERSIONS } from "@/lib/constants";
import axios from "axios";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

export const executeCode = async (language, sourceCode, version) => {
    const response = await API.post("/execute", {
        "language": language,
        "version": version,
        "files": [
            {
                "content": sourceCode
            }
        ],
    })
    return response.data;
}

export const fetchLanguageRuntimes = async () => {
    const response = await API.get("/runtimes");
    return response.data;
}