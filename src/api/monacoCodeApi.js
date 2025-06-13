import { LANGUAGE_VERSIONS } from "@/lib/constants";
import axios from "axios";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

const CANDIDATETOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMDkgMTM6MjM6MDEuNTMwODgyKzAwOjAwIn0.9q2-XjZO-kGuhiEieEObuKmlz_bDs_2ZdebHeEgTD7I'

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

export const fetchLanguages = async () => {
    const response = await axios.get(`${APIURL}/languages`)
    console.log('languages fetched', response.data);
    return response.data;
}

// POST: Submit code to backend
export const submitCodeToBackend = async ({ questionId, payload }) => {
    const res = await fetch(`${APIURL}/candidate/questions/${questionId}/cq-submissions/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit code");
    return res.json();
};

// GET: Poll for submission status/result
export const pollSubmissionStatus = async ({ questionId, submissionId }) => {
    console.log('Polling API called for', questionId, submissionId);
    const res = await fetch(`${APIURL}/candidate/questions/${questionId}/cq-submissions/${submissionId}/`, {
        headers: {
            'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
        }
    });
    if (!res.ok) throw new Error("Failed to poll submission");
    const data = await res.json();
    console.log('Polling API response:', data);
    return data;
};

// GET: Fetch enums (status/result codes)
export const fetchEnums = async () => {
    const res = await fetch(`${APIURL}/enums/all/`, {
        headers: {
            'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch enums");
    return res.json();
};