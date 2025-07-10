// import React, { useCallback, memo } from 'react';
// import RemoveOptionButton from './RemoveOptionButton';
// import { Input } from '@/components/ui/input';
// import { cn } from '@/lib/utils';
// const AnswerOption = memo(({
//     answer,
//     index,
//     isSelected,
//     onAnswerChange,
//     onTextChange,
//     onRemove,
//     canRemove,
//     type = "radio"
// }) => {
//     const handleSelectionChange = useCallback((e) => {
//         if (type === "radio") {
//             onAnswerChange(Number(e.target.value)); // ensure number
//         } else {
//             onAnswerChange(answer.id, e.target.checked);
//         }
//     }, [answer.id, onAnswerChange, type]);

//     const handleTextChange = useCallback((e) => {
//         onTextChange(answer.id, e.target.value);
//     }, [answer.id, onTextChange]);

//     const handleRemove = useCallback(() => {
//         onRemove(answer.id);
//     }, [answer.id, onRemove]);

//     return (
//         <div className="flex items-center gap-2 peer">
//             <Input
//                 type={type}
//                 name={type === "radio" ? "answer" : undefined}
//                 value={answer.id}
//                 checked={isSelected}
//                 onChange={handleSelectionChange}
//                 className="w-4 h-4 accent-purplePrimary"
//             />
//             <Input
//                 type="text"
//                 value={answer.text}
//                 onChange={handleTextChange}
//                 // className={cn("p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary", {
//                 //     "border-dangerPrimary": !answer.text.trim().length
//                 // })}
//                 className="p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary"
//                 placeholder={`Option ${index + 1}`}
//             />
//             {/* <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleRemove}
//                 className="text-greyPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                 disabled={!canRemove}
//             >
//                 <DeleteIcon className="w-4 h-4 text-greyPrimary group-hover:text-dangerPrimary transition-colors duration-300 ease-in" />
//             </motion.button> */}
//             <RemoveOptionButton handleRemove={handleRemove} canRemove={canRemove} />
//         </div>
//     );
// });

// export default 

import React, { memo } from 'react';
import RemoveOptionButton from './RemoveOptionButton';
import { Input } from '@/components/ui/input';

const AnswerOption = memo(({
    answer,
    index,
    selectedValue,
    onAnswerChange,
    onTextChange,
    onRemove,
    canRemove,
    type = "radio",
    register,
    fieldName,
    textError
}) => (
    <div className="flex items-center gap-2 peer">
        {/* <input
            type={type}
            name="selectedAnswer"
            value={answer.answerId}
            checked={String(isSelected) === String(answer.answerId)}
            onChange={() => onAnswerChange(answer.answerId)}
            className="w-4 h-4 accent-purplePrimary"
        /> */}
        {/* <input
            type={type}
            name="selectedAnswer"
            value={answer.answerId} // Make sure this matches
            checked={String(isSelected) === String(answer.answerId)}
            onChange={() => onAnswerChange(answer.answerId)}
            className="w-4 h-4 accent-purplePrimary"
        /> */}
        {/* <input
            type={type}
            name="selectedAnswer"
            value={answer.answerId}
            checked={String(selectedValue) === String(answer.answerId)}
            onChange={() => onAnswerChange(answer.answerId)}
            className="w-4 h-4 accent-purplePrimary"
        />
        <Input
            type="text"
            {...register(fieldName)}
            defaultValue={answer.text}
            className="p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary"
            placeholder={`Option ${index + 1}`}
            onChange={e => onTextChange(e.target.value)}
        />
        <RemoveOptionButton handleRemove={onRemove} canRemove={canRemove} />
    </div> */}
        <input
            type={type}
            name="selectedAnswer"
            value={answer.answerId}
            checked={String(selectedValue) === String(answer.answerId)}
            onChange={() => onAnswerChange(answer.answerId)}
            className="w-4 h-4 accent-purplePrimary"
        />
        <Input
            type="text"
            {...register(fieldName)}
            defaultValue={answer.text}
            // className="p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary"
            className={`p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border ${textError ? 'border-dangerPrimary' : 'border-seperatorPrimary'
                }`}
            placeholder={`Option ${index + 1}`}
            onChange={e => onTextChange(e.target.value)}
        />
        <RemoveOptionButton handleRemove={onRemove} canRemove={canRemove} />
    </div>
));

{/* <input
            type={type}
            name="selectedAnswer"
            value={answer.answerId}
            checked={String(isSelected) === String(answer.answerId)}
            onChange={() => onAnswerChange(answer.answerId)}
            className="w-4 h-4 accent-purplePrimary"
        /> */}

export default AnswerOption;

// const AnswerOption = memo(({
//     answer,
//     index,
//     isSelected,
//     onAnswerChange,
//     onTextChange,
//     onRemove,
//     canRemove,
//     type = "radio",
//     register,
//     fieldName
// }) => (
//     <div className="flex items-center gap-2 peer">
//         <input // Use regular input instead of Input component
//             type={type}
//             name="answer"
//             value={answer.id}
//             checked={isSelected}
//             onChange={onAnswerChange} // This should work now
//             className="w-4 h-4 accent-purplePrimary"
//         />
//         <Input
//             type="text"
//             {...register(fieldName)}
//             defaultValue={answer.text}
//             className="p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary"
//             placeholder={`Option ${index + 1}`}
//             onChange={e => onTextChange(e.target.value)}
//         />
//         <RemoveOptionButton handleRemove={onRemove} canRemove={canRemove} />
//     </div>
// ));

// export default AnswerOption;