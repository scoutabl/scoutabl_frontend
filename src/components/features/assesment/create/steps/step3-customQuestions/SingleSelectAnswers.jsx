// import { useFieldArray, useFormContext } from "react-hook-form";
// import AddOptionButton from "@/components/features/assesment/create/shared/AddOptionButton";
// import RemoveOptionButton from "@/components/features/assesment/create/shared/RemoveOptionButton";
// import { Input } from '@/components/ui/input';
// import MarkIcon from '@/assets/mark.svg?react';
// import { cn } from "@/lib/utils";
// import { Checkbox } from "@/components/ui/checkbox";
// const SingleSelectAnswers = ({
//     name = "singleSelectAnswers",
//     selectedName = "selectedAnswer",
//     mode
// }) => {
//     const { control, register, setValue, watch, formState: { errors }, trigger } = useFormContext();
//     const { fields, append, remove } = useFieldArray({ control, name });
//     const selectedAnswer = watch(selectedName);
//     const shuffleEnabled = watch("shuffleEnabled");

//     const handleAnswerChange = (id) => {
//         setValue(selectedName, id, { shouldValidate: true });
//         trigger(selectedName); // This will clear the error if valid
//     };

//     const handleTextChange = (val, index) => {
//         setValue(`${name}.${index}.text`, val, { shouldValidate: true })
//     }

//     const handleRemoveOption = (index) => {
//         const removedAnswerId = fields[index].answerId;
//         remove(index);
//         // If the removed option was selected, clear the selectedAnswer
//         if (selectedAnswer === removedAnswerId) {
//             setValue(selectedName, null, { shouldValidate: true });
//         }
//     };

//     return (
//         <div className="flex flex-col gap-4">
//             <div className="flex items-center justify-between">
//                 <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
//                 <div className="flex items-center gap-1">
//                     <Checkbox
//                         {...register("shuffleEnabled")}
//                         checked={!!shuffleEnabled}
//                         onCheckedChange={val => {
//                             console.log("Shuffle checkbox toggled. New value:", !!val);
//                             setValue("shuffleEnabled", !!val);
//                         }}
//                     />
//                     <span className="text-sm text-greyAccent font-semibold ml-2"> Shuffle Options</span>
//                 </div>
//             </div>
//             <div className="flex flex-col gap-4">
//                 {fields.map((field, index) => (
//                     <div key={field.id} className="flex flex-col">
//                         <div className="flex items-center gap-2 peer">
//                             <input
//                                 type="radio"
//                                 name="selectedAnswer"
//                                 value={field.answerId}
//                                 checked={String(selectedAnswer) === String(field.answerId)}
//                                 onChange={() => handleAnswerChange(field.answerId)}
//                                 className="w-4 h-4 accent-purplePrimary"
//                             />
//                             <Input
//                                 type="text"
//                                 {...register(`${name}.${index}.text`)}
//                                 defaultValue={field.text}
//                                 className={cn('p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary ', {
//                                     'border-dangerPrimary': errors[name]?.[index]?.text
//                                 }
//                                 )}
//                                 placeholder={`Option ${index + 1}`}
//                                 onChange={e => handleTextChange(e.target.value, index)}
//                             />
//                             <RemoveOptionButton
//                                 handleRemove={() => handleRemoveOption(index)}
//                                 canRemove={fields.length > 2}
//                             />
//                         </div>
//                         {errors[name]?.[index]?.text && (
//                             <div className="w-full bg-red-950 p-2 rounded-lg mt-4">
//                                 <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
//                                 <span className="text-white text-xs font-medium">
//                                     {errors[name][index].text.message}
//                                 </span>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//                 {errors.selectedAnswer && (
//                     <div className="w-full bg-red-950 p-2 rounded-lg mt-4">
//                         <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
//                         <span className="text-white text-xs font-medium">
//                             {errors.selectedAnswer.message}
//                         </span>
//                     </div>
//                 )}
//             </div>
//             <AddOptionButton handleAddOption={() => {
//                 append({
//                     answerId: Date.now(),
//                     text: "",
//                 });
//             }} />
//         </div>
//     );
// };
// export default SingleSelectAnswers;

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import AddOptionButton from "@/components/features/assesment/create/shared/AddOptionButton";
import RemoveOptionButton from "@/components/features/assesment/create/shared/RemoveOptionButton";
import { Input } from '@/components/ui/input';
import MarkIcon from '@/assets/mark.svg?react';
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import FormMessage from "../../shared/FormMessage";
const SingleSelectAnswers = ({
    name = "singleSelectAnswers",
    selectedName = "selectedAnswer",
    mode
}) => {
    const { control, register, setValue, watch, formState: { errors }, trigger } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });
    const selectedAnswer = watch(selectedName);
    const shuffleEnabled = watch("shuffleEnabled");

    const handleAnswerChange = (id) => {
        setValue(selectedName, id, { shouldValidate: true });
        trigger(selectedName);
    };

    const handleTextChange = (val, index) => {
        setValue(`${name}.${index}.text`, val, { shouldValidate: true })
    }

    const handleRemoveOption = (index) => {
        const removedAnswerId = fields[index].answerId;
        remove(index);
        if (selectedAnswer === removedAnswerId) {
            setValue(selectedName, null, { shouldValidate: true });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
                <div className="flex items-center gap-1">
                    <Controller
                        name="shuffleEnabled"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={(val) => {
                                    console.log("Shuffle checkbox toggled. New value:", !!val);
                                    field.onChange(!!val);
                                }}
                            />
                        )}
                    />
                    <span className="text-sm text-greyAccent font-semibold ml-2"> Shuffle Options</span>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col">
                        <div className="flex items-center gap-2 peer">
                            <input
                                type="radio"
                                name="selectedAnswer"
                                value={field.answerId}
                                checked={String(selectedAnswer) === String(field.answerId)}
                                onChange={() => handleAnswerChange(field.answerId)}
                                className="w-4 h-4 accent-purplePrimary"
                            />
                            <Input
                                type="text"
                                {...register(`${name}.${index}.text`)}
                                defaultValue={field.text}
                                className={cn('p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary ', {
                                    'border-dangerPrimary': errors[name]?.[index]?.text
                                }
                                )}
                                placeholder={`Option ${index + 1}`}
                                onChange={e => handleTextChange(e.target.value, index)}
                            />
                            <RemoveOptionButton
                                handleRemove={() => handleRemoveOption(index)}
                                canRemove={fields.length > 2}
                            />
                        </div>
                        {errors[name]?.[index]?.text && (
                            // <div className="w-full bg-red-950 p-2 rounded-lg mt-4">
                            //     <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
                            //     <span className="text-white text-xs font-medium">
                            //         {errors[name][index].text.message}
                            //     </span>
                            // </div>
                            <FormMessage className={"mt-2"} message={errors[name][index].text.message} />
                        )}
                    </div>
                ))}
                {errors.selectedAnswer && (
                    // <div className="w-full bg-red-950 p-2 rounded-lg mt-4">
                    //     <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
                    //     <span className="text-white text-xs font-medium">
                    //         {errors.selectedAnswer.message}
                    //     </span>
                    // </div>
                    <FormMessage message={errors?.selectedAnswer?.message} />
                )}
            </div>
            <AddOptionButton handleAddOption={() => {
                append({
                    answerId: Date.now(),
                    text: "",
                });
            }} />
        </div>
    );
};

export default SingleSelectAnswers;