import React from 'react'
import AiIcon from '@/assets/AiIcon.svg?react'
const Step3 = () => {
    return (
        <div className='flex flex-col gap-6'>
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
                <div className='min-w-[400px] bg-purpleQuaternary rounded-5xl p-4 flex items-center gap-[6px]'>
                    <AiIcon className='w-4 h-' />
                    <span className='text-purplePrimary font-semibold text-xl'>Scoutabl’s AI suggests tests by matching skills in your job description with related tests.</span>
                </div>
            </div>
        </div>
    )
}

export default Step3