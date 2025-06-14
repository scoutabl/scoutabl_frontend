import React, { createContext, useContext, useState, useRef } from 'react';

const CodingAssesmentContext = createContext();

export function CodingAssesmentProvider({ children }) {
    // Shared state
    const [activeTab, setActiveTab] = useState('description');
    const [sidebarActiveTab, setSidebarActiveTab] = useState('description'); // For sidebar (Description/Submissions)
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 15;
    const [sidebarWidth, setSidebarWidth] = useState(540); // default width
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isOutputFullscreen, setIsOutputFullscreen] = useState(false)
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);
    const [rightPanelWidth, setRightPanelWidth] = useState(0);
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);
    // Add more shared state as needed
    // Shared state for editor height (for vertical resizer sync)
    const [editorHeight, setEditorHeight] = useState(0); // px, will be set to 50% on mount
    const [lastEditorHeight, setLastEditorHeight] = useState(0); // remembers last expanded height
    const [isDragging, setIsDragging] = useState(false);
    // Add submission refresh trigger
    const [submissionRefreshTrigger, setSubmissionRefreshTrigger] = useState(0);

    return (
        <CodingAssesmentContext.Provider value={{
            sidebarActiveTab, setSidebarActiveTab,
            activeTab, setActiveTab,
            currentQuestion, setCurrentQuestion,
            totalQuestions,
            sidebarWidth, setSidebarWidth,
            isCollapsed, setIsCollapsed,
            isFullscreen, setIsFullscreen,
            isOutputFullscreen, setIsOutputFullscreen,
            sidebarRef, isResizing,
            rightPanelWidth, setRightPanelWidth,
            isRightCollapsed, setIsRightCollapsed,
            editorHeight, setEditorHeight,
            lastEditorHeight, setLastEditorHeight,
            isDragging, setIsDragging,
            submissionRefreshTrigger, setSubmissionRefreshTrigger
        }}>
            {children}
        </CodingAssesmentContext.Provider>
    );
}

export function useCodingAssesment() {
    return useContext(CodingAssesmentContext);
} 