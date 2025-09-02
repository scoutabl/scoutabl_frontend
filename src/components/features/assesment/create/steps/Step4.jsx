import React, { useState, useEffect, useRef } from "react";
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

const Step4 = () => {
  const { assessment, steps, selectedStep, handleStepChange } =
    useAssessmentContext();
  const [activeTab, setActiveTab] = useState("sequence");
  const [domains, setDomains] = useState(["gmail.com", "abc.com"]);
  const [selectedUsers, setSelectedUsers] = useState([
    "sxcscascsc",
    "scacascasc",
  ]);
  const [customQuestionLibraryOpen, setCustomQuestionLibraryOpen] = useState(false);
  const [qualifyingQuestionLibraryOpen, setQualifyingQuestionLibraryOpen] = useState(false);
  const [testLibraryOpen, setTestLibraryOpen] = useState(false);

  // Add toggle state variables
  const [showResultsToCandidates, setShowResultsToCandidates] = useState(false);
  const [addIntroVideo, setAddIntroVideo] = useState(false);
  const [collectCandidateDocuments, setCollectCandidateDocuments] = useState(false);
  const [assessmentStartDate, setAssessmentStartDate] = useState(false);
  const [domainRestriction, setDomainRestriction] = useState(false);

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
    disableCopyPaste: false, // This one starts as enabled
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

  // Section collapse state
  const [collapsedSections, setCollapsedSections] = useState({
    sequence: false,
    "essential-settings": false,
    "assessment-validity": false,
    "team-access": false,
    proctoring: false,
    legal: false,
  });

  const tabs = [
    { id: "sequence", label: "Sequence" },
    { id: "essential-settings", label: "Essential Settings" },
    { id: "assessment-validity", label: "Assessment Validity" },
    { id: "team-access", label: "Team Access" },
    { id: "proctoring", label: "Proctoring" },
    { id: "legal", label: "Legal" },
  ];

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
  }, []);

  const removeDomain = (domain) => {
    setDomains(domains.filter((d) => d !== domain));
  };

  const removeUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

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
            Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if
          </p>
          <div className="flex gap-6">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
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
                    <CustomToggleSwitch checked={showResultsToCandidates} onCheckedChange={setShowResultsToCandidates} />
                    <h3 className="text-lg font-semibold text-gray-900">Show results to candidates</h3>
                  </div>
                  <Button variant="primary" className="rounded-full px-4 py-2 text-sm">
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade
                  </Button>
                </div>
              </div>

              <div className="bg-backgroundPrimary rounded-2xl p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CustomToggleSwitch checked={addIntroVideo} onCheckedChange={setAddIntroVideo} />
                    <h3 className="text-lg font-semibold text-gray-900">Add Intro Video</h3>
                  </div>
                  <Button variant="primary" className="rounded-full px-4 py-2 text-sm">
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-6">
              <div className="bg-backgroundPrimary rounded-2xl p-5 border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CustomToggleSwitch checked={collectCandidateDocuments} onCheckedChange={setCollectCandidateDocuments} />
                    <h3 className="text-lg font-semibold text-gray-900">Collect Candidate Documents</h3>
                  </div>
                  <Button variant="primary" className="rounded-full px-4 py-2 text-sm">
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade
                  </Button>
                </div>

                <div className="bg-purple-100 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-purplePrimary mb-2">Learn About Document Hub</h4>
                  <p className="text-sm text-gray-700">
                    Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if candidates
                    satisfy the essential requirements of the job. Only if all questions are answered as required.
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex gap-5">
                    {["Resume", "Cover Letter", "Relieving Letter", "ID Proof"].map((doc) => (
                      <div key={doc} className="flex items-center gap-6 p-2 pl-4 pr-4 bg-white rounded-lg border whitespace-nowrap">
                        <Checkbox />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-5">
                    {["Contact Number", "Experience Certificate/ Letter"].map((doc) => (
                      <div key={doc} className="flex items-center gap-6 p-2 pl-4 pr-4 bg-white rounded-lg border whitespace-nowrap">
                        <Checkbox />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="primary" className="w-auto px-4 py-2 rounded-lg">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Custom File Upload
                </Button>
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
            Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if
          </p>
              </div>
              

              <Button className="bg-purplePrimary text-white rounded-full px-4 py-2 text-sm">
                <Crown className="w-4 h-4 mr-1 " />
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
                    <CustomToggleSwitch checked={assessmentStartDate} onCheckedChange={setAssessmentStartDate}/>
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
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <span className="text-gray-400">
                        Start Date & Time: DD/MM/YYYY HH:MM
                      </span>
                      <ChevronDownIcon className="w-4 h-4 ml-auto" />
                   </div>
                  
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <span className="text-gray-400">
                        End Date & Time: DD/MM/YYYY HH:MM
                      </span>
                      <ChevronDownIcon className="w-4 h-4 ml-auto" />
                 </div>
                </div>  
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
              <Button className="bg-purplePrimary text-white rounded-full px-4 py-2 text-sm">
                <Crown className="w-4 h-4 mr-1" />
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
            Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if ca, determinedetermine determine determine
          </p>
          <div className="space-y-6">
            {/* Assessment Access and Domain Restriction - Side by Side */}
            <div className="grid grid-cols-2 gap-6">
              {/* Assessment Access */}
              <div className="bg-backgroundPrimary rounded-2xl p-6 border">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Assessment Access</h3>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                    <span className="text-gray-500">Selected Users</span>
                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                      <span className="text-gray-500">Choose Users</span>
                      <ChevronDownIcon className="w-4 h-4 ml-auto" />
                    </div>
                    <div className="flex gap-2">
                      {selectedUsers.map((user) => (
                        <Badge
                          key={user}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {user}
                          <button
                            onClick={() => removeUser(user)}
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
              <div className="bg-backgroundPrimary rounded-2xl p-6 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <CustomToggleSwitch 
                      checked={domainRestriction} 
                      onCheckedChange={setDomainRestriction} 
                    />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        Domain Restriction
                      </h3>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-1 pr-2 pl-3 bg-white rounded-lg border ml-auto">
                    <span className="text-gray-500">Allowed</span>
                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                  </div>
                </div>
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
              </div>
            </div>

            {/* Time Zone - Aligned with Assessment Access width */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-backgroundPrimary rounded-2xl p-6 border">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Time Zone</h3>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                  <span className="text-gray-500">Selected Time Zone for the assessment</span>
                  <ChevronDownIcon className="w-4 h-4 ml-auto" />
                </div>
              </div>
              {/* Empty div to maintain grid structure */}
              <div></div>
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
                  Auto grade your assessments wit AI Auto grade your assessments
                  wit AIAuto grade your assessments wit AIAuto grade your
                  assessments wit AI
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {[
                    { label: "Location logging", key: "locationLogging" },
                    { label: "Webcam snapshots", key: "webcamSnapshots" },
                    { label: "Plagiarism detection", key: "plagiarismDetection" },
                    { label: "Browser extension detection", key: "browserExtensionDetection" },
                    { label: "Fullscreen mode detection", key: "fullscreenModeDetection" },
                    { label: "Mouse out tracking", key: "mouseOutTracking" },
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
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="w-10 h-8 bg-purplePrimary rounded-2xl flex items-center justify-center">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {[
                    { label: "Disable copy & Paste", key: "disableCopyPaste" },
                    { label: "IP logging", key: "ipLogging" },
                    { label: "Tab proctoring", key: "tabProctoring" },
                    { label: "Keystroke analysis", key: "keystrokeAnalysis" },
                    { label: "Screen record protection", key: "screenRecordProtection" },
                    { label: "Restrict multiple monitors", key: "restrictMultipleMonitors" },
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
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="w-10 h-8 bg-purplePrimary rounded-2xl flex items-center justify-center">
                          <Crown className="w-5 h-5 text-white" />
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
                    Auto grade your assessments wit AI Auto grade your
                    assessments wit AIAuto grade your assessments wit AIAuto
                    grade your assessments wit AI
                  </p>
                </div>
                <Button className="bg-purplePrimary text-white rounded-full px-4 py-2">
                  <Crown className="w-4 h-4 mr-1" />
                  Join Pro
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">  
                {[
                  { label: "Multiple Face Detection", key: "faceDetection" },
                  { label: "Virtual Machine Detection", key: "virtualMachineDetection" },
                  { label: "GPT Detection", key: "gptDetection" },
                  { label: "Browser fingerprinting", key: "browserFingerprinting" },
                  { label: "AI Identity Verification", key: "aiIdentityVerification" },
                ].map((feature) => (
                  <div key={feature.label} className="bg-white rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CustomToggleSwitch 
                        checked={proctoringSettings[feature.key]} 
                        onCheckedChange={() => handleProctoringToggle(feature.key)} 
                      />
                      <span className="font-medium">{feature.label}</span>
                      <HelpCircle className="w-4 h-4 opacity-70" />
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
            Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if ca, determinedetermine determine determine
          </p>
        
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Extra Time */}
              <div className="bg-backgroundPrimary rounded-2xl p-6 border h-full">
                <h3 className="text-lg font-semibold mb-2">Extra Time</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Qualifying questions are presented to candidates ahead of the
                  tests. The answers to these questions determine if ca,
                  determinedetermine determine determine
                </p>
                <div className="flex items-center gap-3 p-2 pl-3 bg-white rounded-lg border mb-4">
                  <span className="text-gray-500">Time</span>
                  <ChevronDownIcon className="w-4 h-4 ml-auto" />
                </div>
                <div className="bg-purpleQuaternary rounded-xl p-4 flex-1">
                  <p className="text-sm text-gray-700">
                    Candidates with concentration/ memory impairments Candidates
                    with concentration/ memory impairments Candidates with
                    concentration/ memory impairments Candidates with
                    concentration/ memory impairments. Candidates with
                    concentration.
                  </p>
                </div>
              </div>

              {/* Accommodation for candidates */}
              <div className="bg-backgroundPrimary rounded-2xl p-6 border h-full">
                <h3 className="text-lg font-semibold mb-2">
                  Accommodation for candidates
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Qualifying questions are presented to candidates ahead of the
                  tests. The answers to these questions determine if ca,
                  determinedetermine determine determine
                </p>
                <div className="bg-white rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-700">
                        Non fluent English speakers
                      </span>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
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
                      <HelpCircle className="w-4 h-4 text-gray-400" />
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
      <div className="flex justify-between items-center">
        <Button variant="outline" className="rounded-full px-6 py-2">
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          className="rounded-full px-6 py-2 bg-gray-300 text-gray-500  cursor-not-allowed"
          disabled
        >
          Finish
        </Button>
      </div>
    </div>
  );
};

export default Step4;
