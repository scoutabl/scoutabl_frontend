// QuestionModal.jsx
import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';

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

const DEFAULT_REARRANGE_OPTIONS = [
    { id: 1, text: 'runs' },
    { id: 2, text: 'quickly' },
    { id: 3, text: 'dog' },
]


function convertHHMMSSToMinutes(hhmmss) {
    if (!hhmmss) return 120; // fallback
    const [hours, minutes, seconds] = hhmmss.split(":").map(Number);
    return hours * 60 + minutes + Math.floor(seconds / 60);
}

//custom hook for question form
// const useQuestionForm = (initialData, initialQuestion, mode, isOpen, questionType) => {
//     const schema = getValidationSchema(questionType);

//     const getDefaultValues = () => {
//         const defaults = {
//             post: initialData.title || initialQuestion,
//             timeToAnswer: Number(initialData.timeToAnswer) || 25,
//             customScore: Number(initialData.customScore) || 25,
//             isCompulsory: initialData.is_compulsory || false,
//             saveToLibrary: initialData.is_save_template || false,
//             selectedAnswer: null,
//             selectedAnswers: [],
//             selectedRating: initialData.selectedRating || null,
//             correctAnswer: initialData.value || 250,
//             numericCondition: initialData.condition?.toString() || '2',
//             singleSelectAnswers: DEFAULT_SINGLE_SELECT_ANSWERS,
//             multipleSelectAnswers: DEFAULT_MULTIPLE_SELECT_ANSWERS,
//             rearrangeOrder: initialData.correct_order || [],
//             rearrangeOptions: initialData.options
//                 ? [...initialData.options].sort((a, b) => a.correct_order - b.correct_order)
//                 : DEFAULT_REARRANGE_OPTIONS,
//             // shuffleEnabled: initialData.shuffle_options || false,
//             shuffleEnabled: false,
//             relevance_context: initialData.relevance_context || '',
//             look_for_context: initialData.look_for_context || '',
//             title: initialData.title || '',
//         };
//         if (mode === 'edit' && initialData.choices) {
//             if (questionType === 'single-select') {
//                 defaults.singleSelectAnswers = initialData.choices.map(choice => ({
//                     answerId: Number(choice.id),
//                     text: choice.text,
//                 }));
//                 const correct = initialData.choices.find(c => c.is_correct);
//                 defaults.selectedAnswer = correct ? Number(correct.id) : null;
//             }
//             if (questionType === 'multiple-select') {
//                 defaults.multipleSelectAnswers = initialData.choices.map(choice => ({
//                     id: Number(choice.id),
//                     text: choice.text
//                 }));
//                 defaults.selectedAnswers = initialData.choices
//                     .filter(c => c.is_correct)
//                     .map(c => Number(c.id));
//             }
//             defaults.timeToAnswer = convertHHMMSSToMinutes(initialData.completion_time);
//             defaults.customScore = initialData.custom_score || 120;
//             defaults.shuffleEnabled = initialData.shuffle_options || false;
//             // defaults.isCompulsory = initialData.is_compulsory || false;
//             // defaults.saveToLibrary = initialData.is_save_template || false;
//             // defaults.shuffleEnabled = initialData.shuffle_options || false;
//             // defaults.title = initialData.title || '';
//             // defaults.relevance_context = initialData.relevance_context || '';
//             // defaults.look_for_context = initialData.look_for_context || '';
//         }

//         return defaults;
//     };

//     const form = useForm({
//         resolver: zodResolver(schema),
//         defaultValues: getDefaultValues(),
//         mode: 'onSubmit', // Validate on change for better UX
//     });

//     // Reset form when modal opens/closes or mode changes
//     useEffect(() => {
//         if (isOpen) {
//             console.log('Resetting form with:', getDefaultValues());
//             form.reset(getDefaultValues());
//         }
//     }, [mode, isOpen, initialData, questionType]);

