// import React from 'react'
// import RemoveOptionButton from '@/components/features/assesment/create/shared/RemoveOptionButton';
// import { useState, useEffect } from "react";
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import AddOptionButton from '../../shared/AddOptionButton';

// const MultipleSelectAnswers = ({
//     answers,
//     selectedAnswers = [],
//     onAnswersChange,
//     onSelectedChange,
//     showShuffleToggle
// }) => {
//     const [shuffleEnabled, setShuffleEnabled] = useState(false);
//     const [shuffledOptions, setShuffledOptions] = useState([]);

//     useEffect(() => {
//         if (shuffleEnabled) {
//             const shuffled = [...answers]
//                 .map(value => ({ value, sort: Math.random() }))
//                 .sort((a, b) => a.sort - b.sort)
//                 .map(({ value }) => value);
//             setShuffledOptions(shuffled);
//         } else {
//             setShuffledOptions([]);
//         }
//     }, [shuffleEnabled, answers]);

//     const handleShuffleToggle = (checked) => {
//         setShuffleEnabled(checked);
//     };

//     const handleAddOption = () => {
//         const maxId = Math.max(...answers.map(answer => parseInt(answer.id) || 0));
//         const newAnswer = {
//             id: (maxId + 1).toString(),
//             text: ''
//         };
//         onAnswersChange([...answers, newAnswer]);
//     };

//     const handleRemoveOption = (answerId) => {
//         if (answers.length <= 2) {
//             // alert('You must have at least 2 options');
//             return;
//         }
//         const updatedAnswers = answers.filter(answer => answer.id !== answerId);
//         onAnswersChange(updatedAnswers);
//         const updatedSelected = selectedAnswers.filter(id => id !== answerId);
//         onSelectedChange(updatedSelected);
//     };

//     const handleAnswerTextChange = (answerId, newText) => {
//         const updatedAnswers = answers.map(answer =>
//             answer.id === answerId ? { ...answer, text: newText } : answer
//         );
//         onAnswersChange(updatedAnswers);
//     };

//     const handleCheckboxChange = (answerId, checked) => {
//         let updatedSelected;
//         if (checked) {
//             updatedSelected = [...selectedAnswers, answerId];
//         } else {
//             updatedSelected = selectedAnswers.filter(id => id !== answerId);
//         }
//         onSelectedChange(updatedSelected);
//     };

//     const optionsToRender = shuffleEnabled ? shuffledOptions : answers;

//     return (
//         <div className="flex flex-col gap-4">
//             <div className="flex items-center justify-between">
//                 <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
//                 {showShuffleToggle && (
//                     <div className='flex items-center gap-1 group'>
//                         <Checkbox
//                             name="shuffleMultipleSelectOptions"
//                             id="shuffleMultipleSelectOptions"
//                             checked={shuffleEnabled}
//                             onCheckedChange={handleShuffleToggle}
//                         />
//                         <label htmlFor='shuffleMultipleSelectOptions' className="text-greyAccent font-medium text-sm group-hover:text-purplePrimary duration-300 transition-colors ease-in cursor-pointer">
//                             Shuffle options
//                         </label>
//                     </div>
//                 )}
//             </div>
//             <div className='flex flex-col gap-4 '>
//                 {optionsToRender.map((answer, index) => (
//                     <div key={answer.id} className="flex items-center gap-2 peer">
//                         <Checkbox
//                             checked={selectedAnswers.includes(answer.id)}
//                             onCheckedChange={checked => handleCheckboxChange(answer.id, checked)}
//                         />
//                         <Input
//                             type="text"
//                             value={answer.text}
//                             onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
//                             className="p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder={`Option ${index + 1}`}
//                         />
//                         <RemoveOptionButton handleRemove={handleRemoveOption(answer.id)} canRemove={answers.length > 2} />
//                     </div>
//                 ))}
//             </div>
//             <AddOptionButton handleAddOption={handleAddOption} />
//         </div>
//     );
// };

// export default MultipleSelectAnswers

