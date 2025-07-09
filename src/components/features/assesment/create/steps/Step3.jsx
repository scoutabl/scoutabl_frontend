import React, { useState } from 'react'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify';
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
import Step3Loading from './step3-customQuestions/Step3Loading';
import AiIcon from '@/assets/AiIcon.svg?react'
import PlusIcon from '@/assets/plusIcon.svg?react'
import TrashIcon from '@/assets/trashIcon.svg?react'
import EditIcon from '@/assets/editquestion.svg?react'
import DuplicateIcon from '@/assets/duplicateIcon.svg?react'
import NoTestIcon from '@/assets/noTestIcon.svg?react'
import ChevronLeftIcon from '@/assets/chevronLeft.svg?react'
import ChevronRightIcon from '@/assets/chevronRight.svg?react'
import { Eye, GripVertical } from 'lucide-react'
import QuestionModal from './step3-customQuestions/QuestionModal';
const Step3 = ({ assessmentId = 14 }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [modalInitialData, setModalInitialData] = useState({});
    const [modalQuestionType, setModalQuestionType] = useState(null);
    const { data: questions, isLoading, error, refetch } = useAssessmentQuestions(assessmentId);

    // Helper to flatten all question type objects
    const allTypeDefs = questionTypes.flatMap(cat => cat.questions);

    //helper function to get type definition based on question
    const getTypeDef = (q) => {
        // Map backend resourcetype to your config type
        if (q.resourcetype === 'MCQuestion') {
            return allTypeDefs.find(typeDef =>
                typeDef.type === (q.multiple_true ? 'multiple-select' : 'single-select')
            );
        }
        if (q.resourcetype === 'RearrangeQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'rearrange');
        }
        if (q.resourcetype === 'RatingQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'rating');
        }
        if (q.resourcetype === 'NumberQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'numeric-input');
        }
        if (q.resourcetype === 'EssayQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'essay');
        }
        if (q.resourcetype === 'CodeQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'code');
        }
        if (q.resourcetype === 'ExcelQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'ms-excel');
        }
        if (q.resourcetype === 'SheetsQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'google-sheets');
        }
        if (q.resourcetype === 'VideoQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'video');
        }
        if (q.resourcetype === 'AudioQuestion') {
            return allTypeDefs.find(typeDef => typeDef.type === 'audio');
        }
        // fallback
        return undefined;
    };

    // Format completion time from "HH:MM" to "X hr Y min"
    function formatCompletionTime(timeStr) {
        if (!timeStr) return '--';

        const [hours, minutes] = timeStr.split(':').map(Number);

        if (hours && minutes) return `${hours} hr ${minutes} min`;
        if (hours) return `${hours} hr`;
        if (minutes) return `${minutes} min`;

        return '--';
    }


    //function to delete question
    const { mutate: removeQuestion } = useRemoveQuestion(assessmentId);

    const handleDelete = (questionId) => {
        removeQuestion({ questionId });
    };


    //function to duplicate question
    const { mutate: duplicateQuestion } = useDuplicateQuestion(assessmentId);

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
        const typeDef = getTypeDef(question);
        const type = typeDef?.type;
        console.log(type); // This should now log the correct type
        setModalMode('edit');
        setModalInitialData(question);
        setModalQuestionType(type);
        setModalOpen(true);
    };

    if (isLoading) return <div className='flex flex-col items-center'><Step3Loading /></div>;
    if (error) return <div>Error loading questions</div>;

    return (
        <div className='flex flex-col gap-6 px-[116px] py-6'>
            <div className='flex items-center justify-between'>
                <div className='w-[600px] p-4 bg-white rounded-5xl flex items-center gap-4 border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]'>
                    {/* circular Step No */}
                    <div>

                    </div>
                    <div className='flex flex-col gap-1'>
                        <select>
                            <option value="1">Select a category</option>
                            <option value="2">Category 1</option>
                            <option value="3">Category 2</option>
                            <option value="4">Category 3</option>
                        </select>
                        <span className='text-greenPrimary font-semibold text-xl'>Add Custom Questions</span>
                    </div>
                    <span className='block px-3 py-1 mt-auto bg-greenPrimary/15 rounded-full'>Next: Finalize</span>
                </div>
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
            <div className='p-4 flex flex-col gap-4 rounded-5xl bg-white border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]'>
                {questions.length > 0
                    ?
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-greyPrimary'>Question Sequence</h3>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    {/* <input type="checkbox" name="randomize" id="randomize" /> */}
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
                        </div>
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
                        {questions && questions.length > 0 && questions.map((q, idx) => {
                            console.log(q.id)
                            const typeDef = getTypeDef(q) || {};
                            const safeTitle = DOMPurify.sanitize(q.title);
                            return (
                                <div
                                    key={q.id}
                                    className="py-3 px-5 grid gap-4 items-center bg-backgroundPrimary rounded-xl"
                                    style={{
                                        gridTemplateColumns: 'clamp(60px, 5vw, 86px) minmax(200px, 1fr) clamp(80px, 8vw, 103px) clamp(120px, 15vw, 198px) clamp(120px, 15vw, 196px)'
                                    }}
                                >
                                    <div className="p-[6px] flex items-center gap-1 border border-purplePrimary rounded-full">
                                        <GripVertical size={20} color='#5C5C5C' />
                                        <div className='h-5 w-[30px] grid place-content-center text-xs font-semibold text-white bg-purplePrimary rounded-full'>
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <Checkbox name={`questionTitle${q.id}`} id={`questionTitle${q.id}`} />
                                        {/* <label htmlFor={`questionTitle${q.id}`} className='truncate'>{q.title}</label> */}
                                        <label
                                            htmlFor={`questionTitle${q.id}`}
                                            className="truncate"
                                            dangerouslySetInnerHTML={{ __html: safeTitle }}
                                        />
                                    </div>
                                    <div className="font-medium text-center">{formatCompletionTime(q.completion_time)}</div>
                                    <div
                                        className="font-medium min-w-[150px] max-w-[150px] rounded-full px-[6px] py-[5.5px] flex items-center gap-[6px] mx-auto"
                                        style={{
                                            background: typeDef.bg || '#EEE',
                                            color: typeDef.text || '#333'
                                        }}
                                    >
                                        {typeDef.icon && (
                                            <div
                                                className="w-[18px] h-[18px] flex items-center justify-center rounded-full"
                                                style={{
                                                    background: typeDef.text || '#EEE',
                                                }}
                                            >
                                                {React.cloneElement(typeDef.icon, {
                                                    style: { color: typeDef.bg || '#333', width: 12, height: 12 }
                                                })}
                                            </div>
                                        )}
                                        <span className='text-sm font-medium'>{typeDef.name || q.resourcetype || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mx-auto">
                                        <motion.button
                                            className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Eye className='text-greyPrimary font-normal' size={16} />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDuplicate(q.id)}
                                            className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <DuplicateIcon className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleEdit(q)}
                                            className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <EditIcon className="w-4 h-4" />
                                        </motion.button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <motion.button
                                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </motion.button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your account
                                                        and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className='rounded-md bg-dangerPrimary hover:bg-red-900 text-white hover:text-white'>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className='rounded-md bg-greenPrimary hover:bg-green-950 text-greyPrimary hover:text-white'
                                                        onClick={() => handleDelete(q.id)}
                                                    >
                                                        Continue
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        {/* <motion.button
                                            onClick={() => handleDelete(q.id)}
                                            className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </motion.button> */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    :
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-greyPrimary'>Question Sequence</h3>
                            <div className='flex items-center gap-2'>
                                <Checkbox name="randomize" id="randomize" />
                                <label htmlFor="randomize" className='text-sm font-medium text-greyAccent'>Randomize Order</label>
                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-center gap-6'>
                            <NoTestIcon />
                            <div>
                                <h5 className='pb-[6px] text-center'>You haven't added any question yet!</h5>
                                <span className='text-greyAccent text-sm font-medium text-center block'>Stay productive by creating a task.</span>
                            </div>
                            <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right" className="px-4 py-2 rounded-xl bg-purplePrimary hover:bg-[#EEF2FC] text-sm font-medium hover:text-purplePrimary text-white border border-transparent hover:border-purplePrimary [&_svg]:size-3">
                                Add from Library
                            </Button>
                        </div>
                    </div>
                }
            </div>
            <QuestionModal
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                mode={modalMode}
                initialData={modalInitialData}
                questionType={modalQuestionType}
                assessmentId={assessmentId}
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