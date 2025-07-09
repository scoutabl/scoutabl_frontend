import React from "react";
import { cn } from "@/lib/utils";

/**
 * Stateless HorizontalCard component for option selection.
 * @param {Object} props
 * @param {string} props.title - Title text
 * @param {string} props.description - Description text
 * @param {function} props.Icon - SVG Icon React component or function (imported with ?react, can accept props)
 * @param {boolean} props.selected - Whether the card is selected
 * @param {function} props.onClick - Click handler
 * @param {string} [props.className] - Additional className
 * @param {object} [props.rest] - Other props
 */
const HorizontalCard = ({
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
        "w-[420px] px-6 py-6 flex flex-row items-center gap-6 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] border rounded-[16px] bg-white hover:bg-[#FAEEFF] transition-all duration-300 ease-in-out group cursor-pointer",
        selected ? "bg-[#FAEEFF] border-[#9B71F7]" : "bg-white border-black/10 hover:border-[#9B71F7]",
        className
      )}
      {...rest}
    >
      {Icon && <Icon width={56} height={56} />}
      <div className="flex flex-col items-start justify-center">
        <h4 className="font-semibold text-[#333333]">{title}</h4>
        <span className="font-normal text-[13px] text-[#5C5C5C] mt-1">
          {description}
        </span>
      </div>
    </div>
  );
};

export default React.memo(HorizontalCard); 