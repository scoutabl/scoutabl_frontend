import React, { useState } from "react";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import AssessmentStep from "@/components/common/AssessmentStep";
import Section from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import AiIcon from "@/assets/AiIcon.svg?react";
import ChevronLeftIcon from "@/assets/chevronLeftIcon.svg?react";
import ChevronDownIcon from "@/assets/chevronDownIcon.svg?react";
import SquareIcon from "@/assets/SquareIcon.svg?react";
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

const Step4 = () => {
  const { assessment, steps, selectedStep, handleStepChange } =
    useAssessmentContext();
  const [activeTab, setActiveTab] = useState("essential-settings");
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

  return (
    <div className="flex flex-col gap-6">
      <EditAssessmentQuestionsPopup questionType="qualifying" open={qualifyingQuestionLibraryOpen} onOpenChange={setQualifyingQuestionLibraryOpen} />
      <EditAssessmentQuestionsPopup questionType="custom" open={customQuestionLibraryOpen} onOpenChange={setCustomQuestionLibraryOpen} />
      <EditAssessmentTestsPopup open={testLibraryOpen} onOpenChange={setTestLibraryOpen} />

      {/* Progress Section */}
      <div className="flex flex-row justify-between items-end ">
        <AssessmentStep
          steps={steps}
          selected={selectedStep}
          onSelect={handleStepChange}
        />

        {/* Pro Tip */}
        <div className="w-[500px] min-h-[92px] bg-purple-50 rounded-2xl px-4 py-4 flex items-center gap-3 border shadow-lg ml-8">
          <AiIcon className="w-4 h-4 flex-shrink-0 text-purple-600" />
          <p className="text-sm text-gray-600">
            <span className="bg-purplePrimary inline-block text-transparent bg-clip-text font-semibold">Pro Tip: </span>
             Scoutabl's AI suggests tests by matching skills in your job description with related tests.
          </p>
        </div>
      </div>

      {/* Tab Navigation - Centered */}
      <div className="flex justify-center">
        <div className="bg-white rounded-full p-2 border">
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-purplePrimary text-white"
                    : "text-gray-600 hover:text-gray-800"
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
        >
          {/* <SectionHeader number={1} title="Qualifying Questions" tooltipText="Qualifying questions are presented to candidates ahead of the tests. The answers to these questions determine if candidates satisfy the essential requirements of the job. Only if all questions are answered as required, they proceed to the tests." /> */}
          <QuestionSequenceTable
            assessmentId={assessment?.id}
            questionType="qualifying"
            onEdit={() => {}}
            minimal={false}
            headerProps={{ number: 1 }}
            secitonProps={{ variant: "default" }}
            variant="finalize"
            showSubHeader
            onAddFromLibrary={() => setQualifyingQuestionLibraryOpen(true)}
          />

          {/* Test Sequence Table */}
          <AssessmentTestSequenceTable
            minimal={false}
            headerProps={{ number: 2 }}
            secitonProps={{ variant: "default" }}
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
            secitonProps={{ variant: "default" }}
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
                    <ToggleSwitch checked={showResultsToCandidates} onCheckedChange={setShowResultsToCandidates} />
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
                    <ToggleSwitch checked={addIntroVideo} onCheckedChange={setAddIntroVideo} />
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
                    <ToggleSwitch checked={collectCandidateDocuments} onCheckedChange={setCollectCandidateDocuments} />
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
        >
          <div className="space-y-6">
            
              <div className="bg-backgroundPrimary rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ToggleSwitch checked={assessmentStartDate} onCheckedChange={setAssessmentStartDate}/>
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
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <span className="text-gray-500">Selected Users</span>
                    <ChevronDownIcon className="w-4 h-4 ml-auto" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
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
                    <ToggleSwitch 
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
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
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
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
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
          collapsable={true}
          collapsed={collapsedSections["proctoring"]}
          onToggle={() => toggleSectionCollapse("proctoring")}
        >
          <div className="space-y-6">
            {/* Basic Proctoring */}
            <div className="bg-gray-50 rounded-2xl p-6 border">
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
                    { label: "Location logging", enabled: false },
                    { label: "Webcam snapshots", enabled: false },
                    { label: "Plagiarism detection", enabled: false },
                    { label: "Browser extension detection", enabled: false },
                    { label: "Fullscreen mode detection", enabled: false },
                    { label: "Mouse out tracking", enabled: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white rounded-xl p-4 border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Toggle disabled={!item.enabled} />
                          <span className="font-medium">{item.label}</span>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        {!item.enabled && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-3 py-1"
                          >
                            <Crown className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {[
                    { label: "Disable copy & Paste", enabled: true },
                    { label: "IP logging", enabled: false },
                    { label: "Tab proctoring", enabled: false },
                    { label: "Keystroke analysis", enabled: false },
                    { label: "Screen record protection", enabled: false },
                    { label: "Restrict multiple monitors", enabled: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white rounded-xl p-4 border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Toggle disabled={!item.enabled} />
                          <span className="font-medium">{item.label}</span>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        {!item.enabled && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purplePrimary to-pink-500 text-white rounded-full px-3 py-1"
                          >
                            <Crown className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Proctoring */}
            <div className="bg-gradient-to-r from-purplePrimary via-pink-500 to-yellow-400 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Advanced Proctoring
                  </h3>
                  <p className="text-sm opacity-90">
                    Auto grade your assessments wit AI Auto grade your
                    assessments wit AIAuto grade your assessments wit AIAuto
                    grade your assessments wit AI
                  </p>
                </div>
                <Button className="bg-white text-gray-800 rounded-full px-4 py-2">
                  <Crown className="w-4 h-4 mr-1" />
                  Join Pro
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Face Detection",
                  "GPT Detection",
                  "AI Identity Verification",
                  "Virtual Machine Detection",
                  "Browser fingerprinting",
                ].map((feature) => (
                  <div key={feature} className="bg-white/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Toggle disabled={true} />
                      <span className="font-medium">{feature}</span>
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
          collapsable={true}
          collapsed={collapsedSections["legal"]}
          onToggle={() => toggleSectionCollapse("legal")}
        >
          <div className="space-y-6">
            {/* Extra Time */}
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <h3 className="text-lg font-semibold mb-2">Extra Time</h3>
              <p className="text-sm text-gray-600 mb-4">
                Qualifying questions are presented to candidates ahead of the
                tests. The answers to these questions determine if ca,
                determinedetermine determine determine
              </p>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border mb-4">
                <span className="text-gray-700">Time</span>
                <ChevronDownIcon className="w-4 h-4 ml-auto" />
              </div>
              <div className="bg-purpleQuaternary rounded-xl p-4">
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
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <h3 className="text-lg font-semibold mb-2">
                Accommodation for candidates
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Qualifying questions are presented to candidates ahead of the
                tests. The answers to these questions determine if ca,
                determinedetermine determine determine
              </p>
              <div className="bg-white rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      Non fluent English speakers
                    </span>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <Toggle />
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      Candidates with concentration/ memory impairments
                    </span>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <Toggle disabled={true} />
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
          className="rounded-full px-6 py-2 bg-gray-300 text-gray-500 cursor-not-allowed"
          disabled
        >
          Finish
        </Button>
      </div>
    </div>
  );
};

export default Step4;
