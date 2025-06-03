import React from 'react'
import PlusIcon from '@/assets/plusIcon.svg?react'
import CreateAiIcon from '@/assets/createAiIcon.svg?react'
import { Button } from '@/components/ui/button'
import ActiveAssementIcon from '@/assets/activeAssesment.svg?react'
import InvitationSentIcon from '@/assets/invitationSent.svg?react'
import TotalCandidatesIcon from '@/assets/totalCandidates.svg?react'
import CompletionRateIcon from '@/assets/completionRate.svg?react'
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

const Assesment = () => {
    return (
        <section className='py-6 px-[116px] flex flex-col gap-6 bg-backgroundPrimary'>
            {/* header */}
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-2xl text-greyPrimary'>Assesments</h1>
                <div className='flex items-center gap-3'>
                    <Button variant='primary' className='p-3 flex items-center gap-2 rounded-2xl group'>
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

            </div>
        </section>
    )
}

export default Assesment