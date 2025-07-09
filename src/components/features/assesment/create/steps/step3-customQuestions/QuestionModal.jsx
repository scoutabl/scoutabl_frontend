// QuestionModal.jsx
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import CodingQuestionContent from './CodingQuestionContent';
import { Eye, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SingleSelectAnswers from './SingleSelectAnswers';
import MultipleSelectAnswers from './MultipleSelectAnswers';
import RearrangeAnswers from './RearrangeAnswers';
import RatingScaleAnswers from './RatingScaleAnswers';
import NumericInputAnswers from './NumericInputAnswers';
import ReusableAnswer from './ReusableAnswer';
import AiIcon from '@/assets/AiIcon.svg?react'
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from 'sonner';
import { useAddQuestion, useUpdateQuestion } from '@/api/createQuestion';
import Assesment from '../../../Assesment';


const DEFAULT_SINGLE_SELECT_ANSWERS = [
    { id: '1', text: 'Yes' },
    { id: '2', text: 'No' },
];

const DEFAULT_MULTIPLE_SELECT_ANSWERS = [
    { id: '1', text: 'Javascript' },
    { id: '2', text: 'C++' }
];

//custom hook for question form
const useQuestionForm = (initialData, initialQuestion) => {
    const [question, setQuestion] = useState(initialData.question || initialQuestion);
    const [timeToAnswer, setTimeToAnswer] = useState(initialData.timeToAnswer || 120);
    const [customScore, setCustomScore] = useState(initialData.customScore || 120);
    const [isCompulsory, setIsCompulsory] = useState(initialData.isCompulsory || false);
    const [saveToLibrary, setSaveToLibrary] = useState(initialData.saveToLibrary || false);
    const [selectedAnswer, setSelectedAnswer] = useState(initialData.selectedAnswer || '');
    const [selectedRating, setSelectedRating] = useState(initialData.selectedRating || null);
    const [correctAnswer, setCorrectAnswer] = useState(initialData.correctAnswer || '000.00');
    const [numericCondition, setNumericCondition] = useState("0");
    const [post, setPost] = useState(initialData.question || initialQuestion);
    const [rearrangeOptions, setRearrangeOptions] = useState([
        { id: 1, text: '' },
        { id: 2, text: '' },
    ]);

    const [singleSelectAnswers, setSingleSelectAnswers] = useState(
        initialData.choices
            ? initialData.choices.map(choice => ({
                id: choice.id, // use backend id!
                text: choice.text
            }))
            : DEFAULT_SINGLE_SELECT_ANSWERS
    );
    const [multipleSelectAnswers, setMultipleSelectAnswers] = useState(
        initialData.answers || DEFAULT_MULTIPLE_SELECT_ANSWERS
    );
    const [selectedAnswers, setSelectedAnswers] = useState(initialData.selectedAnswers || []);

    return {
        question, setQuestion,
        timeToAnswer, setTimeToAnswer,
        customScore, setCustomScore,
        isCompulsory, setIsCompulsory,
        saveToLibrary, setSaveToLibrary,
        selectedAnswer, setSelectedAnswer,
        selectedRating, setSelectedRating,
        correctAnswer, setCorrectAnswer,
        numericCondition, setNumericCondition,
        post, setPost,
        singleSelectAnswers, setSingleSelectAnswers,
        multipleSelectAnswers, setMultipleSelectAnswers,
        selectedAnswers, setSelectedAnswers,
        rearrangeOptions, setRearrangeOptions,
    };
};

const QuestionModal = memo(({
    trigger,
    questionType,
    initialQuestion = "Have you previously worked in a remote/hybrid environment?",
    onSave,
    initialData = {},
    isOpen,
    setIsOpen,
    mode = 'add',
    assessmentId
}) => {
    // Remove internal isOpen state
    // const [isOpen, setIsOpen] = useState(false);
    const formState = useQuestionForm(initialData, initialQuestion);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Memoize validation logic
    const isValid = useMemo(() => {
        if (!formState.post.trim()) return false;

        if (questionType === 'single-select') {
            return formState.selectedAnswer &&
                formState.singleSelectAnswers.every(answer => answer.text.trim());
        }

        if (questionType === 'multiple-select') {
            return formState.multipleSelectAnswers.every(answer => answer.text.trim());
        }

        return true;
    }, [questionType, formState.post, formState.selectedAnswer, formState.singleSelectAnswers, formState.multipleSelectAnswers]);

    const addQuestionMutation = useAddQuestion(assessmentId, () => { setIsOpen(false); });
    const isEdit = mode === 'edit';
    const updateQuestionMutation = useUpdateQuestion(assessmentId, () => { setIsOpen(false) })

    const handleSave = useCallback(() => {
        if (!isValid) {
            if (!formState.post.trim()) {
                toast.error('Please enter a question');
                return;
            }

            if (questionType === 'single-select' && !formState.selectedAnswer) {
                toast.error('Please select the correct answer');
                return;
            }

            if (questionType === 'single-select' && formState.singleSelectAnswers.some(answer => !answer.text.trim())) {
                toast.error('All answer options must have text');
                return;
            }

            return;
        }

        const mins = parseInt(formState.timeToAnswer, 10) || 0;
        const completion_time = `00:${String(mins).padStart(2, '0')}:00`;

        let choices = [];
        let multiple_true = false;

        if (questionType === 'multiple-select') {
            choices = formState.multipleSelectAnswers.map(opt => {
                // Find original choice by id
                const original = initialData.choices?.find(c => c.id === opt.id);
                return {
                    ...(isEdit && original?.id ? { id: original.id } : {}),
                    text: opt.text,
                    is_correct: formState.selectedAnswers.includes(opt.id)
                };
            });
            multiple_true = true;
        } else if (questionType === 'single-select') {
            choices = formState.singleSelectAnswers.map(opt => {
                const original = initialData.choices?.find(c => c.id === opt.id);
                return {
                    ...(isEdit && original?.id ? { id: original.id } : {}),
                    text: opt.text,
                    is_correct: opt.id === formState.selectedAnswer
                };
            });
            multiple_true = false;
        }

        if (questionType === 'single-select' || questionType === 'multiple-select') {
            const payload = {
                resourcetype: "MCQuestion",
                completion_time,
                save_template: formState.saveToLibrary,
                title: formState.post,
                multiple_true,
                custom_score: Number(formState.customScore),
                is_compulsory: formState.isCompulsory,
                choices
            };
            if (isEdit) {
                updateQuestionMutation.mutate({ questionId: initialData.id, payload });
            } else {
                addQuestionMutation.mutate(payload);
            }
            return;
        }

        if (questionType === 'rearrange') {
            const options = formState.rearrangeOptions.map((opt, idx) => ({
                text: opt.text,
                question_order: idx,
                correct_order: idx
            }));

            const payload = {
                resourcetype: "RearrangeQuestion",
                completion_time,
                save_template: formState.saveToLibrary,
                title: formState.post,
                content: formState.post,
                shuffle_options: true,
                correct_order: options.map((_, idx) => idx),
                options
            };
            if (isEdit) {
                updateQuestionMutation.mutate({ questionId: initialData.id, payload });
            } else {
                addQuestionMutation.mutate(payload);
            }
            return;
        }

        if (questionType === 'numeric-input') {
            const payload = {
                "resourcetype": "NumberQuestion",
                completion_time,
                "save_template": formState.saveToLibrary,
                "title": formState.post,
                "content": formState.post,
                "value": formState.correctAnswer,
                "condition": formState.numericCondition
            }
            if (isEdit) {
                updateQuestionMutation.mutate({ questionId: initialData.id, payload });
            } else {
                addQuestionMutation.mutate(payload);
            }
            return;
        }

        const questionData = {
            questionType,
            question: formState.post,
            timeToAnswer: formState.timeToAnswer,
            customScore: formState.customScore,
            isCompulsory: formState.isCompulsory,
            saveToLibrary: formState.saveToLibrary,
            ...(questionType === 'rating' && { selectedRating: formState.selectedRating }),
            ...(questionType === 'numeric-input' && {
                correctAnswer: formState.correctAnswer,
                numericCondition: formState.numericCondition,
            }),
        };
        onSave?.(questionData);
        setIsOpen(false);
    }, [isValid, formState, questionType, addQuestionMutation, updateQuestionMutation, isEdit, initialData, onSave, setIsOpen]);

    const handleTextEditorChange = useCallback((content) => {
        formState.setPost(content);
    }, [formState.setPost]);

    const renderAnswerSection = useMemo(() => {
        switch (questionType) {
            case 'single-select':
                return (
                    <SingleSelectAnswers
                        answers={formState.singleSelectAnswers}
                        selectedAnswer={formState.selectedAnswer}
                        onAnswerChange={formState.setSelectedAnswer}
                        onAnswersChange={formState.setSingleSelectAnswers}
                        showShuffleToggle={true}
                        errors={
                            hasSubmitted
                                ? [
                                    !formState.selectedAnswer && "Please select the correct answer",
                                    formState.singleSelectAnswers.some(answer => !answer.text.trim()) && "All answer options must have text"
                                ].filter(Boolean)
                                : []
                        }
                    />
                );
            case 'multiple-select':
                return (
                    <MultipleSelectAnswers
                        answers={formState.multipleSelectAnswers}
                        selectedAnswers={formState.selectedAnswers}
                        onAnswersChange={formState.setMultipleSelectAnswers}
                        onSelectedChange={formState.setSelectedAnswers}
                        showShuffleToggle={true}
                        length={DEFAULT_MULTIPLE_SELECT_ANSWERS.length}
                    />
                );
            case 'rating':
                return (
                    <RatingScaleAnswers
                        scale="star-rating"
                        selectedRating={formState.selectedRating}
                        onRatingChange={formState.setSelectedRating}
                    />
                );
            case 'numeric-input':
                return (
                    <NumericInputAnswers
                        correctAnswer={formState.correctAnswer}
                        onAnswerChange={formState.setCorrectAnswer}
                        numericCondition={formState.numericCondition}
                        onConditionChange={formState.setNumericCondition}
                    />
                );
            case 'rearrange':
                return (
                    <RearrangeAnswers
                        value={formState.rearrangeOptions}
                        onChange={formState.setRearrangeOptions}
                    />
                )
            case 'essay':
            case 'video':
            case 'audio':
                return (
                    <ReusableAnswer />
                );
            default:
                return <div>Unsupported question type</div>;
        }
    }, [questionType, formState]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Remove DialogTrigger, modal is controlled from parent */}
            <DialogContent className="flex flex-col p-6 min-w-[90vw] sm:min-w-[600px] md:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1208px] max-w-[98vw] max-h-[90vh] overflow-y-auto rounded-[24px]">
                <div className="flex items-center justify-between mb-4">
                    <DialogHeader className="max-h-9">
                        <DialogTitle className="flex items-center gap-2">
                            <span className="text-xl text-greyPrimary">New Question:</span>
                            <Select defaultValue={questionType}>
                                <SelectTrigger className="w-[176px] text-sm bg-blueSecondary text-greyAccent">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single-select">Single Select</SelectItem>
                                    <SelectItem value="multiple-select">Multi Select</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                    <SelectItem value="numeric-input">Numeric Input</SelectItem>
                                    <SelectItem value="essay">Essay</SelectItem>
                                </SelectContent>
                            </Select>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="sr-only">
                        Add a new question to your assessment.
                    </DialogDescription>
                    <div className="flex items-center gap-3">
                        <button className="h-[33px] w-[112px] text-sm text-purplePrimary border border-purplePrimary rounded-full hover:bg-purplePrimary hover:text-white transition-colors duration-300 ease-linear flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4 transition-colors duration-300 ease-linear" />
                            Preview
                        </button>
                        <DialogClose className="p-2 text-greyPrimary hover:text-dangerPrimary transition-colors duration-300 ease-linear">
                            <X className="w-5 h-5" />
                        </DialogClose>
                    </div>
                </div>

                {questionType === 'code' ? (
                    <CodingQuestionContent initialData={initialData} initialQuestion={initialQuestion} />
                ) : (
                    <div className="flex gap-6">
                        <div className="flex-1 flex flex-col gap-4">
                            <div className='bg-purpleQuaternary rounded-2xl px-4 py-3 flex gap-2'>
                                <AiIcon className='w-4 h-4' />
                                <span className='text-[#7C7C7C] font-normal text-sm block'><span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text text-sm font-semibold'>Pro Tip:&nbsp;</span>Scoutabl's AI suggests tests by matching skills in your job description with related tests.</span>
                            </div>

                            <div className="flex-1">
                                <RichTextEditor content={formState.post} onChange={handleTextEditorChange} wordCountToggle={false} />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className='mb-6 p-3 flex flex-col gap-3 rounded-2xl bg-blueSecondary'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <label
                                            htmlFor="timeToAnswer"
                                            className='min-h-10 min-w-[150px] px-3 py-2 text-sm font-semibold text-greyAccent bg-white border-r border-seperatorPrimary rounded-tl-md rounded-bl-md'
                                        >
                                            Time to Answer
                                            <span className='text-[#E45270]'>*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            name="timeToAnswer"
                                            id="timeToAnswer"
                                            placeholder='120 Min'
                                            className='px-3 py-2 max-h-10 max-w-[114px] text-base font-medium text-greyAccent bg-white rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none border-0' onChange={(e) => formState.setTimeToAnswer(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="text-base font-medium text-greyPrimary">Compulsory Question</span>
                                        {/* <label className="relative inline-flex items-center cursor-pointer">
                                            <Input
                                                type="checkbox"
                                                checked={formState.isCompulsory}
                                                onChange={(e) => formState.setIsCompulsory(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors ${formState.isCompulsory ? 'bg-purplePrimary' : 'bg-greyac'}`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formState.isCompulsory ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                            </div>
                                        </label> */}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <Input
                                                type="checkbox"
                                                checked={formState.isCompulsory}
                                                onChange={(e) => formState.setIsCompulsory(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors ${formState.isCompulsory ? 'bg-purplePrimary' : 'bg-greyAccent'}`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formState.isCompulsory ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <label
                                            htmlFor="customScore"
                                            className='min-h-10 min-w-[150px] px-3 py-2 text-sm font-semibold text-greyAccent bg-white border-r border-seperatorPrimary rounded-tl-md rounded-bl-md'
                                        >
                                            Set Custom Score
                                            <span className='text-[#E45270]'>*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            name="customScore"
                                            id="customScore"
                                            placeholder='120'
                                            className='px-3 py-2 max-h-10 max-w-[114px] text-base font-medium text-greyAccent bg-white rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none border-0'
                                            onChange={(e) => formState.setCustomScore(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-base font-medium text-greyPrimary">Save question to library</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <Input
                                                type="checkbox"
                                                checked={formState.saveToLibrary}
                                                onChange={(e) => formState.setSaveToLibrary(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors ${formState.saveToLibrary ? 'bg-purplePrimary' : 'bg-greyAccent'}`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formState.saveToLibrary ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {renderAnswerSection}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                className="mt-4 ml-auto w-[124px] h-[37px] grid place-content-center bg-[#1EA378] text-white rounded-full text-sm font-medium"
                            >
                                Add Question
                            </motion.button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
});

export default QuestionModal;