//     return form;
// };
const useQuestionForm = (initialData, initialQuestion, mode, isOpen, questionType) => {
    const schema = getValidationSchema(questionType);

    const getDefaultValues = () => {
        // Handle coding questions separately due to different field structure
        if (questionType === 'coding') {
            return getCodingDefaults();
        }

        // Base defaults that apply to all non-coding question types
        const baseDefaults = {
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
            rearrangeOrder: initialData.correct_order || [],
            rearrangeOptions: initialData.options
                ? [...initialData.options].sort((a, b) => a.correct_order - b.correct_order)
                : DEFAULT_REARRANGE_OPTIONS,
            shuffleEnabled: false,
            relevance_context: initialData.relevance_context || '',
            look_for_context: initialData.look_for_context || '',
            title: initialData.title || '',
        };

        // Return base defaults for non-edit modes
        if (mode !== 'edit' || !initialData.choices) {
            return baseDefaults;
        }

        // Edit mode specific overrides
        const editOverrides = {
            timeToAnswer: convertHHMMSSToMinutes(initialData.completion_time),
            customScore: initialData.custom_score || 120,
            shuffleEnabled: initialData.shuffle_options || false,
        };

        // Question type specific processing for edit mode
        const questionTypeOverrides = getQuestionTypeOverrides(initialData, questionType);

        return {
            ...baseDefaults,
            ...editOverrides,
            ...questionTypeOverrides
        };
    };

    // Helper function for coding question defaults
    const getCodingDefaults = () => {
        return {
            // Basic question fields
            question: initialData?.question || initialQuestion || '',
            difficulty: initialData?.difficulty || '1',
            inputFormats: initialData?.inputFormats || '',
            constraints: initialData?.constraints || '',
            outputFormats: initialData?.outputFormats || '',
            tags: initialData?.tags || [],

            // Coding-specific fields
            selectedLanguages: initialData?.selectedLanguages || [],
            codeStubs: initialData?.codeStubs || {},
            customScore: initialData?.customScore || 10,
            saveToLibrary: initialData?.saveToLibrary || false,
            enablePrecisionCheck: initialData?.enablePrecisionCheck || false,
            disableCompile: initialData?.disableCompile || false,
            testCases: initialData?.testCases || [],
        };
    };

    // Helper function to handle question type specific logic
    const getQuestionTypeOverrides = (data, type) => {
        const overrides = {};

        if (type === 'single-select') {
            overrides.singleSelectAnswers = data.choices.map(choice => ({
                answerId: Number(choice.id),
                text: choice.text,
            }));

            const correctChoice = data.choices.find(c => c.is_correct);
            overrides.selectedAnswer = correctChoice ? Number(correctChoice.id) : null;
        }

        if (type === 'multiple-select') {
            overrides.multipleSelectAnswers = data.choices.map(choice => ({
                id: Number(choice.id),
                text: choice.text
            }));

            overrides.selectedAnswers = data.choices
                .filter(c => c.is_correct)
                .map(c => Number(c.id));
        }

        return overrides;
    };

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: getDefaultValues(),
        mode: 'onSubmit',
    });

    // Reset form when modal opens/closes or mode changes
    useEffect(() => {
        if (isOpen) {
            console.log('Resetting form with:', getDefaultValues());
            form.reset(getDefaultValues());
        }
    }, [mode, isOpen, initialData, questionType]);

    return form;
};

