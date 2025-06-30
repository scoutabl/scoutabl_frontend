// QuestionModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, BookOpen, Shuffle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
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

// Numeric Input Answer Component
const NumericInputAnswers = ({ correctAnswer, onAnswerChange }) => {
    return (
        <div className="space-y-4">
            <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Correct it</span>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Answer is</span>
                <select
                    className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium"
                    value="more-than"
                    onChange={() => { }}
                >
                    <option value="more-than">More than</option>
                    <option value="less-than">Less than</option>
                    <option value="equal-to">Equal to</option>
                    <option value="between">Between</option>
                </select>
                <Input
                    type="number"
                    value={correctAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-24 text-center"
                    placeholder="000.00"
                    step="0.01"
                />
            </div>
        </div>
    );
};


// Rating Scale Answer Component
const RatingScaleAnswers = ({ scale, selectedRating, onRatingChange }) => {
    const scales = {
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

    // const scaleOptions = scales[scale] || scales['star-rating'];
    const [scaleOptions, setScaleOptions] = useState(scales[scale] || scales['star-rating'])

    const [activeTab, setActiveTab] = useState('rating');
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">Select a scale</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setActiveTab('star-rating'), setScaleOptions(scales['star-rating']) }}
                        className={cn("flex items-center px-3 gap-2 py-[6px] text-sm font-medium bg-white hover:bg-purplePrimary text-purplePrimary hover:text-white rounded-full border border-purplePrimary transition-all duration-300 ease-in group hover:cursor-pointer",
                            { 'bg-purplePrimary text-white': activeTab === 'star-rating' }
                        )}
                    >
                        <RatingIcon
                            className={cn("text-purplePrimary w-4 h-4 group-hover:text-white transition-all duration-300 ease-in",
                                { 'text-white': activeTab === 'star-rating' }
                            )} />
                        Star Rating (1-5)
                    </button>
                    <button
                        onClick={() => { setActiveTab('likert'), setScaleOptions(scales['likert']) }}
                        className={cn("flex items-center px-3 gap-2 py-[6px] text-sm font-medium bg-white hover:bg-purplePrimary text-purplePrimary hover:text-white rounded-full border border-purplePrimary transition-all duration-300 ease-in group hover:cursor-pointer",
                            { 'bg-purplePrimary text-white': activeTab === 'likert' }
                        )}
                    >
                        <LikertIcon
                            className={cn("text-purplePrimary w-4 h-4 group-hover:text-white transition-all duration-300 ease-in",
                                { 'text-white': activeTab === 'likert' }
                            )} />
                        Likert Scale
                    </button>
                    <button
                        onClick={() => { setActiveTab('numeric'), setScaleOptions(scales['numeric']) }}
                        className={cn("flex items-center px-3 gap-2 py-[6px] text-sm font-medium bg-white hover:bg-purplePrimary text-purplePrimary hover:text-white rounded-full border border-purplePrimary transition-all duration-300 ease-in group hover:cursor-pointer",
                            { 'bg-purplePrimary text-white': activeTab === 'numeric' }
                        )}
                    >
                        <NumericInputIcon
                            className={cn("text-purplePrimary w-4 h-4 group-hover:text-white transition-all duration-300 ease-in",
                                { 'text-white': activeTab === 'numeric' }
                            )} />
                        Numeric Scale
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {scaleOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedRating === option.value
                            ? 'border-purplePrimary bg-purple-50'
                            : 'border-gray-200 hover:bg-purple-50 hover:border-purplePrimary'
                            }`}
                        onClick={() => onRatingChange(option.value)}
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
                        )
                        }
                        <span className="font-medium text-gray-800">{option.label}</span>
                    </div>
                ))}
            </div>
            {/* <div className="space-y-3">
                {scaleOptions.map((option) => (
                    <div
                        key={option.value}
                        className='flex items-center gap-3'
                        onClick={() => onRatingChange(option.value)}
                    >
                        {option.stars && (
                            <div className="min-h-8 py-[6px] px-3 flex gap-2 border border-purplePrimary rounded-full">
                                {Array.from({ length: option.stars }, (_, i) => (
                                    <PurpleStarIcon key={i} />
                                ))}
                            </div>
                        )}
                        <div className="p-3 w-full rounded-[12px] font-medium text-gray-800 border border-[#E0E0E0]">{option.label}</div>
                    </div>
                ))}
            </div> */}
        </div>
    );
};


// Single Select Answer Component
const SingleSelectAnswers = ({
    answers,
    selectedAnswer,
    onAnswerChange,
    onAnswersChange,
    showShuffleToggle
}) => {
    const [shuffleEnabled, setShuffleEnabled] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        if (shuffleEnabled) {
            // Shuffle only when enabled
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
        // Find the highest existing ID and add 1
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

        // If the removed answer was selected, clear the selection
        if (selectedAnswer === answerId) {
            onAnswerChange('');
        }
    };

    const handleAnswerTextChange = (answerId, newText) => {
        const updatedAnswers = answers.map(answer =>
            answer.id === answerId ? { ...answer, text: newText } : answer
        );
        onAnswersChange(updatedAnswers);
    };

    const optionsToRender = shuffleEnabled ? shuffledOptions : answers;

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
            <div className='flex flex-col gap-4 '>
                {optionsToRender.map((answer, index) => (
                    <div key={answer.id} className="flex items-center gap-2 peer">
                        <Input
                            type="radio"
                            name="answer"
                            value={answer.id}
                            checked={selectedAnswer === answer.id}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            className="w-4 h-4 text-blue-600"
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

// Main Reusable Question Modal Component
const QuestionModal = ({
    trigger,
    questionType,
    initialQuestion = "Have you previously worked in a remote/hybrid environment?",
    onSave,
    initialData = {}
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState(initialData.question || initialQuestion);
    const [timeToAnswer, setTimeToAnswer] = useState(initialData.timeToAnswer || 120);
    const [customScore, setCustomScore] = useState(initialData.customScore || 120);
    const [isCompulsory, setIsCompulsory] = useState(initialData.isCompulsory || false);
    const [saveToLibrary, setSaveToLibrary] = useState(initialData.saveToLibrary || false);
    const [selectedAnswer, setSelectedAnswer] = useState(initialData.selectedAnswer || '');
    const [selectedRating, setSelectedRating] = useState(initialData.selectedRating || null);
    const [correctAnswer, setCorrectAnswer] = useState(initialData.correctAnswer || '000.00');
    const [post, setPost] = useState(initialData.question || initialQuestion);
    // Dynamic answers state - Initialize with default answers or from initialData
    const [singleSelectAnswers, setSingleSelectAnswers] = useState(
        initialData.answers || [
            { id: '1', text: 'Yes' },
            { id: '2', text: 'No' },
        ]
    );

    const handleSave = () => {
        // Validation
        if (!post.trim()) {
            alert('Please enter a question');
            return;
        }

        if (questionType === 'single-select') {
            if (!selectedAnswer) {
                alert('Please select the correct answer');
                return;
            }

            if (singleSelectAnswers.some(answer => !answer.text.trim())) {
                alert('All answer options must have text');
                return;
            }
        }

        const questionData = {
            questionType,
            question: post,
            timeToAnswer,
            customScore,
            isCompulsory,
            saveToLibrary,
            ...(questionType === 'single-select' && {
                selectedAnswer,
                answers: singleSelectAnswers
            }),
            ...(questionType === 'rating' && { selectedRating }),
            ...(questionType === 'numeric-input' && { correctAnswer }),
        };

        console.log('Saving question:', questionData);
        onSave?.(questionData);
        setIsOpen(false);
    };

    const handleTextEditorOnChange = (content) => {
        setPost(content)
    }

    useEffect(() => {
        console.log('Post content:', post);
    }, [post])

    const renderAnswerSection = () => {
        switch (questionType) {
            case 'single-select':
            case 'multi-select':
                return (
                    <SingleSelectAnswers
                        answers={singleSelectAnswers}
                        selectedAnswer={selectedAnswer}
                        onAnswerChange={setSelectedAnswer}
                        onAnswersChange={setSingleSelectAnswers}
                        showShuffleToggle={true}
                    />
                );
            case 'rating':
                return (
                    <RatingScaleAnswers
                        scale="star-rating"
                        selectedRating={selectedRating}
                        onRatingChange={setSelectedRating}
                    />
                );
            case 'numeric-input':
                return (
                    <NumericInputAnswers
                        correctAnswer={correctAnswer}
                        onAnswerChange={setCorrectAnswer}
                    />
                );
            default:
                return <div>Unsupported question type</div>;
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>

            <DialogContent className="p-6 min-w-[1208px] max-h-[720px] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <DialogTitle className="flex items-center gap-2">
                        <span className="text-xl text-greyPrimary">New Question:</span>
                        <Select defaultValue={questionType}>
                            <SelectTrigger className="w-[176px] text-sm bg-blueSecondary text-greyAccent">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single-select">Single Select</SelectItem>
                                <SelectItem value="multiple-select">Multiple Select</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                                <SelectItem value="numeric-input">Numeric Input</SelectItem>
                                <SelectItem value="essay">Essay</SelectItem>
                            </SelectContent>
                        </Select>
                    </DialogTitle>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
                            📋 Preview
                        </button>
                        <DialogClose className="p-2 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </DialogClose>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Left Panel - Question Content */}
                    <div className="flex-1">
                        {/* AI Tip */}
                        {/* <div className="flex items-start gap-3 p-4 mb-6 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-600 text-sm">💡</span>
                            </div>
                            <div className="text-sm text-[#7C7C7C]">
                                <strong className='font-semibold'>Pro Tip:&nbsp;</strong>Scoutabl's AI suggests tests by matching skills in asedfa awd awd. asedfaas edfaased faasedf aasedfa.
                            </div>
                        </div> */}
                        <div className='bg-purpleQuaternary rounded-2xl px-4 py-3 flex gap-2 mb-4'>
                            <AiIcon className='w-4 h-' />
                            <span className='text-[#7C7C7C] font-normal text-sm block'><span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text text-sm font-semibold'>Pro Tip:&nbsp;</span>Scoutabl's AI suggests tests by matching skills in your job description with related tests.</span>
                        </div>

                        {/* Question Input */}
                        <div className="mb-6">
                            {/* Rich Text Editor Toolbar */}
                            {/* <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
                                <span className="text-sm text-gray-600">16</span>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">B</button>
                                    <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">I</button>
                                    <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">U</button>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">⋮</button>
                                    <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded">≡</button>
                                </div>
                            </div>

                            <textarea
                                className="w-full p-4 border border-gray-300 border-t-0 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter your question here..."
                            /> */}
                            <RichTextEditor content={post} onChange={handleTextEditorOnChange} wordCountToggle={false} />
                        </div>
                    </div>
                    {/* Right Panel - Settings */}
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
                                        className='px-3 py-2 max-h-10 max-w-[114px] text-base font-medium text-greyAccent bg-white rounded-tr-md rounded-br-md'
                                        onChange={(e) => setTimeToAnswer(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-8">
                                    <span className="text-base font-medium text-greyPrimary">Compulsory Question</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <Input
                                            type="checkbox"
                                            checked={isCompulsory}
                                            onChange={(e) => setIsCompulsory(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-11 h-6 rounded-full transition-colors ${isCompulsory ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isCompulsory ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
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
                                        className='px-3 py-2 max-h-10 max-w-[114px] text-base font-medium text-greyAccent bg-white rounded-tr-md rounded-br-md'
                                        onChange={(e) => setCustomScore(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-base font-medium text-greyPrimary">Save question to library</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <Input
                                            type="checkbox"
                                            checked={saveToLibrary}
                                            onChange={(e) => setSaveToLibrary(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-11 h-6 rounded-full transition-colors ${saveToLibrary ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${saveToLibrary ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Answer Section */}
                        <div className='p-4 bg-white rounded-2xl border border-[#E0E0E0]'>
                            {renderAnswerSection()}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            className="mt-4 ml-auto w-[124px] h-[37px] grid place-content-center bg-[#1EA378] text-white rounded-full text-sm font-medium"
                        >
                            Add Question
                        </motion.button>

                        {/* Action Buttons */}
                        {/* <div className="space-y-3">
                            <button
                                onClick={handleSave}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                Add Question
                            </button>

                            <div className="flex gap-2">
                                <button className="flex-1 px-3 py-2 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50">
                                    🔄 Rephrase with AI
                                </button>
                                <button className="flex-1 px-3 py-2 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50">
                                    ✍️ Write with AI
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuestionModal;