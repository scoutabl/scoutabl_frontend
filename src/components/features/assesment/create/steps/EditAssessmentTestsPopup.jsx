import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditAssessmentTests from "@/components/common/EditAssessmentTests";

const EditAssessmentTestsPopup = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] h-[80vh] overflow-y-auto p-0 rounded-3xl">
        <DialogTitle className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Tests from Library</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogTitle>

        <div className="p-6">
          <EditAssessmentTests modal={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssessmentTestsPopup; 