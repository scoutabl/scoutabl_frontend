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
import PlusIcon from "@/assets/plusIcon.svg?react";

import { cn, debounce } from "@/lib/utils";
import Loading from "../ui/loading";

/**
 * Re-usable component that renders the “Question Sequence” table used while
 * configuring an assessment. It encapsulates all logic for
 * – fetching questions
 * – re-ordering via drag & drop
 * – randomising order
 * – duplicating & deleting questions (single / multi-select)
 *
 * Props
 * ───────────────────────────────────────────────────────────
 *  • assessmentId   – number | string  (required)
 *  • onEdit(question) – callback invoked when the user clicks the Edit action
 */
const QuestionSequenceTable = ({
  assessmentId,
  onEdit,
  minimal = false,
  className = "",
}) => {
  /***************************************************************************
   * Data fetching                                                            *
   ***************************************************************************/
  const { data: assessment, isLoading: isAssessmentLoading } =
    useAssessment(assessmentId);

  const { mutate: updateAssessment, isPending: isUpdatingAssessment } =
    useUpdateAssessment();

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuestions({
    params: {
      id__in: (assessment?.custom_questions || []).join(","),
      fetch_all: 1,
    },
    enabled: !!assessmentId,
  });

  /***************************************************************************
   * Local state                                                              *
   ***************************************************************************/
  const [questionOrder, setQuestionOrder] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [localRandomize, setLocalRandomize] = useState(false);

  // Track whether the current questionOrder update originates from the API so
  // we don’t send PATCH requests back in response to our own response handling
  const isUpdatingFromAPI = useRef(false);

  /* ----------------------------------------------------------------------- */
  /*  Sync local state with assessment                                        */
  /* ----------------------------------------------------------------------- */
  useEffect(() => {
    setLocalRandomize(assessment?.custom_questions_randomize || false);
  }, [assessment?.custom_questions_randomize]);

  useEffect(() => {
    isUpdatingFromAPI.current = true;
    setQuestionOrder(assessment?.custom_questions_order || []);
    // Reset the flag immediately after paint
    setTimeout(() => {
      isUpdatingFromAPI.current = false;
    }, 0);
  }, [assessment?.custom_questions_order]);

  // Persist order changes back to the server (debounced by React-Query mutation)
  useEffect(() => {
    if (isUpdatingFromAPI.current) return;
    if (
      JSON.stringify(questionOrder) ===
      JSON.stringify(assessment?.custom_questions_order)
    )
      return;

    if (assessment?.id && questionOrder.length > 0 && !isUpdatingAssessment) {
      updateAssessment({
        assessmentId: assessment.id,
        data: {
          custom_questions_order: questionOrder,
        },
      });
    }
  }, [
    assessment?.id,
    questionOrder,
    isUpdatingAssessment,
    assessment?.custom_questions_order,
    updateAssessment,
  ]);

  /***************************************************************************
   * Helpers                                                                  *
   ***************************************************************************/
  const getQuestionTypeString = (q) => {
    return getQuestionType(q.resourcetype, q.multiple_true);
  };

  const removeQuestions = async (questionIds) => {
    await updateAssessment({
      assessmentId: assessment?.id,
      data: {
        custom_questions: assessment?.custom_questions?.filter(
          (q) => !questionIds.includes(q)
        ),
        custom_questions_order: assessment?.custom_questions_order?.filter(
          (q) => !questionIds.includes(q)
        ),
      },
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
      updateAssessment({
        assessmentId: assessment?.id,
        data: {
          custom_questions_randomize: checked,
        },
      });
    }, 500),
    [updateAssessment, assessment?.id]
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
      setQuestionOrder((items) => {
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
        />
      </div>
    );
  };

  /***************************************************************************
   * Derived data                                                             *
   ***************************************************************************/
  const orderedQuestions =
    questions?.length > 0
      ? questionOrder
          .map((id) => questions.find((q) => q.id === id))
          .filter(Boolean)
      : [];

  /***************************************************************************
   * Render                                                                   *
   ***************************************************************************/
  if (questionsError) return <div>Error loading questions</div>;

  return (
    <Section
      id="question-sequence"
      variant="white"
      className={className}
      header={
        <SectionHeader
          title="Question Sequence"
          headerRight={
            <div className="flex items-center gap-4">
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
              <Chip className="bg-purpleSecondary rounded-full">
                <span className="font-semibold text-sm text-greyPrimary">
                  Total Score:&nbsp;
                </span>
                <span>900</span>
              </Chip>

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
        />
      }
    >
      {isAssessmentLoading || isQuestionsLoading ? (
        <Loading />
      ) : questions?.length > 0 ? (
        <div className="flex flex-col gap-4 text-sm">
          {/* Table header */}
          {!minimal && (
            <div className="py-3 px-5 flex items-center gap-4 bg-purpleSecondary rounded-xl font-semibold">
              <div className="w-[65px] flex-shrink-0 text-center">No.</div>
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
              items={questionOrder}
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
            text="You haven't added any question yet!"
            subtext="Stay productive by creating a task."
          >
            <Button variant="outline" className="rounded-xl">
              <PlusIcon className="w-4 h-4 mr-2" /> Add Question
            </Button>
            <Button className="rounded-xl bg-purplePrimary hover:bg-purplePrimary/80">
              Add from Library
            </Button>
          </EmptyState>
        </Section>
      )}
    </Section>
  );
};

export default QuestionSequenceTable;
