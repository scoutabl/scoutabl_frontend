import React from 'react'
import { useAssessmentContext } from '@/components/common/AssessmentNavbarWrapper';
import AssessmentStep from '@/components/common/AssessmentStep';

const Step4 = () => {
    const { steps, selectedStep, handleStepChange } = useAssessmentContext();
    return (
        <div>
            <AssessmentStep
                steps={steps}
                selected={selectedStep}
                onSelect={handleStepChange}
            />
        </div>
    )
}

export default Step4