import React, { useState } from "react";
import AssessmentStep from "@/components/common/AssessmentStep";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import CategoryCard from "@/components/ui/cards/category-card";
import SchoolIcon from "@/assets/schoolIcon.svg?react";
import NotesIcon from "@/assets/noteIcon.svg?react";
import ChatIcon from "@/assets/chatIcon.svg?react";
import CodeIcon from "@/assets/codeIcon.svg?react";
import BoxedIcon from "@/components/ui/boxed-icon";
import ChevronRightIcon from "@/assets/chevronRightIcon.svg?react";
import AiIcon from "@/assets/AiIcon.svg?react";
import Chip from "@/components/ui/chip";
import { SCOUTABL_MUTED_SECONDARY, SCOUTABL_WHITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useCreateAssessment } from "@/api/assessments/assessment";
import { useEnums } from "@/context/EnumsContext";

const Step1 = () => {
  const { resolveEnum } = useEnums();
  const {
    steps,
    selectedStep,
    setSelectedStep,
    assessmentName,
    setAssessmentId,
  } = useAssessmentContext();
  const { mutateAsync: createAssessment, isPending: isCreatingAssessment } =
    useCreateAssessment();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNext = async () => {
    const assessment = await createAssessment({
      name: assessmentName,
      category: selectedCategory,
      save_template: false,
    });
    setAssessmentId(assessment.id);
    // TODO: Navigate
  };

  const CATEGORIES = [
    {
      name: "Skills & Coding Tests",
      description:
        "For assessing technical skills, coding proficiency, and problem-solving abilities.",
      tags: ["Coding", "Problem Solving", "Technical Skills"],
      value: resolveEnum("AssessmentCategory.SKILLS_AND_CODING"),
      icon: <SchoolIcon className="size-8" />,
    },
    {
      name: "Take Home Assignment",
      description:
        "For evaluating candidates' ability to complete tasks independently.",
      tags: ["Excel", "PowerPoint", "Assignments"],
      value: resolveEnum("AssessmentCategory.TAKE_HOME"),
      icon: <NotesIcon className="size-8" />,
    },
    {
      name: "Live Coding Contests",
      description: "For screening candidates' coding skills in real-time.",
      tags: ["Coding", "Problem Solving", "Technical Skills"],
      value: resolveEnum("AssessmentCategory.LIVE_CODING_CONTEST"),
      icon: <CodeIcon className="size-8" />,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row">
        <AssessmentStep
          steps={steps}
          selected={selectedStep}
          onSelect={setSelectedStep}
        />
      </div>
      <div className="flex flex-col gap-8 mb-8">
        <h2 className="text-2xl font-semibold text-greyPrimary">
          Choose Assessment Category
        </h2>
        <div className="flex flex-row gap-8 justify-center">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.name}
              header={
                <BoxedIcon
                  icon={category.icon}
                  isActive={selectedCategory === category.value}
                  className="size-10"
                />
              }
              value={category.value}
              title={category.name}
              content={category.description}
              footer={
                <div className="flex flex-wrap gap-2 w-full">
                  {category.tags.map((tag) => (
                    <Chip
                      key={tag}
                      style={{
                        background:
                          selectedCategory === category.value
                            ? SCOUTABL_WHITE
                            : SCOUTABL_MUTED_SECONDARY,
                      }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              }
              onClick={() => setSelectedCategory(category.value)}
              selected={selectedCategory === category.value}
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-5 mt-8">
          <Button variant="next" className="rounded-md">
            <AiIcon />
            Create with AI
          </Button>
          <Button
            variant="back"
            className="rounded-md"
            disabled={isCreatingAssessment}
            onClick={handleNext}
          >
            Continue Manually
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step1;
