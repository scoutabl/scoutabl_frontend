import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, MessageSquare, HelpCircle, Clock, HardDrive, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import sidebarOpenIcon from '/sidebarOpen.svg';
import sidebarCloseIcon from '/sidebarClose.svg';
import submissionIcon from '/submissionIcon.svg';
import CodeEditor from './CodeEditor';
export default function CodingAssesment() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 15;

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Dummy data for questions
    const questionsData = [
        {
            id: 1,
            title: "Implement a dynamic form generator with validation.",
            instructions: [
                "Create a form with at least one field initially.",
                "Allow users to add or remove fields dynamically.",
                "Each field should have a label, type, and optional validation rules.",
                "Validate fields on blur or form submission.",
                "Display error messages for invalid fields.",
                "Use CSS for styling."
            ],
            optional: "Implement advanced validation, conditional fields, field rearrangement, and i18n support.",
            assessment: "Your solution will be assessed based on functionality, code quality, and performance. Optional: Implement advanced validation, conditional fields, field rearrangement, and i18n support."
        },
        {
            id: 2,
            title: "Explain how you would implement a shopping cart feature in a React e-commerce application.",
            instructions: [
                "State management (Redux/Context)",
                "Cart operations (add/remove/update)",
                "Persistence (localStorage)",
                "Cart summary calculation"
            ],
            optional: "Implement product variants and quantity constraints.",
            assessment: "Your solution will be assessed based on architecture design, state management approach, and performance considerations."
        }
    ];

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

    return (
        <div className='flex gap-8 px-12 py-6'>

            <div className={cn(
                "relative transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[60px]" : "max-w-[531px] w-full"
            )}>


                <aside className={cn(
                    "bg-white rounded-[20px] border border-gray-200 shadow-md transition-all duration-300 h-full overflow-hidden min-h-screen",
                    isCollapsed ? "p-2" : "p-6"
                )}>
                    {isCollapsed ? (
                        // Collapsed view
                        <div className="flex flex-col items-center gap-6 py-4">
                            <button
                                className={cn(
                                    "p-2 rounded-md w-full flex justify-center",
                                    activeTab === 'description' ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-gray-100"
                                )}
                                onClick={() => setActiveTab('description')}
                            >
                                <FileText size={20} />
                            </button>
                            <button
                                className={cn(
                                    "p-2 rounded-md w-full flex justify-center",
                                    activeTab === 'submissions' ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-gray-100"
                                )}
                                onClick={() => setActiveTab('submissions')}
                            >
                                <img src={submissionIcon} alt="submissionIcon" />
                            </button>
                            {/* Collapse button */}
                            <button
                                onClick={toggleSidebar}
                            >
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
                                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
                                    <h2 className="text-lg font-medium">{currentQuestionData.title}</h2>

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Instructions:</h3>
                                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                            {currentQuestionData.instructions.map((instruction, index) => (
                                                <li key={index} className="pl-2">{instruction}</li>
                                            ))}
                                        </ol>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Optional: </span>
                                            {currentQuestionData.optional}
                                        </p>
                                    </div>

                                    <div className="space-y-2 border-t pt-4 mt-4">
                                        <p className="text-sm text-gray-600">
                                            {currentQuestionData.assessment}
                                        </p>
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
            </div>
            <div className='flex-1'>
                <CodeEditor />
            </div>
        </div>
    );
}