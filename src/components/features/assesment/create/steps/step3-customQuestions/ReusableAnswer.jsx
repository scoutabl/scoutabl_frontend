import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import QuestionIcon from '@/assets/questionIcon.svg?react'

const ReusableAnswer = ({ register, errors }) => {
    return (
        <div className='p-4 bg-purpleSecondary rounded-5xl flex flex-col gap-4'>
            <div className='flex flex-col gap-[6px]'>
                <h3 className='text-sm font font-semibold text-primary'>Information for your team (optional)</h3>
                <span className='text-xs font-medium text-greyPrimary'>This information will not be visible to candidates.</span>
            </div>
            <div className='flex flex-col gap-1'>
                <div className="flex items-center gap-2">
                    <label htmlFor="title" className="text-sm font-medium text-greyPrimary">
                        Question title
                    </label>
                    <QuestionIcon />
                </div>
                <Input
                    id='title'
                    className='bg-white border border-greySecondary rounded-xl h-[45px] px-4 text-sm font-medium text-primary placeholder:text-greyAccent'
                    placeholder='Write your answer here..'
                    {...register('title')}
                />
                {errors?.title && (
                    <span className="text-xs text-red-500 font-medium">{errors.title.message}</span>
                )}
            </div>
            <div className='flex flex-col gap-1'>
                <div className="flex items-center gap-2">
                    <label htmlFor="relevance_context" className="text-sm font-medium text-greyPrimary">
                        Why is this question relevant?
                    </label>
                    <QuestionIcon />
                </div>
                <Textarea
                    id='relevance_context'
                    className='max-w-[532px] bg-white border border-greySecondary rounded-xl px-4 text-sm font-medium text-primary placeholder:text-greyAccent resize-none'
                    placeholder='Write your answer here..'
                    {...register('relevance_context')}
                />
                {errors?.relevance_context && (
                    <span className="text-xs text-red-500 font-medium">{errors.relevance_context.message}</span>
                )}
            </div>
            <div className='flex flex-col gap-1'>
                <div className="flex items-center gap-2">
                    <label htmlFor="look_for_context" className="flex text-sm font-medium text-greyPrimary">
                        What to look for in the answer?
                    </label>
                    <QuestionIcon />
                </div>
                <Textarea
                    id='look_for_context'
                    className='max-w-[532px] bg-white border border-greySecondary rounded-xl h-[45px] px-4 text-sm font-medium text-primary placeholder:text-greyAccent resize-none'
                    placeholder='Write your answer here..'
                    {...register('look_for_context')}
                />
                {errors?.look_for_context && (
                    <span className="text-xs text-red-500 font-medium">{errors.look_for_context.message}</span>
                )}
            </div>
        </div>
    )
}

export default ReusableAnswer