import React, { createContext, useContext, useState } from "react";

const AssessmentContext = createContext();

export function useAssessment() {
    return useContext(AssessmentContext);
}

export function AssessmentProvider({ children }) {
    const [assessmentData, setAssessmentData] = useState({
        jobRole: "",
        language: "",
        jobDescription: "",
        rounds: [],
        // ...other fields
    });

    return (
        <AssessmentContext.Provider value={{ assessmentData, setAssessmentData }}>
            {children}
        </AssessmentContext.Provider>
    );
}