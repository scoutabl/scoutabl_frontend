import React from "react";
import { durationToMinutes } from "@/lib/utils";
import Dropdown from "@/components/ui/dropdown";
import QuickStats from "@/components/common/QuickStats";

import { EllipsisVertical, GripVertical } from "lucide-react";
import ClockIcon from "@/assets/clockIcon.svg?react";
import QuestionIcon from "@/assets/questionIcon.svg?react";
import HistIcon from "@/assets/histIcon.svg?react";



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

  const stats = [
    {
      key: "duration",
      value: `${formatDuration(completionTime)} min`,
      icon: <ClockIcon className="w-4 h-4" />,
    },
    {
      key: "questions",
      value: `${questionCount} questions`,
      icon: <QuestionIcon className="w-4 h-4" />,
    },
    {
      key: "weight",
      value: `${weight} points`,
      icon: <HistIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border transition-all bg-white">
      {/* Header with grip, title and menu */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Drag handle */}
          {isMovable && (
            <div
              className="cursor-grab active:cursor-grabbing flex-shrink-0"
              {...dragListeners}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
          )}
          
          {/* Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-gray-500">Test {order}:</span>
            <span className="text-sm font-semibold text-gray-900 truncate">
              {title || "Not Set"}
            </span>
          </div>
        </div>

        {/* 3-dots menu */}
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

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Stats using QuickStats */}
      <QuickStats stats={stats} />
    </div>
  );
};

export default AssessmentTestRow; 