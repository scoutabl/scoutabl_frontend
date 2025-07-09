import { useState, useMemo, memo, useCallback } from "react";
import { Checkbox } from '@/components/ui/checkbox';
import AnswerOption from "@/components/features/assesment/create/shared/AnswerOption";
import AddOptionButton from "@/components/features/assesment/create/shared/AddOptionButton";


const SingleSelectAnswers = memo(({
    answers,
    selectedAnswer,
    onAnswerChange,
    onAnswersChange,
    showShuffleToggle,
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
            {/* {errors && errors.length > 0 && (
                <div className="text-red-500 text-sm">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )} */}
            <AddOptionButton handleAddOption={handleAddOption} />
        </div>
    );
});

export default SingleSelectAnswers;