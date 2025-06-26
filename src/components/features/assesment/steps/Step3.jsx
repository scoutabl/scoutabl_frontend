import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AiIcon from '@/assets/AiIcon.svg?react'
import TickIcon from '@/assets/tick.svg?react'
import MultiSelect from '@/assets/multiSelect.svg?react'
import RatingIcon from '@/assets/ratingIcon.svg?react'
import RearrangeIcon from '@/assets/rearrangeIcon.svg?react'
import NumericInputIcon from '@/assets/numericInputIcon.svg?react'
import EssayIcon from '@/assets/essayIcon.svg?react'
import CodeIcon from '@/assets/codeIcon.svg?react'
import MsExcelIcon from '@/assets/msExcelIcon.svg?react'
import GoogleSheetsIcon from '@/assets/googleSheetsIcon.svg?react'
import VideoIcon from '@/assets/videoIcon.svg?react'
import AudioIcon from '@/assets/audioIcon.svg?react'
import PlusIcon from '@/assets/plusIcon.svg?react'
import TrashIcon from '@/assets/trashIcon.svg?react'
import EditIcon from '@/assets/editquestion.svg?react'
import DuplicateIcon from '@/assets/duplicateIcon.svg?react'
import NoTestIcon from '@/assets/noTestIcon.svg?react'
import ChevronLeftIcon from '@/assets/chevronLeft.svg?react'
import ChevronRightIcon from '@/assets/chevronRight.svg?react'
import { Eye } from 'lucide-react'

