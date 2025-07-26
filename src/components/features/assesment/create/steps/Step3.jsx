import React, { useState, useEffect } from 'react'
import QuestionCards from './step3-customQuestions/QuestionCards'
import { useAssessmentQuestions, useRemoveQuestion, useDuplicateQuestion } from '@/api/createQuestion'
import { questionTypes } from './step3-customQuestions/QuestionCards'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import Step3Loading from './step3-customQuestions/Step3Loading';
import AiIcon from '@/assets/AiIcon.svg?react'
import PlusIcon from '@/assets/plusIcon.svg?react'
import TrashIcon from '@/assets/trashIcon.svg?react'
import NoTestIcon from '@/assets/noTestIcon.svg?react'
import ChevronLeftIcon from '@/assets/chevronLeftIcon.svg?react'
import ChevronRightIcon from '@/assets/chevronRightIcon.svg?react'
import QuestionModal from './step3-customQuestions/QuestionModal';
import QuestionRow from '@/components/ui/question-row';
import AssessmentStep from '@/components/common/AssessmentStep';
import { useAssessmentContext } from '@/components/common/AssessmentNavbarWrapper';
import Section from '@/components/common/Section';
import SectionHeader from '@/components/ui/section-header';
import EmptyState from '@/components/ui/empty-state';
const Step3 = () => {
    const { assessment, steps, selectedStep, handleStepChange } = useAssessmentContext();
    const [modalOpen, setModalOpen] = useState(false);
    
    // State for question order and selection
    const [questionOrder, setQuestionOrder] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState(new Set());
    
    // Section collapse state
    const [collapsedSections, setCollapsedSections] = useState({
        'question-sequence': false,
    });
    const { data: questions, isLoading, error } = useAssessmentQuestions(assessment?.id);

    // Set initial question order when questions load
    useEffect(() => {
        if (questions && questions.length > 0) {
            setQuestionOrder(questions.map(q => q.id));
        }
    }, [questions]);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [modalInitialData, setModalInitialData] = useState({});
    const [modalQuestionType, setModalQuestionType] = useState(null);

    // Helper to flatten all question type objects
    const allTypeDefs = questionTypes.flatMap(cat => cat.questions);

    // Updated helper function to get type definition based on question
    const getTypeDef = (q) => {
        if (q.resourcetype === 'MCQuestion') {
            return allTypeDefs.find(typeDef =>
                typeDef.resourcetype === 'MCQuestion' &&
                typeDef.multiple_true === !!q.multiple_true
            );
        }
        return allTypeDefs.find(typeDef => typeDef.resourcetype === q.resourcetype);
    };




    //function to delete question
    const { mutate: removeQuestion } = useRemoveQuestion(assessment?.id);

    const handleDelete = (questionId) => {
        removeQuestion({ questionId });
    };


    //function to duplicate question
    const { mutate: duplicateQuestion } = useDuplicateQuestion(assessment?.id);

    const handleDuplicate = (questionId) => {
        duplicateQuestion({ questionId });
    };
    // For add
    const handleAdd = (type) => {
        setModalMode('add');
        setModalInitialData({});
        setModalQuestionType(type);
        setModalOpen(true);
    };
    // For edit
    const handleEdit = (question) => {
        console.log('Editing question:', question);
        const typeDef = getTypeDef(question);
        const type = typeDef?.type;
        console.log(type); // This should now log the correct type
        setModalMode('edit');
        setModalInitialData(question);
        setModalQuestionType(type);
        setModalOpen(true);
    };

    // Drag and drop handlers
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setQuestionOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                console.log('Question order updated:', newOrder);
                return newOrder;
            });
        }
    };

    // Selection handlers
    const handleQuestionSelect = (questionId, isSelected) => {
        setSelectedQuestions(prev => {
            const newSelection = new Set(prev);
            if (isSelected) {
                newSelection.add(questionId);
            } else {
                newSelection.delete(questionId);
            }
            return newSelection;
        });
    };

    // Create sortable question row component
    const SortableQuestionRow = ({ questionId, index }) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({ id: questionId });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.95 : 1,
            zIndex: isDragging ? 100 : 1,
        };

        const question = questions.find(q => q.id === questionId);
        if (!question) return null;

        const typeDef = getTypeDef(question) || {};

        return (
            <div ref={setNodeRef} style={style} {...attributes}>
                <QuestionRow
                    questionId={question.id}
                    isMovable={true}
                    order={index + 1}
                    isSelected={selectedQuestions.has(question.id)}
                    title={question.title}
                    completionTime={question.completion_time}
                    questionType={typeDef}
                    onPreview={() => {/* Handle preview */}}
                    onEdit={() => handleEdit(question)}
                    onDuplicate={() => handleDuplicate(question.id)}
                    onDelete={() => handleDelete(question.id)}
                    onSelect={handleQuestionSelect}
                    dragListeners={listeners}
                />
            </div>
        );
    };

    // Get ordered questions
    const orderedQuestions = questionOrder.map(id => questions?.find(q => q.id === id)).filter(Boolean);

    // Section toggle function
    const toggleSectionCollapse = (sectionId) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    if (isLoading) return <div className='flex flex-col items-center'><Step3Loading /></div>;
    if (error) return <div>Error loading questions</div>;

    return (
        <div className='flex flex-col gap-6 py-6'>
            <div className='flex items-center justify-between'>
                <AssessmentStep
                    steps={steps}
                    selected={selectedStep}
                    onSelect={handleStepChange}
                />
                <div className='min-w-[450px] bg-purpleQuaternary rounded-5xl px-4 py-[25px] flex items-center gap-2 [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]'>
                    <AiIcon className='w-4 h-' />
                    <span className='text-[#7C7C7C] font-normal text-sm block max-w-[418px]'><span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text text-sm font-semibold'>Pro Tip:&nbsp;</span>Scoutabl's AI suggests tests by matching skills in your job description with related tests.</span>
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-2xl font-semibold text-greyPrimary'>Choose Question Type</h2>
                    <p className='text-sm font-medium text-greyAccent'>You can add up to 20 custom questions at a time</p>
                </div>
                <div className='flex items-center gap-3'>
                    <Button className="px-4 py-2 rounded-xl border border-purplePrimary bg-[#EEF2FC] text-purplePrimary text-sm font-medium hover:bg-purplePrimary hover:text-white transition-all duration-300 ease-in">Skip to Finalize</Button>
                    <Button className="px-4 py-2 rounded-xl bg-purplePrimary hover:bg-[#EEF2FC] text-sm font-medium hover:text-purplePrimary text-white transition-all duration-300 ease-in border border-purplePrimary">Add from Library</Button>
                </div>
            </div>
            <QuestionCards onAdd={handleAdd} />
            <Section
                id="question-sequence"
                variant="white"
                header={
                    <SectionHeader
                        title="Question Sequence"
                        headerRight={
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Checkbox name="randomize" id="randomize" />
                                    <label htmlFor="randomize" className='text-sm font-medium text-greyAccent'>Randomize Order</label>
                                </div>
                                <div>
                                    <span className='font-semibold text-sm text-greyPrimary'>Total Score:&nbsp;</span>
                                    <span>900</span>
                                </div>
                                <motion.button
                                    className='h-8 w-8 rounded-full grid place-content-center border border-seperatorPrimary'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <TrashIcon className="text-green-500 font-bold" />
                                </motion.button>
                            </div>
                        }
                    />
                }
            >
                {questions.length > 0 ? (
                    <div className='flex flex-col gap-4'>
                        <div
                            className="py-3 px-5 grid gap-4 items-center bg-purpleSecondary rounded-xl"
                            style={{
                                gridTemplateColumns: 'clamp(60px, 5vw, 86px) minmax(200px, 1fr) clamp(80px, 8vw, 103px) clamp(120px, 15vw, 198px) clamp(120px, 15vw, 196px)'
                            }}
                        >
                            <div className="font-medium">No.</div>
                            <div className="font-medium">Question</div>
                            <div className="font-medium text-center">Time</div>
                            <div className="font-medium text-center">Type</div>
                            <div className="font-medium text-center">Action</div>
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                        >
                            <SortableContext
                                items={questionOrder}
                                strategy={verticalListSortingStrategy}
                            >
                                {orderedQuestions.map((q, idx) => (
                                    <SortableQuestionRow
                                        key={q.id}
                                        questionId={q.id}
                                        index={idx}
                                    />
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
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Question
                            </Button>
                            <Button className="rounded-xl bg-purplePrimary hover:bg-purplePrimary/80">
                                Add from Library
                            </Button>
                        </EmptyState>
                    </Section>
                )}
            </Section>
            <QuestionModal
                key={modalMode + (modalInitialData?.id || '')}
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                mode={modalMode}
                initialData={modalInitialData}
                questionType={modalQuestionType}
                setQuestionType={setModalQuestionType}
                asssessmentId={assessment.id}
            // You can add onSave or other props as needed
            />
            <div className='flex items-center justify-between'>
                <Button variant="back" effect="shineHover">
                    <ChevronLeftIcon />
                    Back
                </Button>
                <Button variant="next" effect="shineHover">
                    Next
                    <ChevronRightIcon />
                </Button>
            </div>
        </div>
    )
}


export default Step3