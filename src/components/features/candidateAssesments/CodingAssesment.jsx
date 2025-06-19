import { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CodingAssesmentProvider, useCodingAssesment } from './CodingAssesmentContext';
import CodeSidebar from './CodeSidebar';
import CodeEditor from './CodeEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { fetchLanguages } from '@/api/monacoCodeApi';
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
    const [languageTemplates, setLanguageTemplates] = useState({});

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
        if (!container) return;
        const containerLeft = container.getBoundingClientRect().left;
        const newContainerWidth = container.getBoundingClientRect().right - e.clientX;

        if (newContainerWidth <= RIGHT_COLLAPSED_WIDTH) {
            setIsRightCollapsed(true);
            setRightPanelWidth(RIGHT_COLLAPSED_WIDTH); // lock at 52px
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

    //fetch default template
    useEffect(() => {
        async function loadLanguages() {
            const langs = await fetchLanguages();
            // Create a map: { python3: "def main(): ...", swift: "import Foundation..." }
            const templates = {};
            langs.results.forEach(lang => {
                templates[lang.code] = lang.default_template?.content || '';
            });
            setLanguageTemplates(templates);
        }
        loadLanguages();
    }, []);



    // const CANDIDATETOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMDkgMTM6MjM6MDEuNTMwODgyKzAwOjAwIn0.9q2-XjZO-kGuhiEieEObuKmlz_bDs_2ZdebHeEgTD7I'
    const CANDIDATETOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiY3JlYXRlZF9hdCI6IjIwMjUtMDYtMTggMTI6MzM6MjUuNzM5MzUwKzAwOjAwIn0.zwZmeUQwcBUscQ0PqaxoXxreCPBUJD8kXsD-TqldhaI'
    // Fetch function using axios
    const fetchQuestionsWithTestCases = async () => {
        try {
            const response = await axios.get('https://dev.scoutabl.com/api/candidate-sessions/current-test/questions/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Candidate-Authorization': `Bearer ${CANDIDATETOKEN}`
                }
            });
            const data = response.data;
            const question = data.results[0];
            // Fetch test case files for public_testcases
            const testCases = await Promise.all(
                (question.public_testcases || []).map(async (tc) => {
                    const input = tc.input_file ? await axios.get(tc.input_file).then(res => res.data) : '';
                    const output = tc.output_file ? await axios.get(tc.output_file).then(res => res.data) : '';
                    return { ...tc, input, output };
                })
            );

            return {
                ...question,
                testCases,
                inputVars: ['nums'], // adjust as needed
            };
        } catch (error) {
            throw error;
        }
    };

    const [isMinLoading, setIsMinLoading] = useState(true);

    // Use TanStack Query
    const { data: currentTestData, isLoading, error } = useQuery({
        queryKey: ['currentTestQuestion'],
        queryFn: async () => {
            const startTime = Date.now();
            const result = await fetchQuestionsWithTestCases();
            const endTime = Date.now();
            const elapsedTime = endTime - startTime;

            // Ensure minimum loading time of 1 second
            if (elapsedTime < 1000) {
                await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
            }

            return result;
        },
        staleTime: 0, // Disable caching to ensure fresh data on refresh
    });

    useEffect(() => {
        if (!isLoading) {
            // Add a small delay before hiding the loading state
            const timer = setTimeout(() => {
                setIsMinLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setIsMinLoading(true);
        }
    }, [isLoading]);

    //loading component
    const LoadingComponent = () => {
        return (
            <div className='flex gap-8 py-6 min-w-0 h-[calc(100vh-116px)]'>
                <div className='relative rounded-5xl shadow-md flex flex-col h-full max-h-[calc(100vh-116px)] min-w-0 overflow-x-auto p-6 w-[540px] bg-white dark:bg-blackPrimary'>
                    <Skeleton className="h-4 w-[250px] mb-4 bg-gray-300 dark:bg-gray-500" />
                    <Skeleton className="h-4 w-[200px] mb-4 bg-gray-300 dark:bg-gray-500" />
                    <Skeleton className="h-4 w-[300px] mb-4 bg-gray-300 dark:bg-gray-500" />
                    <Skeleton className="h-4 w-[280px] mb-4 bg-gray-300 dark:bg-gray-500" />
                    <Skeleton className="h-4 w-[320px] bg-gray-300 dark:bg-gray-500" />
                </div>
                <div className='flex flex-col gap-3 flex-1 h-full max-h-[calc(100vh-116px)] overflow-x-auto'>
                    <div className='p-6 h-[70%] flex flex-col gap-2 bg-white  rounded-5xl dark:bg-blackPrimary'>
                        <Skeleton className="h-4 w-[250px] mb-4 bg-gray-300 dark:bg-gray-500" />
                        <Skeleton className="h-4 w-[200px] mb-4 bg-gray-300 dark:bg-gray-500" />
                        <Skeleton className="h-4 w-[300px] mb-4 bg-gray-300 dark:bg-gray-500" />
                        <Skeleton className="h-4 w-[280px] bg-gray-300 dark:bg-gray-500" />
                    </div>
                    <div className='p-6 h-[30%] flex flex-col gap-2 mt-4 bg-white  rounded-5xl dark:bg-blackPrimary'>
                        <Skeleton className="h-4 w-[250px] mb-4 bg-gray-300 dark:bg-gray-500" />
                        <Skeleton className="h-4 w-[200px] bg-gray-300 dark:bg-gray-500" />
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading || isMinLoading) return <LoadingComponent />;
    if (error) return <div className='h-[calc(100vh-116px)] flex flex-col items-center justify-center text-2xl text-bold text-red-700'>Error loading question</div>;

    if (!currentTestData) {
        return <LoadingComponent />;
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
                        submissionsData={submissionsData}
                        getStatusColor={getStatusColor}
                        onCollapseToggle={handleCollapseToggle}
                        currentTestData={currentTestData}
                        questionId={currentTestData?.id}
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
            <div className={cn('flex-1 h-full min-w-[52px]', isRightCollapsed && !isFullscreen ? 'w-[52px] min-w-[52px] max-w-[52px] overflow-hidden' : 'overflow-x-auto')}>
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
                            : {
                                minWidth: minRightPanelWidth, // always enforce min width
                                transition: isResizing.current ? 'none' : 'width 0.2s'
                            }
                    }
                >
                    <CodeEditor
                        testCases={currentTestData.testCases}
                        inputVars={currentTestData.inputVars}
                        collapsed={isRightCollapsed}
                        isFullscreen={isFullscreen}
                        setIsFullscreen={setIsFullscreen}
                        currentTestData={currentTestData}
                        languageTemplates={languageTemplates}
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