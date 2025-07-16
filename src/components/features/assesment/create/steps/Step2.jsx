import React from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import AssessmentStep from "@/components/common/AssessmentStep";
import Section from "@/components/common/section";
import AddedTest from "@/components/common/AddedTest";

// TODO: Fetch from API
const MAX_TEST_COUNT = 5;

const Step2 = () => {
  const { assessment, steps, selectedStep, handleStepChange } =
    useAssessmentContext();
  const tests = assessment?.test_details || [];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <AssessmentStep
          steps={steps}
          selected={selectedStep}
          onSelect={handleStepChange}
        />
      </div>
      <Section>
        <Section className="bg-white flex flex-col p-3">
          <div className="flex flex-row gap-3 justify-between">
            {Array.from({ length: MAX_TEST_COUNT }).map((_, index) => (
              <AddedTest
                key={index}
                test={tests.length > index ? tests[index] : null}
                order={index + 1}
              />
            ))}
          </div>
        </Section>
      </Section>
    </div>
  );
};

export default Step2;
