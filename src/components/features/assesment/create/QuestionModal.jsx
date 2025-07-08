// QuestionModal.jsx
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'; import { motion } from 'framer-motion';
import CodingQuestionContent from './CodingQuestionContent';
import { X } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import RearrangeAnswers from './steps/customQuestions/RearrangeAnswers';
import AiIcon from '@/assets/AiIcon.svg?react'
import PlusIcon from '@/assets/plusIcon.svg?react'
import PurpleStarIcon from '@/assets/purpleStar.svg?react'
import RichTextEditor from '@/components/RichTextEditor';
import NumericInputIcon from '@/assets/numericInputIcon.svg?react'
import RatingIcon from '@/assets/ratingIcon.svg?react'
import LikertIcon from '@/assets/smileyIcon.svg?react'
import Emoji1 from '@/assets/emoji1.svg?react'
import Emoji2 from '@/assets/emoji2.svg?react'
import Emoji3 from '@/assets/emoji3.svg?react'
import Emoji4 from '@/assets/emoji4.svg?react'
import Emoji5 from '@/assets/emoji5.svg?react'
import DeleteIcon from '@/assets/trashIcon.svg?react'
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAddQuestion } from '@/api/createQuestion';

const SCALE_OPTIONS = {
    'star-rating': [
        { value: 1, label: 'Hated it', stars: 1 },
        { value: 2, label: 'Satisfactory', stars: 2 },
        { value: 3, label: 'Nice', stars: 3 },
        { value: 4, label: 'Good', stars: 4 },
        { value: 5, label: 'Excellent', stars: 5 },
    ],
    'likert': [
        { value: 1, label: 'Strongly Disagree', icon: <Emoji1 /> },
        { value: 2, label: 'Disagree', icon: <Emoji2 /> },
        { value: 3, label: 'Neutral', icon: <Emoji3 /> },
        { value: 4, label: 'Agree', icon: <Emoji4 /> },
        { value: 5, label: 'Strongly Agree', icon: <Emoji5 /> },
    ],
    'numeric': Array.from({ length: 5 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`,
    })),
};

const DEFAULT_SINGLE_SELECT_ANSWERS = [
    { id: '1', text: 'Yes' },
    { id: '2', text: 'No' },
];

const DEFAULT_MULTIPLE_SELECT_ANSWERS = [
    { id: '1', text: 'Option 1' },
    { id: '2', text: 'Option 2' },
];

const NumericInputAnswers = ({ correctAnswer, onAnswerChange, numericCondition, onConditionChange }) => {
    return (
        <div className="space-y-4">
            <div className="mb-4">
                <span className="text-base font-semibold text-greyPrimary">Correct if</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-greyAccent font-semibold">Answer is</span>
                <Select defaultValue={numericCondition} onValueChange={onConditionChange}>
                    <SelectTrigger chevronColor="text-white" className="!h-[43px] py-3 px-6 flex items-center justify-between w-fit text-sm font-medium bg-purplePrimary text-white rounded-xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="more-than">More than</SelectItem>
                        <SelectItem value="less-than">Less than</SelectItem>
                        <SelectItem value="equal-to">More than/ equal to</SelectItem>
                        <SelectItem value="between">Less than/ equal to</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    type="number"
                    value={correctAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="flex-1 h-[43px] p-3 border border-gray-300 rounded-xl text-sm font-medium text-greyAccent"
                    placeholder="000.00"
                    step="0.01"
                />
            </div>
        </div>
    )
}

const RatingOption = memo(({ option, isSelected, onClick }) => {
    const handleClick = useCallback(() => {
        onClick(option.value);
    }, [onClick, option.value]);

    return (
        <div
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${isSelected
                ? 'border-purplePrimary bg-purple-50'
                : 'border-gray-200 hover:bg-purple-50 hover:border-purplePrimary'
                }`}
            onClick={handleClick}
        >
            {option.stars && (
                <div className="flex gap-2">
                    {Array.from({ length: option.stars }, (_, i) => (
                        <PurpleStarIcon key={i} className="text-purplePrimary" />
                    ))}
                </div>
            )}
            {option.icon && (
                <div className="w-6 h-6 flex items-center justify-center">
                    {option.icon}
                </div>
            )}
            <span className="font-medium text-gray-800">{option.label}</span>
        </div>
    );
});

