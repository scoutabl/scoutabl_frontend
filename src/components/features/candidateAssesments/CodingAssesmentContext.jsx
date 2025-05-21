import React, { createContext, useContext, useState, useRef } from 'react';

const CodingAssesmentContext = createContext();

export function CodingAssesmentProvider({ children }) {
    // Shared state
    const [activeTab, setActiveTab] = useState('description');
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 15;
    const [sidebarWidth, setSidebarWidth] = useState(540); // default width
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);

    // Add more shared state as needed

    return (
        <CodingAssesmentContext.Provider value={{
            activeTab, setActiveTab,
            currentQuestion, setCurrentQuestion,
            totalQuestions,
            sidebarWidth, setSidebarWidth,
            isCollapsed, setIsCollapsed,
            isFullscreen, setIsFullscreen,
            sidebarRef, isResizing
        }}>
            {children}
        </CodingAssesmentContext.Provider>
    );
}

export function useCodingAssesment() {
    return useContext(CodingAssesmentContext);
} 