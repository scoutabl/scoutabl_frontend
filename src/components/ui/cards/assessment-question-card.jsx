import React from "react";
import Chip from "../chip";
import { cn } from "@/lib/utils";
import { SCOUTABL_PINK } from "@/lib/constants";

const variants = {
  default: "bg-white",
  selected: `bg-[${SCOUTABL_PINK}] border border-purplePrimary`,
};

/**
 * AssessmentQuestionCard – reusable card for custom-question library.
 * Mirrors AssessmentTestCard API so it can drop-in wherever needed.
 *
 * Props
 * ──────────────────────────────────────────────────────────────────
 * • name           – Question title
 * • description    – Short description (optional)
 * • tags           – Array of { icon, text, variant? } objects
 * • footer         – React node (buttons etc.) rendered at the bottom
 * • variant        – "default" | "selected" (default "default")
 * • className      – extra Tailwind classes
 */
const AssessmentQuestionCard = ({
  name,
  description,
  tags = [],
  footer,
  variant = "default",
  className = "",
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 flex flex-col gap-2 h-full",
        variants[variant],
        className
      )}
    >
      {/* Tags */}
      <div className="flex flex-row gap-2 mb-2">
        {tags.slice(0, 3).map((tag, idx) => (
          <Chip
            key={idx}
            className="flex flex-row gap-1 items-center text-[12px]"
            variant="blueSecondary"
          >
            {tag.name}
          </Chip>
        ))}
      </div>

      {/* Title */}
      <div className="text-md font-semibold truncate" title={name}>
        {name}
      </div>

      {/* Description */}
      {description && (
        <div className="text-sm text-grayAccent flex-1 max-h-[40px] line-clamp-2 text-ellipsis">
          {description}
        </div>
      )}

      {/* Footer (buttons) */}
      {footer && <div className="mt-auto">{footer}</div>}
    </div>
  );
};

export default AssessmentQuestionCard;
