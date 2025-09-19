import React from "react";
import { durationToMinutes } from "@/lib/utils";
import Dropdown from "@/components/ui/dropdown";
import { Checkbox } from "@/components/ui/checkbox";

import { EllipsisVertical, GripVertical } from "lucide-react";
import ClockIcon from "@/assets/clockIcon.svg?react";
import QuestionIcon from "@/assets/questionIcon.svg?react";
import HistIcon from "@/assets/histIcon.svg?react"
import WeightageIcon from "@/assets/weightageIcon.svg?react"

/**
 * AssessmentTestRow component for displaying individual test rows in the sequence table
 */
const AssessmentTestRow = ({
  isMovable = false,
  order = 1,
  title = "",
  description = "",
  completionTime = 0,
  questionCount = 0,
  weight = 0,
  onPreview,
  onEdit,
  onDelete,
  onEditWeight,
  dragListeners = {},
  minimal = false,
  isSelected = false,
  onSelect,
}) => {

  const formatDuration = (seconds) => {
    return durationToMinutes(seconds) || 0;
  };

  const menuOptions = [
    ...(onPreview ? [{ value: "preview", display: "Preview Test" }] : []),
    ...(onEdit ? [{ value: "details", display: "View Details" }] : []),
    ...(onEditWeight ? [{ value: "weights", display: "Edit Weightage" }] : []),
    { value: "remove", display: "Remove Test" },
  ];

  const handleMenuAction = (action) => {
    switch (action) {
      case "preview":
        onPreview?.();
        break;
      case "details":
        onEdit?.();
        break;
      case "weights":
        onEditWeight?.();
        break;
      case "remove":
        onDelete?.();
        break;
    }
  };

  return (

     
    
    <div className="flex items-center gap-3 p-2 pl-4 rounded-lg border bg-white hover:bg-gray-50 transition-all">
      
      {/*Drag Handle Section*/}
      <div className="p-[6px] flex justify-between items-center gap-1 border border-purplePrimary rounded-full w-[65px] h-[30px]">
        {isMovable && (
          <div {...dragListeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical size={17} className="text-purplePrimary" />
          </div>
        )}
        <div className="h-5 w-[30px] grid place-content-center text-xs font-semibold text-white bg-purplePrimary rounded-full">
          {String(order).padStart(2, "0")}
        </div>
      </div>
      
      
      
      
      {/* Selection Checkbox */}
      <Checkbox 
        checked={isSelected}
        onCheckedChange={(checked) => onSelect?.(checked)}
        className="flex-shrink-0"
      />

     

      {/* Test Name */}
      <div className="flex-1 min-w-0">
        <span className="text-sm">
          <span className="font-medium text-gray-900">{title || "Problem Solving"}</span>
        </span>
      </div>

      {/* Difficulty/Score Pill */}
      <div className="flex items-center gap-2 px-3 py-1 bg-purplePrimary text-white rounded-full text-sm font-medium">
        <div className="w-4 h-4 bg-purplePrimary rounded-full flex items-center justify-center">
          <WeightageIcon className="w-4 h-4" />
        </div>
        <span>20</span> 
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <ClockIcon className="w-4 h-4" />
        <span>{formatDuration(completionTime)} min</span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-300"></div>

      {/* Questions */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <QuestionIcon className="w-4 h-4" />
        <span>{questionCount} questions</span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-300"></div>

      {/* Points */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <HistIcon className="w-4 h-4" />
        <span>{weight} points</span>
      </div>

      {/* More Options */}
      {!minimal && (
        <Dropdown
          options={menuOptions}
          icon={<EllipsisVertical className="w-4 h-4" />}
          iconOnly
          onChange={handleMenuAction}
          closeOnSelect
          modal={false}
          className="flex-shrink-0"
        />
      )}
    </div>
  );
};

export default AssessmentTestRow; 