import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import AnswerOption from "@/components/features/assesment/create/shared/AnswerOption";
import AddOptionButton from "@/components/features/assesment/create/shared/AddOptionButton";
import MarkIcon from '@/assets/mark.svg?react'

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
                    <div key={field.id}>
                        <AnswerOption
                            answer={field}
                            index={index}
                            selectedValue={selectedAnswer}
                            onAnswerChange={handleAnswerChange}
                            onTextChange={(val) => handleTextChange(val, index)}
                            onRemove={() => handleRemoveOption(index)}
                            canRemove={fields.length > 2}
                            type="radio"
                            register={register}
                            fieldName={`${name}.${index}.text`}
                            textError={errors.singleSelectAnswers?.[index]?.text}
                        />
                        {errors.singleSelectAnswers?.[index]?.text && (
                            <div className="w-full bg-red-950 p-2 rounded-lg mt-4">
                                <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
                                <span className="text-white text-xs font-medium">
                                    {errors.singleSelectAnswers[index].text.message}
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
            <AddOptionButton handleAddOption={(e) => {
                e.preventDefault();
                if (mode === 'edit') {
                    append({
                        answerId: Date.now(), // <-- add this!

                        text: "",
                    });
                } else {
                    append({
                        answerId: Date.now(),
                        text: "",
                    });
                }
            }} />
        </div>
    );
};
export default SingleSelectAnswers;