import { useRef } from 'react'
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileText, MessageSquare, HelpCircle, Clock, HardDrive, Code, List } from 'lucide-react';
import sidebarOpenIcon from '/openSidebar.svg';
import sidebarCloseIcon from '/closeSidebar.svg';
import menuVerticalIcon from '/menuVertical.svg';
import { useCodingAssesment } from './CodingAssesmentContext';

const CodeSidebar = ({
    currentQuestionData,
    submissionsData,
    getStatusColor,
    onCollapseToggle
}) => {
    const {
        activeTab, setActiveTab,
        currentQuestion, setCurrentQuestion,
        totalQuestions,
        isCollapsed,
        setIsCollapsed,
        sidebarWidth
    } = useCodingAssesment();
    const sideBarWidthRef = useRef(0);
    return (
        <aside className={cn(
            "relative bg-white rounded-[20px] border border-gray-200 shadow-md transition-all duration-300 flex flex-col h-full max-h-[calc(100vh-116px)] min-w-0 overflow-x-auto scrollbar-webkit",
            isCollapsed ? "p-3 w-12 min-w-[52px] max-w-[52px] rounded-xl" : "p-6"
        )}>
            {isCollapsed ? (
                // Collapsed view
                <div className="flex flex-col-reverse justify-end gap-3 py-2 h-[calc(100vh-100px)] rounded-xl">
                    <button
                        className={cn(
                            "p-3 rounded-md w-full flex flex-col items-center justify-center gap-1",
                            activeTab === 'submissions' ? "bg-purpleSecondary" : "hover:bg-purpleSecondary transition-all duration-300"
                        )}
                        onClick={() => setActiveTab('submissions')}
                    >
                        <span
                            className='text-sm font-medium text-greyPrimary'
                            style={{
                                writingMode: 'vertical-lr',
                                textOrientation: 'mixed',
                                transform: 'rotate(180deg)',
                                marginTop: 2
                            }}>

                            Submissions
                        </span>
                        <svg style={{ transform: 'rotate(-90deg)' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3.33334" y="4.16699" width="13.3333" height="4.16667" rx="1" stroke="#333333" stroke-width="2" stroke-linejoin="round" />
                            <rect x="3.33334" y="11.667" width="13.3333" height="4.16667" rx="1" stroke="#333333" stroke-width="2" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button
                        className={cn(
                            "p-3 rounded-md w-full flex flex-col items-center justify-center gap-1",
                            activeTab === 'description' ? "bg-purpleSecondary" : "hover:bg-purpleSecondary transition-all duration-300"
                        )}
                        onClick={() => setActiveTab('description')}
                    >
                        <span className='text-sm font-medium text-greyPrimary' style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>Description</span>
                        <FileText size={18} style={{ transform: 'rotate(-90deg)', color: '#333333' }} />
                    </button>

                    {/* Collapse button */}
                    <button onClick={onCollapseToggle} className='p-2 rounded-md w-full flex justify-center group hover:bg-purpleSecondary transition-all duration-300'>
                        <img src={sidebarOpenIcon} alt="sidebarOpen Icon" className='h-[17.5px] w-[15.42px] group-hover:scale-110 transition-all duration-300' />
                        {/* <svg style={{ color: '#000000' }} width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 1.70833C0.5 0.903333 1.15333 0.25 1.95833 0.25H6.54167C6.70743 0.25 6.8664 0.315848 6.98361 0.433058C7.10082 0.550269 7.16667 0.70924 7.16667 0.875C7.16667 1.04076 7.10082 1.19973 6.98361 1.31694C6.8664 1.43415 6.70743 1.5 6.54167 1.5H1.95833C1.90308 1.5 1.85009 1.52195 1.81102 1.56102C1.77195 1.60009 1.75 1.65308 1.75 1.70833V16.2917C1.75 16.4067 1.84333 16.5 1.95833 16.5H6.54167C6.70743 16.5 6.8664 16.5658 6.98361 16.6831C7.10082 16.8003 7.16667 16.9592 7.16667 17.125C7.16667 17.2908 7.10082 17.4497 6.98361 17.5669C6.8664 17.6842 6.70743 17.75 6.54167 17.75H1.95833C1.57156 17.75 1.20063 17.5964 0.927136 17.3229C0.653645 17.0494 0.5 16.6784 0.5 16.2917V1.70833ZM13.8383 9.625H6.95833C6.79257 9.625 6.6336 9.55915 6.51639 9.44194C6.39918 9.32473 6.33333 9.16576 6.33333 9C6.33333 8.83424 6.39918 8.67527 6.51639 8.55806C6.6336 8.44085 6.79257 8.375 6.95833 8.375H13.8383L11.0883 5.47167C10.9788 5.35064 10.921 5.19157 10.9272 5.02846C10.9334 4.86536 11.0032 4.71115 11.1216 4.59882C11.24 4.48649 11.3977 4.42494 11.5609 4.42734C11.7241 4.42975 11.8799 4.4959 11.995 4.61167L15.745 8.57C15.8551 8.68611 15.9164 8.84001 15.9164 9C15.9164 9.15999 15.8551 9.31389 15.745 9.43L11.995 13.3883C11.8799 13.5041 11.7241 13.5703 11.5609 13.5727C11.3977 13.5751 11.24 13.5135 11.1216 13.4012C11.0032 13.2888 10.9334 13.1346 10.9272 12.9715C10.921 12.8084 10.9788 12.6494 11.0883 12.5283L13.8383 9.625Z" fill="#333333" />
                        </svg> */}

                    </button>
                </div>
            ) : (
                // Expanded view
                // <div className="flex flex-col h-full">

                // </div>
                <>
                    {/* Tabs */}
                    <div className="flex items-center gap-6 mb-4 overflow-x-hidden min-h-[40px]">
                        <button
                            className={cn(
                                "px-[6px] py-[5px] flex items-center gap-1 font-medium text-greyPrimary rounded-[8px] text-sm",
                                activeTab === 'description'
                                    ? "bg-purpleSecondary"
                                    : "bg-white hover:bg-purpleSecondary transition-all duration-300"
                            )}
                            onClick={() => setActiveTab('description')}
                        >
                            <FileText size={16} />
                            {sidebarWidth > 120 && <span>Description</span>}
                        </button>
                        <button
                            className={cn(
                                "px-[6px] py-[5px] flex items-center gap-1 font-medium text-greyPrimary rounded-[8px] text-sm",
                                activeTab === 'submissions'
                                    ? "bg-purpleSecondary"
                                    : "bg-white hover:bg-purpleSecondary transition-all duration-300"
                            )}
                            onClick={() => setActiveTab('submissions')}
                        >
                            <img src={menuVerticalIcon} alt="menuVerticalIcon" />
                            {sidebarWidth > 120 && <span>Submissions</span>}
                        </button>
                        <button
                            onClick={onCollapseToggle}
                            className="absolute top-[27px] right-4 z-10 p-2 rounded-[8px] hover:bg-purpleSecondary transition-all duration-300"
                        >
                            <img src={sidebarCloseIcon} alt="sidebarClose Icon" />
                        </button>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'description' ? (
                        <>
                            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-webkit min-w-[400px] ">
                                {/* Question number */}
                                <div className="flex items-center justify-between min-w-0 pb-6">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <select
                                            className="bg-gray-100 border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none"
                                            value={currentQuestion}
                                            onChange={(e) => setCurrentQuestion(parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: totalQuestions }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    Question {i + 1} of {totalQuestions}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="flex items-center gap-1 px-3 py-1 rounded-full text-purple-600 hover:bg-purple-50 group">
                                        <div className="h-6 w-6 grid place-content-center rounded-full bg-purple-600 group-hover:bg-purple-700 text-white">
                                            <HelpCircle size={14} />
                                        </div>
                                        <span className="text-sm font-medium">Question info</span>
                                    </button>
                                </div>
                                <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto">
                                    {/* question title */}
                                    {/* <h2 className="text-sm font-medium">{currentQuestionData.title}</h2> */}

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-sm">Instructions:</h3>
                                        <ol className="list-decimal list-inside space-y-2 text-sm text-greyPrimary">
                                            {currentQuestionData.instructions.map((instruction, index) => (
                                                <li key={index} className="pl-2 text-sm text-greyPrimary">{instruction}</li>
                                            ))}
                                        </ol>
                                    </div>

                                    {/* test cases */}
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-bold text-sm text-greyPrimary">Test Cases</span>
                                        </p>
                                        {currentQuestionData.testCases.map((testCase, index) => (
                                            <div key={index} className='space-y-1'>
                                                <h3 className="text-sm text-greyPrimary font-medium">Example:&nbsp;{index + 1}</h3>
                                                <p className="text-sm text-greyPrimary">Input:&nbsp;{testCase.input}</p>
                                                <p className="text-sm text-greyPrimary">Output:&nbsp;{testCase.output}</p>
                                                <p className="text-sm text-greyPrimary">Explanation:&nbsp;{testCase.explanation}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Repeated assessment text from the image */}
                                    <div className="space-y-2 pt-1">
                                        <p className="text-sm text-greyPrimary">
                                            Your solution will be assessed based on functionality, code quality, and performance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Navigation buttons */}
                            <div className="flex justify-between pt-4 flex-wrap flex-shrink-0 min-w-[400px]">
                                <div className="flex space-x-2">
                                    <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                                        <MessageSquare size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                                        <HelpCircle size={18} />
                                    </button>
                                </div>

                                <div className="flex space-x-2">
                                    <button className="px-4 py-2 rounded-full border border-purple-600 text-purple-600 font-medium hover:bg-purple-50 flex items-center gap-1">
                                        <ChevronLeft size={16} />
                                        Back
                                    </button>
                                    <button className="px-4 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 flex items-center gap-1">
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full overflow-auto scrollbar-webkit">
                            <div className="space-y-6 min-w-[483px]">
                                {/* Submissions table header and column layout */}
                                <div
                                    className="flex items-center text-sm text-gray-600 font-medium mb-6"
                                >
                                    <div className='flex items-center gap-2' style={{ minWidth: 180 }}>
                                        <span className='text-sm text-greyPrimary font-medium text-nowrap'>S. No.</span>
                                        <span className='text-sm text-greyPrimary font-medium'>Status</span>
                                    </div>
                                    <div className='flex-1 flex'>
                                        <div className='flex-1 text-sm text-greyPrimary font-medium text-center'>Runtime</div>
                                        <div className='flex-1 text-sm text-greyPrimary font-medium text-center'>Memory</div>
                                        <div className='flex-1 text-sm text-greyPrimary font-medium text-center'>Language</div>
                                    </div>
                                </div>

                                {/* Submissions list */}
                                <div className="flex flex-col gap-2 items-center">
                                    {submissionsData.map((submission) => (
                                        <div
                                            key={submission.id}
                                            className={cn("flex items-center rounded-lg w-full p-[6px]", getStatusColor(submission.status))}
                                        >
                                            <div className="flex items-center gap-2" style={{ minWidth: 180 }}>
                                                <span className="w-10 font-bold text-[1.5rem] text-greyPrimary whitespace-nowrap">{String(submission.id).padStart(2, '0')}</span>
                                                <span className={cn("w-28 text-sm font-bold whitespace-nowrap", {
                                                    'text-[#008B00]': submission.status === 'Accepted',
                                                    'text-[#DA4D2E]': submission.status !== 'Accepted',
                                                })}>
                                                    {submission.status}
                                                </span>
                                            </div>
                                            <div className="flex-1 flex items-center gap-1 justify-center">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3.33331V8L10.6667 9.33331" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8" cy="8" r="6" stroke="#333333" strokeWidth="1.5" /></svg>
                                                <span className="text-xs text-greyPrimary font-medium whitespace-nowrap">{submission.runtime}</span>
                                            </div>
                                            <div className="flex-1 flex items-center gap-1 justify-center">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.05554 3.2998H6.45203C8.10888 3.2998 9.45203 4.64295 9.45203 6.2998V8.7002C9.45186 9.25234 9.00421 9.7002 8.45203 9.7002H4.05554C3.50336 9.7002 3.05571 9.25234 3.05554 8.7002V4.2998C3.05554 3.74752 3.50326 3.2998 4.05554 3.2998Z" stroke="#333333" strokeWidth="1.5" /><path d="M4.44617 2.90002V0.5" stroke="#333333" strokeWidth="1.5" /><path d="M4.44617 12.4996V10.0996" stroke="#333333" strokeWidth="1.5" /><path d="M8.04773 12.4996V10.0996" stroke="#333333" strokeWidth="1.5" /><path d="M12.2436 8.2998L9.8446 8.2998" stroke="#333333" strokeWidth="1.5" /><path d="M2.64986 8.2998L0.250854 8.2998" stroke="#333333" strokeWidth="1.5" /><path d="M2.64986 4.7002L0.250854 4.7002" stroke="#333333" strokeWidth="1.5" /><path d="M8.05068 1.5C8.47062 1.5 8.88647 1.58275 9.27447 1.74353C9.66247 1.90431 10.015 2.13999 10.312 2.43712C10.6091 2.73425 10.8447 3.08702 11.0054 3.4753C11.1662 3.86358 11.2489 4.27975 11.2489 4.70004" stroke="#333333" strokeWidth="1.5" /></svg>
                                                <span className="text-xs text-greyPrimary font-medium whitespace-nowrap">{submission.memory}</span>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center">
                                                <span className="text-xs text-greyPrimary font-medium py-1 px-3 bg-[#69B4FF] rounded-full grid place-content-center text-nowrap">{submission.language}</span>
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