import React from "react";
import PropTypes from "prop-types";

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
  iconSolid: IconSolid,
  iconOutline: IconOutline,
  label,
  active = false,
  onClick,
  className = "",
  ...rest
}) => {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex flex-col items-center justify-center focus:outline-none transition-all duration-200 ${className}`}
      {...rest}
    >
      <span
        className={`px-4 py-1 flex items-center justify-center mb-1 rounded-full transition-colors duration-200 ${
          active ? "bg-white text-purplePrimary" : "bg-transparent text-white"
        }`}
      >
        {active && IconSolid && <IconSolid className="size-5" aria-hidden="true" />}
        {!active && IconOutline && <IconOutline className="size-5" aria-hidden="true" />}
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

IconButton.propTypes = {
  iconSolid: PropTypes.elementType.isRequired,
  iconOutline: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default React.memo(IconButton);
