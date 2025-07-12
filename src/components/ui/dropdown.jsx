import React from "react";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChevronDown from "@/assets/chevronDownIcon.svg?react";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

/**
 * Dropdown component
 * @param {Array<{display: string, value: string|number}>} options - List of dropdown options
 * @param {function} onChange - Callback when an option is selected (receives value)
 * @param {string|number} currentValue - Currently selected value
 * @param {string} className - Additional className for the button
 */
const Dropdown = ({
  name,
  options,
  onChange,
  currentValue,
  className = "",
  renderOption,
}) => {
  const currentOption = options.find(
    (opt) =>
      opt.value === currentValue ||
      (opt.isDefault && (currentValue === null || currentValue === undefined))
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`rounded-full focus-visible:ring-0 text-sm ${className}`}
        >
          {name ? `${name}: ` : ""}{" "}
          {currentOption
            ? renderOption
              ? renderOption(currentOption)
              : currentOption.display
            : "Select"}
          <ChevronDown className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="py-2 px-0">
        <DropdownMenuGroup className="p-0">
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`rounded-none text-base px-3 hover:cursor-pointer ${
                opt.value === currentValue
                  ? "bg-[#F3E8FF] border-l-4 border-purplePrimary font-medium"
                  : ""
              }`}
            >
              {renderOption ? renderOption(opt) : opt.display}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  renderOption: PropTypes.func, // Optional custom render function
};

export default Dropdown;
