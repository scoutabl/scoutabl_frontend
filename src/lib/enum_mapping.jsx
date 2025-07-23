import { useEnums } from "@/context/EnumsContext";

export const useAssessmentCategoryNameMap = () => {
  const { resolveEnum } = useEnums();

  return {
    [resolveEnum("AssessmentCategory.SKILLS_AND_CODING")]: "Skills and Coding",
    [resolveEnum("AssessmentCategory.LIVE_CODING_CONTEST")]:
      "Live Coding Contest",
    [resolveEnum("AssessmentCategory.JOB_SIMULATION")]: "Job Simulation",
    [resolveEnum("AssessmentCategory.TAKE_HOME")]: "Take Home",
  };
};
