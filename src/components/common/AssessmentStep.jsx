import React from 'react';

/**
 * steps: Array<{ value: number|string, name: string, primaryColor: string, secondaryColor: string, enabled: boolean }>
 * selected: value of the currently selected step
 * onSelect: function(value) called when a step is selected
 * children: optional, for additional content below the select
 */
const AssessmentStep = ({
  steps = [],
  selected,
  onSelect,
  children,
  rightContent,
}) => {
  const currentStepIndex = steps.findIndex(s => s.value === selected);
  const currentStep = steps[currentStepIndex] || {};
  const nextStep = steps[currentStepIndex + 1];

  return (
    <div className='w-[600px] p-4 bg-white rounded-5xl flex items-center gap-4 border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]'>
      {/* Circular Step No */}
      <div className='flex items-center justify-center w-12 h-12 rounded-full' style={{ background: currentStep.secondaryColor, color: currentStep.primaryColor, fontWeight: 700, fontSize: 20 }}>
        {currentStep.value}
      </div>
      <div className='flex flex-col gap-1 flex-1'>
        {/* Step select dropdown */}
        <select
          className='mb-1 px-2 py-1 rounded border border-gray-200 text-base font-medium outline-none'
          value={selected}
          onChange={e => {
            const val = e.target.value;
            if (onSelect) onSelect(val);
          }}
        >
          {steps.map((step, idx) => (
            <option key={step.value} value={step.value} disabled={!step.enabled}>
              {`Step ${idx + 1} of ${steps.length}`}
            </option>
          ))}
        </select>
        <span className='text-greenPrimary font-semibold text-xl'>{currentStep.name}</span>
        {children}
      </div>
      {nextStep && nextStep.name && (
        <span className='block px-3 py-1 mt-auto bg-greenPrimary/15 rounded-full'>Next: {nextStep.name}</span>
      )}
      {rightContent}
    </div>
  );
};

export default AssessmentStep; 