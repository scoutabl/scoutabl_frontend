import React from "react";
import Dropdown from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";

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
  const currentStepIndex = steps.findIndex((s) => s.value === selected);
  const currentStep = steps[currentStepIndex] || {};
  const nextStep = steps[currentStepIndex + 1];
  const enabledSteps = steps[currentStepIndex].enabledSteps;

  return (
    <div className="w-[550px] p-4 bg-white rounded-5xl flex items-center gap-4 border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]">
      {/* Circular Step No */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full border border-5"
        style={{
        //   background: currentStep.secondaryColor,
        //   color: currentStep.primaryColor,
        borderColor: currentStep.primaryColor,
          fontWeight: 700,
          fontSize: 20,
        }}
      >
        {currentStep.value}
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {/* Step select dropdown */}
        <Dropdown
          name={`Step ${currentStepIndex + 1} of ${steps.length}`}
          options={steps.map((step) => ({
            display: step.name,
            value: step.value,
            disabled: !enabledSteps.includes(step.value),
          }))}
          currentValue={selected}
          onChange={onSelect}
          multiselect={false}
          showCurrentValue={false}
          className={cn("w-30 h-6 text-xs p-1 gap-0")}
          style={{ background: currentStep.secondaryColor }}
        />
        <span
          className="font-semibold text-lg"
          style={{ color: currentStep.primaryColor }}
        >
          {currentStep.name}
        </span>
        {children}
      </div>
      {nextStep && nextStep.name && (
        <span
          className="block px-3 py-1 mt-auto rounded-full text-sm text-greyPrimary"
          style={{
            background: currentStep.secondaryColor,
            // color: currentStep.primaryColor,
          }}
        >
          Next: {nextStep.name}
        </span>
      )}
      {rightContent}
    </div>
  );
};

export default AssessmentStep;
