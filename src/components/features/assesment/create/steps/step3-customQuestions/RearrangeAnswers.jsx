// import { Input } from '@/components/ui/input';
// import React, { useRef, useEffect, useState } from 'react';
// import { useFormContext, useFieldArray } from 'react-hook-form';
// import { Reorder, useDragControls, useMotionValue, animate } from 'framer-motion';
// import { GripVertical, Plus as PlusIcon, Trash2 as DeleteIcon, AlertCircle as MarkIcon } from 'lucide-react';

// const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

// function useRaisedShadow(y) {
//     const boxShadow = useMotionValue(inactiveShadow);
//     useEffect(() => {
//         let isActive = false;
//         return y.on("change", (latest) => {
//             const wasActive = isActive;
//             if (latest !== 0) {
//                 isActive = true;
//                 if (isActive !== wasActive) {
//                     animate(boxShadow, "5px 5px 10px rgba(0,0,0,0.3)");
//                 }
//             } else {
//                 isActive = false;
//                 if (isActive !== wasActive) {
//                     animate(boxShadow, inactiveShadow);
//                 }
//             }
//         });
//     }, [y, boxShadow]);
//     return boxShadow;
// }

// const RearrangeAnswers = ({ name = 'rearrangeOptions' }) => {
//     const dragConstraintsRef = useRef(null);
//     const { control, register, setValue, formState: { errors }, watch } = useFormContext();
//     const { fields, append, remove, move } = useFieldArray({ control, name });
//     const watchedOptions = watch(name) || [];

//     // Local state for drag animation
//     const [dragItems, setDragItems] = useState(fields);

//     // Sync dragItems from fields when options change (add/remove)
//     useEffect(() => {
//         setDragItems(fields);
//     }, [fields.length]);

//     // Add new option
//     const handleAddOption = () => {
//         append({ id: Date.now(), text: '' });
//     };

//     // Remove option
//     const handleRemoveOption = (idx) => {
//         remove(idx);
//     };

//     // Individual drag controls for each item
//     const RearrangeItem = ({ field, idx }) => {
//         const controls = useDragControls();
//         const y = useMotionValue(0);
//         const boxShadow = useRaisedShadow(y);

//         return (
//             <Reorder.Item
//                 key={field.id}
//                 value={field}
//                 dragControls={controls}
//                 dragListener={false}
//                 layout
//                 whileDrag={{ userSelect: "none", scale: 1.04 }}
//                 style={{ boxShadow, y }}
//                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                 className="flex items-center gap-2 bg-white rounded transition-all duration-200"
//                 onDragEnd={() => {
//                     const oldIds = fields.map(f => f.id);
//                     const newIds = dragItems.map(f => f.id);

//                     // Find the id that moved (the one whose index changed the most)
//                     let movedId = null;
//                     let maxDelta = 0;
//                     oldIds.forEach((id, oldIdx) => {
//                         const newIdx = newIds.indexOf(id);
//                         const delta = Math.abs(newIdx - oldIdx);
//                         if (delta > maxDelta) {
//                             maxDelta = delta;
//                             movedId = id;
//                         }
//                     });

//                     if (movedId !== null) {
//                         const from = oldIds.indexOf(movedId);
//                         const to = newIds.indexOf(movedId);
//                         if (from !== -1 && to !== -1 && from !== to) {
//                             move(from, to);
//                             console.log('Moving from', from, 'to', to);
//                         }
//                     }
//                 }}
//             >
//                 {/* Drag Handle */}
//                 <div
//                     onPointerDown={(e) => controls.start(e)}
//                     className="p-[6px] flex items-center gap-1 cursor-move border border-purplePrimary rounded-full select-none"
//                 >
//                     <GripVertical size={20} color='#5C5C5C' />
//                     <div className='h-5 w-[30px] grid place-content-center text-xs font-semibold text-white bg-purplePrimary rounded-full'>
//                         {String(idx + 1).padStart(2, '0')}
//                     </div>
//                 </div>
//                 {/* Input Field */}
//                 <Input
//                     className="flex-1"
//                     {...register(`${name}.${idx}.text`)}
//                     defaultValue={field.text}
//                     placeholder={`Option ${idx + 1}`}
//                 />
//                 {/* Delete Button */}
//                 <button
//                     type="button"
//                     onClick={() => handleRemoveOption(idx)}
//                     className="p-2 text-greyPrimary hover:text-dangerPrimary transition-colors duration-300 ease-in"
//                     title="Delete option"
//                 >
//                     <DeleteIcon size={16} />
//                 </button>
//                 {errors[name]?.[idx]?.text && (
//                     <div className="w-full bg-red-950 p-2 rounded-lg my-2">
//                         <MarkIcon className="w-4 h-4 inline mr-1 text-white" />
//                         <span className="text-white text-xs font-medium">
//                             {errors[name][idx].text.message}
//                         </span>
//                     </div>
//                 )}
//             </Reorder.Item>
//         );
//     };

