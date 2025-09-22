import React from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import AssessmentStep from "@/components/common/AssessmentStep";
import EditAssessmentTests from "@/components/common/EditAssessmentTests";
import { Button } from "@/components/ui/button";
import ChevronLeftIcon from "@/assets/chevronLeftIcon.svg?react";
import ChevronRightIcon from "@/assets/chevronRightIcon.svg?react";

const Step2 = () => {
  const { steps, selectedStep, handleStepChange } = useAssessmentContext();

  // Navigation handlers
  const handleBack = () => {
    const currentStepIndex = steps.findIndex((s) => s.value === selectedStep);
    if (currentStepIndex > 0) {
      const previousStep = steps[currentStepIndex - 1];
      handleStepChange(previousStep.value);
    }
  };

  const handleNext = () => {
    const currentStepIndex = steps.findIndex((s) => s.value === selectedStep);
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      handleStepChange(nextStep.value);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <AssessmentStep
          steps={steps}
          selected={selectedStep}
          onSelect={handleStepChange}
        />
      </div>
      <EditAssessmentTests />
      
      {/* Back / Next navigation buttons */}
      <div className="flex items-center justify-between pb-6">
        <Button 
          variant="back" 
          effect="shineHover"
          onClick={handleBack}
        >
          <ChevronLeftIcon /> Back
        </Button>
        <Button 
          className=''
          variant="next" 
          effect="shineHover"
          onClick={handleNext}
        >
          Next <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(Step2);
