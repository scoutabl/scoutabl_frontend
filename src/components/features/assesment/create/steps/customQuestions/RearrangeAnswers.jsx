import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { GripVertical } from 'lucide-react';
import DeleteIcon from '@/assets/trashIcon.svg?react'

const RearrangeAnswers = ({ value = [], onChange }) => {
    const [options, setOptions] = useState(value.length ? value : [
        { id: 1, text: '' },
        { id: 2, text: '' },
    ]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dropIndex, setDropIndex] = useState(null);

    // Handle drag start
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    // Handle drag over
    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDropIndex(index);
    };

    // Handle drag end
    const handleDragEnd = () => {
        if (
            draggedIndex !== null &&
            dropIndex !== null &&
            draggedIndex !== dropIndex
        ) {
            const newOptions = [...options];
            const [removed] = newOptions.splice(draggedIndex, 1);
            newOptions.splice(dropIndex, 0, removed);
            setOptions(newOptions);
            onChange?.(newOptions);
        }
        setDraggedIndex(null);
        setDropIndex(null);
    };

    // Edit option text
    const editOption = (idx, text) => {
        const newOptions = options.map((opt, i) => i === idx ? { ...opt, text } : opt);
        setOptions(newOptions);
        onChange?.(newOptions);
    };

    // Delete option
    const deleteOption = idx => {
        const newOptions = options.filter((_, i) => i !== idx);
        setOptions(newOptions);
        onChange?.(newOptions);
    };

    // Add option
    const addOption = () => {
        const newOptions = [...options, { id: Date.now(), text: '' }];
        setOptions(newOptions);
        onChange?.(newOptions);
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="font-semibold mb-4 text-greyPrimary">Select correct order</label>
            {options.map((opt, idx) => (
                <div
                    key={opt.id}
                    className={`flex items-center gap-2 transition-all duration-200}`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                >

                    {/* Drag Handle */}
                    <div className="p-[6px] flex items-center gap-1 cursor-move border border-purplePrimary rounded-full">
                        <GripVertical size={20} color='#5C5C5C' />
                        <div className='h-5 w-[30px] grid place-content-center text-xs font-semibold text-white bg-purplePrimary rounded-full'>
                            {String(idx + 1).padStart(2, '0')}
                        </div>
                    </div>


                    {/* Input Field */}
                    <Input
                        className="flex-1"
                        value={opt.text}
                        onChange={e => editOption(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                    />

                    {/* Delete Button */}
                    <button
                        type="button"
                        onClick={() => deleteOption(idx)}
                        className="p-2 text-greyPrimary hover:text-dangerPrimary transition-colors duration-300 ease-in"
                        title="Delete option"
                    >
                        <DeleteIcon size={16} />
                    </button>
                </div>
            ))}

            {/* Add Option Button */}
            <button
                type="button"
                onClick={addOption}
                className="text-blue-600 text-sm mt-2 hover:underline self-start font-medium"
            >
                + Add Options
            </button>
        </div>
    );
};

export default RearrangeAnswers