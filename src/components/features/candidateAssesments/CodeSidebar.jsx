import { useRef } from 'react'
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileText, MessageSquare, HelpCircle, Clock, HardDrive, Code } from 'lucide-react';
import sidebarOpenIcon from '/sidebarOpen.svg';
import sidebarCloseIcon from '/sidebarClose.svg';
import submissionIcon from '/submissionIcon.svg';
import { useCodingAssesment } from './CodingAssesmentContext';

const CodeSidebar = ({
    currentQuestionData,
    submissionsData,
    getStatusColor
}) => {
    const {
        activeTab, setActiveTab,
        currentQuestion, setCurrentQuestion,
        totalQuestions,
        isCollapsed,
        setIsCollapsed
    } = useCodingAssesment();
    const sideBarWidthRef = useRef(0);
    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    return (
        <aside className={cn(
            "relative bg-white rounded-[20px] border border-gray-200 shadow-md transition-all duration-300 h-full overflow-x-auto max-h-[767px]",
            isCollapsed ? "p-2" : "p-6"
        )}>
            {isCollapsed ? (
                // Collapsed view
                <div className="flex flex-col-reverse items-center gap-6 py-4">
                    <button
                        className={cn(
                            "p-2 rounded-md w-full flex flex-col items-center justify-center gap-1",
                            activeTab === 'submissions' ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-gray-100"
                        )}
                        onClick={() => setActiveTab('submissions')}
                    >
                        <img src={submissionIcon} alt="submissionIcon" />
                        <span className='text-sm font-medium' style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>Submissions</span>
                    </button>
                    <button
                        className={cn(
                            "p-2 rounded-md w-full flex flex-col items-center justify-center gap-1",
                            activeTab === 'description' ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-gray-100"
                        )}
                        onClick={() => setActiveTab('description')}
                    >
                        <FileText size={20} />
                        <span className='text-sm font-medium' style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>Description</span>
                    </button>
                    {/* Collapse button */}
                    <button onClick={toggleSidebar} className='p-2 rounded-md w-full flex justify-center'>
                        {isCollapsed ? <img src={sidebarOpenIcon} alt="sidebarOpen Icon" /> : <img src={sidebarCloseIcon} alt="sidebarClose Icon" />}
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
                            onClick={toggleSidebar}
                            className='ml-auto'
                        >
                            {isCollapsed ? <img src={sidebarOpenIcon} alt="sidebarOpen Icon" /> : <img src={sidebarCloseIcon} alt="sidebarClose Icon" />}
                        </button>
                    </div>

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

                    {/* Content based on active tab */}
                    {activeTab === 'description' ? (
                        <div className="space-y-6 overflow-auto max-h-[548px]">
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
                            {/* Submissions table header */}
                            <div className="grid grid-cols-5 text-sm text-gray-600 font-medium mb-2 px-2">
                                <div>S. No.</div>
                                <div>Status</div>
                                <div>Runtime</div>
                                <div>Memory</div>
                                <div>Language</div>
                            </div>

                            {/* Submissions list */}
                            <div className="space-y-2">
                                {submissionsData.map((submission) => (
                                    <div
                                        key={submission.id}
                                        className={cn(
                                            "grid grid-cols-5 text-sm rounded-lg p-2",
                                            getStatusColor(submission.status)
                                        )}
                                    >
                                        <div className="font-semibold">{String(submission.id).padStart(2, '0')}</div>
                                        <div>{submission.status}</div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} /> {submission.runtime}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HardDrive size={14} /> {submission.memory}
                                        </div>
                                        <div className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1 w-fit">
                                            <Code size={12} /> {submission.language}
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
            )}
        </aside>
    );
};

export default CodeSidebar;