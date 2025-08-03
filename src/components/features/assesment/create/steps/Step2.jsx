import React from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import AssessmentStep from "@/components/common/AssessmentStep";
import EditAssessmentTests from "@/components/common/EditAssessmentTests";

const Step2 = () => {
  const { steps, selectedStep, handleStepChange } = useAssessmentContext();

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
    </div>
  );
};

export default React.memo(Step2);
