import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import AssessmentStep from "@/components/common/AssessmentStep";
import Section from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import AiIcon from "@/assets/AiIcon.svg?react";
import ChevronLeftIcon from "@/assets/chevronLeftIcon.svg?react";
import ChevronDownIcon from "@/assets/chevronDownIcon.svg?react";
import SquareIcon from "@/assets/squareIcon.svg?react";
import PlusIcon from "@/assets/plusIcon.svg?react";
import TrashIcon from "@/assets/trashIcon.svg?react";
import CloudIcon from "@/assets/cloudIcon.svg?react";
import FilesColored from "@/assets/filesColored.svg?react";
import { X, Crown, HelpCircle } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import EmptyState from "@/components/ui/empty-state";
import QuestionSequenceTable from "@/components/common/QuestionSequenceTable";
import AssessmentTestSequenceTable from "@/components/common/AssessmentTestSequenceTable";
import EditAssessmentQuestionsPopup from "./EditAssessmentQuestionsPopup";
import EditAssessmentTestsPopup from "./EditAssessmentTestsPopup";
import { CustomToggleSwitch } from "@/components/ui/custom-toggle-switch";
import FileIcon from "@/assets/fileIcon.svg?react";
import Dropdown from "@/components/ui/dropdown";
import { Controller, useForm } from 'react-hook-form';
import { DateTimePicker } from "@/components/ui/datetimepicker";
import { CustomTooltip } from "@/components/ui/custom-tooltip";

// Api imports
import { useUpdateAssessment } from "@/api/assessments/assessment";
import { useEnums } from "@/context/EnumsContext";
import { toast } from "sonner";
import { useUsers } from "@/api/users/users";
import UserAvatarBadge from "@/components/common/UserAvatarBadge";


// Video file MIME types and extensions
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/mkv', 'video/m4v', 'video/3gp'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.m4v', '.3gp'];
const ACCEPTED_VIDEO_TYPES = VIDEO_MIME_TYPES.join(',');



import { debounce } from "@/lib/utils";
import { useProctorSettingsMap } from "@/lib/enum_mapping";


