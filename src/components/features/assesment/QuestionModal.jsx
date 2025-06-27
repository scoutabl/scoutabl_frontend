// QuestionModal.jsx
import React, { useState } from 'react';
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
                <input
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

// Single Select Answer Component
const SingleSelectAnswers = ({ answers, selectedAnswer, onAnswerChange, shuffleOptions }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Select right answer</span>
                {shuffleOptions && (
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" className="rounded" />
                        Shuffle options
                    </label>
                )}
            </div>

            {answers.map((answer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="answer"
                            value={answer.id}
                            checked={selectedAnswer === answer.id}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-800">{answer.text}</span>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}

            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                + Add Options
            </button>
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
            { value: 1, label: 'Strongly Disagree' },
            { value: 2, label: 'Disagree' },
            { value: 3, label: 'Neutral' },
            { value: 4, label: 'Agree' },
            { value: 5, label: 'Strongly Agree' },
        ],
        'numeric': Array.from({ length: 10 }, (_, i) => ({
            value: i + 1,
            label: `${i + 1}`,
        })),
    };

    const scaleOptions = scales[scale] || scales['star-rating'];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">Select a scale</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                        ⭐ Star Rating (1-5)
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        📊 Likert Scale
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        🔢 Numeric Scale
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {scaleOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedRating === option.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        onClick={() => onRatingChange(option.value)}
                    >
                        {option.stars && (
                            <div className="flex gap-1">
                                {Array.from({ length: option.stars }, (_, i) => (
                                    <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                            </div>
                        )}
                        <span className="font-medium text-gray-800">{option.label}</span>
                    </div>
                ))}
            </div>
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

    // Sample answers for single select (would come from props in real implementation)
    const singleSelectAnswers = [
        { id: 'yes', text: 'Yes' },
        { id: 'no1', text: 'No' },
        { id: 'no2', text: 'No' },
        { id: 'no3', text: 'No' },
    ];

    const handleSave = () => {
        const questionData = {
            questionType,
            question,
            timeToAnswer,
            customScore,
            isCompulsory,
            saveToLibrary,
            ...(questionType === 'single-select' && { selectedAnswer }),
            ...(questionType === 'rating' && { selectedRating }),
            ...(questionType === 'numeric-input' && { correctAnswer }),
        };

        onSave?.(questionData);
        setIsOpen(false);
    };

    const renderAnswerSection = () => {
        switch (questionType) {
            case 'single-select':
                return (
                    <SingleSelectAnswers
                        answers={singleSelectAnswers}
                        selectedAnswer={selectedAnswer}
                        onAnswerChange={setSelectedAnswer}
                        shuffleOptions={true}
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

            <DialogContent className="p-6 min-w-[80vw] max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <DialogTitle className="flex items-center gap-2 mb-4">
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
                        <div className="flex items-start gap-3 p-4 mb-6 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-600 text-sm">💡</span>
                            </div>
                            <div className="text-sm text-purple-700">
                                <strong>Pro Tip:</strong> ScoutAbility AI suggests tests by matching skills in educator's own word, prioritizes correlated/validated assessments.
                            </div>
                        </div>

                        {/* Question Input */}
                        <div className="mb-6">
                            {/* Rich Text Editor Toolbar */}
                            <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
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
                            />
                        </div>

                        {/* Answer Section */}
                        {renderAnswerSection()}
                    </div>

                    {/* Right Panel - Settings */}
                    <div className="flex-1">
                        {/* Time to Answer */}
                        <div className="mb-6">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4" />
                                Time to Answer*
                            </label>
                            <Select value={timeToAnswer.toString()} onValueChange={(value) => setTimeToAnswer(Number(value))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="60">60 MIN</SelectItem>
                                    <SelectItem value="120">120 MIN</SelectItem>
                                    <SelectItem value="180">180 MIN</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Compulsory Question Toggle */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Compulsory Question</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
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

                        {/* Custom Score */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Set Custom Score*
                            </label>
                            <Select value={customScore.toString()} onValueChange={(value) => setCustomScore(Number(value))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="120">120</SelectItem>
                                    <SelectItem value="150">150</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Save to Library Toggle */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Save question to library</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
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

                        {/* Action Buttons */}
                        <div className="space-y-3">
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
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuestionModal;