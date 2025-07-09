// import { useState, useMemo, memo, useCallback } from "react";
// import { Checkbox } from '@/components/ui/checkbox';
// import AnswerOption from "@/components/features/assesment/create/shared/AnswerOption";
// import AddOptionButton from "@/components/features/assesment/create/shared/AddOptionButton";


// const SingleSelectAnswers = memo(({
//     answers,
//     selectedAnswer,
//     onAnswerChange,
//     onAnswersChange,
//     showShuffleToggle,
//     shuffleEnabled,
//     setShuffleEnabled
// }) => {
//     // const [shuffleEnabled, setShuffleEnabled] = useState(false);

//     const shuffledOptions = useMemo(() => {
//         if (!shuffleEnabled) return answers;

//         return [...answers]
//             .map(value => ({ value, sort: Math.random() }))
//             .sort((a, b) => a.sort - b.sort)
//             .map(({ value }) => value);
//     }, [shuffleEnabled, answers]);

//     const handleShuffleToggle = useCallback((checked) => {
//         setShuffleEnabled(checked);
//     }, []);

//     const handleAddOption = useCallback(() => {
//         // Find the minimum id (for negative id generation)
//         const minId = Math.min(0, ...answers.map(answer => Number(answer.id) || 0));
//         const newAnswer = {
//             id: minId - 1, // e.g., -1, -2, -3, etc.
//             text: ''
//         };
//         onAnswersChange([...answers, newAnswer]);
//     }, [answers, onAnswersChange]);

//     const handleRemoveOption = useCallback((answerId) => {
//         if (answers.length <= 2) {
//             alert('You must have at least 2 options');
//             return;
//         }

//         const updatedAnswers = answers.filter(answer => answer.id !== answerId);
//         onAnswersChange(updatedAnswers);

//         if (selectedAnswer === answerId) {
//             onAnswerChange('');
//         }
//     }, [answers, selectedAnswer, onAnswersChange, onAnswerChange]);

//     const handleAnswerTextChange = useCallback((answerId, newText) => {
//         const updatedAnswers = answers.map(answer =>
//             answer.id === answerId ? { ...answer, text: newText } : answer
//         );
//         onAnswersChange(updatedAnswers);
//     }, [answers, onAnswersChange]);

//     return (
//         <div className="flex flex-col gap-4">
//             <div className="flex items-center justify-between">
//                 <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
//                 {showShuffleToggle && (
//                     <div className='flex items-center gap-1 group'>
//                         <Checkbox
//                             name="shuffleSingleSelectOptions"
//                             id="shuffleSingleSelectOptions"
//                             checked={shuffleEnabled}
//                             onCheckedChange={handleShuffleToggle}
//                         />
//                         <label htmlFor='shuffleSingleSelectOptions' className="text-greyAccent font-medium text-sm group-hover:text-purplePrimary duration-300 transition-colors ease-in cursor-pointer">
//                             Shuffle options
//                         </label>
//                     </div>
//                 )}
//             </div>
//             <div className='flex flex-col gap-4'>
//                 {shuffledOptions.map((answer, index) => (
//                     <AnswerOption
//                         key={answer.id}
//                         answer={answer}
//                         index={index}
//                         isSelected={selectedAnswer === answer.id}
//                         onAnswerChange={onAnswerChange}
//                         onTextChange={handleAnswerTextChange}
//                         onRemove={handleRemoveOption}
//                         canRemove={answers.length > 2}
//                         type="radio"
//                     />
//                 ))}
//             </div>
//             <AddOptionButton handleAddOption={handleAddOption} />
//         </div>
//     );
// });

// export default SingleSelectAnswers;

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import AnswerOption from "@/components/features/assesment/create/shared/AnswerOption";
import AddOptionButton from "@/components/features/assesment/create/shared/AddOptionButton";

// const SingleSelectAnswers = ({ name = "singleSelectAnswers", selectedName = "selectedAnswer" }) => {
//     const { control, register, setValue, watch } = useFormContext();
//     const { fields, append, remove } = useFieldArray({ control, name });
//     const selectedAnswer = watch(selectedName);

//     console.log('SingleSelectAnswers Debug:', {
//         fields,
//         selectedAnswer,
//         name,
//         selectedName
//     });

//     return (
//         <div className="flex flex-col gap-4">
//             <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
//             <div className="flex flex-col gap-4">
//                 {fields.map((field, index) => (
//                     <Controller
//                         key={field.id}
//                         name={selectedName}
//                         control={control}
//                         render={({ field: radioField }) => (
//                             <AnswerOption
//                                 answer={field}
//                                 index={index}
//                                 isSelected={radioField.value === field.id}
//                                 onAnswerChange={() => setValue(selectedName, field.id)}
//                                 onTextChange={val => setValue(`${name}.${index}.text`, val)}
//                                 onRemove={() => remove(index)}
//                                 canRemove={fields.length > 2}
//                                 type="radio"
//                                 register={register}
//                                 fieldName={`${name}.${index}.text`}
//                             />
//                         )}
//                     />
//                 ))}
//             </div>
//             <AddOptionButton handleAddOption={() => append({ id: Date.now(), text: "" })} />
//         </div>
//     );
// };

// const SingleSelectAnswers = ({ name = "singleSelectAnswers", selectedName = "selectedAnswer" }) => {
//     const { control, register, setValue, watch } = useFormContext();
//     const { fields, append, remove } = useFieldArray({ control, name });
//     const selectedAnswer = watch(selectedName);

//     return (
//         <div className="flex flex-col gap-4">
//             <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
//             <div className="flex flex-col gap-4">
//                 {fields.map((field, index) => (
//                     <Controller
//                         key={field.id}
//                         name={selectedName}
//                         control={control}
//                         render={({ field: radioField }) => (
//                             <AnswerOption
//                                 answer={field}
//                                 index={index}
//                                 isSelected={Number(radioField.value) === Number(field.id)} // Compare the actual answer IDs
//                                 onAnswerChange={() => {
//                                     console.log('Setting selectedAnswer to:', field.id); // field.id is the actual answer ID
//                                     radioField.onChange(field.id); // Set to the actual answer ID
//                                 }}
//                                 onTextChange={val => setValue(`${name}.${index}.text`, val)}
//                                 onRemove={() => remove(index)}
//                                 canRemove={fields.length > 2}
//                                 type="radio"
//                                 register={register}
//                                 fieldName={`${name}.${index}.text`}
//                             />
//                         )}
//                     />
//                 ))}
//             </div>
//             <AddOptionButton handleAddOption={() => append({ id: Date.now(), text: "" })} />
//         </div>
//     );
// };

const SingleSelectAnswers = ({ name = "singleSelectAnswers", selectedName = "selectedAnswer" }) => {
    const { control, register, setValue, watch } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });
    const selectedAnswer = watch(selectedName);
    fields.forEach((field, idx) => {
        console.log(`Field ${idx}:`, field);
    });
    return (
        <div className="flex flex-col gap-4">
            <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
            <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                    <AnswerOption
                        key={field.id}
                        answer={field}
                        index={index}
                        // isSelected={String(selectedAnswer) === String(field.id)}
                        // onAnswerChange={() => setValue(selectedName, field.id)}
                        isSelected={selectedAnswer}
                        onAnswerChange={id => setValue(selectedName, id)}
                        onTextChange={val => setValue(`${name}.${index}.text`, val)}
                        onRemove={() => remove(index)}
                        canRemove={fields.length > 2}
                        type="radio"
                        register={register}
                        fieldName={`${name}.${index}.text`}
                    />
                ))}
            </div>
            <AddOptionButton handleAddOption={() => append({ answerId: Date.now(), text: "" })} />
        </div>
    );
};

export default SingleSelectAnswers;