import React from 'react'
import RemoveOptionButton from '@/components/features/assesment/create/shared/RemoveOptionButton';
import { useState, useEffect } from "react";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import AddOptionButton from '../../shared/AddOptionButton';
import { cn } from '@/lib/utils';

const MultipleSelectAnswers = ({
    answers,
    selectedAnswers = [],
    onAnswersChange,
    onSelectedChange,
    showShuffleToggle,
    shuffleEnabled,
    setShuffleEnabled,
    length,
    error
}) => {
    // const [shuffleEnabled, setShuffleEnabled] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        if (shuffleEnabled) {
            const shuffled = [...answers]
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
            setShuffledOptions(shuffled);
        } else {
            setShuffledOptions([]);
        }
    }, [shuffleEnabled, answers]);

    const handleShuffleToggle = (checked) => {
        setShuffleEnabled(checked);
    };

    const handleAddOption = () => {
        // Find the minimum id (for negative id generation)
        const minId = Math.min(0, ...answers.map(answer => Number(answer.id) || 0));
        const newAnswer = {
            id: minId - 1, // e.g., -1, -2, -3, etc.
            text: ''
        };
        onAnswersChange([...answers, newAnswer]);
    };

    const handleRemoveOption = (answerId) => {
        if (answers.length <= 2) {
            alert('You must have at least 2 options');
            return;
        }
        const updatedAnswers = answers.filter(answer => answer.id !== answerId);
        onAnswersChange(updatedAnswers);
        const updatedSelected = selectedAnswers.filter(id => id !== answerId);
        onSelectedChange(updatedSelected);
    };

    const handleAnswerTextChange = (answerId, newText) => {
        const updatedAnswers = answers.map(answer =>
            answer.id === answerId ? { ...answer, text: newText } : answer
        );
        onAnswersChange(updatedAnswers);
    };

    const handleCheckboxChange = (answerId, checked) => {
        let updatedSelected;
        if (checked) {
            updatedSelected = [...selectedAnswers, answerId];
        } else {
            updatedSelected = selectedAnswers.filter(id => id !== answerId);
        }
        onSelectedChange(updatedSelected);
    };

    const optionsToRender = shuffleEnabled ? shuffledOptions : answers;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-greyPrimary">Select right answer</span>
                {showShuffleToggle && (
                    <div className='flex items-center gap-1 group'>
                        <Checkbox
                            name="shuffleMultipleSelectOptions"
                            id="shuffleMultipleSelectOptions"
                            checked={shuffleEnabled}
                            onCheckedChange={handleShuffleToggle}
                        />
                        <label htmlFor='shuffleMultipleSelectOptions' className="text-greyAccent font-medium text-sm group-hover:text-purplePrimary duration-300 transition-colors ease-in cursor-pointer">
                            Shuffle options
                        </label>
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-4 '>
                {optionsToRender.map((answer, index) => (
                    <div key={answer.id} className="flex items-center gap-2 peer">
                        <Checkbox
                            checked={selectedAnswers.includes(answer.id)}
                            onCheckedChange={checked => handleCheckboxChange(answer.id, checked)}
                        />
                        <Input
                            type="text"
                            value={answer.text}
                            onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
                            className={cn(
                                "p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                {
                                    "border-dangerPrimary": !answer.text.trim()
                                }
                            )}
                            placeholder={`Option ${index + 1}`}
                        />
                        <RemoveOptionButton handleRemove={() => handleRemoveOption(answer.id)} canRemove={answers.length > length} />
                    </div>
                ))}
            </div>
            <AddOptionButton handleAddOption={handleAddOption} />
            {/* <button onClick={handleAddOption} className="py-[17.5px] flex items-center gap-3 group cursor-pointer">
                <div className='size-6 grid place-content-center bg-white rounded-full border border-transparent group-hover:bg-blueBtn group-hover:border-blueBtn transition-colors duration-300 ease-in'>
                    <PlusIcon className="text-blueBtn group-hover:text-white transition-colors duration-200 ease-in" />
                </div>
                <span className='text-blueBtn text-sm font-medium group-hover:underline underline-offset-4 transition-all duration-200 ease-in'>Add Options</span>
            </button> */}
        </div>
    );
};

export default MultipleSelectAnswers