import { useState } from "react";
import { cn } from "@/lib/utils";
import AiIcon from '@/assets/AiIcon.svg?react'
import QuestionIcon from '@/assets/questionIcon.svg?react'
import { CircleAlert } from 'lucide-react';
import RichTextEditor from "@/components/RichTextEditor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";

const CodingQuestionContent = ({ initialData, initialQuestion }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [post, setPost] = useState(initialData.question || initialQuestion);
    const [seletectedTags, setSelectedTags] = useState(['arrays', 'recursion']);
    const steps = [
        { id: "1", title: "Question Details" },
        { id: "2", title: "Select Languages" },
        { id: "3", title: "Code Stubs" },
        { id: "4", title: "Test Cases" },
    ];

    const questionTagsList = [
        { value: "arrays", label: "Arrays" },
        { value: "recursion", label: "Recursion" },
        { value: "iteration", label: "Iteration" },
        { value: "functions", label: "Functions" },
        { value: "conditionals", label: "Conditionals" },
        { value: "inheritance", label: "Inheritance" },
        { value: "promises", label: "Promises" },
        { value: "memoization", label: "Memoization" },
    ];
    const handleTextEditorOnChange = (content) => {
        setPost(content)
    }

    function Step1Content() {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <h3 className="flex text-base font-medium text-greyPrimary">Problem Statement<span className="text-[#E45270]">*</span></h3>
                    <QuestionIcon />
                </div>
                <RichTextEditor content={post} onChange={handleTextEditorOnChange} wordCountToggle={false} />
                <div className="flex items-center gap-4">
                    <label className="min-w-[220px] text-base font-medium text-greyPrimary">Difficulty Level</label>
                    <Select defaultValue='1'>
                        <SelectTrigger chevronColor="text-greyAccent" className="!h-[42px] w-[230px] p-3 flex items-center justify-between text-xs font-normal bg-white text-greyPrimary rounded-md">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="input-formats" className="flex text-base font-medium text-greyPrimary">
                            Input Formats
                            <span className="text-[#E45270]">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <Input type='text' id="input-formats" placeholder="nums=[1, 2, 3]" className='w-full' />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="constraints" className="flex text-base font-medium text-greyPrimary">
                            Constraints
                            <span className="text-[#E45270]">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <Input type='text' id="constraints" placeholder="Constraints" className='w-full' />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label htmlFor="output-formats" className="flex text-base font-medium text-greyPrimary">
                            Output Format
                            <span className="text-[#E45270]">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <Input type='text' id="output-formats" placeholder="output" className='w-full' />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[220px]">
                        <label className="flex text-base font-medium text-greyPrimary">
                            Question Tags
                            <span className="text-[#E45270]">*</span>
                        </label>
                        <QuestionIcon />
                    </div>
                    <MultiSelect
                        options={questionTagsList}
                        onValueChange={setSelectedTags}
                        defaultValue={seletectedTags}
                        placeholder="Select Question Tags"
                    />
                </div>
            </div>
        );
    }

    function Step2Content() {
        return (
            <div>
                {/* Language selection table, time/memory limits, etc. */}
            </div>
        );
    }

    function Step3Content() {
        return (
            <div>
                {/* Code stub editor, language tabs, etc. */}
            </div>
        );
    }

    function Step4Content() {
        return (
            <div>
                {/* Test cases table, add/edit, custom score, toggles, etc. */}
            </div>
        );
    }

    function renderStepContent() {
        switch (currentStep) {
            case 1: return <Step1Content />;
            case 2: return <Step2Content />;
            case 3: return <Step3Content />;
            case 4: return <Step4Content />;
            default: return null;
        }
    }

    return (
        <div className='flex gap-6 flex-1'>
            <aside className='p-6 w-[20.7%] max-w-[240px] flex flex-col justify-between rounded-5xl bg-white border border-[#E0E0E0]'>
                <div className="flex flex-col gap-4">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                "px-3 py-2 flex items-center gap-3 rounded-xl min-w-[202px] hover:bg-purpleQuaternary group transition-all duration-300 ease-in",
                                currentStep === Number(step.id) && "bg-purpleQuaternary"
                            )}
                            onClick={() => setCurrentStep(Number(step.id))}
                            style={{ cursor: "pointer" }}
                        >
                            <div
                                className={cn(
                                    'h-[51px] w-1 rounded-5xl transition-all duration-300 ease-in',
                                    currentStep === Number(step.id) ? 'bg-purplePrimary opacity-100' : 'bg-purplePrimary opacity-0 group-hover:opacity-100 '
                                )}
                            />
                            <div className="flex items-center gap-4">
                                <span className="h-[26px] w-[26px] grid place-content-center text-sm font-semibold text-purplePrimary border border-purplePrimary rounded-full">{step.id}</span>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-normal text-purplePrimary">Step:&nbsp;{step.id}</span>
                                    <span className="text-sm font-semibold text-greyPrimary text-nowrap">{step.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-[6px]">
                        <AiIcon className="h-5 w-5 text-purplePrimary" />
                        <h3 className='text-sm font-semibold bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Quality Review</h3>
                    </div>
                    <div className="flex items-start gap-1">
                        <CircleAlert size={24} className="text-greyAccent" />
                        <div className="flex flex-col gap-[6px]">
                            <span className="text-xs font-normal text-greyAccent">Scoutabl's AI suggests tests by matchin skills in your job.</span>
                            <span className="text-xs font-medium text-purplePrimary">Add sample test cases</span>
                        </div>
                    </div>
                </div>
            </aside>
            {/* step content */}
            <section className="flex-1 bg-white min-h-[600px]">
                {renderStepContent()}
                <div className="flex justify-between mt-6">
                    <button
                        disabled={currentStep === 1}
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="btn"
                    >
                        Back
                    </button>
                    <button
                        disabled={currentStep === 4}
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="btn"
                    >
                        Next
                    </button>
                </div>
            </section>
        </div>
    )
}

export default CodingQuestionContent