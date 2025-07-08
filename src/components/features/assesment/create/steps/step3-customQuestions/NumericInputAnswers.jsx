// const NumericInputAnswers = ({ correctAnswer, onAnswerChange, numericCondition, onConditionChange }) => {
//     return (
//         <div className="space-y-4">
//             <div className="mb-4">
//                 <span className="text-base font-semibold text-greyPrimary">Correct if</span>
//             </div>
//             <div className="flex items-center gap-4">
//                 <span className="text-sm text-greyAccent font-semibold">Answer is</span>
//                 <Select defaultValue={numericCondition} onValueChange={onConditionChange}>
//                     <SelectTrigger chevronColor="text-white" className="!h-[43px] py-3 px-6 flex items-center justify-between w-fit text-sm font-medium bg-purplePrimary text-white rounded-xl">
//                         <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="more-than">More than</SelectItem>
//                         <SelectItem value="less-than">Less than</SelectItem>
//                         <SelectItem value="equal-to">More than/ equal to</SelectItem>
//                         <SelectItem value="between">Less than/ equal to</SelectItem>
//                     </SelectContent>
//                 </Select>
//                 <Input
//                     type="number"
//                     value={correctAnswer}
//                     onChange={(e) => onAnswerChange(e.target.value)}
//                     className="flex-1 h-[43px] p-3 border border-greyAccent rounded-xl text-sm font-medium text-greyAccent"
//                     placeholder="000.00"
//                     step="0.01"
//                 />
//             </div>
//         </div>
//     )
// }


import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
const NumericInputAnswers = ({ correctAnswer, onAnswerChange, numericCondition, onConditionChange }) => {
    return (
        <div className="space-y-4">
            <div className="mb-4">
                <span className="text-base font-semibold text-greyPrimary">Correct if</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-greyAccent font-semibold">Answer is</span>
                <Select defaultValue={numericCondition} onValueChange={onConditionChange}>
                    <SelectTrigger chevronColor="text-white" className="!h-[43px] py-3 px-6 flex items-center justify-between w-fit text-sm font-medium bg-purplePrimary text-white rounded-xl">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="more-than">More than</SelectItem>
                        <SelectItem value="less-than">Less than</SelectItem>
                        <SelectItem value="equal-to">More than/ equal to</SelectItem>
                        <SelectItem value="between">Less than/ equal to</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    type="number"
                    value={correctAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="flex-1 h-[43px] p-3 border border-greyAccent rounded-xl text-sm font-medium text-greyAccent"
                    placeholder="000.00"
                    step="0.01"
                />
            </div>
        </div>
    )
}

export default NumericInputAnswers;