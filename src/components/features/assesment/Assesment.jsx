import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import PlusIcon from '@/assets/plusIcon.svg?react'
import CreateAiIcon from '@/assets/createAiIcon.svg?react'
import ActiveAssementIcon from '@/assets/activeAssesment.svg?react'
import InvitationSentIcon from '@/assets/invitationSent.svg?react'
import TotalCandidatesIcon from '@/assets/totalCandidates.svg?react'
import CompletionRateIcon from '@/assets/completionRate.svg?react'
import DotsIcon from '@/assets/dots.svg?react'
import EditIcon from '@/assets/editIcon.svg?react'
import PreviewIcon from '@/assets/previewIcon.svg?react'
import DuplicateIcon from '@/assets/duplicateIcon.svg?react'
import ShareIcon from '@/assets/shareIcon.svg?react'
import SettingsIcon from '@/assets/settingsIcon.svg?react'
import TrashIcon from '@/assets/trashIcon.svg?react'
import { Eye, Trash2 } from 'lucide-react'
import { ROUTES } from "../../../lib/routes";
const options = [
    {
        title: 'Active Assessments',
        total: 13,
        icon: <ActiveAssementIcon />
    },
    {
        title: 'Invitations Sent',
        total: 12256,
        icon: <InvitationSentIcon />
    },
    {
        title: 'Total Candidates',
        total: 1256,
        icon: <TotalCandidatesIcon />
    },
    {
        title: 'Overall Completion Rate',
        total: '76%',
        icon: <CompletionRateIcon />
    }

]

// const assesments = [
//     {
//         status: 'Published',
//         title: 'Senior UX Designer Assessment ',
//         owner: 'Molly Williams',
//         expires: '21/ Feb/ 2025',
//         tags: ['Skills & Coding', 'random'],
//         candidates: 3128
//     },
//     {
//         status: 'Archived',
//         title: 'Senior UX Designer Assessment ',
//         owner: 'Molly Williams',
//         expires: '21/ Feb/ 2025',
//         tags: ['Skills & Coding', 'random'],
//         candidates: 3128
//     },
//     {
//         status: 'Draft',
//         title: 'Senior UX Designer Assessment ',
//         owner: 'Molly Williams',
//         expires: '21/ Feb/ 2025',
//         tags: ['Skills & Coding', 'random'],
//         candidates: 3128
//     },
//     {
//         status: 'Published',
//         title: 'Senior UX Designer Assessment ',
//         owner: 'Molly Williams',
//         expires: '21/ Feb/ 2025',
//         tags: ['Skills & Coding', 'random'],
//         candidates: 3128
//     },
//     {
//         status: 'Archived',
//         title: 'Senior UX Designer Assessment ',
//         owner: 'Molly Williams',
//         expires: '21/ Feb/ 2025',
//         tags: ['Skills & Coding', 'random'],
//         candidates: 3128
//     },
//     {
//         status: 'Draft',
//         title: 'Senior UX Designer Assessment ',
//         owner: 'Molly Williams',
//         expires: '21/ Feb/ 2025',
//         tags: ['Skills & Coding', 'random'],
//         candidates: 3128
//     }
// ]

