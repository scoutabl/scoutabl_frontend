import React, { useCallback, memo } from 'react';
import RemoveOptionButton from './RemoveOptionButton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
                className="w-4 h-4 accent-purplePrimary"
            />
            <Input
                type="text"
                value={answer.text}
                onChange={handleTextChange}
                className={cn("p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary", {
                    "border-dangerPrimary": !answer.text.trim().length
                })}
                placeholder={`Option ${index + 1}`}
            />
            {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRemove}
                className="text-greyPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={!canRemove}
            >
                <DeleteIcon className="w-4 h-4 text-greyPrimary group-hover:text-dangerPrimary transition-colors duration-300 ease-in" />
            </motion.button> */}
            <RemoveOptionButton handleRemove={handleRemove} canRemove={canRemove} />
        </div>
    );
});

export default AnswerOption