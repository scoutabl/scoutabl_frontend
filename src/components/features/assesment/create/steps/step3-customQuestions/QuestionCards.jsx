// QuestionCards.jsx - Usage Example
import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import QuestionModal from './QuestionModal';
import PlusIcon from '@/assets/plusIcon.svg?react'
import TickIcon from '@/assets/tick.svg?react'
import MultiSelect from '@/assets/multiSelect.svg?react'
import RatingIcon from '@/assets/ratingIcon.svg?react'
import RearrangeIcon from '@/assets/rearrangeIcon.svg?react'
import NumericInputIcon from '@/assets/numericInputIcon.svg?react'
import EssayIcon from '@/assets/essayIcon.svg?react'
import CodeIcon from '@/assets/codeIcon.svg?react'
import MsExcelIcon from '@/assets/msExcelIcon.svg?react'
import GoogleSheetsIcon from '@/assets/googleSheetsIcon.svg?react'
import VideoIcon from '@/assets/videoIcon.svg?react'
import AudioIcon from '@/assets/audioIcon.svg?react'

export const questionTypes = [
    {
        category: 'Choice Based',
        questions: [
            {
                id: 'single-select',
                name: 'Single Select',
                type: 'single-select',
                question: 'Have you previously worked in a remote/hybrid environment?',
                icon: <TickIcon />,
                bg: '#D8FEE3',
                text: '#13482A'
            },
            {
                id: 'multiple-select',
                name: 'Multiple Select',
                type: 'multiple-select',
                question: 'Which programming languages are you proficient in?',
                icon: <MultiSelect />,
                bg: '#FEEDD9',
                text: '#BD7500'
            },
            {
                id: 'rating',
                name: 'Rating',
                type: 'rating',
                question: 'How would you rate your experience with our service?',
                icon: <RatingIcon />,
                bg: '#E8E5FF',
                text: '#3B2A91'
            },
            {
                id: 'rearrange',
                name: 'Rearrange',
                type: 'rearrange',
                question: 'Rearrange the steps in the correct order to effectively set up for a remote/hybrid work environment',
                icon: <RearrangeIcon />,
                bg: '#95D1D2',
                text: '#2F5D5E'
            }
        ]
    },
    {
        category: 'Text Based',
        questions: [
            {
                id: 'numeric-input',
                name: 'Numeric Input',
                type: 'numeric-input',
                question: 'How many years of experience do you have?',
                icon: <NumericInputIcon />,
                bg: '#C18DAC',
                text: '#643B53'
            },
            {
                id: 'essay',
                name: 'Essay',
                type: 'essay',
                question: 'Describe your ideal work environment.',
                icon: <EssayIcon />,
                bg: '#A98878',
                text: '#64483B'
            }
        ]
    },
    {
        category: 'Hands-on',
        questions: [
            {
                id: 'code',
                name: 'Code',
                type: 'code',
                question: 'Write a function to reverse a string.',
                icon: <CodeIcon />,
                bg: '#8893D1',
                text: '#192569'
            },
            {
                id: 'ms-excel',
                name: 'MS Excel',
                type: 'excel',
                question: 'Create a pivot table from the given data.',
                icon: <MsExcelIcon />,
                bg: '#E9755B',
                text: '#692819'
            },
            {
                id: 'google-sheets',
                name: 'Google Sheets',
                type: 'sheets',
                question: 'Use VLOOKUP to find matching records.',
                icon: <GoogleSheetsIcon />,
                bg: '#5DDD87',
                text: '#1C4B2B'
            }
        ]
    },
    {
        category: 'Media',
        questions: [
            {
                id: 'video',
                name: 'Video',
                type: 'video',
                question: 'Record a 2-minute introduction about yourself.',
                icon: <VideoIcon />,
                bg: '#D8FFFE',
                text: '#0A615F'
            },
            {
                id: 'audio',
                name: 'Audio',
                type: 'audio',
                question: 'Record your answer to this question.',
                icon: <AudioIcon />,
                bg: '#FFFFDE',
                text: '#5C7D0E'
            }
        ]
    }
];

const QuestionCards = () => {
    const handleQuestionSave = (questionData) => {
        console.log('Question saved:', questionData);
        // Handle saving the question data to your state/backend
        // questionData will contain:
        // {
        //   questionType: 'single-select' | 'rating' | 'numeric-input',
        //   question: 'The actual question text from textarea',
        //   timeToAnswer: 120,
        //   customScore: 120,
        //   isCompulsory: true/false,
        //   saveToLibrary: true/false,
        //   selectedAnswer: 'answer-id' (for single-select),
        //   selectedRating: 3 (for rating),
        //   correctAnswer: '5.00' (for numeric-input)
        // }
    };


    const QuestionCard = ({ question, category }) => {
        const PlusButton = (
            <motion.button
                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto group'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }
                }>
                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
            </motion.button>
        );

        return (
            <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                    {question.icon}
                </div>
                <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>{question.name}</span>

                {/* Only show modal for supported question types */}
                {['single-select', 'rating', 'numeric-input', 'multiple-select', 'code', 'rearrange', 'essay', 'video', 'audio'].includes(question.type) ? (
                    <QuestionModal
                        trigger={PlusButton}
                        questionType={question.type}
                        initialQuestion={question.question}
                        onSave={handleQuestionSave}
                    />
                ) : (
                    PlusButton
                )}
            </div>
        );
    };

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="grid grid-cols-4 gap-6">
                {questionTypes.map((category) => (
                    <div key={category.category}>
                        <h3 className='pb-3 text-sm text-greyPrimary font-semibold'>
                            {category.category}
                        </h3>
                        <div className="space-y-3">
                            {category.questions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    category={category.category}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionCards;