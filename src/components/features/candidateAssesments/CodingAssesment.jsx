import React from 'react';
import { cn } from '@/lib/utils';
import AssessmentNavbar from '@/components/shared/AssesmentNavbar';
import CodeEditor from './CodeEditor';
import { questionsData } from '@/lib/codingQuestions';
import CodeSidebar from './CodeSidebar';
import { CodingAssesmentProvider, useCodingAssesment } from './CodingAssesmentContext';

function CodingAssesmentInner() {
    const {
        activeTab, setActiveTab,
        currentQuestion, setCurrentQuestion,
        totalQuestions,
        sidebarWidth, setSidebarWidth,
        isCollapsed, setIsCollapsed,
        isFullscreen, setIsFullscreen,
        sidebarRef, isResizing
    } = useCodingAssesment();

    const COLLAPSED_WIDTH = 48; // px
    const minSidebarWidth = COLLAPSED_WIDTH;
    const minEditorWidth = 200;
    const maxSidebarWidth = window.innerWidth * 0.90;
    const prevSidebarWidthRef = React.useRef(sidebarWidth);

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
                return 'bg-[#BFE2BF] text-[#008B00]';
            case 'Wrong Answer':
                return 'bg-[#F5D2CA] text-[#DA4D2E]';
            case 'Compile Error':
            case 'Runtime Error':
                return 'bg-[#F5D2CA] text-[#DA4D2E]';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    // Update sidebar width and collapse state on resize
    // const handleMouseMove = (e) => {
    //     if (!isResizing.current) return;
    //     const totalWidth = sidebarRef.current.parentElement.offsetWidth;
    //     const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
    //     const editorWidth = totalWidth - newWidth - 8; // 8px for resizer
    //     if (newWidth <= COLLAPSED_WIDTH) {
    //         prevSidebarWidthRef.current = sidebarWidth > COLLAPSED_WIDTH ? sidebarWidth : 400;
    //         setIsCollapsed(true);
    //         setSidebarWidth(COLLAPSED_WIDTH);
    //     } else if (newWidth >= minSidebarWidth && editorWidth >= minEditorWidth && newWidth <= maxSidebarWidth) {
    //         setSidebarWidth(newWidth);
    //         if (isCollapsed) setIsCollapsed(false);
    //     }
    // };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const totalWidth = sidebarRef.current.parentElement.offsetWidth;
        const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
        const editorWidth = totalWidth - newWidth - 8; // 8px for resizer

        if (newWidth <= COLLAPSED_WIDTH) {
            prevSidebarWidthRef.current = sidebarWidth > COLLAPSED_WIDTH ? sidebarWidth : 400;
            setIsCollapsed(true);
            setSidebarWidth(COLLAPSED_WIDTH);
        } else if (editorWidth >= minEditorWidth && newWidth <= maxSidebarWidth) {
            setSidebarWidth(newWidth);
            setIsCollapsed(prev => (prev ? false : prev)); // Always uncollapse if previously collapsed
        }
    };
    // When user clicks collapse/expand button, toggle and restore width
    const handleCollapseToggle = () => {
        if (isCollapsed) {
            setSidebarWidth(prevSidebarWidthRef.current || 400);
            setIsCollapsed(false);
        } else {
            prevSidebarWidthRef.current = sidebarWidth;
            setSidebarWidth(COLLAPSED_WIDTH);
            setIsCollapsed(true);
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

    if (isFullscreen) {
        // Render fullscreen overlay with only CodeEditor
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: '#18181b' }}>
                <CodeEditor
                    testCases={currentQuestionData.testCases}
                    inputVars={currentQuestionData.inputVars}
                    callPattern={currentQuestionData.callPattern}
                    fullscreen={true}
                    onExitFullscreen={() => setIsFullscreen(false)}
                />
            </div>
        );
    }

    return (
        <>
            <AssessmentNavbar currentIndex={currentQuestion} total={totalQuestions} timeLeft={100} />
            <div className='flex gap-3 px-12 py-6 min-w-0 h-calc[100vh_-_116px]'>
                {/* Sidebar */}
                <div
                    ref={sidebarRef}
                    style={{
                        width: sidebarWidth,
                        minWidth: minSidebarWidth,
                        maxWidth: maxSidebarWidth,
                        transition: isResizing.current ? 'none' : 'width 0.2s'
                    }}
                    className="h-full"
                >
                    <CodeSidebar
                        currentQuestionData={currentQuestionData}
                        submissionsData={submissionsData}
                        getStatusColor={getStatusColor}
                        onCollapseToggle={handleCollapseToggle}
                    />
                </div>
                {/* Resizer bar */}
                <div
                    className='h-[calc(100vh_-_116px)] w-2 flex items-center justify-center cursor-ew-resize transition-colors duration-150 z-20'
                    style={{ minWidth: 8, maxWidth: 8 }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-1 h-6 rounded-full bg-greyAccent" />
                </div>
                {/* Main content area: flex row for editor/output */}
                <div className='flex-1 h-full min-w-0 overflow-x-auto'>
                    <div className='h-full min-w-[400px] flex flex-col'>
                        <CodeEditor
                            testCases={currentQuestionData.testCases}
                            inputVars={currentQuestionData.inputVars}
                            callPattern={currentQuestionData.callPattern}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default function CodingAssesment() {
    return (
        <CodingAssesmentProvider>
            <CodingAssesmentInner />
        </CodingAssesmentProvider>
    );
}