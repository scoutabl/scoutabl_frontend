import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Chip from "@/components/ui/chip";
import EmptyState from "@/components/ui/empty-state";
import QuestionRow from "@/components/ui/question-row";
import Section from "@/components/common/Section";
import SectionHeader from "@/components/ui/section-header";

import { useQuestions } from "@/api/assessments/question";
import {
  useAssessment,
  useUpdateAssessment,
} from "@/api/assessments/assessment";
import { useDuplicateQuestion } from "@/api/createQuestion";

import Step3Loading from "@/components/features/assesment/create/steps/step3-customQuestions/Step3Loading";
import { getQuestionType } from "@/lib/questionTypes";

import TrashIcon from "@/assets/trashIcon.svg?react";
import { Plus } from "lucide-react";

import { cn, debounce } from "@/lib/utils";
import Loading from "../ui/loading";
import { useEnums } from "@/context/EnumsContext";
import { useAssessmentContext } from "./AssessmentNavbarWrapper";

const variants = {
  default: {
    header: "bg-purpleSecondary",
    scoreChip: "bg-purpleSecondary",
  },
  finalize: {
    header: "bg-backgroundPrimary",
    scoreChip: "bg-white",
  },
};

/**
 * Re-usable component that renders the "Question Sequence" table used while
 * configuring an assessment. It encapsulates all logic for
 * – fetching questions
 * – re-ordering via drag & drop
 * – randomising order
 * – duplicating & deleting questions (single / multi-select)
 *
 * Props
 * ───────────────────────────────────────────────────────────
 *  • assessmentId   – number | string  (required)
 *  • questionType   – "custom" | "qualifying" (default: "custom")
 *  • onEdit(question) – callback invoked when the user clicks the Edit action
 */
