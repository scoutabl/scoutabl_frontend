import { useRef } from 'react'
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileText, MessageSquare, HelpCircle, Clock, HardDrive, Code, List } from 'lucide-react';
import sidebarOpenIcon from '/sidebarOpen.svg';
import sidebarCloseIcon from '/sidebarClose.svg';
import submissionIcon from '/submissionIcon.svg';
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
        setIsCollapsed
    } = useCodingAssesment();
    const sideBarWidthRef = useRef(0);
    return (
        <aside className={cn(
            "relative bg-white rounded-[20px] border border-gray-200 shadow-md transition-all duration-300 h-full overflow-x-auto max-h-[767px]",
            isCollapsed ? "p-3 w-12 min-w-[52px] max-w-[52px]" : "p-6"
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
                        {/* <img src={sidebarOpenIcon} alt="sidebarOpen Icon" className='w-4 h-4 group-hover:scale-110 transition-all duration-300' /> */}
                        <svg style={{ color: '#000000' }} width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 1.70833C0.5 0.903333 1.15333 0.25 1.95833 0.25H6.54167C6.70743 0.25 6.8664 0.315848 6.98361 0.433058C7.10082 0.550269 7.16667 0.70924 7.16667 0.875C7.16667 1.04076 7.10082 1.19973 6.98361 1.31694C6.8664 1.43415 6.70743 1.5 6.54167 1.5H1.95833C1.90308 1.5 1.85009 1.52195 1.81102 1.56102C1.77195 1.60009 1.75 1.65308 1.75 1.70833V16.2917C1.75 16.4067 1.84333 16.5 1.95833 16.5H6.54167C6.70743 16.5 6.8664 16.5658 6.98361 16.6831C7.10082 16.8003 7.16667 16.9592 7.16667 17.125C7.16667 17.2908 7.10082 17.4497 6.98361 17.5669C6.8664 17.6842 6.70743 17.75 6.54167 17.75H1.95833C1.57156 17.75 1.20063 17.5964 0.927136 17.3229C0.653645 17.0494 0.5 16.6784 0.5 16.2917V1.70833ZM13.8383 9.625H6.95833C6.79257 9.625 6.6336 9.55915 6.51639 9.44194C6.39918 9.32473 6.33333 9.16576 6.33333 9C6.33333 8.83424 6.39918 8.67527 6.51639 8.55806C6.6336 8.44085 6.79257 8.375 6.95833 8.375H13.8383L11.0883 5.47167C10.9788 5.35064 10.921 5.19157 10.9272 5.02846C10.9334 4.86536 11.0032 4.71115 11.1216 4.59882C11.24 4.48649 11.3977 4.42494 11.5609 4.42734C11.7241 4.42975 11.8799 4.4959 11.995 4.61167L15.745 8.57C15.8551 8.68611 15.9164 8.84001 15.9164 9C15.9164 9.15999 15.8551 9.31389 15.745 9.43L11.995 13.3883C11.8799 13.5041 11.7241 13.5703 11.5609 13.5727C11.3977 13.5751 11.24 13.5135 11.1216 13.4012C11.0032 13.2888 10.9334 13.1346 10.9272 12.9715C10.921 12.8084 10.9788 12.6494 11.0883 12.5283L13.8383 9.625Z" fill="#333333" />
                        </svg>

                    </button>
                </div>
            ) : (
                // Expanded view
                <div className="flex flex-col h-full">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            className={cn(
                                "px-4 py-2 flex items-center gap-2 font-medium",
                                activeTab === 'description'
                                    ? "border-b-2 border-purple-600 text-purple-600"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                            onClick={() => setActiveTab('description')}
                        >
                            <FileText size={16} />
                            Description
                        </button>
                        <button
                            className={cn(
                                "px-4 py-2 flex items-center gap-2 font-medium",
                                activeTab === 'submissions'
                                    ? "border-b-2 border-purple-600 text-purple-600"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                            onClick={() => setActiveTab('submissions')}
                        >
                            <img src={submissionIcon} alt="submissionIcon" />
                            Submissions
                        </button>
                        <button
                            onClick={onCollapseToggle}
                            className='ml-auto'
                        >
                            <img src={sidebarCloseIcon} alt="sidebarClose Icon" />
                        </button>
                    </div>



                    {/* Content based on active tab */}
                    {activeTab === 'description' ? (
                        <div className="space-y-6 overflow-auto max-h-[548px]">
                            {/* Question number */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
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
                            <h2 className="text-lg font-medium">{currentQuestionData.title}</h2>

                            <div className="space-y-4">
                                <h3 className="font-medium">Instructions:</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                    {currentQuestionData.instructions.map((instruction, index) => (
                                        <li key={index} className="pl-2">{instruction}</li>
                                    ))}
                                </ol>
                            </div>

                            {/* test cases */}
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Test Cases:</span>
                                </p>
                                {currentQuestionData.testCases.map((testCase, index) => (
                                    <div key={index}>
                                        <h3 className="text-sm text-gray-600">Example {index + 1}:</h3>
                                        <p><strong>Input:</strong> {testCase.input}</p>
                                        <p><strong>Output:</strong> {testCase.output}</p>
                                        <p><strong>Explanation:</strong> {testCase.explanation}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Repeated assessment text from the image */}
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    Your solution will be assessed based on functionality, code quality, and performance. Optional: Implement advanced validation, conditional fields, field rearrangement, and i18n support.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    Your solution will be assessed based on functionality, code quality, and performance.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
                            {/* Submissions table header and column layout */}
                            <div className="flex items-center justify-between text-sm text-gray-600 font-medium mb-2 px-2">
                                <div className="flex items-center gap-2 min-w-[120px]">
                                    <span className='text-sm text-greyPrimary font-medium'>S. No.</span>
                                    <span className='text-sm text-greyPrimary font-medium'>Status</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 w-[260px] text-center">
                                    <span className='text-sm text-greyPrimary font-medium'>Runtime</span>
                                    <span className='text-sm text-greyPrimary font-medium'>Memory</span>
                                    <span className='text-sm text-greyPrimary font-medium'>Language</span>
                                </div>
                            </div>

                            {/* Submissions list */}
                            <div className="flex flex-col gap-3 overflow-x-auto">
                                {submissionsData.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className={cn(
                                            "flex items-center justify-between rounded-lg p-2",
                                            getStatusColor(submission.status)
                                        )}
                                    >
                                        <div className="flex items-center gap-2 min-w-[120px]">
                                            <span className="font-bold text-[1.875rem] text-greyPrimary">{String(submission.id).padStart(2, '0')}</span>
                                            <span className={cn('text-sm text-bold text-[#DA4D2E]',
                                                {
                                                    'text-[#008B00]': submission.status === 'Accepted',
                                                })}
                                            >
                                                {submission.status}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 w-[280px] text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.01937 3.02188C1.98303 4.05795 1.33805 5.42125 1.19439 6.87951C1.05072 8.33777 1.41727 9.80069 2.23154 11.019C3.0458 12.2373 4.25738 13.1356 5.65979 13.5609C7.0622 13.9862 8.56873 13.9123 9.9227 13.3516C11.2767 12.7909 12.3944 11.7782 13.0853 10.4859C13.7762 9.19365 13.9975 7.70185 13.7116 6.26469C13.4256 4.82754 12.6501 3.53402 11.5172 2.60451C10.3843 1.675 8.9641 1.16699 7.4986 1.16699" stroke="#333333" stroke-width="2" stroke-linecap="round" />
                                                    <path d="M7.50085 7.49999L3.49982 3.5" stroke="#333333" stroke-width="2" stroke-linecap="round" />
                                                    <path d="M7.49982 1.5V2.83333" stroke="#333333" stroke-linecap="round" />
                                                    <path d="M13.4998 7.5L12.1661 7.5" stroke="#333333" stroke-linecap="round" />
                                                    <path d="M7.49982 12.167V13.5003" stroke="#333333" stroke-linecap="round" />
                                                    <path d="M2.83575 7.5L1.50207 7.5" stroke="#333333" stroke-linecap="round" />
                                                </svg>

                                                <span className='text-xs text-greyPrimary font-medium'>{submission.runtime}</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-1">
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.05554 3.2998H6.45203C8.10888 3.2998 9.45203 4.64295 9.45203 6.2998V8.7002C9.45186 9.25234 9.00421 9.7002 8.45203 9.7002H4.05554C3.50336 9.7002 3.05571 9.25234 3.05554 8.7002V4.2998C3.05554 3.74752 3.50326 3.2998 4.05554 3.2998Z" stroke="#333333" stroke-width="2" />
                                                    <path d="M4.44617 2.90002V0.5" stroke="#333333" stroke-width="2" />
                                                    <path d="M4.44617 12.4996V10.0996" stroke="#333333" stroke-width="2" />
                                                    <path d="M8.04773 12.4996V10.0996" stroke="#333333" stroke-width="2" />
                                                    <path d="M12.2436 8.2998L9.8446 8.2998" stroke="#333333" stroke-width="2" />
                                                    <path d="M2.64986 8.2998L0.250854 8.2998" stroke="#333333" stroke-width="2" />
                                                    <path d="M2.64986 4.7002L0.250854 4.7002" stroke="#333333" stroke-width="2" />
                                                    <path d="M8.05068 1.5C8.47062 1.5 8.88647 1.58275 9.27447 1.74353C9.66247 1.90431 10.015 2.13999 10.312 2.43712C10.6091 2.73425 10.8447 3.08702 11.0054 3.4753C11.1662 3.86358 11.2489 4.27975 11.2489 4.70004" stroke="#333333" stroke-width="2" />
                                                </svg>

                                                <span className='text-xs text-greyPrimary font-medium text-nowrap'>{submission.memory}</span>
                                            </div>
                                            <span className='text-xs text-greyPrimary font-medium pt-1 px-3 bg-[#69B4FF] rounded-full grid place-content-center'>{submission.language}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-auto pt-4">
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
                </div>
            )
            }
        </aside >
    );
};

export default CodeSidebar;