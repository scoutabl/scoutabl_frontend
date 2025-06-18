import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { useCodingAssesment } from './CodingAssesmentContext';
import QuestionPopup from '@/components/features/candidateAssesments/QuestionPopup';
import { fetchSubmissions, fetchLanguages } from '@/api/monacoCodeApi';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import SidebarOpenIcon from '@/assets/openSidebar.svg?react';
import FileIcon from '@/assets/fileIcon.svg?react';
import SubmissionIcon from '@/assets/Menu.svg?react'
import SidebarCloseIcon from '@/assets/closeSidebar.svg?react';
import TimerIcon from '@/assets/timerLogo.svg?react'
import MemoryIcon from '@/assets/memoryIcon.svg?react'
import FlagIcon from '@/assets/flagIcon.svg?react'
import HeadphoneIcon from '@/assets/headphoneIcon.svg?react'
import { useEnums } from '@/context/EnumsContext';
//code sidebar

// Helper function to format result text (similar to getErrorText in Output.jsx)
function formatResultText(resultText) {
    if (!resultText || resultText === 'SUCCESS') return 'Accepted'; // Return 'Accepted' for SUCCESS
    return resultText
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

const CodeSidebar = ({
    currentTestData,
    questionId,
    submissionsData,
    getStatusColor,
    onCollapseToggle
}) => {
    const {
        sidebarActiveTab, setSidebarActiveTab,
        currentQuestion, setCurrentQuestion,
        totalQuestions,
        isCollapsed,
        setIsCollapsed,
        sidebarWidth,
        submissionRefreshTrigger
    } = useCodingAssesment();
    const { enums } = useEnums(); // Access enums
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submissions, setSubmissions] = useState([]);
    const [languagesMap, setLanguagesMap] = useState({}); // New state for language mapping

    // Fetch languages once on component mount
    useEffect(() => {
        const getLanguages = async () => {
            try {
                const data = await fetchLanguages();
                const map = {};
                data.results.forEach(lang => {
                    map[lang.id] = lang.name;
                });
                setLanguagesMap(map);
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };
        getLanguages();
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        console.log(currentTestData)
    })

    // Handle question selection from popup
    const handleQuestionSelect = (index) => {
        setCurrentQuestionIndex(index);
        setCurrentQuestion(index + 1); // Update the context with the new question number
    };

    // Handle navigation
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            handleQuestionSelect(currentQuestionIndex - 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            handleQuestionSelect(currentQuestionIndex + 1);
        }
    };

    const getSubmissions = async (questionId) => {
        if (!enums || !enums.enums.CQEvaluationResult || !languagesMap || Object.keys(languagesMap).length === 0) return;

        try {
            const responseData = await fetchSubmissions(questionId);
            const rawSubmissions = responseData.results || responseData;

            const mappedSubmissions = rawSubmissions.map(submission => {
                const evaluation = submission.evaluations?.[0];

                // Map status
                let status = 'Unknown';
                if (evaluation?.evaluation_result !== undefined) {
                    const resultKey = Object.keys(enums.enums.CQEvaluationResult).find(
                        key => enums.enums.CQEvaluationResult[key] === evaluation.evaluation_result
                    );
                    status = formatResultText(resultKey); // Apply formatting
                } else if (submission.evaluation_result !== undefined) {
                    const resultKey = Object.keys(enums.enums.CQEvaluationResult).find(
                        key => enums.enums.CQEvaluationResult[key] === submission.evaluation_result
                    );
                    status = formatResultText(resultKey); // Apply formatting
                }


                // Map runtime
                const runtime = evaluation?.result?.run?.time ? `${parseFloat(evaluation.result.run.time) * 1000} ms` : 'N/A';

                // Map memory (using max-rss for now, as you mentioned)
                const memory = evaluation?.result?.run?.['max-rss'] ? `${(parseInt(evaluation.result.run['max-rss']) / 1024).toFixed(2)} MB` : 'N/A';

                // Map language using languagesMap
                const languageName = languagesMap[submission.language] || 'Unknown';

                return {
                    id: submission.id,
                    status: status,
                    runtime: runtime,
                    memory: memory,
                    language: languageName,
                };
            });
            setSubmissions(mappedSubmissions);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    useEffect(() => {
        if (sidebarActiveTab === 'submissions' && questionId && enums && languagesMap && Object.keys(languagesMap).length > 0) {
            getSubmissions(questionId);
        }
    }, [sidebarActiveTab, questionId, submissionRefreshTrigger, enums, languagesMap]); // Add languagesMap to dependencies


    return (
        <aside className={cn(
            "relative bg-white dark:bg-blackPrimary rounded-[20px] shadow-md flex flex-col h-full max-h-[calc(100vh-116px)] min-w-0 overflow-x-auto",
            isCollapsed ? "p-3 w-12 min-w-[52px] max-w-[52px] rounded-xl" : "p-6"
        )}>
            {isCollapsed ? (
                // Collapsed view
                <div className="flex flex-col-reverse justify-end gap-3 py-2 h-[calc(100vh-100px)] rounded-xl">
                    <button
                        className={cn(
                            "p-3 rounded-md w-full flex flex-col items-center justify-center gap-1 group",
                            sidebarActiveTab === 'submissions' ? "bg-purpleSecondary" : "hover:bg-purpleSecondary transition-all duration-300"
                        )}
                        onClick={() => setSidebarActiveTab('submissions')}
                    >
                        <span className={cn('text-sm font-medium text-greyPrimary', {
                            'dark:text-greyPrimary': sidebarActiveTab === 'submissions',
                            'dark:text-white group-hover:dark:text-greyPrimary transition-all duration-300': sidebarActiveTab !== 'submissions'
                        })}
                            style={{
                                writingMode: 'vertical-lr',
                                textOrientation: 'mixed',
                                transform: 'rotate(180deg)',
                                marginTop: 2
                            }}>

                            Submissions
                        </span>
                        <SubmissionIcon className={cn("text-greyPrimary dark:text-white group",
                            { 'dark:text-greyPrimary': sidebarActiveTab === 'submissions' }
                        )} />
                    </button>
                    <button
                        className={cn(
                            "p-3 rounded-md w-full flex flex-col items-center justify-center gap-1 group",
                            sidebarActiveTab === 'description' ? "bg-purpleSecondary" : "hover:bg-purpleSecondary transition-all duration-300"
                        )}
                        onClick={() => setSidebarActiveTab('description')}
                    >
                        <span
                            className={cn('text-sm font-medium text-greyPrimary', {
                                'dark:text-greyPrimary': sidebarActiveTab === 'description',
                                'dark:text-white group-hover:dark:text-greyPrimary transition-all duration-300': sidebarActiveTab !== 'description'
                            })}
                            style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                        >
                            Description
                        </span>
                        <FileIcon className={cn("text-greyPrimary dark:text-white rotate-[-90deg] group-hover:fill-greyPrimary group group-hover:dark:text-greyPrimary",
                            { 'dark:text-greyPrimary active fill-greyPrimary': sidebarActiveTab === 'description' },
                        )} />
                    </button>
                    <motion.button
                        onClick={onCollapseToggle}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.98 }}
                        className='flex items-center justify-center rounded-xl group pb-5'
                    >
                        <SidebarOpenIcon className="text-greyPrimary dark:text-white" />
                    </motion.button>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex items-center gap-6 mb-4 overflow-x-hidden min-h-[40px]">
                        <button
                            className={cn(
                                "px-[6px] py-[5px] flex items-center gap-1 font-medium text-greyPrimary dark:text-white rounded-[8px] text-sm dark:hover:text-greyPrimary group",
                                sidebarActiveTab === 'description'
                                    ? "bg-purpleSecondary dark:text-greyPrimary"
                                    : "bg-transparent hover:bg-purpleSecondary transition-all duration-300"
                            )}
                            onClick={() => setSidebarActiveTab('description')}
                        >
                            <FileIcon className={cn("group-hover:fill-greyPrimary group", {
                                'dark:text-greyPrimary active fill-greyPrimary': sidebarActiveTab === 'description'
                            })} />
                            {sidebarWidth > 120 && <span>Description</span>}
                        </button>
                        <button
                            className={cn(
                                "px-[6px] py-[5px] flex items-center gap-1 font-medium text-greyPrimary dark:text-white rounded-[8px] text-sm dark:hover:text-greyPrimary group",
                                sidebarActiveTab === 'submissions'
                                    ? "bg-purpleSecondary dark:text-greyPrimary"
                                    : "bg-transparent hover:bg-purpleSecondary transition-all duration-300"
                            )}
                            onClick={() => setSidebarActiveTab('submissions')}
                        >
                            <SubmissionIcon className={cn("text-greyPrimary dark:text-white rotate-[90deg] group",
                                { 'dark:text-greyPrimary': sidebarActiveTab === 'submissions' },
                                { 'active': sidebarActiveTab === 'submissions' }
                            )} />
                            {sidebarWidth > 120 && <span>Submissions</span>}
                        </button>
                        <motion.button
                            onClick={onCollapseToggle}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.98 }}
                            className="absolute top-[27px] right-4 z-10 p-2 rounded-[8px]"
                        >
                            <SidebarCloseIcon className="text-greyPrimary dark:text-white" />
                        </motion.button>
                    </div>

                    {/* Content based on active tab */}
                    {sidebarActiveTab === 'description' ? (
                        <>
                            <div className="flex-1 min-h-0 overflow-y-auto min-w-[400px] ">
                                {/* Question number */}
                                <div className="flex items-center justify-between min-w-0 pb-6">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <QuestionPopup
                                            currentQuestionIndex={currentQuestionIndex}
                                            onQuestionSelect={handleQuestionSelect}
                                            mode="coding"
                                            totalQuestions={totalQuestions}
                                        />
                                    </div>
                                    <button className="flex items-center gap-[6px] px-3 py-2 rounded-full text-purplePrimray group hover:bg-purplePrimary  transition-all duration-300 ease">
                                        <div className="h-5 w-5 grid place-content-center rounded-full bg-purplePrimary group-hover:bg-white">
                                            <span className='text-white dark:text-black group-hover:text-purplePrimary tex-xs font-medium'>?</span>
                                        </div>
                                        <span className="text-sm font-medium text-purplePrimary group-hover:text-white">Question info</span>
                                    </button>
                                </div>
                                <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto">
                                    <div className="space-y-4">
                                        <h2 className='text-xl font-bold text-greyPrimary dark:text-white'>{currentTestData.title}</h2>
                                        {/* <span>{currentTestData.results[0].content}</span> */}
                                        {/* <h3 className="font-bold text-sm text-greyPrimary dark:text-white">Instructions:</h3>
                                            <ol className="list-decimal list-inside space-y-2 text-sm text-greyPrimary dark:text-white">
                                                {selectedQuestionData.instructions.map((instruction, index) => (
                                                    <li key={index} className="pl-2 text-sm text-greyPrimary dark:text-white">{instruction}</li>
                                                ))}
                                            </ol> */}
                                    </div>

                                    {/* test cases */}
                                    {/* <div className="space-y-2">

                                            <h3 className="font-bold text-sm text-greyPrimary dark:text-white">Test Cases</h3>

                                            {selectedQuestionData.testCases.map((testCase, index) => (
                                                <div key={index} className='space-y-1'>
                                                    <h3 className="text-sm text-greyPrimary dark:text-white font-medium">Example:&nbsp;{index + 1}</h3>
                                                    <p className="text-sm text-greyPrimary dark:text-white">Input:&nbsp;{testCase.input}</p>
                                                    <p className="text-sm text-greyPrimary dark:text-white">Output:&nbsp;{testCase.output}</p>
                                                    <p className="text-sm text-greyPrimary dark:text-white">Explanation:&nbsp;{testCase.explanation}</p>
                                                </div>
                                            ))}
                                        </div> */}

                                    {/* Repeated assessment text from the image */}
                                    {/* <div className="space-y-2 pt-1">
                                            <p className="text-sm text-greyPrimary dark:text-white">
                                                Your solution will be assessed based on functionality, code quality, and performance.
                                            </p>
                                        </div> */}
                                </div>
                            </div>
                            {/* flag and Navigation buttons */}
                            <div className="flex items-center justify-between pt-4 flex-wrap flex-shrink-0 min-w-[400px]">
                                <div className="flex space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group w-10 h-10 rounded-full border border-greyPrimary flex items-center justify-center text-greyPrimary dark:hover:bg-white dark:border-white group">
                                        {/* <Flag size={20} className='text-greyPrimary dark:text-white group-hover:dark:text-black' /> */}
                                        <FlagIcon className="flag-icon group-hover:fill-black dark:text-white group-hover:dark:text-black" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group w-10 h-10 rounded-full border border-greyPrimary flex items-center justify-center text-greyPrimary dark:hover:bg-white dark:border-white group">
                                        <HeadphoneIcon className="dark:text-white" />
                                    </motion.button>

                                </div>

                                {/* Navigation buttons */}
                                <div className="flex items-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePreviousQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        className={cn(
                                            "h-10 w-[98px] rounded-full bg-transparent text-purplePrimary font-medium flex items-center justify-center gap-1 border border-purplePrimary",
                                            currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <ChevronLeft size={16} />
                                        Back
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNextQuestion}
                                        disabled={currentQuestionIndex === totalQuestions - 1}
                                        className={cn(
                                            "h-10 w-[98px] rounded-full bg-purplePrimary text-white font-medium hover:bg-purplePrimary/60 flex items-center justify-center gap-1 transition-all duration-300 ease",
                                            currentQuestionIndex === totalQuestions - 1 && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </motion.button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full overflow-auto">
                            <div className="space-y-6 min-w-[483px]">
                                {/* Submissions table header and column layout */}
                                <div
                                    className="flex items-center text-sm text-gray-600 font-medium mb-6"
                                >
                                    <div className='flex items-center gap-3' style={{ minWidth: 180 }}>
                                        <span className='text-sm text-greyPrimary dark:text-white font-medium text-nowrap'>S. No.</span>
                                        <span className='text-sm text-greyPrimary dark:text-white font-medium'>Status</span>
                                    </div>
                                    <div className='flex-1 flex'>
                                        <div className='flex-1 text-sm text-greyPrimary dark:text-white font-medium text-center'>Runtime</div>
                                        <div className='flex-1 text-sm text-greyPrimary dark:text-white font-medium text-center'>Memory</div>
                                        <div className='flex-1 text-sm text-greyPrimary dark:text-white font-medium text-center'>Language</div>
                                    </div>
                                </div>

                                {/* Submissions list */}
                                <div className="flex flex-col gap-2 items-center">
                                    {submissions.map((submission) => (
                                        <div
                                            key={submission.id}
                                            className={cn("flex items-center rounded-lg w-full p-[6px]", getStatusColor(submission.status))}
                                        >
                                            <div className="flex items-center gap-3" style={{ minWidth: 180 }}>
                                                <span className="w-10 font-bold text-[1.5rem] text-greyPrimary dark:text-white whitespace-nowrap">{String(submission.id).padStart(2, '0')}</span>
                                                <span className={cn("w-28 text-sm font-bold whitespace-nowrap", {
                                                    'text-[#008B00] dark:text-[#1EA378]': submission.status === 'Accepted',
                                                    'text-[#DA4D2E] dark:text-[#EB5757]': submission.status !== 'Accepted',
                                                })}>
                                                    {submission.status}
                                                </span>
                                            </div>
                                            <div className="flex-1 flex items-center gap-1 justify-center">
                                                <TimerIcon className="text-greyPrimary dark:text-white h-4 w-4" />
                                                <span className="text-xs text-greyPrimary dark:text-white font-medium whitespace-nowrap">{submission.runtime}</span>
                                            </div>
                                            <div className="flex-1 flex items-center gap-1 justify-center">
                                                <MemoryIcon className="text-greyPrimary dark:text-white h-4 w-4" />
                                                <span className="text-xs text-greyPrimary dark:text-white font-medium whitespace-nowrap">{submission.memory}</span>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center">
                                                <span className="text-xs text-greyPrimary dark:text-white font-medium py-1 px-3 bg-[#69B4FF] dark:bg-[#7C51D4] rounded-full grid place-content-center text-nowrap">{submission.language}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
            }
        </aside >
    );
};

export default CodeSidebar;