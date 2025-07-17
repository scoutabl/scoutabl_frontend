import React from "react";
import Chip from "../chip";

/**
 * AssessmentTestCard component
 * @param {string} name - Test name/title
 * @param {string} description - Test description
 * @param {Array<{icon: React.ReactNode, text: string, styles?: string}>} tags - List of tags with icon, text, and optional styles
 * @param {React.ReactNode} footer - Custom footer component (e.g., Add/Remove/Details buttons)
 * @param {string} [className] - Additional class names for the card
 */
const AssessmentTestCard = ({ name, description, tags = [], footer, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white p-6 flex flex-col gap-4 min-w-[320px] max-w-[370px] w-full ${className}`}
    >
      {/* Tags */}
      <div className="flex flex-row gap-2 mb-2">
        {tags.map((tag, idx) => (
          <Chip
            key={idx}
            // className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${tag.styles || "border-primary text-primary bg-white"}`}
          >
            {tag.icon && <span className="mr-1">{tag.icon}</span>}
            {tag.text}
          </Chip>
        ))}
      </div>
      {/* Name */}
      <div className="text-lg font-semibold mb-1">{name}</div>
      {/* Description */}
      <div className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</div>
      {/* Footer */}
      <div className="mt-auto flex flex-row items-center gap-2">{footer}</div>
    </div>
  );
};

export default AssessmentTestCard;