const QuestionSequenceTable = ({
  assessmentId,
  questionType = "custom",
  onEdit,
  minimal = false,
  className = "",
  headerProps = {},
  secitonProps = {},
  showHeader = true,
  showSubHeader = false,
  onAddQuestion,
  onAddFromLibrary,
  variant = "default",
}) => {
  /***************************************************************************
   * Data fetching                                                            *
   ***************************************************************************/
  const {
    assessment,
    updateAssessment,
    isUpdatingAssessment,
    isAssessmentLoading,
  } = useAssessmentContext();

  const { resolveEnum } = useEnums();

  // Determine which fields to use based on questionType
  const isCustom = questionType === "custom";
  const questionIds = isCustom
    ? assessment?.custom_questions || []
    : assessment?.qualifying_questions || [];
  const questionOrder = isCustom
    ? assessment?.custom_questions_order || []
    : assessment?.qualifying_questions_order || [];
  const questionRandomize = isCustom
    ? assessment?.custom_questions_randomize || false
    : assessment?.qualifying_questions_randomize || false;

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestions({
    params: {
      id__in: questionIds.join(","),
      question_type: resolveEnum(
        isCustom
          ? "QuestionType.CUSTOM_QUESTION"
          : "QuestionType.QUALIFYING_QUESTION"
      ),
      fetch_all: 1,
    },
    enabled: !!assessmentId,
  });

  /***************************************************************************
   * Local state                                                              *
   ***************************************************************************/
  const [localQuestionOrder, setLocalQuestionOrder] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [localRandomize, setLocalRandomize] = useState(false);

  // Track whether the current questionOrder update originates from the API so
  // we don't send PATCH requests back in response to our own response handling
  const isUpdatingFromAPI = useRef(false);

  /* ----------------------------------------------------------------------- */
  /*  Sync local state with assessment                                        */
  /* ----------------------------------------------------------------------- */
  useEffect(() => {
    setLocalRandomize(questionRandomize);
  }, [questionRandomize]);

  useEffect(() => {
    isUpdatingFromAPI.current = true;
    setLocalQuestionOrder(questionOrder);
    // Reset the flag immediately after paint
    setTimeout(() => {
      isUpdatingFromAPI.current = false;
    }, 0);
  }, [questionOrder]);

  // Persist order changes back to the server (debounced by React-Query mutation)
  useEffect(() => {
    if (isUpdatingFromAPI.current) return;
    if (JSON.stringify(localQuestionOrder) === JSON.stringify(questionOrder))
      return;

    if (
      assessment?.id &&
      localQuestionOrder.length > 0 &&
      !isUpdatingAssessment
    ) {
      const updateData = isCustom
        ? { custom_questions_order: localQuestionOrder }
        : { qualifying_questions_order: localQuestionOrder };

      updateAssessment({
        assessmentId: assessment.id,
        data: updateData,
      });
    }
  }, [
    assessment?.id,
    localQuestionOrder,
    isUpdatingAssessment,
    questionOrder,
    updateAssessment,
    isCustom,
  ]);

  /***************************************************************************
   * Helpers                                                                  *
   ***************************************************************************/
  const getQuestionTypeString = (q) => {
    return getQuestionType(q.resourcetype, q.multiple_true);
  };

  const removeQuestions = async (questionIds) => {
    const currentQuestions = isCustom
      ? assessment?.custom_questions || []
      : assessment?.qualifying_questions || [];
    const currentOrder = isCustom
      ? assessment?.custom_questions_order || []
      : assessment?.qualifying_questions_order || [];

    const updateData = isCustom
      ? {
          custom_questions: currentQuestions.filter(
            (q) => !questionIds.includes(q)
          ),
          custom_questions_order: currentOrder.filter(
            (q) => !questionIds.includes(q)
          ),
        }
      : {
          qualifying_questions: currentQuestions.filter(
            (q) => !questionIds.includes(q)
          ),
          qualifying_questions_order: currentOrder.filter(
            (q) => !questionIds.includes(q)
          ),
        };

    await updateAssessment({
      assessmentId: assessment?.id,
      data: updateData,
    });
  };

  const handleDelete = (questionId) => {
    removeQuestions([questionId]);
  };

  const handleDeleteMultiple = async () => {
    await removeQuestions(Array.from(selectedQuestions));
    setSelectedQuestions(new Set());
  };

  const debouncedUpdateRandomize = useCallback(
    debounce((checked) => {
      const updateData = isCustom
        ? { custom_questions_randomize: checked }
        : { qualifying_questions_randomize: checked };

      updateAssessment({
        assessmentId: assessment?.id,
        data: updateData,
      });
    }, 500),
    [updateAssessment, assessment?.id, isCustom]
  );

  const handleRandomize = (checked) => {
    setLocalRandomize(checked);
    debouncedUpdateRandomize(checked);
  };

  const { mutate: duplicateQuestion } = useDuplicateQuestion(assessment?.id);
  const handleDuplicate = (questionId) => {
    duplicateQuestion({ questionId });
  };

  /***************************************************************************
   * Drag-and-drop                                                            *
   ***************************************************************************/
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
      activationKeyboardConstraint: { distance: 3 },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setLocalQuestionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder;
      });
    }
  };

  const handleQuestionSelect = (questionId, isSelected) => {
    setSelectedQuestions((prev) => {
      const next = new Set(prev);
      isSelected ? next.add(questionId) : next.delete(questionId);
      return next;
    });
  };

  /***************************************************************************
   * Sortable row                                                             *
   ***************************************************************************/
  const SortableQuestionRow = ({ questionId, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: questionId });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.95 : 1,
      zIndex: isDragging ? 100 : 1,
    };

    const question = questions?.find((q) => q.id === questionId);
    if (!question) return null;

    const questionTypeString = getQuestionTypeString(question);

    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <QuestionRow
          questionId={question.id}
          isMovable
          order={index + 1}
          isSelected={selectedQuestions.has(question.id)}
          title={question.title}
          completionTime={question.completion_time}
          questionType={questionTypeString}
          {...(!minimal
            ? {
                onPreview: () => {},
                onEdit: () => onEdit && onEdit(question),
                onDuplicate: () => handleDuplicate(question.id),
              }
            : {})}
          onDelete={() => handleDelete(question.id)}
          onSelect={handleQuestionSelect}
          dragListeners={listeners}
          minimal={minimal}
          variant={variant === "default" ? "default" : "finalize"}
        />
      </div>
    );
  };

  /***************************************************************************
   * Derived data                                                             *
   ***************************************************************************/
  const orderedQuestions =
    questions?.length > 0
      ? localQuestionOrder
          .map((id) => questions.find((q) => q.id === id))
          .filter(Boolean)
      : [];

  /***************************************************************************
   * Render                                                                   *
   ***************************************************************************/
  if (questionsError) return <div>Error loading questions</div>;

  const sectionTitle = isCustom ? "Custom Questions" : "Qualifying Questions";

  return (
    <Section
      id="question-sequence"
      variant="white"
      className={className}
      header={
        <SectionHeader
          title={sectionTitle}
          headerRight={
            <div className="flex items-center gap-4">
              <div className="flex flex-row px-1 gap-4 justify-between">
                {/* Randomise check-box */}
                {!minimal && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      name="randomize"
                      id="randomize"
                      checked={localRandomize}
                      onCheckedChange={handleRandomize}
                    />
                    <label
                      htmlFor="randomize"
                      className="text-sm font-medium text-greyAccent"
                    >
                      Randomize Order
                    </label>
                  </div>
                )}

                {/* Total score (static for now) */}
                <Chip
                  className={cn("rounded-full", variants[variant].scoreChip)}
                >
                  <span className="font-semibold text-sm text-greyPrimary">
                    Total Score:&nbsp;
                  </span>
                  <span>900</span>
                </Chip>
              </div>

              {/* Delete multiple */}
              <Motion.button
                className={cn(
                  "h-8 w-8 rounded-full grid place-content-center border border-seperatorPrimary",
                  selectedQuestions.size === 0 && "hidden"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDeleteMultiple}
              >
                <TrashIcon />
              </Motion.button>
            </div>
          }
          subHeader={showSubHeader && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                icon={Plus}
                iconPlacement="left"
                onClick={onAddQuestion}
              >
                Add Question
              </Button>
              <Button variant="primary" onClick={onAddFromLibrary}>
                Add from Library
              </Button>
            </div>
          )}
          {...headerProps}
        />
      }
      {...secitonProps}
    >
      {isAssessmentLoading || isQuestionsLoading ? (
        <Loading />
      ) : questions?.length > 0 ? (
        <div className="flex flex-col gap-4 text-sm">
          {/* Table header */}
          {!minimal && showHeader && (
            <div
              className={cn(
                "py-3 px-5 flex items-center gap-4 rounded-xl font-semibold",
                variants[variant].header
              )}
            >
              <div className="w-[65px] flex-shrink-0 text-center"></div>
              <div className="flex-1">Question</div>
              <div className="w-24 flex-shrink-0 text-center">Time</div>
              <div className="w-[200px] flex-shrink-0 text-center">Type</div>
              <div className="w-[140px] flex-shrink-0 text-center">Action</div>
            </div>
          )}

          {/* Row list (sortable) */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            autoScroll={{ enabled: false }}
          >
            <SortableContext
              items={localQuestionOrder}
              strategy={verticalListSortingStrategy}
            >
              {orderedQuestions.map((q, idx) => (
                <SortableQuestionRow key={q.id} questionId={q.id} index={idx} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <Section variant="white">
          <EmptyState
            text={`You haven't added any ${
              isCustom ? "custom" : "qualifying"
            } question yet!`}
            subtext="Stay productive by creating a task."
          >
            <Button variant="outline" icon={Plus} iconPlacement="left">
              Add Question
            </Button>
            <Button variant="primary">Add from Library</Button>
          </EmptyState>
        </Section>
      )}
    </Section>
  );
};

export default QuestionSequenceTable;