const QuestionModal = memo(({
    trigger,
    questionType,
    setQuestionType,
    initialQuestion = "Rearrange the following words to form a grammatically correct and meaningful sentence",
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
    const inputRefs = useRef([]);

    // RichTextEditor integration with react-hook-form
    const handleTextEditorChange = (content) => {
        setValue('post', content);
    };

    const onError = (errors) => {
        // Find the first error in rearrangeOptions
        if (errors.rearrangeOptions) {
            const firstErrorIdx = errors.rearrangeOptions.findIndex(opt => opt && opt.text);
            if (firstErrorIdx !== -1 && inputRefs.current[firstErrorIdx]) {
                inputRefs.current[firstErrorIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                inputRefs.current[firstErrorIdx].focus();
            }
        }
        console.log("Zod validation errors:", errors);
    };

    const onSubmit = (data) => {
        console.log("Form data before submit:", data);
        console.log("shuffleEnabled in form data:", data.shuffleEnabled);

        const mins = parseInt(data.timeToAnswer, 10) || 0;
        const completion_time = `00:${String(mins).padStart(2, '0')}:00`;

        let choices = [];
        let multiple_true = false;

        //coding question payload
        if (questionType === 'coding') {
            // Handle coding question submission
            const payload = {
                resourcetype: 'CodingQuestion',
                completion_time: data.customScore,
                save_template: data.saveToLibrary,
                content: data.question,
                difficulty: data.difficulty,
                input_formats: data.inputFormats,
                constraints: data.constraints,
                output_formats: data.outputFormats,
                tags: data.tags,
                selected_languages: data.selectedLanguages,
                code_stubs: data.codeStubs,
                test_cases: data.testCases,
                enable_precision_check: data.enablePrecisionCheck,
                disable_compile: data.disableCompile,
                // ...add other coding-specific fields as needed
            };

            if (isEdit) {
                updateQuestionMutation.mutate({ questionId: initialData.id, payload });
            } else {
                addQuestionMutation.mutate(payload);
            }
            return;
        }

        if (questionType === 'multiple-select') {
            choices = data.multipleSelectAnswers.map(opt => {
                const choiceData = {
                    text: opt.text,
                    is_correct: data.selectedAnswers.map(String).includes(String(opt.id))
                };

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
                shuffle_options: !!data.shuffleEnabled,
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
                ...(mode === 'edit' && opt.id ? { id: opt.id } : {}),
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
                options
            };
            if (isEdit) {
                updateQuestionMutation.mutate({ questionId: initialData.id, payload });
            } else {
                addQuestionMutation.mutate(payload);
            }
            return;
        }

        if (['essay', 'video', 'audio'].includes(questionType)) {
            const payload = {
                resourcetype: questionType === 'essay' ? 'EssayQuestion' : questionType === 'video' ? 'VideoQuestion' : 'AudioQuestion',
                completion_time,
                save_template: data.saveToLibrary,
                content: data.title || '', // If you have a content field, otherwise use title or another field
                title: data.title,
                relevance_context: data.relevance_context,
                look_for_context: data.look_for_context,
                // ...add other fields as needed
            };
            if (isEdit) {
                updateQuestionMutation.mutate({ questionId: initialData.id, payload });
            } else {
                addQuestionMutation.mutate(payload);
            }
            return;
        }
    };
    const renderQuestionContent = useMemo(() => {
        switch (questionType) {
            case 'single-select':
                return (
                    <SingleSelectAnswers mode={mode} />
                );
            case 'multiple-select':
                return (
                    <MultipleSelectAnswers mode={mode} />
                );
            case 'rating':
                return (
                    <RatingScaleAnswers
                        scale="star-rating"
                    // selectedRating={data?.selectedRating}
                    // onRatingChange={data?.setSelectedRating}
                    />
                );
            case 'numeric-input':
                return (
                    <NumericInputAnswers />
                );
            case 'rearrange':
                return (
                    <RearrangeAnswers inputRefs={inputRefs} />
                )
            case 'code':
                return (
                    <FormProvider>
                        <CodingQuestionContent
                            initialData={initialData}
                            initialQuestion={initialQuestion}
                            form={form} // Pass the form instance
                            onSubmit={onSubmit} // Pass the onSubmit handler
                        />
                    </FormProvider>
                )
            case 'essay':
            case 'video':
            case 'audio':
                return (
                    <ReusableAnswer register={form.register} errors={form.formState.errors} />
                );
            default:
                return <div>Unsupported question type</div>;
        }
    }, [questionType]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* Remove DialogTrigger, modal is controlled from parent */}
            {/* <DialogContent className="flex flex-col p-6 min-w-[90vw] sm:min-w-[600px] md:min-w-[800px] lg:min-w-[1000px] xl:min-w-[1208px] max-w-[1208px] max-h-[90vh] overflow-y-auto rounded-[24px]"> */}
            <DialogContent className="h-[720px] w-[1208px] max-h-[90vh] flex flex-col p-6 overflow-y-auto rounded-[24px]">
                <div className="flex items-center justify-between mb-4">
                    <DialogHeader className="max-h-9">
                        <DialogTitle className="flex items-center gap-2">
                            <span className="text-xl text-greyPrimary">New Question:</span>
                            <Select value={questionType} onValueChange={setQuestionType}>
                                <SelectTrigger className="w-[176px] text-sm bg-blueSecondary text-greyAccent">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single-select">Single Select</SelectItem>
                                    <SelectItem value="multiple-select">Multi Select</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                    <SelectItem value="numeric-input">Numeric Input</SelectItem>
                                    <SelectItem value="essay">Essay</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="audio">Audio</SelectItem>
                                    <SelectItem value="rearrange">Rearrange</SelectItem>
                                    <SelectItem value="code">Code</SelectItem>
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
                    <>
                        {renderQuestionContent}
                    </>
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
                                {renderQuestionContent}
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