const Step4 = () => {
  const { assessment, steps, selectedStep, handleStepChange, isAssessmentLoading } =
    useAssessmentContext();
  const [activeTab, setActiveTab] = useState("sequence");
  const [domains, setDomains] = useState(["gmail.com", "abc.com"]);
  
  // Update selectedUsers state to work with user objects
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Fetch users data
  const { data: users } = useUsers();
  const [customQuestionLibraryOpen, setCustomQuestionLibraryOpen] = useState(false);
  const [qualifyingQuestionLibraryOpen, setQualifyingQuestionLibraryOpen] = useState(false);
  const [testLibraryOpen, setTestLibraryOpen] = useState(false);

  // Toggle state variables
  const [ishowResultsToCandidatesEnabled, setshowResultsToCandidatesEnabled] = useState(false);
  const [isaddIntroVideoEnabled, setAddIntroVideoEnabled] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [iscollectCandidateDocumentsEnabled, setcollectCandidateDocumentsEnabled] = useState(false);
  const [isAssessmentStartDateEnabled, setAssessmentStartDateEnabled] = useState(false);
  const [isdomainRestrictionEnabled, setdomainRestrictionEnabled] = useState(false);
  const [status, setStatus] = useState("allowed"); 
  const [dropdownKey, setDropdownKey] = useState(0);
  const [assessmentDescription, setAssessmentDescription] = useState();

  // State variables for date/time
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [extraTime, setExtraTime] = useState(0);

  // state variables
  const [videoLinkValue, setVideoLinkValue] = useState("");
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]);

  // Add handlers for document checkboxes
  const handleDocumentTypeToggle = (docType) => {
    setSelectedDocumentTypes(prev => {
      if (prev.includes(docType)) {
        return prev.filter(type => type !== docType);
      } else {
        return [...prev, docType];
      }
    });
  };

  useEffect(() => {
    if (!isAssessmentLoading) {
      // Existing fields
      setAssessmentDescription(assessment?.description);
      setAssessmentStartDateEnabled(assessment?.enable_time_restrictions);
      setStartDate(assessment?.start_date ? new Date(assessment.start_date) : null);
      setEndDate(assessment?.end_date ? new Date(assessment.end_date) : null);
      setExtraTime(assessment?.extra_time_percentage_for_tests || 0);
      
      // Add missing fields from API payload
      setshowResultsToCandidatesEnabled(assessment?.email_candidate_results || false);
      setcollectCandidateDocumentsEnabled(assessment?.enable_collect_documents || false);
      setdomainRestrictionEnabled(assessment?.enable_domain_restrictions || false);
      
      // Load domain restrictions
      if (assessment?.domain_restrictions) {
        setDomains(assessment.domain_restrictions);
      }
      
      // Load domain restriction type (0 = allowed, 1 = disallowed)
      if (assessment?.domain_restriction_type !== undefined) {
        setStatus(assessment.domain_restriction_type === 0 ? "allowed" : "disallowed");
      }
      
      // Load proctoring settings
      if (assessment?.proctor_settings?.settings) {
        const enabledSettings = assessment.proctor_settings.settings;
        // Ensure enabledSettings is an array
        const settingsArray = Array.isArray(enabledSettings) ? enabledSettings : [];
        
        setProctoringSettings(prev => {
          const newSettings = { ...prev };
          // Map API enum values back to local state keys
          Object.keys(prev).forEach(key => {
            const enumValue = proctorSettingsMap[key];
            if (enumValue !== null && enumValue !== undefined) {
              const numericValue = typeof enumValue === 'string' ? parseInt(enumValue, 10) : enumValue;
              newSettings[key] = settingsArray.includes(numericValue);
            }
          });
          return newSettings;
        });
      }
      
      // Load legal settings
      setLegalSettings({
        nonFluentEnglishSpeakers: assessment?.enable_accomadation_for_nonenglish || false,
        concentrationMemoryImpairments: assessment?.enable_accomadation_for_disabled || false,
      });
      
      // Load missing fields with correct backend field names
      setAddIntroVideoEnabled(assessment?.intro_screen ? true : false);
      setVideoLinkValue(assessment?.intro_screen || "");
      setSelectedDocumentTypes(assessment?.collect_document_types || []);
      setSelectedUsers(assessment?.moderators || []);
    }
  }, [
    isAssessmentLoading, 
    assessment?.description, 
    assessment?.enable_time_restrictions, 
    assessment?.start_date, 
    assessment?.end_date, 
    assessment?.extra_time_percentage_for_tests,
    assessment?.email_candidate_results,
    assessment?.enable_collect_documents,
    assessment?.enable_domain_restrictions,
    assessment?.domain_restrictions,
    assessment?.domain_restriction_type,
    assessment?.proctor_settings,
    assessment?.enable_accomadation_for_nonenglish,
    assessment?.enable_accomadation_for_disabled,
    assessment?.intro_screen,
    assessment?.collect_document_types,
    assessment?.moderators
  ]);

  // Proctoring toggle state variables
  const [proctoringSettings, setProctoringSettings] = useState({
    // Basic Proctoring - Left Column
    locationLogging: false,
    webcamSnapshots: false,
    plagiarismDetection: false,
    browserExtensionDetection: false,
    fullscreenModeDetection: false,
    mouseOutTracking: false,
    
    // Basic Proctoring - Right Column
    disableCopyPaste: false,
    ipLogging: false,
    tabProctoring: false,
    keystrokeAnalysis: false,
    screenRecordProtection: false,
    restrictMultipleMonitors: false,
    
    // Advanced Proctoring - All enabled and working
    faceDetection: false,
    gptDetection: false,
    aiIdentityVerification: false,
    virtualMachineDetection: false,
    browserFingerprinting: false,
  });

  // Legal section toggle state variables
  const [legalSettings, setLegalSettings] = useState({
    nonFluentEnglishSpeakers: false,
    concentrationMemoryImpairments: false,
  });

  // Api imports
  const { mutateAsync: updateAssessment, isPending: isUpdating } = useUpdateAssessment();
  const { resolveEnum, enums } = useEnums();
  const proctorSettingsMap = useProctorSettingsMap();

 
