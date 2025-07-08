import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import { BASE_API_URL } from '@/lib/constants';

// const CANDIDATETOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMDkgMTM6MjM6MDEuNTMwODgyKzAwOjAwIn0.9q2-XjZO-kGuhiEieEObuKmlz_bDs_2ZdebHeEgTD7I'
const CANDIDATETOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMTggMTI6MzM6MjUuNzM5MzUwKzAwOjAwIn0.zwZmeUQwcBUscQ0PqaxoXxreCPBUJD8kXsD-TqldhaI'

// //
// export const executeCode = async (language, sourceCode, version) => {
//     const response = await API.post("/execute", {
//         "language": language,
//         "version": version,
//         "files": [
//             {
//                 "content": sourceCode
//             }
//         ],
//     })
//     return response.data;
// }

// POST: Submit code to backend
export const submitCodeToBackend = async ({ questionId, payload }) => {
    const res = await fetch(`${BASE_API_URL}/candidate/questions/${questionId}/cq-submissions/`, {
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
    const res = await fetch(`${BASE_API_URL}/candidate/questions/${questionId}/cq-submissions/${submissionId}/`, {
        headers: {
            'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
        }
    });
    if (!res.ok) throw new Error("Failed to poll submission");
    const data = await res.json();
    return data;
};

// Get Submission list
export const fetchSubmissions = async (questionId) => {
    const res = await fetch(`${BASE_API_URL}/candidate/questions/${questionId}/cq-submissions/?is_test=false&ordering=-created_at&page_size=100`, {
        headers: {
            'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
        }
    });
    if (!res.ok) throw new Error("Failed fetch submissions");
    const data = await res.json();
    return data;
}

//Get Languages
export const fetchLanguages = async () => {
    const response = await axios.get(`${BASE_API_URL}/languages`)
    return response.data;
}

// React Query hook for languages
export function useLanguages() {
    return useQuery({
        queryKey: ['languages'],
        queryFn: fetchLanguages,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

// GET: Fetch enums (status/result codes)
export const fetchEnums = async () => {
    const res = await fetch(`${BASE_API_URL}/enums/all/`, {
        headers: {
            'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch enums");
    return res.json();
};