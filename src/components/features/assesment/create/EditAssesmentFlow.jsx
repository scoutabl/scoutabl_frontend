import { useParams, useNavigate } from "react-router-dom";
import { useAssessment } from "@/context/AssesmentContext";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import { ROUTES } from "../../../../lib/routes";

const steps = [
    { id: "configure", component: Step2 },
    { id: "custom-questions", component: Step3 },
    { id: "finalize", component: Step4 },
];

export default function EditAssessmentFlow() {
    const { stepId, assessmentId } = useParams();
    const navigate = useNavigate();
    const stepIndex = steps.findIndex((s) => s.id === stepId) || 0;
    const StepComponent = steps[stepIndex]?.component || Step1;

    const goToStep = (id) => navigate(ROUTES.ASSESSMENT_CREATE.replace(":stepId", id));

    return (
        <div>
            <StepComponent
                onNext={() => goToStep(steps[stepIndex + 1]?.id)}
                onBack={() => goToStep(steps[stepIndex - 1]?.id)}
                isFirst={stepIndex === 0}
                isLast={stepIndex === steps.length - 1}
            />
        </div>
    );
}
