import React from 'react';
import { motion } from 'framer-motion';
import { Eye, GripVertical } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import EditIcon from '@/assets/editquestion.svg?react';
import DuplicateIcon from '@/assets/duplicateIcon.svg?react';
import TrashIcon from '@/assets/trashIcon.svg?react';
import DOMPurify from 'dompurify';

const QuestionRow = ({
    isMovable = true,
    order,
    isSelected = false,
    title,
    completionTime,
    questionType,
    onPreview,
    onEdit,
    onDuplicate,
    onDelete,
    onSelect,
    questionId,
    dragListeners
}) => {
    // Format completion time from "HH:MM" to "X hr Y min"
    const formatCompletionTime = (timeStr) => {
        if (!timeStr) return '--';

        const [hours, minutes] = timeStr.split(':').map(Number);

        if (hours && minutes) return `${hours} hr ${minutes} min`;
        if (hours) return `${hours} hr`;
        if (minutes) return `${minutes} min`;

        return '--';
    };

    const safeTitle = DOMPurify.sanitize(title);

    return (
        <div
            className="py-3 px-5 grid gap-4 items-center bg-backgroundPrimary rounded-xl"
            style={{
                gridTemplateColumns: 'clamp(60px, 5vw, 86px) minmax(200px, 1fr) clamp(80px, 8vw, 103px) clamp(120px, 15vw, 198px) clamp(120px, 15vw, 196px)'
            }}
        >
            {/* Order/Grip Section */}
            <div className="p-[6px] flex items-center gap-1 border border-purplePrimary rounded-full">
                {isMovable && (
                    <div {...dragListeners} className="cursor-grab">
                        <GripVertical size={20} color='#5C5C5C' />
                    </div>
                )}
                <div className='h-5 w-[30px] grid place-content-center text-xs font-semibold text-white bg-purplePrimary rounded-full'>
                    {String(order).padStart(2, '0')}
                </div>
            </div>

            {/* Title Section */}
            <div className="flex items-center gap-6">
                <Checkbox 
                    name={`questionTitle${questionId}`} 
                    id={`questionTitle${questionId}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelect && onSelect(questionId, checked)}
                />
                <label
                    htmlFor={`questionTitle${questionId}`}
                    className="truncate"
                    dangerouslySetInnerHTML={{ __html: safeTitle }}
                />
            </div>

            {/* Completion Time */}
            <div className="font-medium text-center">
                {formatCompletionTime(completionTime)}
            </div>

            {/* Question Type */}
            <div
                className="font-medium min-w-[150px] max-w-[150px] rounded-full px-[6px] py-[5.5px] flex items-center gap-[6px] mx-auto"
                style={{
                    background: questionType?.bg || '#EEE',
                    color: questionType?.text || '#333'
                }}
            >
                {questionType?.icon && (
                    <div
                        className="w-[18px] h-[18px] flex items-center justify-center rounded-full"
                        style={{
                            background: questionType?.text || '#EEE',
                        }}
                    >
                        {React.cloneElement(questionType.icon, {
                            style: { color: questionType?.bg || '#333', width: 12, height: 12 }
                        })}
                    </div>
                )}
                <span className='text-sm font-medium'>
                    {questionType?.name || 'Unknown'}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mx-auto">
                {/* Preview Button */}
                <motion.button
                    onClick={() => onPreview && onPreview()}
                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Eye className='text-greyPrimary font-normal' size={16} />
                </motion.button>

                {/* Duplicate Button */}
                <motion.button
                    onClick={() => onDuplicate && onDuplicate()}
                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <DuplicateIcon className="w-4 h-4" />
                </motion.button>

                {/* Edit Button */}
                <motion.button
                    onClick={() => onEdit && onEdit()}
                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <EditIcon className="w-4 h-4" />
                </motion.button>

                {/* Delete Button with Alert Dialog */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <motion.button
                            className='w-8 h-8 grid place-content-center bg-white rounded-full'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <TrashIcon className="w-4 h-4" />
                        </motion.button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this question
                                and remove it from your assessment.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className='rounded-md bg-dangerPrimary hover:bg-red-900 text-white hover:text-white'>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className='rounded-md bg-greenPrimary hover:bg-green-950 text-greyPrimary hover:text-white'
                                onClick={() => onDelete && onDelete()}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default QuestionRow; 