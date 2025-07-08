import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import PurpleStarIcon from '@/assets/purpleStar.svg?react'
import NumericInputIcon from '@/assets/numericInputIcon.svg?react'
import RatingIcon from '@/assets/ratingIcon.svg?react'
import LikertIcon from '@/assets/smileyIcon.svg?react'
import Emoji1 from '@/assets/emoji1.svg?react'
import Emoji2 from '@/assets/emoji2.svg?react'
import Emoji3 from '@/assets/emoji3.svg?react'
import Emoji4 from '@/assets/emoji4.svg?react'
import Emoji5 from '@/assets/emoji5.svg?react'
import { cn } from '@/lib/utils';

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

export default RatingScaleAnswers;