import { useRef, useEffect, useState } from 'react';
import { CodingAssesmentProvider, useCodingAssesment } from './CodingAssesmentContext';
import CodeSidebar from './CodeSidebar';
import CodeEditor from './CodeEditor';
import { cn } from '@/lib/utils';
import { questionsData } from '@/lib/codingQuestions';

function CodingAssesmentInner() {
    const {
        currentQuestion, setCurrentQuestion,
        sidebarWidth, setSidebarWidth,
        isCollapsed, setIsCollapsed,
        isFullscreen, setIsFullscreen,
        sidebarRef, isResizing,
        rightPanelWidth, setRightPanelWidth,
        isRightCollapsed, setIsRightCollapsed,
        isOutputFullscreen, setIsOutputFullscreen,
        isDragging, setIsDragging
    } = useCodingAssesment();

    const RIGHT_COLLAPSED_WIDTH = 52; //px
    const minRightPanelWidth = RIGHT_COLLAPSED_WIDTH;
    const COLLAPSED_WIDTH = 48; // px
    const minSidebarWidth = COLLAPSED_WIDTH;
    const minEditorWidth = 52;
    const maxSidebarWidth = window.innerWidth * 0.90;
    const prevSidebarWidthRef = useRef(sidebarWidth);
    const prevRightPanelWidthRef = useRef(rightPanelWidth);
    const rightPanelRef = useRef(null);
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
                return 'bg-[#BFE2BF] text-[#008B00] dark:bg-[#224D24]';
            case 'Wrong Answer':
                return 'bg-[#F5D2CA] text-[#DA4D2E] dark:bg-[#291412]';
            case 'Compile Error':
            case 'Runtime Error':
                return 'bg-[#F5D2CA] text-[#DA4D2E] dark:bg-[#291412]';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    // handle resizing
    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        // handle sidebar resizing
        if (!sidebarRef.current) return;
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

        // handle right panel resizing
        const container = rightPanelRef.current;
        if (!container) return; // Prevents the error!
        const containerLeft = container.getBoundingClientRect().left;
        const newContainerWidth = container.getBoundingClientRect().right - e.clientX;
        if (newContainerWidth <= RIGHT_COLLAPSED_WIDTH) {
            setIsRightCollapsed(true);
            setRightPanelWidth(RIGHT_COLLAPSED_WIDTH);
        } else {
            setIsRightCollapsed(false);
            setRightPanelWidth(newContainerWidth);
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
        setIsDragging(false);
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (e) => {
        isResizing.current = true;
        setIsDragging(true);
        document.body.style.cursor = 'ew-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        if (isDragging) {
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.userSelect = '';
        }
        return () => {
            document.body.style.userSelect = '';
        };
    }, [isDragging]);

    const CANDIDATETOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMDggMDk6MzA6MjcuMDIwNDA3KzAwOjAwIn0.JloLYpQ-zBMWXE4JGT5XnI_2hARKHJNoHRmrJ4D372E'
    const [currentTestData, setCurrentTestData] = useState(null);
    // get question
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await fetch('https://dev.scoutabl.com/api/candidate-sessions/current-test/questions/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
                    }
                })
                if (!response.ok) {
                    throw new Error('Failed to fetch question');
                }
                const data = await response.json();
                console.log(data)
                setCurrentTestData(data)
                console.log('currentData', currentTestData)
            } catch (error) {
                throw new Error('Failed To fetch question')
            }
        }
        fetchQuestion();
    }, [])

    if (!currentTestData) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex gap-3 py-6 min-w-0 h-[calc(100vh-116px)]'>
            {/* Sidebar: hidden in fullscreen */}
            {!isFullscreen && !isOutputFullscreen && (
                <div
                    ref={sidebarRef}
                    style={{
                        width: sidebarWidth,
                        minWidth: minSidebarWidth,
                        maxWidth: maxSidebarWidth,
                        transition: isResizing.current ? 'none' : 'width 0.2s'
                    }}
                >
                    <CodeSidebar
                        currentQuestionData={currentQuestionData}
                        submissionsData={submissionsData}
                        getStatusColor={getStatusColor}
                        onCollapseToggle={handleCollapseToggle}
                        currentTestData={currentTestData}
                    />
                </div>
            )}
            {/* Resizer bar: hidden in fullscreen */}
            {(!isFullscreen && !isOutputFullscreen) && (
                <div
                    className='h-full w-2 flex items-center justify-center cursor-ew-resize transition-colors duration-150 z-20'
                    style={{ minWidth: 8, maxWidth: 8 }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-1 h-6 rounded-full bg-greyAccent" />
                </div>
            )}
            {/* Main content area: editor expands in fullscreen */}
            <div className={cn('flex-1 h-full', isRightCollapsed && !isFullscreen ? 'w-[52px] min-w-[52px] max-w-[52px] overflow-hidden' : 'overflow-x-auto')}>
                <div
                    className="h-full flex flex-col flex-1"
                    ref={rightPanelRef}
                    style={
                        isRightCollapsed && !isFullscreen
                            ? {
                                width: rightPanelWidth,
                                minWidth: minRightPanelWidth,
                                maxWidth: minRightPanelWidth,
                                transition: isResizing.current ? 'none' : 'width 0.2s'
                            }
                            : {}
                    }
                >
                    <CodeEditor
                        testCases={currentQuestionData.testCases}
                        inputVars={currentQuestionData.inputVars}
                        callPattern={currentQuestionData.callPattern}
                        collapsed={isRightCollapsed}
                        isFullscreen={isFullscreen}
                        setIsFullscreen={setIsFullscreen}
                        currentTestData={currentTestData}
                    />
                    {/* Output panel: hidden in fullscreen */}
                    {!isFullscreen && (
                        <></>
                        // You can add your Output panel here if needed
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CodingAssesment() {

    return (
        <CodingAssesmentProvider>
            <CodingAssesmentInner />
        </CodingAssesmentProvider>
    );
}