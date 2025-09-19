import React, { useEffect, useRef, useState, useMemo } from "react";
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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Chip from "@/components/ui/chip";
import EmptyState from "@/components/ui/empty-state";
import Section from "@/components/common/Section";
import SectionHeader from "@/components/ui/section-header";
import AssessmentTestRow from "./AssessmentTestRow";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AssessmentTestDetail from "@/components/common/AssessmentTestDetails";
import TestAddDialog from "@/components/common/TestAddDialog";

import { useAssessmentContext } from "./AssessmentNavbarWrapper";
import { cn, durationToMinutes } from "@/lib/utils";
import Loading from "@/components/ui/loading";
import { Plus } from "lucide-react";
import TrashIcon from "@/assets/trashIcon.svg?react";

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
 * Re-usable component that renders the "Test Sequence" table used while
 * configuring an assessment. It encapsulates all logic for
 * – fetching tests
 * – re-ordering via drag & drop
 * – duplicating & deleting tests (single / multi-select)
 *
 * Props
 * ───────────────────────────────────────────────────────────
 *  • assessmentId   – number | string  (required)
 *  • onEdit(test) – callback invoked when the user clicks the Edit action
 */
const AssessmentTestSequenceTable = ({
  minimal = false,
  className = "",
  headerProps = {},
  secitonProps = {},
  showSubHeader = false,
  onAddFromLibrary,
  variant = "default",
  title = "Skills Assessment",
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

  // Get test data from assessment
  const testOrder = useMemo(() => assessment?.tests_order || [], [assessment?.tests_order]);
  const testWeights = assessment?.test_weights || {};
  const testDetails = assessment?.test_details || [];

  /***************************************************************************
   * Local state                                                              *
   ***************************************************************************/
  const [localTestOrder, setLocalTestOrder] = useState([]);
  const [openTestId, setOpenTestId] = useState(null);
  const [openWeightTestId, setOpenWeightTestId] = useState(null);
  const [selectedTests, setSelectedTests] = useState(new Set());

  // Track whether the current testOrder update originates from the API so
  // we don't send PATCH requests back in response to our own response handling
  const isUpdatingFromAPI = useRef(false);

  /* ----------------------------------------------------------------------- */
  /*  Sync local state with assessment                                        */
  /* ----------------------------------------------------------------------- */
  useEffect(() => {
    isUpdatingFromAPI.current = true;
    setLocalTestOrder(testOrder);
    // Reset the flag immediately after paint
    setTimeout(() => {
      isUpdatingFromAPI.current = false;
    }, 0);
  }, [testOrder]);

  // Persist order changes back to the server (debounced by React-Query mutation)
  useEffect(() => {
    if (isUpdatingFromAPI.current) return;
    if (JSON.stringify(localTestOrder) === JSON.stringify(testOrder)) return;

    if (
      assessment?.id &&
      localTestOrder.length > 0 &&
      !isUpdatingAssessment
    ) {
      updateAssessment({
        assessmentId: assessment.id,
        data: { tests_order: localTestOrder },
      });
    }
  }, [
    assessment?.id,
    localTestOrder,
    isUpdatingAssessment,
    testOrder,
    updateAssessment,
  ]);

  /***************************************************************************
   * Helpers                                                                  *
   ***************************************************************************/
  const removeTests = async (testIds) => {
    const currentTests = assessment?.tests || [];
    const currentOrder = assessment?.tests_order || [];
    const currentWeights = assessment?.test_weights || {};

    const updateData = {
      tests: currentTests.filter((t) => !testIds.includes(t)),
      tests_order: currentOrder.filter((t) => !testIds.includes(t)),
      test_weights: { ...currentWeights },
    };

    // Remove weights for deleted tests
    testIds.forEach((id) => {
      delete updateData.test_weights[id];
    });

    await updateAssessment({
      assessmentId: assessment?.id,
      data: updateData,
    });
  };

  const handleDelete = (testId) => {
    removeTests([testId]);
  };

  const handleDeleteSelected = async () => {
    if (selectedTests.size > 0) {
      await removeTests(Array.from(selectedTests));
      setSelectedTests(new Set());
    }
  };

  const handleTestSelect = (testId, isSelected) => {
    setSelectedTests((prev) => {
      const next = new Set(prev);
      isSelected ? next.add(testId) : next.delete(testId);
      return next;
    });
  };

  const handleAdd = async (testId, weightage, isEdit = false) => {
    if (isUpdatingAssessment) return;
    const currentTests = assessment?.tests || [];
    const currentOrder = assessment?.tests_order || [];
    
    await updateAssessment({
      assessmentId: assessment.id,
      data: {
        tests: isEdit ? currentTests : [...currentTests, testId],
        test_weights: {
          ...assessment.test_weights,
          [testId]: weightage,
        },
        tests_order: isEdit
          ? currentOrder
          : [...currentOrder.filter((id) => id !== testId), testId],
      },
    });
    setOpenWeightTestId(null);
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
      setLocalTestOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder;
      });
    }
  };

  /***************************************************************************
   * Dialog rendering                                                         *
   ***************************************************************************/
  const renderTestDialogs = ({ test, isEdit }) => (
    <>
      <Dialog open={openTestId === test.id} onOpenChange={() => setOpenTestId(null)}>
        <DialogContent className="w-[80vw] overflow-y-auto p-0 rounded-3xl">
          <DialogTitle hidden>{test.name}</DialogTitle>
          <AssessmentTestDetail test={test} allTags={[]} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openWeightTestId === test.id}
        onOpenChange={() => setOpenWeightTestId(null)}
      >
        <DialogContent className="w-180 p-0">
          <DialogTitle hidden>{test.name}</DialogTitle>
          <TestAddDialog
            test={test}
            onAddTest={(...args) => handleAdd(...args, isEdit)}
            disabled={isUpdatingAssessment}
            weight={assessment?.test_weights?.[test.id] || 50}
          />
        </DialogContent>
      </Dialog>
    </>
  );

  /***************************************************************************
   * Sortable row                                                             *
   ***************************************************************************/
  const SortableTestRow = ({ testId, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: testId });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.95 : 1,
      zIndex: isDragging ? 100 : 1,
    };

    const test = testDetails.find((t) => t.id === testId);
    if (!test) return null;

    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        {renderTestDialogs({ test, isEdit: true })}
        <AssessmentTestRow
          isMovable
          order={index + 1}
          title={test.name}
          description={test.description}
          completionTime={test.completion_time}
          questionCount={test.question_count}
          weight={testWeights[test.id] || 0}
          isSelected={selectedTests.has(test.id)}
          onSelect={(checked) => handleTestSelect(test.id, checked)}
          {...(!minimal
            ? {
                onPreview: () => setOpenTestId(test.id),
                onEdit: () => setOpenTestId(test.id),
                onEditWeight: () => setOpenWeightTestId(test.id),
              }
            : {})}
          onDelete={() => handleDelete(test.id)}
          dragListeners={listeners}
          minimal={minimal}
        />
      </div>
    );
  };

  /***************************************************************************
   * Derived data                                                             *
   ***************************************************************************/
  const orderedTests =
    testDetails.length > 0
      ? localTestOrder
          .map((id) => testDetails.find((t) => t.id === id))
          .filter(Boolean)
      : [];

  const totalDuration = testDetails.reduce((total, test) => total + (durationToMinutes(test.completion_time) || 0), 0);

  /***************************************************************************
   * Render                                                                   *
   ***************************************************************************/
  if (isAssessmentLoading) return <Loading />;

  return (
    <Section
      id="test-sequence"
      variant="white"
      className={className}
      header={
        <SectionHeader
          title={title}
          headerRight={
            <div className="flex items-center gap-4">
              {/* Edit weights button */}
              <Button variant="outline" className="rounded-full" onClick={() => {}}>
                Edit weights
              </Button>
              {/* Delete button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={handleDeleteSelected}
              >
                <TrashIcon className="w-4 h-4 text-black" />
              </Button>
            </div>
          }
          {...headerProps}
        />
      }
      {...secitonProps}
    >
      {testDetails.length > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Assessment Summary */}
          <div className="flex items-center gap-6 text-sm  text-gray-600 ">
            <span>Number of Tests: {testDetails.length}</span>
            <div className="w-px h-4 bg-gray-300"></div>
            <span>Duration: {Math.round(totalDuration)} min</span>
          </div>

          {/* List layout (sortable) */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
            autoScroll={{ enabled: false }}
          >
            <SortableContext
              items={localTestOrder}
            >
              <div className="flex flex-col gap-3 ">
                {orderedTests.map((t, idx) => (
                  <SortableTestRow key={t.id} testId={t.id} index={idx} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <Section variant="white">
          <EmptyState
            text="You haven't added any tests yet!"
            subtext="Stay productive by creating a task."
          >
            <Button variant="outline" icon={Plus} iconPlacement="left">
              Add Test
            </Button>
            <Button variant="primary">Add from Library</Button>
          </EmptyState>
        </Section>
      )}
    </Section>
  );
};

export default AssessmentTestSequenceTable; 