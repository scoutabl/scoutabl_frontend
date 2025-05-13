import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { HelpCircle, Check, Video, AlignJustify, BarChart3 } from 'lucide-react';
import { questions } from '@/lib/questions';
import { cn } from '@/lib/utils';
import { FaCheckCircle } from "react-icons/fa";

const QuestionTypeIcons = {
    'rating': <FaCheckCircle color='#590D0F' />,
    'mcq': <FaCheckCircle color='#13482A' />,
    'single-select': <FaCheckCircle color='#13482A' />,
    'multi-select': <FaCheckCircle color='#590D0F' />,
    'video': <FaCheckCircle color='#0A615F' />,
    'voice': <FaCheckCircle />,
    'long-answer': <FaCheckCircle />,
    'rearrange': <FaCheckCircle />,
    'coding': <FaCheckCircle />,
    'short-answer': <FaCheckCircle />,
    'true-false': <FaCheckCircle />,
};

const QuestionStatus = {
    'completed': <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white"><Check className="h-3 w-3" /></div>,
    'current': <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white"></div>,
    'pending': <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
};

export default function QuestionPopup({ currentQuestionIndex, onQuestionSelect }) {
    // Track question completion status (for demo purposes)
    const getQuestionStatus = (index) => {
        if (index < currentQuestionIndex) return 'completed';
        if (index === currentQuestionIndex) return 'current';
        return 'pending';
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                >
                    <span className="text-sm font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <HelpCircle className="h-4 w-4 text-purple-600" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 border rounded-lg shadow-lg min-w-[483px]"
                sideOffset={5}
                align="start"
            >
                <div className="bg-blue-50 p-3 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-blue-900">Assessment Questions</h3>
                        <span className="text-xs text-blue-800">{currentQuestionIndex + 1} of {questions.length}</span>
                    </div>
                </div>

                <div className="max-h-[450px] overflow-y-auto scrollbar-webkit tiny-thumb">
                    {questions.map((question, index) => (
                        <div
                            key={question.questionId}
                            className={cn(
                                "flex items-start gap-3 cursor-pointer  hover:bg-[#E8DEFD] hover:border-b ",
                                index === currentQuestionIndex && "bg-[#E8DEFD]"
                            )}
                            onClick={() => {
                                onQuestionSelect && onQuestionSelect(index);
                                // Optionally close the popover after selection
                                // setOpen(false); 
                            }}
                        >
                            {/* {QuestionStatus[getQuestionStatus(index)]} */}
                            <div className="flex-1 px-6 py-4">
                                <div className="flex gap-1">
                                    <span className="text-sm text-greyPrimary font-bold">Q{index + 1}:</span>
                                    <span className="text-sm text-greyPrimary text-wrap">{question.questionTitle || "Optional: Implement advanced validation..."}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-green-200 max-w-fit px-2 py-1 rounded-full mt-2">
                                    {QuestionTypeIcons[question.type]}
                                    <span className="text-xs font-medium capitalize">{question.type}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
} 