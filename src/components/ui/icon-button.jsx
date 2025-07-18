import React from "react";
import { cn } from "@/lib/utils";
import { SCOUTABL_MUTED_PRIMARY, COMMON_VARIANTS } from "@/lib/constants";

const variants = {
  default: {
    iconSpan:
      "px-4 py-1 flex items-center justify-center mb-1 rounded-full transition-colors duration-200",
  },
  circleOutline: {
    iconSpan: "p-[8px] rounded-full",
    button: cn(`rounded-full`, COMMON_VARIANTS.outline),
  },
};

/**
 * IconButton component for navigation or option selection.
 * @param {Object} props
 * @param {React.ElementType} props.iconSolid - Solid (filled) icon component
 * @param {React.ElementType} props.iconOutline - Outline icon component
 * @param {string} props.label - Button label
 * @param {boolean} [props.active] - Whether the button is in active state
 * @param {function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional className
 * @param {object} [props.rest] - Other props
 */
const IconButton = ({
  iconSolid,
  iconOutline,
  label,
  active = false,
  onClick,
  className = "",
  variant = "default",
  ...rest
}) => {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        `flex flex-col items-center justify-center focus:outline-none transition-all duration-200`,
        className,
        variants[variant]?.button || ""
      )}
      {...rest}
    >
      <span
        className={cn(
          variants[variant]?.iconSpan,
          active ? "bg-white text-purplePrimary" : "bg-transparent text-white"
        )}
      >
        {active && iconSolid}
        {!active && iconOutline}
      </span>
      <span
        className={`text-sm transition-colors duration-200 ${
          active ? "font-semibold text-white" : "font-normal text-white"
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default React.memo(IconButton);
