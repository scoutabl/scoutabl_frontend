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

// Proctor settings mapping using resolveEnum
export const useProctorSettingsMap = () => {
  const { resolveEnum, enums, enumsLoading } = useEnums();

  // Don't resolve enums until they're loaded
  if (enumsLoading || !enums) {
    return {};
  }

  return {
    // Basic Proctoring - Left Column
    locationLogging: resolveEnum("ProctorSetting.LOCATION_LOGGING"),
    webcamSnapshots: resolveEnum("ProctorSetting.WEBCAM_SNAPSHOTS"),
    plagiarismDetection: resolveEnum("ProctorSetting.PLAGIARISM_DETECTION"),
    browserExtensionDetection: resolveEnum("ProctorSetting.BROWSER_EXTENSION_DETECTION"),
    fullscreenModeDetection: resolveEnum("ProctorSetting.FULL_SCREEN_MODE"),
    mouseOutTracking: resolveEnum("ProctorSetting.MOUSE_OUT_DETECTION"),
    
    // Basic Proctoring - Right Column
    disableCopyPaste: resolveEnum("ProctorSetting.DISABLE_COPY_PASTE"),
    ipLogging: resolveEnum("ProctorSetting.IP_LOGGING"),
    tabProctoring: resolveEnum("ProctorSetting.TAB_SWITCH_DETECTION"),
    keystrokeAnalysis: resolveEnum("ProctorSetting.KEYSTROKE_LOGGING"),
    screenRecordProtection: resolveEnum("ProctorSetting.SCREEN_RECORDING"),
    restrictMultipleMonitors: resolveEnum("ProctorSetting.MULTIPLE_MONITOR_DETECTION"),
    
    // Advanced Proctoring
    faceDetection: resolveEnum("ProctorSetting.MULTIPLE_FACE_DETECTION"),
    gptDetection: resolveEnum("ProctorSetting.GPT_DETECTION"),
    aiIdentityVerification: resolveEnum("ProctorSetting.AI_IDENTITY_VERIFICATION"),
    virtualMachineDetection: resolveEnum("ProctorSetting.VM_DETECTION"),
    browserFingerprinting: resolveEnum("ProctorSetting.BROWSER_FINGERPRINTING"),
  };
};
