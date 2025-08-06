import React from "react";
import { motion as Motion } from "framer-motion";
import { Eye, GripVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/alert-dialog";
import EditIcon from "@/assets/editquestion.svg?react";
import DuplicateIcon from "@/assets/duplicateIcon.svg?react";
import TrashIcon from "@/assets/trashIcon.svg?react";
import DOMPurify from "dompurify";
import QuestionTypeTag from "@/components/ui/question-type-tag";

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
  dragListeners,
  minimal = false,
}) => {
  // Format completion time from "HH:MM" to "X hr Y min"
  const formatCompletionTime = (timeStr) => {
    if (!timeStr) return "--";

    const [hours, minutes] = timeStr.split(":").map(Number);

    if (hours && minutes) return `${hours} hr ${minutes} min`;
    if (hours) return `${hours} hr`;
    if (minutes) return `${minutes} min`;

    return "--";
  };

  const safeTitle = DOMPurify.sanitize(title);

  return (
    <div className="py-2 px-5 flex items-center gap-4 bg-backgroundPrimary rounded-xl">
      {/* Order/Grip Section */}
      <div className="p-[6px] flex justify-between items-center gap-1 border border-purplePrimary rounded-full w-[65px] h-[30px]">
        {isMovable && (
          <div {...dragListeners} className="cursor-grab">
            <GripVertical size={17} className="text-purplePrimary" />
          </div>
        )}
        <div className="h-5 w-[30px] grid place-content-center text-xs font-semibold text-white bg-purplePrimary rounded-full">
          {String(order).padStart(2, "0")}
        </div>
      </div>

      {/* Title Section */}
      <div className="flex items-center gap-5 flex-1 min-w-0">
        <Checkbox
          name={`questionTitle${questionId}`}
          id={`questionTitle${questionId}`}
          checked={isSelected}
          onCheckedChange={(checked, event) => {
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
            onSelect && onSelect(questionId, checked);
          }}
        />
        <label
          className="truncate cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect && onSelect(questionId, !isSelected);
          }}
          dangerouslySetInnerHTML={{ __html: safeTitle }}
        />
      </div>

      {/* Completion Time */}
      {!minimal && (
        <div className="font-medium text-center w-24 flex-none">
          {formatCompletionTime(completionTime)}
        </div>
      )}

      {!minimal && (
        <div className="flex w-[200px] justify-center flex-shrink-0">
          <QuestionTypeTag 
            type={questionType} 
            className="w-[150px] text-ellipsis"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 w-[140px] flex-shrink-0 justify-end">
        {!minimal && (
          <>
            <Motion.button
              onClick={() => onPreview && onPreview()}
              className="w-8 h-8 grid place-content-center bg-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="text-greyPrimary font-normal" size={16} />
            </Motion.button>

            <Motion.button
              onClick={() => onDuplicate && onDuplicate()}
              className="w-8 h-8 grid place-content-center bg-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <DuplicateIcon className="w-4 h-4" />
            </Motion.button>

            <Motion.button
              onClick={() => onEdit && onEdit()}
              className="w-8 h-8 grid place-content-center bg-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <EditIcon className="w-4 h-4" />
            </Motion.button>
          </>
        )}

        {/* Delete Button with Alert Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Motion.button
              className="w-8 h-8 grid place-content-center bg-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <TrashIcon className="w-4 h-4" />
            </Motion.button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                question and remove it from your assessment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-md bg-dangerPrimary hover:bg-red-900 text-white hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="rounded-md bg-greenPrimary hover:bg-green-950 text-greyPrimary hover:text-white"
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
