import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import MarkIcon from '@/assets/mark.svg?react';

const NumericInputAnswers = () => {
    const { register, setValue, watch, formState: { errors } } = useFormContext();
    const correctAnswer = watch('correctAnswer');
    const numericCondition = watch('numericCondition');

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <span className="text-base font-semibold text-greyPrimary">Correct if</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-greyAccent font-semibold">Answer is</span>
                <Select
                    value={numericCondition}
                    onValueChange={val => setValue('numericCondition', val, { shouldValidate: true })}
                >
                    <SelectTrigger chevronColor="text-white" className="!h-[43px] py-3 px-6 flex items-center justify-between w-fit text-sm font-medium bg-purplePrimary text-white rounded-xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Less than</SelectItem>
                        <SelectItem value="1">Less than or Equal</SelectItem>
                        <SelectItem value="2">Greater than</SelectItem>
                        <SelectItem value="3">Greater than or Equal</SelectItem>
                        <SelectItem value="4">Equal</SelectItem>
                        <SelectItem value="5">Not Equal</SelectItem>
                    </SelectContent>
                </Select>
                {/* <Input
                    type="number"
                    {...register('correctAnswer')}
                    value={correctAnswer}
                    onChange={e => setValue('correctAnswer', e.target.value, { shouldValidate: true })}
                    className={`flex-1 h-[43px] p-3 border rounded-xl text-sm font-medium text-greyAccent ${errors.correctAnswer ? 'border-dangerPrimary' : 'border-greyAccent'}`}
                    placeholder="000.00"
                    step="0.01"
                /> */}
                <Input
                    type="number"
                    step="0.01"
                    placeholder="000.00"
                    className={`flex-1 h-[43px] p-3 border rounded-xl text-sm font-medium text-greyAccent ${errors.correctAnswer ? 'border-dangerPrimary' : 'border-greyAccent'}`}
                    {...register('correctAnswer', { valueAsNumber: true })}
                />
            </div>
            {errors.numericCondition && (
                <div className="w-full bg-red-950 p-2 rounded-lg mt-2">
                    <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
                    <span className="text-white text-xs font-medium">{errors.numericCondition.message}</span>
                </div>
            )}
            {errors.correctAnswer && (
                <div className="w-full bg-red-950 p-2 rounded-lg mt-2">
                    <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
                    <span className="text-white text-xs font-medium">{errors.correctAnswer.message}</span>
                </div>
            )}
        </div>
    )
}

export default NumericInputAnswers;