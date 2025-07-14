import { createContext, useContext, useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  useAssessment,
  useUpdateAssessment,
} from "@/api/assessments/assessment";
import EditIcon from "@/assets/editIcon.svg?react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

const AssessmentContext = createContext();

const MAX_INPUT_WIDTH = 400; // px

const AssessmentNavbarWrapper = ({ children }) => {
  const [assessmentId, setAssessmentId] = useState(null);
  const { data: assessment } = useAssessment(assessmentId);
  const [assessmentName, setAssessmentName] = useState(
    assessment ? assessment.name : "Untitled Assessment"
  );
  const { mutateAsync: updateAssessment } = useUpdateAssessment();
  const [selectedStep, setSelectedStep] = useState(1);
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
              id: assessmentId,
              name: assessmentName.trim() || newName,
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

  const stepsArray = [
    {
      value: 1,
      name: "Basics",
      primaryColor: "#0043CE",
      secondaryColor: "#D0E2FF",
      enabled: false,
    },
    {
      value: 2,
      name: "Configure Assessment",
      primaryColor: "#806BFF",
      secondaryColor: "#EEF2FC",
      enabled: true,
    },
    {
      value: 3,
      name: "Add Custom Questions",
      primaryColor: "#27AE60",
      secondaryColor: "#E9F9F1",
      enabled: true,
    },
    {
      value: 4,
      name: "Finalize",
      primaryColor: "#F2994A",
      secondaryColor: "#FFF4E5",
      enabled: false,
    },
  ];

  return (
    <div className="flex flex-col">
      <Navbar logo={logo} actions={actions} />
      <div className="mt-31 mx-[116px]">
        <AssessmentContext.Provider
          value={{
            assessment,
            assessmentName,
            setAssessmentId,
            steps: stepsArray,
            selectedStep,
            setSelectedStep,
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
