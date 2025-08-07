import React from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SectionHeader = ({ 
  number, 
  title, 
  tooltipText, 
  className,
  onEdit,
  onDelete,
  showActions = false,
  headerRight,
  subHeader,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={cn("flex items-center justify-between w-full", className)}>
        {/* Left Section - Number Badge + Title + Tooltip */}
        <div className="flex items-center gap-2">
          {/* Numbered Badge */}
          {number && (
            <div className="flex items-center justify-center w-[38px] h-[30px] bg-purple-200 rounded-full p-1">
              <div className="flex items-center justify-center w-full h-full bg-purplePrimary rounded-full">
                <span className="text-white text-xs font-semibold">{number}</span>
              </div>
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-grayPrimary">{title}</h3>

          {/* Tooltip Icon */}
          {tooltipText && (
            <div className="relative group">
              <HelpCircle className="w-[14px] h-[14px] text-gray-500 cursor-help" />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-200 max-w-200">
                {tooltipText}
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Header Right Content or Action Buttons */}
        {headerRight ? (
          <div className="flex items-center gap-4">
            {headerRight}
          </div>
        ) : (onEdit || onDelete) && (
          <div
            className={cn(
              "flex items-center gap-2 transition-opacity duration-200",
              showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 13.33H2"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.41 3.92L2 13.33V16H4.67L14.08 6.59C14.47 6.2 14.47 5.57 14.08 5.18L12.82 3.92C12.43 3.53 11.8 3.53 11.41 3.92Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Edit
              </button>
            )}

            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center justify-center w-8 h-8 border border-gray-200 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12.67 4V13.33C12.67 14.07 12.07 14.67 11.33 14.67H4.67C3.93 14.67 3.33 14.07 3.33 13.33V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.67 7.33V11.33"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9.33 7.33V11.33"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      {subHeader}
    </div>
  );
};

export default SectionHeader;
