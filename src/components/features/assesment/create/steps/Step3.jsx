import React, { useState } from "react";

import QuestionCards from "./step3-customQuestions/QuestionCards";
import QuestionSequenceTable from "@/components/common/QuestionSequenceTable";
import QuestionModal from "./step3-customQuestions/QuestionModal";

import AssessmentStep from "@/components/common/AssessmentStep";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";

import { Button } from "@/components/ui/button";
import AiIcon from "@/assets/AiIcon.svg?react";
import ChevronLeftIcon from "@/assets/chevronLeftIcon.svg?react";
import ChevronRightIcon from "@/assets/chevronRightIcon.svg?react";
import EditAssessmentQuestionsPopup from "./EditAssessmentQuestionsPopup";

// -------------------------------------------------------------
// Step-3 – Add Custom Questions
// -------------------------------------------------------------
// After refactor, all question-list logic lives inside the reusable
// <QuestionSequenceTable />.  This file now focuses on high-level
// flow (wizard nav, selecting question type, opening the modal).
// -------------------------------------------------------------

const Step3 = () => {
  const {
    assessment,
    steps,
    selectedStep,
    handleStepChange,
  } = useAssessmentContext();

  // ────────────────────────────────────────────────────────────
  // Modal state
  // ────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [modalInitialData, setModalInitialData] = useState({});
  const [modalQuestionType, setModalQuestionType] = useState(null);
  const [questionLibraryOpen, setQuestionLibraryOpen] = useState(false);

  // For the floating QuestionCards ➜ "Add question" buttons
  const handleAdd = (type) => {
    setModalMode("add");
    setModalInitialData({});
    setModalQuestionType(type);
    setModalOpen(true);
  };

  // Called from <QuestionSequenceTable /> when user clicks Edit
  const handleEdit = (question) => {
    setModalMode("edit");
    setModalInitialData(question);
    setModalQuestionType(question.__type); // Sequencer passes a decorated field
    setModalOpen(true);
  };

  const handleAddFromLibrary = () => {
    setQuestionLibraryOpen(true);
  }

  // Navigation handlers
  const handleBack = () => {
    const currentStepIndex = steps.findIndex((s) => s.value === selectedStep);
    if (currentStepIndex > 0) {
      const previousStep = steps[currentStepIndex - 1];
      handleStepChange(previousStep.value);
    }
  };

  const handleNext = () => {
    const currentStepIndex = steps.findIndex((s) => s.value === selectedStep);
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      handleStepChange(nextStep.value);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Wizard nav + AI pro-tip banner */}
      <div className="flex items-center justify-between">
        <AssessmentStep
          steps={steps}
          selected={selectedStep}
          onSelect={handleStepChange}
        />

        <div className="min-w-[450px] bg-purpleQuaternary rounded-5xl px-4 py-[25px] flex items-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]">
          <AiIcon className="w-4 h-4" />
          <span className="text-[#7C7C7C] font-normal text-sm block max-w-[418px]">
            <span className="bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text text-sm font-semibold">
              Pro Tip:&nbsp;
            </span>
            Scoutabl's AI suggests tests by matching skills in your job description with related tests.
          </span>
        </div>
      </div>

      {/* Heading + action buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-greyPrimary">Choose Question Type</h2>
          <p className="text-sm font-medium text-greyAccent">You can add up to 20 custom questions at a time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            Skip to Finalize
          </Button>
          <Button variant="primary" onClick={handleAddFromLibrary}>
            Add from Library
          </Button>
        </div>
      </div>

      {/* Cards displaying the various question types */}
      <QuestionCards onAdd={handleAdd} />

      {/* The reusable question list component */}
      <QuestionSequenceTable 
        assessmentId={assessment?.id} 
        questionType="custom"
        onEdit={handleEdit} 
      />

      {/* Add / Edit modal */}
      <QuestionModal
      key={modalMode + (modalInitialData?.id || "")}
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        mode={modalMode}
        initialData={modalInitialData}
        questionType={modalQuestionType}
        setQuestionType={setModalQuestionType}
        assessmentId={assessment?.id}
      />

      <EditAssessmentQuestionsPopup 
        open={questionLibraryOpen} 
        onOpenChange={setQuestionLibraryOpen} 
      />

      {/* Back / Next navigation buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="back" 
          effect="shineHover"
          onClick={handleBack}
        >
          <ChevronLeftIcon /> Back
        </Button>
        <Button 
          variant="next" 
          effect="shineHover"
          onClick={handleNext}
        >
          Next <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default Step3;
