import { useFormContext, useFieldArray } from "react-hook-form";
import AddOptionButton from "../../shared/AddOptionButton";
import RemoveOptionButton from "../../shared/RemoveOptionButton";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import MarkIcon from '@/assets/mark.svg?react';
const MultipleSelectAnswers = ({ name = "multipleSelectAnswers", selectedName = "selectedAnswers", mode }) => {
    const { control, register, setValue, watch, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });
    const selectedAnswers = watch(selectedName) || [];
    const multipleSelectAnswers = watch(name) || [];

    // Add new option
    const handleAddOption = () => {
        const newId = Date.now();
        append({ id: newId, text: "" });
    };

    // Handle checkbox change - use the actual multipleSelectAnswers ID, not field ID
    const handleCheckboxChange = (index) => {
        const actualId = multipleSelectAnswers[index]?.id;
        if (actualId === undefined) return;

        console.log('DEBUG - Checkbox changed for actual ID:', actualId, typeof actualId);
        console.log('DEBUG - Current selectedAnswers before change:', selectedAnswers);

        let updated;
        // Convert to strings for comparison to handle mixed types
        const selectedAsStrings = selectedAnswers.map(String);
        const actualIdAsString = String(actualId);

        if (selectedAsStrings.includes(actualIdAsString)) {
            // Remove: filter out the matching ID (preserve original types)
            updated = selectedAnswers.filter(val => String(val) !== actualIdAsString);
            console.log('DEBUG - Removing ID:', actualId);
        } else {
            // Add: use the actual ID from multipleSelectAnswers
            updated = [...selectedAnswers, actualId];
            console.log('DEBUG - Adding ID:', actualId);
        }

        console.log('DEBUG - Updated selectedAnswers:', updated);
        setValue(selectedName, updated, { shouldValidate: true });
    };

    // Remove option and update selectedAnswers if needed
    const handleRemoveOption = (index) => {
        const actualId = multipleSelectAnswers[index]?.id;
        remove(index);

        if (actualId !== undefined) {
            const updatedSelected = selectedAnswers.filter(val => String(val) !== String(actualId));
            setValue(selectedName, updatedSelected, { shouldValidate: true });
        }
    };

    return (
        <div>
            {fields.map((field, idx) => {
                const actualAnswer = multipleSelectAnswers[idx];
                const isSelected = actualAnswer ?
                    selectedAnswers.map(String).includes(String(actualAnswer.id)) :
                    false;

                return (
                    <div className='flex flex-col '>
                        <div key={field.id} className="flex items-center gap-2 mb-2">
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleCheckboxChange(idx)}
                                id={`multi-option-${field.id}`}
                            />
                            <Input
                                type="text"
                                {...register(`${name}.${idx}.text`)}
                                defaultValue={field.text}
                                className={cn(
                                    "p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border",
                                    errors[name]?.[idx]?.text ? 'border-dangerPrimary' : 'border-seperatorPrimary'
                                )}
                                onChange={e => setValue(`${name}.${idx}.text`, e.target.value, { shouldValidate: true })}
                            />
                            <RemoveOptionButton
                                handleRemove={() => handleRemoveOption(idx)}
                                canRemove={fields.length > 2}
                            />
                        </div>
                        {errors[name]?.[idx]?.text && (
                            <div className="w-full bg-[#412624] p-2 rounded-lg my-2">
                                <MarkIcon className="w-4 h-4 inline mr-1 text-[#FF4E55]" />
                                <span className="text-[#FF4E55] text-xs font-medium">
                                    {errors[name][idx].text.message}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}

            {errors[selectedName] && (
                <div className="w-full bg-[#412624] p-2 rounded-lg mt-2">
                    <MarkIcon className="w-4 h-4 inline mr-1 text-[#FF4E55]" />
                    <span className="text-[#FF4E55] text-xs font-medium">{errors[selectedName].message}</span>
                </div>
            )}
            <AddOptionButton handleAddOption={handleAddOption} />
        </div>
    );
};

export default MultipleSelectAnswers;