import axios from "axios";

// const CANDIDATETOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMDkgMTM6MjM6MDEuNTMwODgyKzAwOjAwIn0.9q2-XjZO-kGuhiEieEObuKmlz_bDs_2ZdebHeEgTD7I'
const CANDIDATETOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMTMgMTY6Mjk6NDAuMTQ1MTkwKzAwOjAwIn0.eFdPGl7trmwAc9UbKbUntHPT-FwYcEn2fTN8jD2bXnM'

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

export const fetchLanguages = async () => {
    const response = await axios.get(`${APIURL}/languages`)
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
    const res = await fetch(`${APIURL}/candidate/questions/${questionId}/cq-submissions/${submissionId}/`, {
        headers: {
            'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
        }
    });
    if (!res.ok) throw new Error("Failed to poll submission");
    const data = await res.json();
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

// Get Submission list
export const fetchSubmissions = async (questionId) => {
    const res = await fetch(`${APIURL}/candidate/questions/${questionId}/cq-submissions/?is_test=true&ordering=-created_at&page_size=100`, {
        headers: {
            'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
        }
    });
    if (!res.ok) throw new Error("Failed fetch submissions");
    const data = await res.json();
    return data;
}