const Step3 = () => {
    const [questionSequence, setQuestionSequence] = useState([])
    return (
        <div className='flex flex-col gap-6 px-[116px] py-6'>
            <div className='flex items-center justify-between'>
                <div className='w-[600px] p-4 bg-white rounded-5xl flex items-center gap-4 border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]'>
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
                <div className='min-w-[450px] bg-purpleQuaternary rounded-5xl px-4 py-[25px] flex items-center gap-2'>
                    <AiIcon className='w-4 h-' />
                    <span className='text-[#7C7C7C] font-normal text-sm block max-w-[418px]'><span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text text-sm font-semibold'>Pro Tip:&nbsp;</span>Scoutabl’s AI suggests tests by matching skills in your job description with related tests.</span>
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
            <div className='grid grid-cols-4 bg-white rounded-5xl border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]'>
                <div className='pl-6 py-6 border-r border-[EBEBEB] w-full pr-6'>
                    <h3 className='pb-3 text-sm text-greyPrimary font-semibold'>Choice Based</h3>
                    <div className='flex flex-col items-center gap-3'>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <TickIcon className="h-3 w-3" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Single Select</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto '
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                            <dialog className='p-6 bg-white rounded-5xl border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]'>
                                <div className='flex itekmcer justify-between items-center mb-4'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-lg font-semibold text-greyPrimary'>New Question:</span>
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a fruit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Fruits</SelectLabel>
                                                    <SelectItem value="apple">Apple</SelectItem>
                                                    <SelectItem value="banana">Banana</SelectItem>
                                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                                    <SelectItem value="grapes">Grapes</SelectItem>
                                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </dialog>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <MultiSelect className="h-[14px] w-[14px]" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Multiple Select</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <RatingIcon className="h-3 w-3" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Rating</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <RearrangeIcon className="h-[9px] w-[9px] group-hover:rotate-[-12deg]" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Rearrange</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className='pl-6 py-6 border-r border-[EBEBEB] w-full pr-6'>
                    <h3 className='pb-3 text-sm text-greyPrimary font-semibold'>Text Based</h3>
                    <div className='flex flex-col items-center gap-3'>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <NumericInputIcon className="h-3 w-3" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Numeric Input</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <EssayIcon className="h-3 w-3" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Essay</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className='pl-6 py-6 border-r border-[EBEBEB] w-full pr-6'>
                    <h3 className='pb-3 text-sm text-greyPrimary font-semibold'>Hands-on</h3>
                    <div className='flex flex-col items-center gap-3'>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <CodeIcon className="h-3 w-3" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Code</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <MsExcelIcon className="h-[10px] w-[11px]" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>MS Excel</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <GoogleSheetsIcon className="h-[10px] w-[10.82px]" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Google Sheets</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className='pl-6 py-6 w-full pr-6'>
                    <h3 className='pb-3 text-sm text-greyPrimary font-semibold'>Media</h3>
                    <div className='flex flex-col items-center gap-3'>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <VideoIcon className="h-3 w-3" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Video</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-[9.5px] bg-purpleSecondary rounded-full w-full group hover:bg-greyPrimary transition-all duration-300 ease-in">
                            <div className='h-5 w-5 grid place-content-center bg-white rounded-[6px]'>
                                <AudioIcon className="h-3 w-3" />
                            </div>
                            <span className='text-sm font-semibold text-greyPrimary group-hover:text-white transition-all duration-300 ease-in'>Audio</span>
                            <motion.button
                                className='h-6 w-6 grid place-content-center bg-white rounded-full ml-auto'
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }
                                }>
                                <PlusIcon className="h-[10px] w-[10px] group-hover:rotate-[-12deg]" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-4 flex flex-col gap-4 rounded-5xl bg-white border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)]'>
                {questionSequence.length > 0
                    ?
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-greyPrimary'>Question Sequence</h3>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <input type="checkbox" name="randomize" id="randomize" />
                                    <label htmlFor="randomize" className='text-sm font-medium text-greyAccent'>Randomize Order</label>
                                </div>
                                <div>
                                    <span className='font-semibold text-sm text-greyPrimary'>Total Score:&nbsp;</span>
                                    <span>900</span>
                                </div>
                                <motion.button
                                    className='h-8 w-8 rounded-full grid place-content-center border border-[#E0E0E0]'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <TrashIcon className="text-green-500 font-bold" />
                                </motion.button>
                            </div>
                        </div>
                        <div className="py-3 px-5 grid grid-cols-[minmax(60px,86px)_minmax(200px,1fr)_minmax(80px,103px)_minmax(120px,198px)_minmax(120px,196px)] gap-4 items-center bg-purpleSecondary rounded-xl">
                            {/* Header */}
                            <div className="font-medium">No.</div>
                            <div className="font-medium">Question</div>
                            <div className="font-medium">Time</div>
                            <div className="font-medium">Type</div>
                            <div className="font-medium">Action</div>
                        </div>
                        <div className="py-3 border border-black px-5 grid grid-cols-[minmax(60px,86px)_minmax(200px,1fr)_minmax(80px,103px)_minmax(120px,198px)_minmax(120px,196px)] gap-4 items-center bg-backgroundPrimary rounded-xl">
                            {/* Header */}
                            <div className="font-medium min-w-8 flex items-center justify-center rounded-full border-purplePrimary">01</div>
                            <div className="flex items-center gap-6">
                                <input type="checkbox" name="questionTitle" id="questionTitle" />
                                <label htmlFor="questionTitle" className='truncate'>Have you previously worketnfhjworketnfhjworketnfhjworketnfhjworketnfhj....</label>
                            </div>
                            <div className="font-medium">023 min</div>
                            <div className="font-medium min-w-[150px] rounded-full bg-[#D8FEE3] px-[6px] py-[5.5px] text-[#13482A]">Single Select</div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Eye className='text-greyPrimary font-normal' size={16} />
                                </motion.button>
                                <motion.button
                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <DuplicateIcon className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <EditIcon className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-greyPrimary'>Question Sequence</h3>
                            <div className='flex items-center gap-2'>
                                <input type="checkbox" name="randomize" id="randomize" />
                                <label htmlFor="randomize" className='text-sm font-medium text-greyAccent'>Randomize Order</label>
                            </div>
                        </div>
                        {/* <div className="py-3 px-5 grid grid-cols-[minmax(60px,86px)_minmax(200px,1fr)_minmax(80px,103px)_minmax(120px,198px)_minmax(120px,196px)] gap-4 items-center bg-purpleSecondary rounded-xl">

                            <div className="font-medium">No.</div>
                            <div className="font-medium">Question</div>
                            <div className="font-medium">Time</div>
                            <div className="font-medium">Type</div>
                            <div className="font-medium">Action</div>
                        </div>
                        <div className="py-3 border border-black px-5 grid grid-cols-[minmax(60px,86px)_minmax(200px,1fr)_minmax(80px,103px)_minmax(120px,198px)_minmax(120px,196px)] gap-4 items-center bg-backgroundPrimary rounded-xl">

                            <div className="font-medium min-w-8 flex items-center justify-center rounded-full border-purplePrimary">01</div>
                            <div className="flex items-center gap-6">
                                <input type="checkbox" name="questionTitle" id="questionTitle" />
                                <label htmlFor="questionTitle" className='truncate'>Have you previously worketnfhjworketnfhjworketnfhjworketnfhjworketnfhj....</label>
                            </div>
                            <div className="font-medium">023 min</div>
                            <div className="font-medium min-w-[150px] rounded-full bg-[#D8FEE3] px-[6px] py-[5.5px] text-[#13482A]">Single Select</div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Eye className='text-greyPrimary font-normal' size={16} />
                                </motion.button>
                                <motion.button
                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <DuplicateIcon className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <EditIcon className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    className='w-8 h-8 grid place-content-center bg-white rounded-full'
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div> */}
                        <div className='flex flex-col items-center justify-center gap-6'>
                            <NoTestIcon />
                            <div>
                                <h5 className='pb-[6px] text-center'>You haven’t added test yet!</h5>
                                <span className='text-greyAccent text-sm font-medium text-center block'>Stay productive by creating a task.</span>
                            </div>
                            <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right" className="px-4 py-2 rounded-xl bg-purplePrimary hover:bg-[#EEF2FC] text-sm font-medium hover:text-purplePrimary text-white border border-transparent hover:border-purplePrimary [&_svg]:size-3">
                                Add from Library
                            </Button>
                        </div>
                    </div>
                }
            </div>
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