const RatingScaleAnswers = memo(({ scale, selectedRating, onRatingChange }) => {
    const [activeTab, setActiveTab] = useState('star-rating');

    const scaleOptions = useMemo(() => {
        return SCALE_OPTIONS[activeTab] || SCALE_OPTIONS['star-rating'];
    }, [activeTab]);

    const handleStarRatingClick = useCallback(() => {
        setActiveTab('star-rating');
    }, []);

    const handleLikertClick = useCallback(() => {
        setActiveTab('likert');
    }, []);

    const handleNumericClick = useCallback(() => {
        setActiveTab('numeric');
    }, []);

    const handleOptionClick = useCallback((value) => {
        onRatingChange(value);
    }, [onRatingChange]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">Select a scale</span>
                <div className="flex gap-2">
                    <button
                        onClick={handleStarRatingClick}
                        className={cn("flex items-center px-3 gap-2 py-[6px] text-sm font-medium bg-white hover:bg-purplePrimary text-purplePrimary hover:text-white rounded-full border border-purplePrimary transition-all duration-300 ease-in group hover:cursor-pointer",
                            { 'bg-purplePrimary text-white': activeTab === 'star-rating' }
                        )}
                    >
                        <RatingIcon className={cn("text-purplePrimary w-4 h-4 group-hover:text-white transition-all duration-300 ease-in", { 'text-white': activeTab === 'star-rating' })} />
                        Star Rating (1-5)
                    </button>
                    <button
                        onClick={handleLikertClick}
                        className={cn("flex items-center px-3 gap-2 py-[6px] text-sm font-medium bg-white hover:bg-purplePrimary text-purplePrimary hover:text-white rounded-full border border-purplePrimary transition-all duration-300 ease-in group hover:cursor-pointer",
                            { 'bg-purplePrimary text-white': activeTab === 'likert' }
                        )}
                    >
                        <LikertIcon className={cn("text-purplePrimary w-4 h-4 group-hover:text-white transition-all duration-300 ease-in", { 'text-white': activeTab === 'likert' })} />
                        Likert Scale
                    </button>
                    <button
                        onClick={handleNumericClick}
                        className={cn("flex items-center px-3 gap-2 py-[6px] text-sm font-medium bg-white hover:bg-purplePrimary text-purplePrimary hover:text-white rounded-full border border-purplePrimary transition-all duration-300 ease-in group hover:cursor-pointer",
                            { 'bg-purplePrimary text-white': activeTab === 'numeric' }
                        )}
                    >
                        <NumericInputIcon className={cn("text-purplePrimary w-4 h-4 group-hover:text-white transition-all duration-300 ease-in", { 'text-white': activeTab === 'numeric' })} />
                        Numeric Scale
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {scaleOptions.map((option) => (
                    <RatingOption
                        key={option.value}
                        option={option}
                        isSelected={selectedRating === option.value}
                        onClick={handleOptionClick}
                    />
                ))}
            </div>
        </div>
    );
});

const AnswerOption = memo(({
    answer,
    index,
    isSelected,
    onAnswerChange,
    onTextChange,
    onRemove,
    canRemove,
    type = "radio"
}) => {
    const handleSelectionChange = useCallback((e) => {
        if (type === "radio") {
            onAnswerChange(e.target.value);
        } else {
            onAnswerChange(answer.id, e.target.checked);
        }
    }, [answer.id, onAnswerChange, type]);

    const handleTextChange = useCallback((e) => {
        onTextChange(answer.id, e.target.value);
    }, [answer.id, onTextChange]);

    const handleRemove = useCallback(() => {
        onRemove(answer.id);
    }, [answer.id, onRemove]);

    return (
        <div className="flex items-center gap-2 peer">
            <Input
                type={type}
                name={type === "radio" ? "answer" : undefined}
                value={answer.id}
                checked={isSelected}
                onChange={handleSelectionChange}
                className="w-4 h-4 text-blue-600"
            />
            <Input
                type="text"
                value={answer.text}
                onChange={handleTextChange}
                className="p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Option ${index + 1}`}
            />
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRemove}
                className="text-greyPrimary transition-colors disabled:opacity-50 group"
                disabled={!canRemove}
            >
                <DeleteIcon className="w-4 h-4 text-greyPrimary group-hover:text-[#EB5757] transition-colors duration-300 ease-in" />
            </motion.button>
        </div>
    );
});