//     return (
//         <div className="flex flex-col gap-4">
//             <label className="font-semibold text-greyPrimary">Select correct order</label>
//             {/* Wrapper div that acts as drag constraints */}
//             <div ref={dragConstraintsRef} className="relative">
//                 <Reorder.Group
//                     axis="y"
//                     values={dragItems}
//                     onReorder={setDragItems}
//                     className="flex flex-col gap-2"
//                 >
//                     {dragItems.map((field, idx) => (
//                         <RearrangeItem
//                             key={field.id}
//                             field={field}
//                             idx={idx}
//                         />
//                     ))}
//                 </Reorder.Group>
//             </div>
//             <button
//                 type="button"
//                 onClick={handleAddOption}
//                 className="py-[17.5px] flex items-center gap-3 group cursor-pointer"
//             >
//                 <div className='size-6 grid place-content-center bg-white rounded-full border border-transparent group-hover:bg-blueBtn group-hover:border-blueBtn transition-colors duration-300 ease-in'>
//                     <PlusIcon className="text-blueBtn group-hover:text-white transition-colors duration-200 ease-in" />
//                 </div>
//                 <span className='text-blueBtn text-sm font-medium group-hover:underline underline-offset-4 transition-all duration-200 ease-in'>
//                     Add Options
//                 </span>
//             </button>
//         </div>
//     );
// };

// export default RearrangeAnswers;
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Plus as PlusIcon, Trash2 as DeleteIcon, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import FormMessage from '../../shared/FormMessage';
import AddOptionButton from '../../shared/AddOptionButton';

function SortableItem({ id, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    // const style = {
    //     transform: CSS.Transform.toString(transform),
    //     transition,
    //     opacity: isDragging ? 0.5 : 1,
    //     background: 'white',
    //     borderRadius: '12px',
    //     // marginBottom: '12px',
    //     boxShadow: isDragging ? '6px 15px 28px 12px rgba(0,0,0,0.1),0px 10px 15px -3px rgba(0,0,0,0.1)' : undefined,
    //     cursor: 'grab'
    // };
    const style = {
        transform: isDragging
            ? `${CSS.Transform.toString(transform)} scale(1.03)`
            : CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.95 : 1,
        background: 'white',
        borderRadius: '12px',
        boxShadow: isDragging
            ? '0 8px 32px 0 rgba(80, 36, 255, 0.18), 0 2px 8px 0 rgba(0,0,0,0.12)'
            : '0 1px 3px 0 rgba(0,0,0,0.06)',
        zIndex: isDragging ? 100 : 1,
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

const RearrangeAnswers = ({ name = 'rearrangeOptions', inputRefs }) => {
    const { control, register, formState: { errors } } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({ control, name });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = fields.findIndex(f => f.id === active.id);
            const newIndex = fields.findIndex(f => f.id === over.id);
            move(oldIndex, newIndex);
        }
    };
    const handleAddOption = () => {
        append({ text: '' });
    }

    return (
        <div className="flex flex-col max-h-[400px] overflow-y-auto overflow-x-hidden">
            <label className="font-semibold text-greyPrimary">Select correct order</label>
            <div className='my-4 max-h-[200px] overflow-y-auto overflow-x-hidden'>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                >
                    <SortableContext
                        items={fields.map(f => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {fields.map((field, idx) => (
                            <SortableItem key={field.id} id={field.id}>
                                <div className="flex items-center gap-2 bg-white rounded-xl transition-all duration-200 p-2 border border-transparent">
                                    {/* Drag Handle */}
                                    <div className="cursor-grab flex items-center">
                                        <GripVertical size={20} color="#5C5C5C" />
                                        <span className="h-5 w-[30px] grid place-content-center text-xs font-semibold text-white bg-purplePrimary rounded-full ml-1">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    {/* Input Field */}
                                    <Input
                                        ref={el => inputRefs.current[idx] = el}
                                        className={cn('p-3 flex-1 rounded-xl text-greyAccent font-medium text-sm border border-seperatorPrimary ', {
                                            'border-dangerPrimary': errors[name]?.[idx]?.text?.message
                                        }
                                        )}
                                        {...register(`${name}.${idx}.text`)}
                                        defaultValue={field.text}
                                        placeholder={`Option ${idx + 1}`}

                                    />
                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => remove(idx)}
                                        className="p-2 text-greyPrimary hover:text-dangerPrimary transition-colors duration-300 ease-in"
                                        title="Delete option"
                                    >
                                        <DeleteIcon size={16} />
                                    </button>
                                </div>
                                <FormMessage message={errors[name]?.[idx]?.text?.message} />
                            </SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
            {/* <button
                type="button"
                onClick={() => append({ id: Date.now(), text: '' })}
                className="py-[17.5px] flex items-center gap-3 group cursor-pointer"
            >
                <div className='size-6 grid place-content-center bg-white rounded-full border border-transparent group-hover:bg-blueBtn group-hover:border-blueBtn transition-colors duration-300 ease-in'>
                    <PlusIcon className="text-blueBtn group-hover:text-white transition-colors duration-200 ease-in" />
                </div>
                <span className='text-blueBtn text-sm font-medium group-hover:underline underline-offset-4 transition-all duration-200 ease-in'>
                    Add Options
                </span>
            </button> */}
            <AddOptionButton handleAddOption={handleAddOption} />
        </div>
    );
};

export default RearrangeAnswers;