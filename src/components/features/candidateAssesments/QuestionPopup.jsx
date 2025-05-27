import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { HelpCircle, Check, ChevronDown } from 'lucide-react';
import { questions } from '@/lib/questions';
import { questionsData } from '@/lib/codingQuestions';
import { cn } from '@/lib/utils';
import { FaCheckCircle } from "react-icons/fa";

const QuestionTypeIcons = {
    'rating': <FaCheckCircle color='#590D0F' cl />,
    'mcq': <FaCheckCircle color='#13482A' />,
    'single-select': <FaCheckCircle color='#13482A' />,
    'multi-select': <FaCheckCircle color='#590D0F' />,
    'video': <FaCheckCircle color='#0A615F' />,
    'voice': <FaCheckCircle />,
    'long-answer': <FaCheckCircle />,
    'rearrange': <FaCheckCircle />,
    'coding': <FaCheckCircle className='dark:text-black' />,
    'short-answer': <FaCheckCircle />,
    'true-false': <FaCheckCircle />,
};

const QuestionStatus = {
    'completed': <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white"><Check className="h-3 w-3" /></div>,
    'current': <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white"></div>,
    'pending': <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
};

export default function QuestionPopup({
    currentQuestionIndex,
    onQuestionSelect,
    mode = 'regular', // 'regular' or 'coding'
    totalQuestions,
    getQuestionStatus
}) {
    // Use the appropriate questions data based on mode
    const questionsList = mode === 'coding' ? questionsData : questions;
    const total = totalQuestions || questionsList.length;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    variant="ghost"
                    className="flex items-center gap-2 py-[6px] px-3 h-auto rounded-full bg-blueSecondary"
                >
                    <span className="text-sm font-medium text-greyPrimary">Question <strong>{currentQuestionIndex + 1}</strong> of <strong>{total}</strong></span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 border rounded-lg shadow-lg min-w-[483px]"
                sideOffset={5}
                align="start"
            >
                <div className="bg-blue-50 p-3 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        {mode === 'coding' ? (
                            <h3 className="text-sm font-bold text-greyPrimary">Coding Questions</h3>
                        ) : (
                            <h3 className="text-sm font-bold text-greyPrimary">Assessment Questions</h3>
                        )}
                        {/* <h3 className="text-sm font-medium text-greyPrimary">{(mode === 'coding' ?)}Assessment Questions</h3> */}
                        <span className="text-xs text-greyPrimary font-bold">{currentQuestionIndex + 1} of {total}</span>
                    </div>
                </div>

                <div className="max-h-[450px] overflow-y-auto">
                    {questionsList.map((question, index) => (
                        <div
                            key={mode === 'coding' ? question.id : question.questionId}
                            className={cn(
                                "flex items-start gap-3 cursor-pointer hover:bg-[#E8DEFD] hover:border-b group",
                                index === currentQuestionIndex && "bg-[#E8DEFD]"
                            )}
                            onClick={() => {
                                onQuestionSelect && onQuestionSelect(index);
                                setIsOpen(false);
                            }}
                        >
                            <div className="flex-1 px-6 py-4 ">
                                <div className="flex gap-1">
                                    <span className={cn(
                                        "text-sm text-greyPrimary font-bold dark:text-white group-hover:dark:text-black",
                                        index === currentQuestionIndex && "dark:text-greyPrimary"
                                    )}
                                    >Q{index + 1}:</span>
                                    <span className={cn(
                                        "text-sm text-greyPrimary font-regular dark:text-white group-hover:dark:text-black",
                                        index === currentQuestionIndex && "dark:text-greyPrimary"
                                    )}>
                                        {mode === 'coding' ? question.title : question.questionTitle}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-green-200 max-w-fit px-2 py-1 rounded-full mt-2">
                                    {QuestionTypeIcons[mode === 'coding' ? 'coding' : question.type]}
                                    <span className="text-xs font-medium capitalize dark:text-black">
                                        {mode === 'coding' ? 'coding' : question.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover >
    );
} 