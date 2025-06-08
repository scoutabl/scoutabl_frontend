import { LANGUAGE_VERSIONS } from "@/lib/constants";
import axios from "axios";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

const APIURL = 'https://dev.scoutabl.com/api'

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

export const submitCodeToBackend = async ({ questionId, payload }) => {
    const res = await fetch(`${APIURL}/candidate/questions/${questionId}/cq-submissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit code");
    return res.json();
};

export const pollSubmissionStatus = async ({ questionId }) => {
    const res = await fetch(`${APIURL}/candidate/questions/${questionId}/cq-submissions/`);
    if (!res.ok) throw new Error("Failed to poll submission");
    return res.json();
};

export const fetchEnums = async () => {
    const res = await fetch(`${APIURL}/enums/`);
    if (!res.ok) throw new Error("Failed to fetch enums");
    return res.json();
};