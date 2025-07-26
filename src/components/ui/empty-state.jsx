import React from "react";
import { cn } from "@/lib/utils";
import FilesColored from "@/assets/filesColored.svg?react";

const EmptyState = ({ 
  icon: Icon = FilesColored,
  text,
  subtext,
  children,
  className
}) => {
  return (
    <div className={cn("text-center py-12", className)}>
      {/* Icon */}
      <div className="mb-4 flex justify-center">
        <Icon />
      </div>
      
      {/* Main Text */}
      {text && (
        <h3 className="text-xl font-semibold mb-2">
          {text}
        </h3>
      )}
      
      {/* Subtext */}
      {subtext && (
        <p className="text-gray-500 mb-6">
          {subtext}
        </p>
      )}
      
      {/* Action Buttons */}
      {children && (
        <div className="flex gap-4 justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 