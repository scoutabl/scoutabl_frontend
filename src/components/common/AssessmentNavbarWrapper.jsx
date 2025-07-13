import { createContext, useContext, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAssessment } from "@/api/assessments/assessment";

const AssessmentContext = createContext();

const AssessmentNavbarWrapper = ({ children }) => {
  const [assessmentId, setAssessmentId] = useState(null);
  const { data: assessment } = useAssessment(assessmentId);
  const [selectedStep, setSelectedStep] = useState(1);
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
      <Navbar />
      <div className="mt-31 mx-[116px]">
        <AssessmentContext.Provider
          value={{
            assessment,
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
