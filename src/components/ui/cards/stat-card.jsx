import React from "react";
import { cn } from "@/lib/utils";

/**
 * StatCard component for dashboard stats.
 * @param {Object} props
 * @param {string|number} props.stat - The main stat number
 * @param {string} props.label - The label below the stat
 * @param {React.ComponentType} props.Icon - SVG Icon React component
 * @param {string} props.iconBgColor - Tailwind color class for icon circle (e.g. 'bg-blue-100')
 * @param {string} [props.className] - Additional className
 * @param {object} [props.rest] - Other props
 */
const StatCard = ({
  stat,
  label,
  Icon,
  iconBgColor = "bg-blue-100",
  className = "",
  ...rest
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent",
        className
      )}
      {...rest}
    >
      <div className="flex flex-col justify-center">
        <span className="text-[28px] font-semibold text-[#222] leading-none">{stat}</span>
        <span className="text-[16px] font-normal text-[#444] mt-2">{label}</span>
      </div>
      {Icon && (
        <span className={cn("flex items-center justify-center size-14 rounded-full", iconBgColor)}>
          <Icon width={28} height={28} />
        </span>
      )}
    </div>
  );
};

export default React.memo(StatCard);
