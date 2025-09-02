import React from "react";

const CustomToggleSwitch = ({ checked, onCheckedChange, disabled = false }) => {
  return (
    <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-purplePrimary' : 'bg-greyAccent/50'}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
      </div>
    </label>
  );
};

export { CustomToggleSwitch };
