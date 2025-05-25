import React, { useEffect, useState } from 'react';
import logo from '/scoutableBlackLogo.svg'
import timerLogo from '/timerLogo.svg'
import { Progress } from '@/components/ui/progress'

export default function AssessmentNavbar({ currentIndex, total, initialMinutes = 90 }) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    return (
        <div className='flex items-center justify-between h-[44px]'>
            <div className='flex gap-1 items-center justify-center'>
                <img src={logo} alt='scoutabl logo' className='h-[30px] w-[30px]' />
                <h1 className='text-2xl text-greyPrimary font-bold'>Scoutabl</h1>
            </div>
            <div className='flex flex-col gap-1 items-center justify-center'>
                <span className="text-base font-normal">
                    Problem Solving <span className='font-bold text-greyPrimary'>({currentIndex + 1}/{total})</span>
                </span>
                <Progress value={currentIndex + 1} max={total} className='w-[100px] h-3 bg-[#DCD9D9] rounded-full' />
            </div>
            <div className='flex gap-1 items-center justify-center'>
                <img src={timerLogo} alt='timer logo' />
                <span className="mr-2">Time Left:</span>
                {(() => {
                    const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
                    const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
                    const seconds = String(timeLeft % 60).padStart(2, '0');
                    const boxClass = "bg-greyPrimary text-white p-1 rounded-[5px] text-sm font-bold mx-1 min-w-[40px] text-center border-2 border-[#A4A4A4]";
                    return (
                        <span className="flex items-center gap-1">
                            <span className={boxClass}>{hours}</span>
                            <span className="text-black font-bold">:</span>
                            <span className={boxClass}>{minutes}</span>
                            <span className="text-black font-bold">:</span>
                            <span className={boxClass}>{seconds}</span>
                        </span>
                    );
                })()}
            </div>
        </div>
    );
}