const SingleSelectAnswers = memo(({
    answers,
    selectedAnswer,
    onAnswerChange,
    onAnswersChange,
    showShuffleToggle
}) => {
    const [shuffleEnabled, setShuffleEnabled] = useState(false);

    const shuffledOptions = useMemo(() => {
        if (!shuffleEnabled) return answers;

        return [...answers]
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }, [shuffleEnabled, answers]);

    const handleShuffleToggle = useCallback((checked) => {
        setShuffleEnabled(checked);
    }, []);

    const handleAddOption = useCallback(() => {
        const maxId = Math.max(...answers.map(answer => parseInt(answer.id) || 0));
        const newAnswer = {
            id: (maxId + 1).toString(),
            text: ''
        };
        onAnswersChange([...answers, newAnswer]);
    }, [answers, onAnswersChange]);

    const handleRemoveOption = useCallback((answerId) => {
        if (answers.length <= 2) {
            alert('You must have at least 2 options');
            return;
        }

        const updatedAnswers = answers.filter(answer => answer.id !== answerId);
        onAnswersChange(updatedAnswers);

        if (selectedAnswer === answerId) {
            onAnswerChange('');
        }
    }, [answers, selectedAnswer, onAnswersChange, onAnswerChange]);

    const handleAnswerTextChange = useCallback((answerId, newText) => {
        const updatedAnswers = answers.map(answer =>
            answer.id === answerId ? { ...answer, text: newText } : answer
        );
        onAnswersChange(updatedAnswers);
    }, [answers, onAnswersChange]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
                {showShuffleToggle && (
                    <div className='flex items-center gap-1 group'>
                        <Checkbox
                            name="shuffleSingleSelectOptions"
                            id="shuffleSingleSelectOptions"
                            checked={shuffleEnabled}
                            onCheckedChange={handleShuffleToggle}
                        />
                        <label htmlFor='shuffleSingleSelectOptions' className="text-greyAccent font-medium text-sm group-hover:text-purplePrimary duration-300 transition-colors ease-in cursor-pointer">
                            Shuffle options
                        </label>
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-4'>
                {shuffledOptions.map((answer, index) => (
                    <AnswerOption
                        key={answer.id}
                        answer={answer}
                        index={index}
                        isSelected={selectedAnswer === answer.id}
                        onAnswerChange={onAnswerChange}
                        onTextChange={handleAnswerTextChange}
                        onRemove={handleRemoveOption}
                        canRemove={answers.length > 2}
                        type="radio"
                    />
                ))}
            </div>
            <button onClick={handleAddOption} className="py-[17.5px] flex items-center gap-3 text-[#0077C2] text-sm font-medium">
                <PlusIcon /> Add Options
            </button>
        </div>
    );
});

const MultipleSelectAnswers = ({
    answers,
    selectedAnswers = [],
    onAnswersChange,
    onSelectedChange,
    showShuffleToggle
}) => {
    const [shuffleEnabled, setShuffleEnabled] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        if (shuffleEnabled) {
            const shuffled = [...answers]
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            setShuffledOptions(shuffled);
        } else {
            setShuffledOptions([]);
        }
    }, [shuffleEnabled, answers]);

    const handleShuffleToggle = (checked) => {
        setShuffleEnabled(checked);
    };

    const handleAddOption = () => {
        const maxId = Math.max(...answers.map(answer => parseInt(answer.id) || 0));
        const newAnswer = {
            id: (maxId + 1).toString(),
            text: ''
        };
        onAnswersChange([...answers, newAnswer]);
    };

    const handleRemoveOption = (answerId) => {
        if (answers.length <= 2) {
            alert('You must have at least 2 options');
            return;
        }
        const updatedAnswers = answers.filter(answer => answer.id !== answerId);
        onAnswersChange(updatedAnswers);
        const updatedSelected = selectedAnswers.filter(id => id !== answerId);
        onSelectedChange(updatedSelected);
    };

    const handleAnswerTextChange = (answerId, newText) => {
        const updatedAnswers = answers.map(answer =>
            answer.id === answerId ? { ...answer, text: newText } : answer
        );
        onAnswersChange(updatedAnswers);
    };

    const handleCheckboxChange = (answerId, checked) => {
        let updatedSelected;
        if (checked) {
            updatedSelected = [...selectedAnswers, answerId];
        } else {
            updatedSelected = selectedAnswers.filter(id => id !== answerId);
        }
        onSelectedChange(updatedSelected);
    };

    const optionsToRender = shuffleEnabled ? shuffledOptions : answers;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
                {showShuffleToggle && (
                    <div className='flex items-center gap-1 group'>
                        <Checkbox
                            name="shuffleMultipleSelectOptions"
                            id="shuffleMultipleSelectOptions"
                            checked={shuffleEnabled}
                            onCheckedChange={handleShuffleToggle}
                        />
                        <label htmlFor='shuffleMultipleSelectOptions' className="text-greyAccent font-medium text-sm group-hover:text-purplePrimary duration-300 transition-colors ease-in cursor-pointer">
                            Shuffle options
                        </label>
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-4 '>
                {optionsToRender.map((answer, index) => (
                    <div key={answer.id} className="flex items-center gap-2 peer">
                        <Checkbox
                            checked={selectedAnswers.includes(answer.id)}
                            onCheckedChange={checked => handleCheckboxChange(answer.id, checked)}
                        />
                        <Input
                            type="text"
                            value={answer.text}
                            onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
                            className="p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Option ${index + 1}`}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveOption(answer.id)}
                            className="text-greyPrimary transition-colors disabled:opacity-50 group"
                            disabled={answers.length <= 2}
                        >
                            <DeleteIcon className="w-4 h-4 text-greyPrimary group-hover:text-[#EB5757] transition-colors duration-300 ease-in" />
                        </motion.button>
                    </div>
                ))}
            </div>
            <button onClick={handleAddOption} className="py-[17.5px] flex items-center gap-3 text-[#0077C2] text-sm font-medium">
                <PlusIcon /> Add Options
            </button>
        </div>
    );
};

const useQuestionForm = (initialData, initialQuestion) => {
    const [question, setQuestion] = useState(initialData.question || initialQuestion);
    const [timeToAnswer, setTimeToAnswer] = useState(initialData.timeToAnswer || 120);
    const [customScore, setCustomScore] = useState(initialData.customScore || 120);
    const [isCompulsory, setIsCompulsory] = useState(initialData.isCompulsory || false);
    const [saveToLibrary, setSaveToLibrary] = useState(initialData.saveToLibrary || false);
    const [selectedAnswer, setSelectedAnswer] = useState(initialData.selectedAnswer || '');
    const [selectedRating, setSelectedRating] = useState(initialData.selectedRating || null);
    const [correctAnswer, setCorrectAnswer] = useState(initialData.correctAnswer || '000.00');
    const [numericCondition, setNumericCondition] = useState("more-than");
    const [post, setPost] = useState(initialData.question || initialQuestion);
    const [rearrangeOptions, setRearrangeOptions] = useState([
        { id: 1, text: '' },
        { id: 2, text: '' },
    ]);

    const [singleSelectAnswers, setSingleSelectAnswers] = useState(
        initialData.answers || DEFAULT_SINGLE_SELECT_ANSWERS
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
    initialData = {}
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const formState = useQuestionForm(initialData, initialQuestion);

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

    const assessmentId = 14;
    const addQuestionMutation = useAddQuestion(assessmentId, () => {
        setIsOpen(false);
    });

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
            choices = formState.multipleSelectAnswers.map(opt => ({
                text: opt.text,
                is_correct: formState.selectedAnswers.includes(opt.id)
            }));
            multiple_true = true;
        } else if (questionType === 'single-select') {
            choices = formState.singleSelectAnswers.map(opt => ({
                text: opt.text,
                is_correct: opt.id === formState.selectedAnswer
            }));
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
            addQuestionMutation.mutate(payload);
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

            addQuestionMutation.mutate(payload);
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
    }, [isValid, formState, questionType, addQuestionMutation, onSave]);

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
            default:
                return <div>Unsupported question type</div>;
        }
    }, [questionType, formState]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

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
                        <button className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
                            📋 Preview
                        </button>
                        <DialogClose className="p-2 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </DialogClose>
                    </div>
                </div>

                {questionType === 'code' ? (
                    <CodingQuestionContent initialData={initialData} initialQuestion={initialQuestion} />
                ) : (
                    <div className="flex gap-6">
                        <div className="flex-1">
                            <div className='bg-purpleQuaternary rounded-2xl px-4 py-3 flex gap-2 mb-4'>
                                <AiIcon className='w-4 h-' />
                                <span className='text-[#7C7C7C] font-normal text-sm block'><span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text text-sm font-semibold'>Pro Tip:&nbsp;</span>Scoutabl's AI suggests tests by matching skills in your job description with related tests.</span>
                            </div>

                            <div className="mb-6">
                                <RichTextEditor content={formState.post} onChange={handleTextEditorChange} wordCountToggle={false} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className='mb-6 p-3 flex flex-col gap-3 rounded-2xl bg-blueSecondary'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <label
                                            htmlFor="timeToAnswer"
                                            className='min-h-10 min-w-[150px] px-3 py-2 text-sm font-semibold text-greyAccent bg-white border-r border-[#E0E0E0] rounded-tl-md rounded-bl-md'
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
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <Input
                                                type="checkbox"
                                                checked={formState.isCompulsory}
                                                onChange={(e) => formState.setIsCompulsory(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors ${formState.isCompulsory ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formState.isCompulsory ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <label
                                            htmlFor="customScore"
                                            className='min-h-10 min-w-[150px] px-3 py-2 text-sm font-semibold text-greyAccent bg-white border-r border-[#E0E0E0] rounded-tl-md rounded-bl-md'
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
                                            <div className={`w-11 h-6 rounded-full transition-colors ${formState.saveToLibrary ? 'bg-blue-600' : 'bg-gray-300'}`}>
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