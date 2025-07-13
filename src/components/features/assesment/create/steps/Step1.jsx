import React, { useState } from "react";
import AssessmentStep from "@/components/common/AssessmentStep";
import { useAssessmentContext } from "@/components/common/AssessmentNavbarWrapper";
import CategoryCard from "@/components/ui/cards/category-card";
import SchoolIcon from "@/assets/schoolIcon.svg?react";
import NotesIcon from "@/assets/noteIcon.svg?react";
import ChatIcon from "@/assets/chatIcon.svg?react";
import CodeIcon from "@/assets/codeIcon.svg?react";
import BoxedIcon from "@/components/ui/boxed-icon";
import Chip from "@/components/ui/chip";
import { SCOUTABL_MUTED_SECONDARY, SCOUTABL_WHITE } from "@/lib/constants";

const CATEGORIES = [
  {
    name: "Skills & Coding Tests",
    description:
      "For assessing technical skills, coding proficiency, and problem-solving abilities.",
    tags: ["Coding", "Problem Solving", "Technical Skills"],
    icon: <SchoolIcon className="size-8" />,
  },
  {
    name: "Take Home Assignment",
    description:
      "For evaluating candidates' ability to complete tasks independently.",
    tags: ["Excel", "PowerPoint", "Assignments"],
    icon: <NotesIcon className="size-8" />,
  },
  {
    name: "Live Coding Contests",
    description: "For screening candidates' coding skills in real-time.",
    tags: ["Coding", "Problem Solving", "Technical Skills"],
    icon: <CodeIcon className="size-8" />,
  },
];

const Step1 = () => {
  const { steps, selectedStep, setSelectedStep } = useAssessmentContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row">
        <AssessmentStep
          steps={steps}
          selected={selectedStep}
          onSelect={setSelectedStep}
        />
      </div>
      <div className="flex flex-col gap-8">
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
                  isActive={selectedCategory === category.name}
                  className="size-10"
                />
              }
              value={category.name}
              title={category.name}
              content={category.description}
              footer={
                <div className="flex flex-wrap gap-2 w-full">
                  {category.tags.map((tag) => (
                    <Chip
                      key={tag}
                      style={{
                        background:
                          selectedCategory === category.name
                            ? SCOUTABL_WHITE
                            : SCOUTABL_MUTED_SECONDARY,
                      }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              }
              onClick={(value) => setSelectedCategory(value)}
              selected={selectedCategory === category.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1;
