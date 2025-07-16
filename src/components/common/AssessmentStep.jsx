import React, { useEffect } from "react";
import Dropdown from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import {
  RadialBar,
  RadialBarChart,
} from "recharts";

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

  useEffect(() => {
    console.log('Current step index:', currentStepIndex);
    console.log('Steps length:', steps.length);
    console.log('Progress:', progress);
    console.log('enable steps:', enabledSteps);
  }, [currentStepIndex, steps.length]);

  const description = "A radial chart with text"

  // const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  // const progress = (currentStepIndex / (steps.length - 1)) * 100;
  const chartData = [{ value: progress }];

  return (
    <div className="w-[550px] p-4 bg-white rounded-5xl flex items-center gap-4 border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]">
      {/* Circular Step No */}
      <div className="w-[60px] h-[60px] relative flex items-center justify-center">
        {/* <RadialBarChart
          width={60}
          height={60}
          cx={30}
          cy={30}
          innerRadius={22}
          outerRadius={30}
          barSize={8}
          data={chartData}
          startAngle={90}
          endAngle={450}
        > */}
        <RadialBarChart
          width={60}
          height={60}
          cx={30}
          cy={30}
          innerRadius={22}
          outerRadius={30}
          barSize={8}
          data={chartData}
          startAngle={90}
          endAngle={450} // full circle
        >
          <RadialBar
            // minAngle={15}
            background
            clockWise
            dataKey="value"
            fill={currentStep.primaryColor || "#22a87f"}
            cornerRadius={30}
            domain={[0, 100]} // <-- Add this line!
          />
        </RadialBarChart>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-black">
          {currentStep.value}
        </span>
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
