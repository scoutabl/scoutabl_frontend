// QuestionModal.jsx
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';

import { useForm, Controller } from 'react-hook-form';
import { FormProvider } from "react-hook-form";
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
import { getValidationSchema } from './schema/CreateQuestionValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
const DEFAULT_SINGLE_SELECT_ANSWERS = [
    { answerId: 1, text: 'Yes' },
    { answerId: 2, text: 'No' },
];

const DEFAULT_MULTIPLE_SELECT_ANSWERS = [
    { id: 1, text: 'Javascript' },
    { id: 2, text: 'C++' }
];

function convertHHMMSSToMinutes(hhmmss) {
    if (!hhmmss) return 120; // fallback
    const [hours, minutes, seconds] = hhmmss.split(":").map(Number);
    return hours * 60 + minutes + Math.floor(seconds / 60);
}

//custom hook for question form
const useQuestionForm = (initialData, initialQuestion, mode, isOpen, questionType) => {
    const schema = getValidationSchema(questionType);

    const getDefaultValues = () => {
        const defaults = {
            post: initialData.title || initialQuestion,
            timeToAnswer: Number(initialData.timeToAnswer) || 25,
            customScore: Number(initialData.customScore) || 25,
            isCompulsory: initialData.is_compulsory || false,
            saveToLibrary: initialData.is_save_template || false,
            selectedAnswer: null,
            selectedAnswers: [],
            selectedRating: initialData.selectedRating || null,
            correctAnswer: initialData.value || 250,
            numericCondition: initialData.condition?.toString() || '2',
            singleSelectAnswers: DEFAULT_SINGLE_SELECT_ANSWERS,
            multipleSelectAnswers: DEFAULT_MULTIPLE_SELECT_ANSWERS,
            rearrangeOptions: [
                { id: 1, text: '' },
                { id: 2, text: '' },
            ],
            shuffleEnabled: false,
        };
        if (mode === 'edit' && initialData.choices) {
            if (questionType === 'single-select') {
                defaults.singleSelectAnswers = initialData.choices.map(choice => ({
                    answerId: Number(choice.id),
                    text: choice.text,
                }));
                const correct = initialData.choices.find(c => c.is_correct);
                defaults.selectedAnswer = correct ? Number(correct.id) : null;
            }
            if (questionType === 'multiple-select') {
                defaults.multipleSelectAnswers = initialData.choices.map(choice => ({
                    id: Number(choice.id),
                    text: choice.text
                }));
                defaults.selectedAnswers = initialData.choices
                    .filter(c => c.is_correct)
                    .map(c => Number(c.id));
            }
            defaults.timeToAnswer = convertHHMMSSToMinutes(initialData.completion_time);
            defaults.customScore = initialData.custom_score || 120;
            defaults.isCompulsory = initialData.is_compulsory || false;
            defaults.saveToLibrary = initialData.is_save_template || false;
            defaults.shuffleEnabled = initialData.shuffle_options || false;
        }

        return defaults;
    };

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: getDefaultValues(),
        mode: 'onSubmit', // Validate on change for better UX
    });

    // Reset form when modal opens/closes or mode changes
    useEffect(() => {
        if (isOpen) {
            form.reset(getDefaultValues());
        }
    }, [mode, isOpen, initialData, questionType]);

    return form;
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
    const form = useQuestionForm(initialData, initialQuestion, mode, isOpen, questionType)
    const { handleSubmit, control, watch, setValue, formState: { errors, isValid } } = form;
    const addQuestionMutation = useAddQuestion(assessmentId, () => { setIsOpen(false); });
    const updateQuestionMutation = useUpdateQuestion(assessmentId, () => { setIsOpen(false); });
    const isEdit = mode === 'edit';
    // Use watch to get current form values
    const watchedValues = watch();

    // RichTextEditor integration with react-hook-form
    const handleTextEditorChange = (content) => {
        setValue('post', content);
    };

    const onError = (errors) => {
        console.log("Zod validation errors:", errors);
    };

    const onSubmit = (data) => {
        // Debug each option with proper type conversion
        // data.singleSelectAnswers.forEach((opt, index) => {
        //     const isSelected = String(opt.answerId) === String(data.selectedAnswer);
        //     // console.log(`Option ${index}:`, {
        //     //     answerId: opt.answerId,
        //     //     backendId: opt.answerId, // Add this for debugging
        //     //     answerIdType: typeof opt.answerId,
        //     //     text: opt.text,
        //     //     selectedAnswer: data.selectedAnswer,
        //     //     selectedAnswerType: typeof data.selectedAnswer,
        //     //     isSelected: isSelected,
        //     //     stringComparison: String(opt.answerId) === String(data.selectedAnswer)
        //     // });
        // });

        const mins = parseInt(data.timeToAnswer, 10) || 0;
        const completion_time = `00:${String(mins).padStart(2, '0')}:00`;
        // choices = data.multipleSelectAnswers.map(opt => {
        //     // Find backend id if editing
        //     const original = initialData.choices?.find(c => String(c.id) === String(opt.answerId));
        //     return {
        //         ...(isEdit && original?.id ? { id: original.id } : {}),
        //         text: opt.text,
        //         is_correct: data.selectedAnswers.includes(opt.answerId)
        //     };
        // });
        // choices = data.singleSelectAnswers.map(opt => {
        //     // For edit mode, use backendId if available, otherwise let backend create new ID
        //     return {
        //         ...(isEdit && opt.backendId ? { id: opt.backendId } : {}),
        //         text: opt.text,
        //         is_correct: String(opt.answerId) === String(data.selectedAnswer)
        //     };
        // });
        // multiple_true = false;
        // choices = data.singleSelectAnswers.map(opt => {
        //     const choiceData = {
        //         text: opt.text,
        //         is_correct: Number(opt.answerId) === Number(data.selectedAnswer)
        //     };

        //     // Include ID for existing backend choices
        //     if (mode === 'edit' && opt.isExisting === true) {
        //         choiceData.id = opt.answerId;
        //     }

        //     return choiceData;
        // });
        // choices = data.singleSelectAnswers.map(opt => {
        //     const choiceData = {
        //         text: opt.text,
        //         is_correct: String(opt.answerId) === String(data.selectedAnswer)
        //     };
        //     if (mode === 'edit' && opt.answerId) {
        //         choiceData.id = opt.answerId; // Only include id if it exists (i.e., backend option)
        //     }
        //     return choiceData;
        // });

        // let choices = [];
        // let multiple_true = false;
        // if (questionType === 'multiple-select') {
        //     choices = data.multipleSelectAnswers.map(opt => ({
        //         ...(isEdit && initialData.choices?.some(c => String(c.id) === String(opt.id)) ? { id: opt.id } : {}),
        //         text: opt.text,
        //         is_correct: data.selectedAnswers.map(String).includes(String(opt.id))
        //     }));
        //     multiple_true = true;
        // }
        // else if (questionType === 'single-select') {
        //     choices = data.singleSelectAnswers.map(opt => {
        //         const choiceData = {
        //             text: opt.text,
        //             is_correct: String(opt.answerId) === String(data.selectedAnswer)
        //         };
        //         // Only include id if it matches a backend id
        //         const isBackendId = initialData.choices?.some(c => String(c.id) === String(opt.answerId));
        //         if (mode === 'edit' && isBackendId) {
        //             choiceData.id = opt.answerId;
        //         }
        //         return choiceData;
        //     });
        //     multiple_true = false;
        // }

        let choices = [];
        let multiple_true = false;

        if (questionType === 'multiple-select') {
            choices = data.multipleSelectAnswers.map(opt => {
                const choiceData = {
                    text: opt.text,
                    is_correct: data.selectedAnswers.map(String).includes(String(opt.id))
                };

                // Only include id if we're in edit mode AND the id exists in backend data
                if (isEdit && initialData.choices?.some(c => String(c.id) === String(opt.id))) {
                    choiceData.id = opt.id;
                }

                return choiceData;
            });
            multiple_true = true;
        }
        else if (questionType === 'single-select') {
            choices = data.singleSelectAnswers.map(opt => {
                const choiceData = {
                    text: opt.text,
                    is_correct: String(opt.answerId) === String(data.selectedAnswer)
                };

                // Only include id if it matches a backend id
                const isBackendId = initialData.choices?.some(c => String(c.id) === String(opt.answerId));
                if (isEdit && isBackendId) {
                    choiceData.id = opt.answerId;
                }

                return choiceData;
            });
            multiple_true = false;
        }
        // Rest of your submission logic...
        if (questionType === 'single-select' || questionType === 'multiple-select') {
            const payload = {
                resourcetype: "MCQuestion",
                completion_time,
                save_template: data.saveToLibrary,
                title: data.post,
                multiple_true,
                custom_score: Number(data.customScore),
                is_compulsory: data.isCompulsory,
                choices
            };

            if (isEdit) {
                updateQuestionMutation.mutate({ questionId: initialData.id, payload });
            } else {
                addQuestionMutation.mutate(payload);
            }
            return;
        }

        //numeric-input payload
        if (questionType === 'numeric-input') {
            const payload = {
                "resourcetype": "NumberQuestion",
                completion_time,
                "save_template": data.saveToLibrary,
                "title": data.post,
                "content": data.post,
                "value": data.correctAnswer,
                "condition": data.numericCondition
            }
            if (isEdit) {
                updateQuestionMutation.mutate({ questionId: initialData.id, payload });
            } else {
                addQuestionMutation.mutate(payload);
            }
            return;
        }
        // hanlde rearrange quetion
        if (questionType === 'rearrange') {
            const options = data.rearrangeOptions.map((opt, idx) => ({
                text: opt.text,
                question_order: idx,
                correct_order: idx
            }));

            const payload = {
                resourcetype: "RearrangeQuestion",
                completion_time,
                save_template: data.saveToLibrary,
                title: data.post,
                content: data.post,
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

        // Handle other question types...
        // (similar to your existing code)
    };
    const renderAnswerSection = useMemo(() => {
        switch (questionType) {
            case 'single-select':
                return (
                    <SingleSelectAnswers mode={mode} />
                    // answers={data.singleSelectAnswers}
                    // selectedAnswer={data.selectedAnswer}
                    // onAnswerChange={data.setSelectedAnswer}
                    // onAnswersChange={data.setSingleSelectAnswers}
                    // showShuffleToggle={true}
                    // shuffleEnabled={data.shuffleEnabled}
                    // setShuffleEnabled={data.setShuffleEnabled}
                    // errors={
                    //     hasSubmitted
                    //         ? [
                    //             !data.selectedAnswer && "Please select the correct answer",
                    //             data.singleSelectAnswers.some(answer => !answer.text.trim()) && "All answer options must have text"
                    //         ].filter(Boolean)
                    //         : []
                    // }

                );
            case 'multiple-select':
                return (
                    <MultipleSelectAnswers mode={mode} />
                    //         answers = { data.multipleSelectAnswers }
                    // selectedAnswers = { data.selectedAnswers }
                    // onAnswersChange = { data.setMultipleSelectAnswers }
                    // onSelectedChange = { data.setSelectedAnswers }
                    // showShuffleToggle = { true}
                    // shuffleEnabled = { data.shuffleEnabled }
                    // setShuffleEnabled = { data.setShuffleEnabled }
                    // length = { DEFAULT_MULTIPLE_SELECT_ANSWERS.length }
                    // error = { data.multipleSelectAnswers.some(answer => !answer.text.trim()) }
                );
            // case 'rating':
            //     return (
            //         <RatingScaleAnswers
            //             scale="star-rating"
            //             selectedRating={data.selectedRating}
            //             onRatingChange={data.setSelectedRating}
            //         />
            //     );
            case 'numeric-input':
                return (
                    <NumericInputAnswers
                    // correctAnswer={data.correctAnswer}
                    // onAnswerChange={data.setCorrectAnswer}
                    // numericCondition={data.numericCondition}
                    // onConditionChange={data.setNumericCondition}
                    />
                );
            // case 'rearrange':
            //     return (
            //         <RearrangeAnswers
            //             value={data.rearrangeOptions}
            //             onChange={data.setRearrangeOptions}
            //         />
            //     )
            case 'essay':
            case 'video':
            case 'audio':
                return (
                    <ReusableAnswer />
                );
            default:
                return <div>Unsupported question type</div>;
        }
    }, [questionType]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Remove DialogTrigger, modal is controlled from parent */}
            <DialogContent className="flex flex-col p-6 min-w-[90vw] sm:min-w-[600px] md:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1208px] max-w-[1208px] max-h-[90vh] overflow-y-auto rounded-[24px]">

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
                                <RichTextEditor content={watchedValues.post} onChange={handleTextEditorChange} wordCountToggle={false} />
                            </div>
                        </div>
                        <FormProvider {...form}>
                            <form onSubmit={handleSubmit(onSubmit, onError)} className='flex-1 flex flex-col'>
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
                                            <Controller
                                                name="timeToAnswer"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder='120 Min'
                                                        onChange={(e) => field.onChange(Number(e.target.value))} // Convert to number
                                                        className='px-3 py-2 max-h-10 max-w-[114px] text-base font-medium text-greyAccent bg-white rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none border-0'
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <span className="text-base font-medium text-greyPrimary">Compulsory Question</span>
                                            <Controller
                                                name="isCompulsory"
                                                control={control}
                                                render={({ field }) => (
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-11 h-6 rounded-full transition-colors ${field.value ? 'bg-purplePrimary' : 'bg-greyAccent'}`}>
                                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                                        </div>
                                                    </label>
                                                )}
                                            />
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
                                            <Controller
                                                name="customScore"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder='120'
                                                        className='px-3 py-2 max-h-10 max-w-[114px] text-base font-medium text-greyAccent bg-white rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none border-0'
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-base font-medium text-greyPrimary">Save question to library</span>
                                            <Controller
                                                name="saveToLibrary"
                                                control={control}
                                                render={({ field }) => (
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-11 h-6 rounded-full transition-colors ${field.value ? 'bg-purplePrimary' : 'bg-greyAccent'}`}>
                                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${field.value ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                                        </div>
                                                    </label>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {renderAnswerSection}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn("mt-4 ml-auto grid place-content-center bg-[#1EA378] text-white rounded-full text-sm font-medium", {
                                        'w-[124px] h-[37px]': !isEdit,
                                        'w-[156px] h-[44px]': isEdit,
                                    })}
                                >
                                    {isEdit ? 'Update Question' : 'Add Question'}
                                </motion.button>
                            </form>
                        </FormProvider>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
});

export default QuestionModal;