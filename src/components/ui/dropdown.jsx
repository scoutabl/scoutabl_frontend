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
import {
  SCOUTABL_TEXT_SECONDARY,
  SCOUTABL_TEXT,
  SCOUTABL_WHITE,
  COMMON_VARIANTS,
} from "@/lib/constants";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Checkbox from "./checkbox2";

const variants = {
  default: {
    div: "",
  },
  outline: {
    div: COMMON_VARIANTS.outline,
  },
};

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
  multiselect = false,
  showSelectAll = false,
  showCurrentValue = true,
  iconOnly = false,
  icon = <ChevronDown className="size-5" />,
  clearable = false,
  variant = "default",
  style = {},
  rightCheckbox = false,
}) => {
  const isSelected = (val) =>
    multiselect && Array.isArray(currentValue)
      ? currentValue.includes(val)
      : currentValue === val;

  const allValues = options.map((opt) => opt.value);
  const allSelected =
    multiselect &&
    Array.isArray(currentValue) &&
    allValues.length > 0 &&
    allValues.every((val) => currentValue.includes(val));

  const handleItemClick = (val) => {
    if (multiselect) {
      let newValues = Array.isArray(currentValue) ? [...currentValue] : [];
      if (newValues.includes(val)) {
        newValues = newValues.filter((v) => v !== val);
      } else {
        newValues.push(val);
      }
      onChange(newValues);
    } else {
      onChange(val);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...allValues]);
    }
  };

  const currentOption = options.find(
    (opt) =>
      (multiselect && Array.isArray(currentValue)
        ? currentValue.includes(opt.value)
        : opt.value === currentValue) ||
      (opt.isDefault && (currentValue === null || currentValue === undefined))
  );
  const hasValue = multiselect
    ? Array.isArray(currentValue) && currentValue.length > 0
    : currentValue !== null && currentValue !== undefined;

  const showClearIcon = clearable && hasValue;

  const handleClear = () => {
    if (multiselect) {
      onChange([]);
    } else {
      onChange(null);
    }
  };

  return (
    <DropdownMenu>
      <div
        className={cn(
          "flex flex-row items-center rounded-full hover:cursor-pointer",
          "h-10",
          showClearIcon ? "px-4" : "p-0",
          className,
          !hasValue ? variants[variant].div : ""
        )}
        style={{
          background: hasValue ? SCOUTABL_TEXT : "inherit",
          color: hasValue ? SCOUTABL_WHITE : "inherit",
          ...style,
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              `rounded-full focus:outline-none text-sm select-none`,
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 border-0",
              "gap-1 text-ellipsis overflow-hidden",
              showClearIcon ? "p-0" : "px-4",
              className
            )}
            style={{
              color: "inherit",
              background: "inherit",
            }}
          >
            {!iconOnly && (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                <span className={hasValue ? "font-semibold" : ""}>
                  {name ? `${name}` : ""}
                </span>
                {multiselect && showCurrentValue
                  ? hasValue
                    ? `: ${options
                        .filter((opt) => currentValue.includes(opt.value))
                        .map((opt) => opt.display)
                        .join(", ")}`
                    : ""
                  : showCurrentValue && currentOption
                  ? `: ${currentOption.display}`
                  : ""}
              </span>
            )}
            {!showClearIcon && icon}
          </Button>
        </DropdownMenuTrigger>
        {/* TODO: Clearable click events don't work. Fix. */}
        {showClearIcon && (
          <span className="ml-2 stroke-2 hover:stroke-4 select-none">
            <XIcon
              className="size-4"
              style={{ strokeWidth: "inherit" }}
              onClick={handleClear}
            />
          </span>
        )}
      </div>
      <DropdownMenuContent align="start" className="py-2 px-0" style={{
        scrollbarWidth: "2px"
      }}>
        <DropdownMenuGroup
          className="p-0 min-w-[200px]"
          style={{ color: SCOUTABL_TEXT_SECONDARY }}
        >
          {multiselect && showSelectAll && (
            <DropdownMenuItem
              key="__select_all__"
              onClick={handleSelectAll}
              className={cn(
                `rounded-none text-base px-3 hover:cursor-pointer flex flex-row items-center gap-5`,
                rightCheckbox ? "justify-between" : "gap-0",
                "hover:cursor-pointer hover:border-l-2 hover:border-purplePrimary",
                allSelected
                  ? "bg-[#F3E8FF] border-l-4 border-purplePrimary font-medium"
                  : ""
              )}
            >
              {!rightCheckbox && <Checkbox active={allSelected} />}
              <span>{"All"}</span>
              {rightCheckbox && <Checkbox active={allSelected} />}
            </DropdownMenuItem>
          )}
          {options.map((opt) => {
            const checkbox = <Checkbox active={isSelected(opt.value)} />;

            return (
              <DropdownMenuItem
                key={opt.value}
                onClick={
                  opt.disabled ? undefined : () => handleItemClick(opt.value)
                }
                disabled={!!opt.disabled}
                className={cn(
                  `rounded-none text-base px-3 flex flex-row items-center`,
                  rightCheckbox ? "justify-between gap-5" : "gap-0",
                  opt.disabled
                    ? "opacity-50 cursor-not-allowed bg-transparent"
                    : "hover:cursor-pointer hover:border-l-2 hover:border-purplePrimary",
                  isSelected(opt.value) ? "bg-[#F3E8FF] font-medium" : ""
                )}
              >
                {multiselect && !rightCheckbox && checkbox}
                {renderOption ? (
                  renderOption(opt)
                ) : opt.icon ? (
                  <div className="flex flex-row items-center gap-2">
                    {opt.icon}
                    {opt.display}
                  </div>
                ) : (
                  opt.display
                )}
                {multiselect && rightCheckbox && checkbox}
              </DropdownMenuItem>
            );
          })}
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
  currentValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  className: PropTypes.string,
  renderOption: PropTypes.func, // Optional custom render function
  multiselect: PropTypes.bool, // Enable multi-select
  showSelectAll: PropTypes.bool, // Show select all option in multi-select
};

export default Dropdown;
