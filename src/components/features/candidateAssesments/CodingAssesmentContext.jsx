import React, { createContext, useContext, useState, useRef } from 'react';

const CodingAssesmentContext = createContext();

export function CodingAssesmentProvider({ children }) {
    // Shared state
    const [activeTab, setActiveTab] = useState('description');
    const [sidebarActiveTab, setSidebarActiveTab] = useState('description'); 
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 15;
    const [sidebarWidth, setSidebarWidth] = useState(543); 
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isOutputFullscreen, setIsOutputFullscreen] = useState(false)
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);
    const [rightPanelWidth, setRightPanelWidth] = useState(0);
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);
    const [editorHeight, setEditorHeight] = useState(0); 
    const [lastEditorHeight, setLastEditorHeight] = useState(0); 
    const [isDragging, setIsDragging] = useState(false);
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