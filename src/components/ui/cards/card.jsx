import React from "react";
import { cn } from "@/lib/utils";

/**
 * Stateless Card component for option selection.
 * @param {Object} props
 * @param {string} props.title - Title text
 * @param {string} props.description - Description text
 * @param {React.ComponentType} props.Icon - SVG Icon React component (imported with ?react)
 * @param {boolean} props.selected - Whether the card is selected
 * @param {function} props.onClick - Click handler
 * @param {string} [props.className] - Additional className
 * @param {object} [props.rest] - Other props
 */
const Card = ({
  title,
  description,
  Icon,
  selected = false,
  onClick,
  className = "",
  ...rest
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "h-full w-full px-[22px] py-[65px] flex flex-col items-center justify-center gap-3 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border rounded-[16px] bg-white hover:bg-[#FAEEFF] transition-all duration-300 ease-in-out group text-center cursor-pointer",
        selected ? "bg-[#FAEEFF] border-[#9B71F7]" : "bg-white border-black/10 hover:border-[#9B71F7]",
        className
      )}
      {...rest}
    >
      {Icon && <Icon width={48} height={48} className="mb-3" />}
      <h4 className="font-semibold text-[#333333]">{title}</h4>
      <span className="font-normal text-[13px] text-[#5C5C5C] text-center">
        {description}
      </span>
    </div>
  );
};

export default React.memo(Card);