// Section collapse state
  const [collapsedSections, setCollapsedSections] = useState({
    sequence: false,
    "essential-settings": false,
    "assessment-validity": false,
    "team-access": false,
    proctoring: false,
    legal: false,
  });

  const tabs = useMemo(() => [
    { id: "sequence", label: "Sequence" },
    { id: "essential-settings", label: "Essential Settings" },
    { id: "assessment-validity", label: "Assessment Validity" },
    { id: "team-access", label: "Team Access" },
    { id: "proctoring", label: "Proctoring" },
    { id: "legal", label: "Legal" },
  ], []);

  // Initialize React Hook Form
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      extraTime: 10, // Default value for extra time
    }
  });

  // Navigation handlers
  const handleBack = () => {
    const currentStepIndex = steps.findIndex((s) => s.value === selectedStep);
    if (currentStepIndex > 0) {
      const previousStep = steps[currentStepIndex - 1];
      handleStepChange(previousStep.value);
    }
  };

  // Add scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs.map(tab => document.getElementById(tab.id));
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      // Find which section is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveTab(tabs[i].id);
            break;
          }
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabs]);

  const removeDomain = (domain) => {
    setDomains(domains.filter((d) => d !== domain));
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleDescriptionChange = useCallback((e) => {
    setAssessmentDescription(e.target.value);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleSectionCollapse = (sectionId) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Proctoring toggle handlers
  const handleProctoringToggle = (settingName) => {
    setProctoringSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
  };

  // Legal section toggle handlers
  const handleLegalToggle = (settingName) => {
    setLegalSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is video format
      const isValidVideoType = VIDEO_MIME_TYPES.includes(file.type) || 
        VIDEO_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isValidVideoType) {
        // Check file size (10MB limit for video files)
        if (file.size <= 10 * 1024 * 1024) {
          setUploadedFile(file);
          setFileError("");
        } else {
          setFileError("File size must be less than 10MB");
        }
      } else {
        setFileError("Please upload only video format files (MP4, WebM, MOV, AVI, etc.)");
      }
    }
  };

  // Remove uploaded file
  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFileError("");
  };

  // Form submission handler
  const handleFormSubmit = async () => {
    try {
    
        // Use resolveEnum to get the correct enum values for proctor settings
    const enabledToggles = {};
    Object.keys(proctoringSettings).forEach(key => {
      if (proctoringSettings[key] === true) {
        const enumValue = proctorSettingsMap[key];
        console.log(`Proctor setting ${key}:`, enumValue, typeof enumValue); // Debug log
        if (enumValue !== null && enumValue !== undefined) {
          // Ensure the value is a number, not a string
          const numericValue = typeof enumValue === 'string' ? parseInt(enumValue, 10) : enumValue;
          if (!isNaN(numericValue)) {
            enabledToggles[numericValue.toString()] = true;
          }
        }
      }
    });

console.log("Enabled toggles:", enabledToggles, "Type:", typeof enabledToggles[0]); // Debug log
      // Prepare data for API
      const apiData = {
        // Essential Settings
        description: assessmentDescription,
        email_candidate_results: ishowResultsToCandidatesEnabled,
        enable_collect_documents: iscollectCandidateDocumentsEnabled,
        
        // Intro Video
        intro_screen: isaddIntroVideoEnabled ? videoLinkValue : null,
        
        // Assessment Validity
        enable_time_restrictions: isAssessmentStartDateEnabled,
        start_date: startDate,
        end_date: endDate,
        
        // Domain Restrictions
        enable_domain_restrictions: isdomainRestrictionEnabled,
        domain_restriction_type: status === "allowed" ? 0 : 1,
        domain_restrictions: domains,
        
        // Team Access
        moderators: selectedUsers.map(user => user.id),
        
        // Document Collection
        collect_document_types: selectedDocumentTypes,
        
        // Proctoring Settings
        proctor_settings: {
          settings: enabledToggles
        },
        
        // Legal Settings
        enable_accomadation_for_disabled: legalSettings.concentrationMemoryImpairments,
        enable_accomadation_for_nonenglish: legalSettings.nonFluentEnglishSpeakers,
        extra_time_percentage_for_tests: extraTime || 0
      };

      console.log("Sending data:", apiData);

      await updateAssessment({
        assessmentId: assessment?.id,
        data: apiData
      });

      toast.success("Assessment settings saved successfully!");
      
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <EditAssessmentQuestionsPopup questionType="qualifying" open={qualifyingQuestionLibraryOpen} onOpenChange={setQualifyingQuestionLibraryOpen} />
      <EditAssessmentQuestionsPopup questionType="custom" open={customQuestionLibraryOpen} onOpenChange={setCustomQuestionLibraryOpen} />
      <EditAssessmentTestsPopup open={testLibraryOpen} onOpenChange={setTestLibraryOpen} />

      {/* Progress Section */}
      <div className="flex flex-row justify-between items-end  ">
        <AssessmentStep
          steps={steps}
          selected={selectedStep}
          onSelect={handleStepChange}
        />

        {/* Pro Tip */}
        <div className="w-[500px] min-h-[92px] bg-purple-50 rounded-2xl px-4 py-4 flex items-center gap-3 border shadow-md ml-8">
          <AiIcon className="w-4 h-4 flex-shrink-0 text-purple-600" />
          <p className="text-sm text-gray-600">
            <span className="bg-purplePrimary inline-block text-transparent bg-clip-text font-semibold">Pro Tip: </span>
             Scoutabl's AI suggests tests by matching skills in your job description with related tests.
          </p>
        </div>
      </div>

      {/* Tab Navigation - Centered */}
      <div className="flex justify-center sticky top-0 z-10 bg-backgroundPrimary py-2">
        <div className="bg-white rounded-full p-2 border shadow-sm">
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-purplePrimary text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area - All Sections Visible */}
      <div className="space-y-6">
        {/* Sequence Section */}
        <Section
          id="sequence"
          variant="white"
          header="Sequence"
          collapsable={true}
          collapsed={collapsedSections["sequence"]}
          onToggle={() => toggleSectionCollapse("sequence")}
          contentClassName="flex flex-col gap-10"
          className="shadow-lg"
        >
          {/* <SectionHeader number={1} title="Qualifying Questions" tooltipText="Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if candidates satisfy the essential requirements of the job. Only if all questions are answered as required, they proceed to the tests." /> */}
          <QuestionSequenceTable
            assessmentId={assessment?.id}
            questionType="qualifying"
            onEdit={() => {}}
            minimal={false}
            headerProps={{ number: 1 }}
            secitonProps={{ variant: "primary" }}
            variant="finalize"
            showSubHeader
            onAddFromLibrary={() => setQualifyingQuestionLibraryOpen(true)}
          />

          {/* Test Sequence Table */}
          <AssessmentTestSequenceTable
            minimal={false}
            headerProps={{ number: 2 }}
            secitonProps={{ variant: "primary" }}
            variant="finalize"
            showSubHeader
            onAddFromLibrary={() => setTestLibraryOpen(true)}
          />

          <QuestionSequenceTable
            assessmentId={assessment?.id}
            questionType="custom"
            onEdit={() => {}}
            minimal={false}
            headerProps={{ number: 3 }}
            secitonProps={{ variant: "primary" }}
            variant="finalize"
            showSubHeader
            onAddFromLibrary={() => setCustomQuestionLibraryOpen(true)}
          />
        </Section>

        {/* Essential Settings Section */}
        <Section
          id="essential-settings"
          header="Essential Settings"
          collapsable={true}
          collapsed={collapsedSections["essential-settings"]}
          onToggle={() => toggleSectionCollapse("essential-settings")}
          variant="white"
          className="shadow-lg"
        >
          <p className="text-sm text-gray-600 mb-4">
          The Essential Settings section provides configuration options for defining the core parameters, operational behavior, and system-level controls of your assessment.
          </p>
          <div className="flex gap-6 items-start">
            {/* Left Column */}
            <div className="w-1/2 space-y-6">
              <div className="bg-backgroundPrimary rounded-2xl border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <SquareIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Assessment Description</h3>
                </div>
                <div className="relative">
                  <Textarea
                    placeholder="Software Developer"
                    value={assessmentDescription}
                    onChange={handleDescriptionChange}
                    className="w-full min-h-[95px] bg-white border rounded-md resize-none focus:ring-0 focus:outline-none p-3 pr-24"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button variant="outline" size="sm" className="text-purplePrimary border-transparent hover:bg-purple-50">
                      <AiIcon className="w-4 h-4 mr-1" />
                      Write with AI
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-backgroundPrimary rounded-2xl p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CustomToggleSwitch checked={ishowResultsToCandidatesEnabled} onCheckedChange={setshowResultsToCandidatesEnabled} />
                    <h3 className="text-lg font-semibold text-gray-900">Show results to candidates</h3>
                  </div>
                  <Button className="rounded-full px-4 py-2 text-sm bg-purpleUpgrade text-black border-purplePrimary">
                    <Crown className="w-4 h-4 mr-1 text-purplePrimary fill-purplePrimary " />
                    Upgrade
                  </Button>
                </div>
              </div>

              <div className="bg-backgroundPrimary rounded-2xl p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CustomToggleSwitch checked={isaddIntroVideoEnabled} onCheckedChange={setAddIntroVideoEnabled} />
                    <h3 className="text-lg font-semibold text-gray-900">Add Intro Video</h3>
                  </div>
                
                  <Button className="rounded-full px-4 py-2 text-sm bg-purpleUpgrade text-black border-purplePrimary">
                  <Crown className="w-4 h-4 mr-1 text-purplePrimary fill-purplePrimary " />
                    Upgrade
                  </Button>
                 
                </div>
                
                {/* Collapsible content for Add Intro Video */}
                {isaddIntroVideoEnabled && (
                  <div className="mt-4 space-y-4">
                    {/* Video Link Input */}
                    
                      <Input className="bg-white rounded-lg p-3 h-[37px] border"
                        placeholder="Paste a link to your video"
                       
                      />
                    
                    
                    {/* Or separator */}
                    <div className="text-center">
                      <span className="text-gray-500 text-sm">(or)</span>
                    </div>
                    
                    {/* File Upload Area */}
                    <div className="bg-white rounded-lg p-3 border-2 border-dashed border-gray-300 hover:border-purplePrimary transition-colors">
                      <input
                        type="file"
                        accept={ACCEPTED_VIDEO_TYPES}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-9 h-9 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">Upload Video file</p>
                              <p className="text-sm text-gray-500">Drag & Drop Video file here</p>
                              
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">Max: 10 Mb</span>
                        </div>
                      </label>
                    </div>

                    {/* Error Message */}
                    {fileError && (
                      <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                        {fileError}
                      </div>
                    )}
                    
                    {/* Uploaded File Display (if any) */}
                    {uploadedFile && (
                      <div className="bg-white rounded-lg p-2 border w-1/2">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-0.5">
                             <FileIcon className="w-5 h-5 text-blue-600" />
                             <span className="text-sm text-gray-900">{uploadedFile.name}</span>
                             <span className="text-gray-400">•</span>
                             <a className="text-blue-500 text-sm hover:underline">Preview</a>
                             <span className="text-gray-400">•</span>
                             <span className="text-sm text-gray-500">{(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB</span>
                           </div>
                           <button 
                             onClick={removeUploadedFile}
                             className="text-gray-400 hover:text-black transition-colors"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="w-1/2 space-y-6">
              <div className="bg-backgroundPrimary rounded-2xl p-5 border">
                <div className="flex items-center justify-between mb-4 ">
                  <div className="flex items-center gap-3">
                    <CustomToggleSwitch checked={iscollectCandidateDocumentsEnabled} onCheckedChange={setcollectCandidateDocumentsEnabled} />
                    <h3 className="text-lg font-semibold text-gray-900">Collect Candidate Details</h3>
                  </div>
                  <Button className="rounded-full px-4 py-2 text-sm bg-purpleUpgrade text-black border-purplePrimary">
                    <Crown className="w-4 h-4 mr-1 text-purplePrimary fill-purplePrimary " />
                    Upgrade
                  </Button>
                </div>
              
                 <div className="mt-4 space-y-4">
                <div className="bg-purple-100 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-purplePrimary mb-2">Learn About Document Hub</h4>
                  <p className="text-sm text-gray-700">
                    Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if candidates
                    satisfy the essential requirements of the job. Only if all questions are answered as required.
                  </p>
                </div>

                {iscollectCandidateDocumentsEnabled && (
                  <div>
                  <div className="flex gap-5">
                    {["Resume", "Cover Letter", "Relieving Letter", "ID Proof"].map((doc) => (
                      <div key={doc} className="flex items-center gap-2 p-2 pl-2 pr-2 mb-2 bg-white rounded-lg border whitespace-nowrap">
                        <Checkbox />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-5">
                    {["Contact Number", "Experience Certificate/ Letter"].map((doc) => (
                      <div key={doc} className="flex items-center gap-2 p-2 pl-2 pr-2 mb-4 bg-white rounded-lg border whitespace-nowrap">
                        <Checkbox />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                

                <Button variant="primary" className="w-auto px-4 py-2  rounded-lg">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Custom File Upload
                </Button>
                </div>
                )}
              </div>
             
              </div>
               
            </div>
          </div>
        </Section>

        {/* Assessment Validity Section */}
        <Section
          id="assessment-validity"
          variant="white"
          header={
            <div className="flex items-center justify-between w-full ">
              <div>
              <h2 className="text-xl font-semibold">Assessment Validity</h2>
              <p className="text-sm text-gray-600 mb-1 mt-3">
                The Assessment Validity section allows you to set the duration and expiration of your assessment. This is recommended if inviting candidates using link share & integration.
               </p>
              </div>
                        <Button className="rounded-full px-4 py-2 text-sm bg-purpleUpgrade text-black border-purplePrimary">
                    <Crown className="w-4 h-4 mr-1 text-purplePrimary fill-purplePrimary " />
                Upgrade
              </Button>
            </div>
          }
          collapsable={true}
          collapsed={collapsedSections["assessment-validity"]}
          onToggle={() => toggleSectionCollapse("assessment-validity")}
          className="shadow-lg"
        >
          <div className="space-y-6">
            
              <div className="bg-backgroundPrimary rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CustomToggleSwitch checked={isAssessmentStartDateEnabled} onCheckedChange={setAssessmentStartDateEnabled}/>
                    <h3 className="text-lg font-semibold">
                      Assessment Start and End Date
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Set an exact date and time for the assessment to expire. This
                  option is recommended if inviting candidates using link share &
                  integration. Candidates who are in progress when the assessment
                  expires can finish.
                </p>
                {isAssessmentStartDateEnabled && (
                <div className="flex items-center gap-3">
                 <DateTimePicker 
                  className="w-full"
                  placeholder="Select Start Date & Time"
                  value={startDate}
                  onChange={setStartDate}
                 />
                
                 <DateTimePicker 
                  className="w-full"
                  placeholder="Select End Date & Time"
                  value={endDate}
                  onChange={setEndDate}
                 />
                </div>  
                )}
              </div>
            </div>
          
        </Section>

        {/*Access Section */}
        <Section
          id="team-access"
          variant="white"
          header={
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">Access</h2>
              <Button className="rounded-full px-4 py-2 text-sm bg-purpleUpgrade text-black border-purplePrimary ">
              <Crown className="w-4 h-4 mr-1 text-purplePrimary fill-purplePrimary " />
                Join Pro
              </Button>
            </div>
          }
          collapsable={true}
          collapsed={collapsedSections["team-access"]}
          onToggle={() => toggleSectionCollapse("team-access")}
          className="shadow-lg"
        >
          
          <p className="text-sm text-gray-600 mb-4">
            The Access section allows you to control who can access your assessment. You can restrict access to specific domains or users.
          </p>

          <div className="space-y-6">
            {/* Assessment Access and Domain Restriction - Independent Components */}
            <div className="flex gap-6 items-start">
              {/* Assessment Access */}
              <div className="w-1/2 bg-backgroundPrimary rounded-2xl p-6 border">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">Assessment Access</h3>
                    <CustomTooltip message="Select the users who can access the assessment." />
                </div>
                <div className="space-y-4">
                  <Dropdown
                    backgroundColor="white"
                    name="Select Users"
                    variant="squareLight"
                    multiselect
                    rightCheckbox
                    clearable
                    searchable
                    showSelectAll
                    currentValue={selectedUsers.map(user => user.id)}
                    options={[
                      ...(users || []).map((user) => ({
                        display: user.username,
                        value: user.id,
                        user,
                      })),
                    ]}
                    onChange={(selectedUserIds) => {
                      if (selectedUserIds === null || selectedUserIds.length === 0) {
                        setSelectedUsers([]);
                      } else {
                        const selectedUserObjects = users?.filter(user => 
                          selectedUserIds.includes(user.id)
                        ) || [];
                        setSelectedUsers(selectedUserObjects);
                      }
                    }}
                    renderOption={({ user, display, isDefault }) =>
                      isDefault ? (
                        display
                      ) : (
                        <UserAvatarBadge
                          user={user}
                          className="gap-3 py-2"
                          iconClassName="w-10 h-10"
                        />
                      )
                    }
                    className="w-full"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      {selectedUsers.map((user) => (
                        <Badge
                          key={user.id}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {user.username}
                          <button
                            onClick={() => removeUser(user.id)}
                            className="ml-2"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Domain Restriction */}
              <div className="w-1/2 bg-backgroundPrimary rounded-2xl p-4 border">
                <div className="flex items-center items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <CustomToggleSwitch 
                      checked={isdomainRestrictionEnabled} 
                      onCheckedChange={setdomainRestrictionEnabled} 
                    />
                    <div className="flex items-center gap-2 mt-1  ml-1">
                      <h3 className="text-lg font-semibold">
                        Domain Restriction
                      </h3>
                      <CustomTooltip message="Select the domains who can access the assessment." />
                  </div>
                </div>
                
                {isdomainRestrictionEnabled && (
                    <div className="flex items-center text-gray-500 gap-3 p-1.5  bg-white rounded-lg border ml-auto">
                      <Dropdown
                        key={dropdownKey}
                        options={[{display: "Allowed", value: "allowed"}, {display: "Disallowed", value: "disallowed"}]}
                        onChange={(value) => {
                          setStatus(value);
                          setDropdownKey(prev => prev + 1); 
                        }}
                        currentValue={status}
                        className="w-30 h-6 text-m p-1 gap-0 "
                        style={{ background: "P", color: "inherit" }}
                      />
                    </div>
                  )}
                    </div>
                    
                {isdomainRestrictionEnabled && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                        <span className="text-gray-500">Selected Users</span>
                      </div>
                      <div className="flex gap-2">
                        {domains.map((domain) => (
                          <Badge
                            key={domain}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {domain}
                            <button
                              onClick={() => removeDomain(domain)}
                              className="ml-2"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            
          </div>
          
        </Section>

        {/* Proctoring Section */}
        <Section
          id="proctoring"
          header="Proctoring"
          variant="white"
          collapsable={true}
          collapsed={collapsedSections["proctoring"]}
          onToggle={() => toggleSectionCollapse("proctoring")}
          className="shadow-lg"
        >
          <p className="text-sm text-gray-600 mb-4">
            Auto grade your assessments wit AI Auto grade your assessments
            wit AIAuto grade your assessments wit AIAuto grade your
            assessments wit AI
          </p>
          <div className="space-y-6">
            {/* Basic Proctoring */}
            <div className="bg-backgroundPrimary rounded-2xl p-6 border">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Basic Proctoring</h3>
                <p className="text-sm text-gray-600">
                 Basic proctoring helps maintain the integrity of your assessment by detecting cheating and ensuring fair participation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {[
                    { 
                      label: "Location logging", 
                      key: "locationLogging",
                      tooltip: "Tracks and logs the geographical location of candidates during the assessment to ensure they are taking the test from an authorized location."
                    },
                    { 
                      label: "Webcam snapshots", 
                      key: "webcamSnapshots",
                      tooltip: "Takes periodic snapshots using the candidate's webcam to monitor their presence and behavior during the assessment."
                    },
                    { 
                      label: "Plagiarism detection", 
                      key: "plagiarismDetection",
                      tooltip: "Automatically scans submitted answers against a database to detect potential plagiarism and copied content."
                    },
                    { 
                      label: "Browser extension detection", 
                      key: "browserExtensionDetection",
                      tooltip: "Detects and blocks suspicious browser extensions that could be used for cheating or accessing unauthorized resources."
                    },
                    { 
                      label: "Fullscreen mode detection", 
                      key: "fullscreenModeDetection",
                      tooltip: "Monitors if candidates switch out of fullscreen mode, which could indicate they are accessing other applications."
                    },
                    { 
                      label: "Mouse out tracking", 
                      key: "mouseOutTracking",
                      tooltip: "Tracks when the mouse cursor leaves the assessment window, which could indicate switching to other applications."
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white rounded-xl p-4 border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CustomToggleSwitch 
                            checked={proctoringSettings[item.key]} 
                            onCheckedChange={() => handleProctoringToggle(item.key)} 
                          />
                          <span className="font-medium">{item.label}</span>
                          <CustomTooltip message={item.tooltip} />
                        </div>
                        <div className="w-10 h-8 bg-purpleUpgrade rounded-2xl flex items-center justify-center">
                          <Crown className="w-5 h-5 text-purplePrimary fill-purplePrimary " />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {[
                    { 
                      label: "Disable copy & Paste", 
                      key: "disableCopyPaste",
                      tooltip: "Prevents candidates from copying content from the assessment or pasting external content into their answers."
                    },
                    { 
                      label: "IP logging", 
                      key: "ipLogging",
                      tooltip: "Records the IP address of candidates to track their network location and detect potential proxy usage or location changes."
                    },
                    { 
                      label: "Tab proctoring", 
                      key: "tabProctoring",
                      tooltip: "Monitors browser tab activity to detect when candidates switch to other tabs or open new windows during the assessment."
                    },
                    { 
                      label: "Keystroke analysis", 
                      key: "keystrokeAnalysis",
                      tooltip: "Analyzes typing patterns and keystroke dynamics to detect unusual behavior or potential use of automated tools."
                    },
                    { 
                      label: "Screen record protection", 
                      key: "screenRecordProtection",
                      tooltip: "Prevents candidates from taking screenshots or recording their screen during the assessment to protect content security."
                    },
                    { 
                      label: "Restrict multiple monitors", 
                      key: "restrictMultipleMonitors",
                      tooltip: "Detects and restricts the use of multiple monitors to prevent candidates from viewing content on secondary screens."
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white rounded-xl p-4 border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CustomToggleSwitch 
                            checked={proctoringSettings[item.key]} 
                            onCheckedChange={() => handleProctoringToggle(item.key)} 
                          />
                          <span className="font-medium">{item.label}</span>
                          <CustomTooltip message={item.tooltip} />
                        </div>
                        <div className="w-10 h-8 bg-purpleUpgrade rounded-2xl flex items-center justify-center">
                        <Crown className="w-5 h-5 text-purplePrimary fill-purplePrimary " />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Proctoring */}
            <div className="bg-gradient-to-tr from-[#4158D0]/25 via-[#C850C0]/25 to-[#FFCC70]/25 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    Advanced Proctoring
                  </h3>
                  <p className="text-sm opacity-90 text-gray-700">
                     Advanced proctoring helps maintain the integrity of your assessment by detecting cheating and ensuring fair participation.
                  </p>
                </div>
                <Button className="rounded-full px-4 py-2 text-sm bg-purpleUpgrade text-black border-purplePrimary">
                <Crown className="w-4 h-4 mr-1 text-purplePrimary fill-purplePrimary " />
                  Join Pro
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">  
                {[
                  { 
                    label: "Multiple Face Detection", 
                    key: "faceDetection",
                    tooltip: "Uses advanced AI to detect multiple faces in the webcam feed, alerting when unauthorized persons are present during the assessment."
                  },
                  { 
                    label: "Virtual Machine Detection", 
                    key: "virtualMachineDetection",
                    tooltip: "Detects if the candidate is using a virtual machine or emulated environment, which could indicate attempts to bypass security measures."
                  },
                  { 
                    label: "GPT Detection", 
                    key: "gptDetection",
                    tooltip: "Analyzes written responses using AI to detect if answers were generated by language models like ChatGPT or other AI writing tools."
                  },
                  { 
                    label: "Browser fingerprinting", 
                    key: "browserFingerprinting",
                    tooltip: "Creates a unique fingerprint of the candidate's browser and system to detect if multiple people are using the same device."
                  },
                  { 
                    label: "AI Identity Verification", 
                    key: "aiIdentityVerification",
                    tooltip: "Uses facial recognition and biometric analysis to verify the candidate's identity throughout the assessment process."
                  },
                ].map((feature) => (
                  <div key={feature.label} className="bg-white rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CustomToggleSwitch 
                        checked={proctoringSettings[feature.key]} 
                        onCheckedChange={() => handleProctoringToggle(feature.key)} 
                      />
                      <span className="font-medium">{feature.label}</span>
                      <CustomTooltip message={feature.tooltip} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Legal Section */}
        <Section
          id="legal"
          header="Legal"
          variant="white"
          collapsable={true}
          collapsed={collapsedSections["legal"]}
          onToggle={() => toggleSectionCollapse("legal")}
          className="shadow-lg"
        >
          <p className="text-sm text-gray-600 mb-4">
            The Legal section allows you to configure legal settings for your assessment. You can provide extra time for candidates with specific needs.
          </p>
        
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Extra Time */}
              <div className="bg-backgroundPrimary rounded-2xl p-6 border h-full">
                <h3 className="text-lg font-semibold mb-2 pl-2">Extra Time</h3>
                <div className="flex flex-row gap-4">
                <p className="text-sm text-gray-600 mb-4 pl-2">
                Provide extra time for candidates with specific needs. This will be added to the total time of the assessment.
                </p>
                 
                <Controller
                  name="extraTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                        {...field}
                        type="number"
                        placeholder='120 Min'
                        className='px-3 py-2 max-h-10 max-w-[114px] text-base font-medium text-greyAccent bg-white rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none border-0 rounded-xl'
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          setExtraTime(Number(e.target.value));
                        }}
                    />
                  )}
                 />
                  
                </div>
                <div className="bg-purpleQuaternary rounded-xl p-4 flex-1">
                  <p className="text-sm text-gray-700">
                    Candidates with concentration/ memory impairments are eligible for accommodation. This will be added to the total time of the assessment. This is recommended for users with specific needs to maintain the integrity of the assessment.
                    
                  </p>
                </div>
              </div>

              {/* Accommodation for candidates */}
              <div className="bg-backgroundPrimary rounded-2xl p-6 border h-full">
                <h3 className="text-lg font-semibold mb-2">
                  Accommodation for candidates
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                Provide accommodation for candidates with specific needs.
                </p>
                <div className="bg-white rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-700">
                        Non fluent English speakers
                      </span>
                      <CustomTooltip message="Non fluent English speakers are eligible for accommodation." />
                    </div>
                    <CustomToggleSwitch 
                      checked={legalSettings.nonFluentEnglishSpeakers}  
                      onCheckedChange={() => handleLegalToggle("nonFluentEnglishSpeakers")} 
                    />
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-700">
                        Candidates with concentration/ memory impairments
                      </span>
                      <CustomTooltip message="Candidates with concentration/ memory impairments are eligible for accommodation." />
                    </div>
                    <CustomToggleSwitch 
                      checked={legalSettings.concentrationMemoryImpairments} 
                      onCheckedChange={() => handleLegalToggle("concentrationMemoryImpairments")} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pb-6">
        <Button 
        variant="back"
        effect="shineHover"
        onClick={handleBack}
        >
        <ChevronLeftIcon />
          Back
        </Button>
        <Button
          variant="next"
          effect="shineHover"
          onClick={handleFormSubmit}
          disabled={isUpdating}
          className="rounded-full bg-purplePrimary text-white"
        >
          {isUpdating ? "Saving..." : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default Step4;
