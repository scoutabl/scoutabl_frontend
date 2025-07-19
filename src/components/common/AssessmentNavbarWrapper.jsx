import { createContext, useContext, useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  useAssessment,
  useUpdateAssessment,
} from "@/api/assessments/assessment";
import EditIcon from "@/assets/editIcon.svg?react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

const AssessmentContext = createContext();

const MAX_INPUT_WIDTH = 400; // px

const stepsArray = [
  {
    value: 1,
    stepId: "create",
    name: "Basics",
    primaryColor: "#0043CE",
    secondaryColor: "#D0E2FF",
    enabledSteps: [1],
  },
  {
    value: 2,
    stepId: "configure",
    name: "Configure Assessment",
    primaryColor: "#E68334",
    secondaryColor: "#FFF0E4",
    enabledSteps: [2, 3, 4],
  },
  {
    value: 3,
    stepId: "custom-questions",
    name: "Add Custom Questions",
    primaryColor: "#27AE60",
    secondaryColor: "#E9F9F1",
    enabledSteps: [2, 3, 4],
  },
  {
    value: 4,
    stepId: "finalize",
    name: "Finalize",
    primaryColor: "#8B5CF6",
    secondaryColor: "#EEE6FE",
    enabledSteps: [2, 3, 4],
  },
];

const AssessmentNavbarWrapper = ({ children }) => {
  const { stepId, assessmentId } = useParams();
  const { data: assessment, isLoading: isAssessmentLoading } = useAssessment(
    parseInt(assessmentId)
  );
  const [assessmentName, setAssessmentName] = useState(
    assessment ? assessment.name : "Untitled Assessment"
  );
  const { mutateAsync: updateAssessment } = useUpdateAssessment();
  const selectedStep =
    stepsArray.find((step) => step.stepId === stepId)?.value || 1;
  const navigate = useNavigate();

  // For auto-resizing input
  const spanRef = useRef(null);
  const [inputWidth, setInputWidth] = useState(0);

  useEffect(() => {
    if (spanRef.current) {
      // Add a little extra for caret
      const width = Math.min(spanRef.current.offsetWidth + 10, MAX_INPUT_WIDTH);
      setInputWidth(width);
    }
  }, [assessmentName]);

  useEffect(() => {
    if (!isAssessmentLoading && assessment) {
      setAssessmentName(assessment.name);
    }
  }, [isAssessmentLoading, assessment]);

  const handleStepChange = (stepValue) => {
    // setSelectedStep(stepValue);
    if (stepValue === 1) {
      navigate(ROUTES.ASSESSMENT_CREATE);
    } else {
      const targetStep = stepsArray.find(
        (step) => step.value === stepValue
      )?.stepId;
      navigate(
        ROUTES.ASSESSMENT_EDIT.replace(":assessmentId", assessmentId).replace(
          ":stepId",
          targetStep
        )
      );
    }
  };

  const logo = (
    <div className="flex items-center relative gap-2 text-white">
      <input
        type="text"
        value={assessmentName}
        onChange={(e) => setAssessmentName(e.target.value)}
        onBlur={async () => {
          let newName;
          if (!assessmentName.trim()) {
            newName = "Untitled Assessment";
          }
          if (assessmentId) {
            await updateAssessment({
              assessmentId,
              data: { name: assessmentName.trim() || newName },
            });
          }
          if (newName) setAssessmentName(newName);
        }}
        style={{
          width: `${inputWidth}px`,
          maxWidth: `${MAX_INPUT_WIDTH}px`,
          minWidth: "50px",
          transition: "width 0s",
        }}
        className="text-white text-xl font-semibold focus:outline-none bg-transparent"
      />
      {/* Hidden span to measure text width */}
      <span
        ref={spanRef}
        className="invisible absolute whitespace-pre text-xl font-semibold"
        style={{
          padding: 0,
          margin: 0,
        }}
      >
        {assessmentName || "Untitled Assessment"}
      </span>
      <EditIcon />
    </div>
  );

  const actions = (
    <Button
      className="rounded-full bg-white text-purplePrimary hover:bg-white w-20 h-9 p-0"
      onClick={() => navigate(ROUTES.ASSESSMENT)}
    >
      Exit
    </Button>
  );

  return (
    <div className="flex flex-col">
      <Navbar logo={logo} actions={actions} />
      <div className="mt-31 mx-[116px]">
        <AssessmentContext.Provider
          value={{
            assessment,
            assessmentName,
            // setAssessmentId,
            steps: stepsArray,
            selectedStep,
            handleStepChange,
          }}
        >
          {children}
        </AssessmentContext.Provider>
      </div>
    </div>
  );
};

export default AssessmentNavbarWrapper;
export const useAssessmentContext = () => useContext(AssessmentContext);
