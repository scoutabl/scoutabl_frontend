import React from "react";
import { cn } from "@/lib/utils";

const ToggleSwitch = ({ 
  checked, 
  onCheckedChange, 
  disabled = false, 
  className = "",
  size = "default" 
}) => {
  const sizeClasses = {
    sm: "h-4 w-7",
    default: "h-6 w-11", 
    lg: "h-8 w-14"
  };

  const circleSizeClasses = {
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-6 w-6"
  };

  const translateClasses = {
    sm: checked ? "translate-x-3" : "translate-x-0.5",
    default: checked ? "translate-x-6" : "translate-x-1",
    lg: checked ? "translate-x-7" : "translate-x-1"
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        sizeClasses[size],
        checked ? "bg-purplePrimary" : "bg-gray-200",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <span
        className={cn(
          "inline-block rounded-full bg-white transition-transform shadow-sm",
          circleSizeClasses[size],
          translateClasses[size]
        )}
      />
    </button>
  );
};

export { ToggleSwitch };
