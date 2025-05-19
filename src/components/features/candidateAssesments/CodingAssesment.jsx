import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import AssessmentNavbar from '@/components/shared/AssesmentNavbar';

import CodeEditor from './CodeEditor';
import { questionsData } from '@/lib/codingQuestions';
import CodeSidebar from './CodeSidebar';

export default function CodingAssesment() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 15;
    const [sidebarWidth, setSidebarWidth] = useState(400); // default width
    const sidebarRef = useRef(null);
    const isResizing = useRef(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);

    const minSidebarWidth = 60;
    const minEditorWidth = 60;
    // Allow sidebar to take up to 99vw (almost the whole screen)
    const maxSidebarWidth = window.innerWidth * 0.99;

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Get current question data
    const currentQuestionData = questionsData.find(q => q.id === currentQuestion) || questionsData[0];

    // Dummy data for submissions
    const submissionsData = [
        { id: 10, status: 'Accepted', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 9, status: 'Wrong Answer', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 8, status: 'Accepted', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 7, status: 'Compile Error', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 6, status: 'Accepted', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 5, status: 'Runtime Error', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 4, status: 'Accepted', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 3, status: 'Accepted', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 2, status: 'Accepted', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' },
        { id: 1, status: 'Compile Error', runtime: '4187 ms', memory: '119.90 MB', language: 'Java Script' }
    ];

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-200 text-green-800';
            case 'Wrong Answer':
                return 'bg-yellow-200 text-yellow-800';
            case 'Compile Error':
            case 'Runtime Error':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const totalWidth = sidebarRef.current.parentElement.offsetWidth;
        const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
        const editorWidth = totalWidth - newWidth - 8; // 8px for resizer

        setIsSidebarCollapsed(newWidth <= minSidebarWidth);
        setIsEditorCollapsed(editorWidth <= minEditorWidth);

        if (newWidth >= minSidebarWidth && editorWidth >= minEditorWidth && newWidth <= maxSidebarWidth) {
            setSidebarWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e) => {
        isResizing.current = true;
        document.body.style.cursor = 'ew-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <>
            <AssessmentNavbar currentIndex={currentQuestion} total={totalQuestions} timeLeft={100} />
            <div className='flex gap-3 px-12 py-6 h-screen min-w-0'>
                <div
                    ref={sidebarRef}
                    style={{
                        width: isSidebarCollapsed ? minSidebarWidth : (isCollapsed ? 60 : sidebarWidth),
                        minWidth: minSidebarWidth,
                        maxWidth: maxSidebarWidth,
                        transition: isResizing.current ? 'none' : 'width 0.2s'
                    }}
                    className="h-full"
                >
                    <CodeSidebar
                        isCollapsed={isSidebarCollapsed}
                        collapsed={isSidebarCollapsed}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        totalQuestions={totalQuestions}
                        toggleSidebar={toggleSidebar}
                        currentQuestionData={currentQuestionData}
                        submissionsData={submissionsData}
                        getStatusColor={getStatusColor}
                    />
                </div>
                {/* Resizer bar as a flex child with a vertical grip */}
                <div
                    className='h-full w-2 flex items-center justify-center cursor-ew-resize transition-colors duration-150 z-20'
                    style={{ minWidth: 8, maxWidth: 8 }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-1 h-6 rounded-full bg-greyAccent" />
                </div>
                {isEditorCollapsed ? (
                    <div className="flex-1 h-full min-w-0 bg-black">
                        <CodeEditor
                            testCases={currentQuestionData.testCases}
                            inputVars={currentQuestionData.inputVars}
                            callPattern={currentQuestionData.callPattern}
                            collapsed={true}
                        />
                    </div>
                ) : (
                    <div className='flex-1 h-full min-w-0'>
                        <CodeEditor
                            testCases={currentQuestionData.testCases}
                            inputVars={currentQuestionData.inputVars}
                            callPattern={currentQuestionData.callPattern}
                            collapsed={false}
                        />
                    </div>
                )}
            </div>
        </>
    );
}