const Assesment = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [openPopoverIndex, setOpenPopoverIndex] = useState(null);
    const [assessments, setAssessments] = useState([
        {
            id: 1,
            status: 'Published',
            title: 'Senior UX Designer Assessment ',
            owner: 'Molly Williams',
            expires: '21/ Feb/ 2025',
            tags: ['Skills & Coding', 'random'],
            candidates: 3128
        },
        {
            id: 2,
            status: 'Archived',
            title: 'Senior UX Designer Assessment ',
            owner: 'Molly Williams',
            expires: '21/ Feb/ 2025',
            tags: ['Skills & Coding', 'random'],
            candidates: 3128
        },
        {
            id: 3,
            status: 'Draft',
            title: 'Senior UX Designer Assessment ',
            owner: 'Molly Williams',
            expires: '21/ Feb/ 2025',
            tags: ['Skills & Coding', 'random'],
            candidates: 3128
        },
        {
            id: 4,
            status: 'Published',
            title: 'Senior UX Designer Assessment ',
            owner: 'Molly Williams',
            expires: '21/ Feb/ 2025',
            tags: ['Skills & Coding', 'random'],
            candidates: 3128
        },
        {
            id: 5,
            status: 'Archived',
            title: 'Senior UX Designer Assessment ',
            owner: 'Molly Williams',
            expires: '21/ Feb/ 2025',
            tags: ['Skills & Coding', 'random'],
            candidates: 3128
        },
        {
            id: 6,
            status: 'Draft',
            title: 'Senior UX Designer Assessment ',
            owner: 'Molly Williams',
            expires: '21/ Feb/ 2025',
            tags: ['Skills & Coding', 'random'],
            candidates: 3128
        }
    ])
    const navigate = useNavigate();

    const removeAssesment = (id) => {
        setAssessments(assessments.filter(assesment => assesment.id !== id))
        setOpenPopoverIndex(null)
    }

    return (
        <section className='py-6 px-[116px] flex flex-col gap-6 bg-backgroundPrimary'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-2xl text-greyPrimary'>Assesments</h1>
                <div className='flex items-center gap-3'>
                    <Button
                        variant='primary'
                        className='p-3 flex items-center gap-2 rounded-2xl group'
                        onClick={() => navigate(ROUTES.ASSESSMENT_CREATE.replace(":stepId", "1"))}
                    >
                        <div className='h-6 w-6 rounded-full bg-white grid place-content-center'>
                            <PlusIcon className="text-purplePrimary" />
                        </div>
                        <span className='text-base font-semibold text-white'>Create Assesment</span>
                    </Button>
                    <Button variant='secondary' className='p-3 flex items-center gap-2 rounded-2xl'>
                        <div className='h-6 w-6 rounded-full grid place-content-center'>
                            <CreateAiIcon />
                        </div>
                        <span className='text-base font-semibold'>Create using AI</span>
                    </Button>
                </div>
            </div>



            {/* flex counter */}
            <div className="option-grid">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className="p-3 flex flex-col items-center md:items-start gap-[3px] rounded-2xl bg-white"
                    >
                        <h2 className="text-[2rem] font-semibold text-greyPrimary">
                            {typeof option.total === 'number' ? option.total.toLocaleString() : option.total}
                        </h2>
                        <div className="flex items-center gap-[6px]">
                            {option.icon}
                            <span className="text-sm text-greyPrimary">{option.title}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* search Filter & asssesments section */}
            <div className='p-6 flex flex-col gap-6 rounded-5xl bg-purpleSecondary'>
                {/* search */}
                <div className='flex items-center justify-between'>
                    <input type="search" name="assesment-card-filter" id="assesment-card-filter" />
                </div>
                {/* Assessments Card  */}
                <div className='assesment-grid'>
                    <AnimatePresence>
                        {assessments.map((assesment) => {
                            return (
                                <motion.div
                                    key={assesment.id}
                                    className='py-[18px] px-4 flex flex-col gap-4 rounded-2xl border border-seperatorPrimary bg-white'
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -100 }}
                                    layout
                                >
                                    <div className='flex items-center justify-between'>
                                        <div className={cn('px-3 py-1 flex items-center gap-[6px] rounded-full', {
                                            'bg-[#DDF3E3]': assesment.status.toLowerCase() === 'published',
                                            'bg-[#FBDDDD]': assesment.status.toLowerCase() === 'archived',
                                            'bg-[#FFE2CB]': assesment.status.toLowerCase() === 'draft',
                                        })}
                                        >
                                            <div className={cn('h-2 w-2 rounded-full', {
                                                'bg-[#008D0A]': assesment.status.toLowerCase() === 'published',
                                                'bg-[#EB5757]': assesment.status.toLowerCase() === 'archived',
                                                'bg-[#E68335]': assesment.status.toLowerCase() === 'draft',
                                            }
                                            )}
                                            />
                                            <span className={cn('text-xs font-medium', {
                                                'text-[#008D0A]': assesment.status.toLowerCase() === 'published',
                                                'text-[#EB5757]': assesment.status.toLowerCase() === 'archived',
                                                'text-[#E68335]': assesment.status.toLowerCase() === 'draft',
                                            })}>{assesment.status}</span>
                                        </div>
                                        <Popover
                                            open={openPopoverIndex === assesment.id}
                                            onOpenChange={(open) => setOpenPopoverIndex(open ? assesment.id : null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <button className='h-[28px] w-[28px] grid place-content-center rounded-full bg-backgroundPrimary'>
                                                    <DotsIcon />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className='p-0 flex flex-col max-w-[240px] rounded-2xl bg-white'>
                                                {[
                                                    {
                                                        icon: <EditIcon className='text-greyAccent group-hover:text-purplePrimary' />,
                                                        label: 'Edit',
                                                        color: 'text-greyAccent',
                                                        hover: 'group-hover:text-purplePrimary',
                                                        key: 'edit',
                                                        rounded: 'rounded-tl-2xl rounded-tr-2xl',
                                                    },
                                                    {
                                                        icon: <Eye className='w-4 h-4 text-greyAccent group-hover:text-purplePrimary' />,
                                                        label: 'Preview',
                                                        color: 'text-greyAccent',
                                                        hover: 'group-hover:text-purplePrimary',
                                                        key: 'preview',
                                                    },
                                                    {
                                                        icon: <ShareIcon className='text-greyAccent group-hover:text-purplePrimary' />,
                                                        label: 'Share Preview Link',
                                                        color: 'text-greyAccent',
                                                        hover: 'group-hover:text-purplePrimary',
                                                        key: 'share',
                                                    },
                                                    {
                                                        icon: <InvitationSentIcon className='text-greyAccent group-hover:text-purplePrimary' />,
                                                        label: 'Invite Candidates',
                                                        color: 'text-greyAccent',
                                                        hover: 'group-hover:text-purplePrimary',
                                                        key: 'invite',
                                                    },
                                                    {
                                                        icon: <DuplicateIcon className='text-greyAccent group-hover:text-purplePrimary' />,
                                                        label: 'Duplicate',
                                                        color: 'text-greyAccent',
                                                        hover: 'group-hover:text-purplePrimary',
                                                        key: 'duplicate',
                                                    },
                                                    {
                                                        icon: <SettingsIcon className='text-greyAccent group-hover:text-purplePrimary' />,
                                                        label: 'Settings',
                                                        color: 'text-greyAccent',
                                                        hover: 'group-hover:text-purplePrimary',
                                                        key: 'settings',
                                                    },
                                                    {
                                                        icon: <Trash2 className='w-5 h-5 text-greyAccent group-hover:text-[#EB5757]' />,
                                                        label: 'Delete Assessment',
                                                        color: 'text-greyAccent',
                                                        hover: 'group-hover:text-[#EB5757]',
                                                        key: 'delete',
                                                        rounded: 'rounded-bl-2xl rounded-br-2xl',
                                                    },
                                                ].map((item, idx, arr) => {
                                                    const isFirst = idx === 0;
                                                    const isLast = idx === arr.length - 1;
                                                    const rounded = item.rounded || (isFirst ? 'rounded-tl-2xl rounded-tr-2xl' : isLast ? 'rounded-bl-2xl rounded-br-2xl' : '');
                                                    return (
                                                        <button
                                                            onClick={() => {
                                                                if (item.key === 'delete') removeAssesment(assesment.id);
                                                                else if (item.key === 'edit') handleEdit(assesment.id);
                                                                // ...other actions
                                                                setOpenPopoverIndex(null);
                                                            }}
                                                            key={item.key}
                                                            className={cn('relative py-3 px-4 flex gap-3 items-center group w-full text-left hover:bg-purpleTertiary', {
                                                                'hover:bg-[#FBDDDD]': item.key === 'delete',

                                                            })

                                                            }
                                                        >
                                                            <div className={cn('absolute left-0 top-0 h-full w-1 opacity-0 group-hover:opacity-100 bg-purplePrimary', {
                                                                'bg-[#EB5757]': item.key === 'delete'
                                                            })} />
                                                            {item.icon}
                                                            <span className={`font-medium text-sm text-nowrap ${item.color} ${item.hover}`}>{item.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <h2 className='text-base text-semibold text-greyPrimray'>{assesment.title}</h2>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-purplePrimary'>Owner</span>
                                            <div className='flex items-center gap-1'>
                                                {/* image will come here */}
                                                <span className='text-xs text-greyPrimary'>{assesment.owner}</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-purplePrimary'>Expires</span>
                                            <div className='flex items-center gap-1'>
                                                <span className='text-xs text-greyPrimary'>{assesment.expires}</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            {assesment.tags.map((tag, index) => {
                                                return (
                                                    <div key={index} className='px-3 py-1 bg-blueSecondary rounded-full'>
                                                        <span className='text-xs text-greyAccent'>{tag}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className='flex gap-1 items-center'>
                                            <TotalCandidatesIcon className='h-[18px] w-6' />
                                            <span className='text-2xl text-greyPrimray font-bold'>{assesment.candidates}</span>
                                            <span className='text-sm text-greyAccent'>Candidates</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section >
    )
}

export default Assesment