import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EditAssessmentQuestions from "@/components/common/EditAssessmentQuestions";
import Section from "@/components/common/Section";

const EditAssessmentQuestionsPopup = ({
  open,
  onOpenChange,
  questionType = "custom",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle hidden>Add Questions</DialogTitle>
      <DialogContent className="max-h-[80vh] w-[80vw] flex flex-col overflow-y-auto p-0 border-0">
        <Section
          variant="default"
          className="rounded-none border-0"
          contentClassName="flex flex-col gap-4 h-full"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-greyPrimary">
              Add Questions From Library
            </h2>
            <p className="text-md text-greyAccent">
              Custom questions are added to the end of the assessment
            </p>
          </div>
          <EditAssessmentQuestions questionType={questionType} />
        </Section>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssessmentQuestionsPopup;
