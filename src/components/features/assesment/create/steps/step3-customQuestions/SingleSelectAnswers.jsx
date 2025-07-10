import { useFieldArray, useFormContext } from "react-hook-form";
import AddOptionButton from "@/components/features/assesment/create/shared/AddOptionButton";
import RemoveOptionButton from "@/components/features/assesment/create/shared/RemoveOptionButton";
import { Input } from '@/components/ui/input';
import MarkIcon from '@/assets/mark.svg?react';

const SingleSelectAnswers = ({
    name = "singleSelectAnswers",
    selectedName = "selectedAnswer",
    mode
}) => {
    const { control, register, setValue, watch, formState: { errors }, trigger } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });
    const selectedAnswer = watch(selectedName);

    const handleAnswerChange = (id) => {
        setValue(selectedName, id, { shouldValidate: true });
        trigger(selectedName); // This will clear the error if valid
    };

    const handleTextChange = (val, index) => {
        setValue(`${name}.${index}.text`, val, { shouldValidate: true })
    }

    const handleRemoveOption = (index) => {
        const removedAnswerId = fields[index].answerId;
        remove(index);
        // If the removed option was selected, clear the selectedAnswer
        if (selectedAnswer === removedAnswerId) {
            setValue(selectedName, null, { shouldValidate: true });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
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
                                className={`p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border ${errors[name]?.[index]?.text ? 'border-dangerPrimary' : 'border-seperatorPrimary'}`}
                                placeholder={`Option ${index + 1}`}
                                onChange={e => handleTextChange(e.target.value, index)}
                            />
                            <RemoveOptionButton
                                handleRemove={() => handleRemoveOption(index)}
                                canRemove={fields.length > 2}
                            />
                        </div>
                        {errors[name]?.[index]?.text && (
                            <div className="w-full bg-red-950 p-2 rounded-lg mt-4">
                                <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
                                <span className="text-white text-xs font-medium">
                                    {errors[name][index].text.message}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
                {errors.selectedAnswer && (
                    <div className="w-full bg-red-950 p-2 rounded-lg mt-4">
                        <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
                        <span className="text-white text-xs font-medium">
                            {errors.selectedAnswer.message}
                        </span>
                    </div>
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