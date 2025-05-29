import React, { useEffect, useState } from 'react';
import TimerIcon from '@/assets/timerLogo.svg?react'
import ScoutableVectorLogoDark from '@/assets/scoutableLogoVector.svg?react'
import ScoutableVectorLogoLight from '@/assets/scoutableLogoWhiteVector.svg?react'
import SunIcon from '@/assets/sunIcon.svg?react'
import { Progress } from '@/components/ui/progress'
import { Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function AssessmentNavbar({ currentIndex = 1, total = 15, initialMinutes = 90 }) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    return (
        <div className='flex items-center justify-between h-[44px]'>
            {isDarkMode ? <ScoutableVectorLogoDark /> : <ScoutableVectorLogoLight />}

            <div className='flex flex-col gap-1 items-center justify-center'>
                <span className="text-base font-normal text-greyPrimary dark:text-white">
                    Problem Solving <strong>({currentIndex + 1}/{total})</strong>
                </span>
                <Progress value={currentIndex + 1} max={total} className='w-[100px] h-3 bg-[#DCD9D9] rounded-full' />
            </div>
            <div className='flex items-center gap-6'>
                <button
                    onClick={toggleDarkMode}
                    className={`
    w-[42px] h-[24px] flex items-center rounded-full transition-colors duration-300
    bg-purplePrimary relative
  `}
                    aria-label="Toggle theme"
                >
                    <span
                        className={`
      absolute left-1 top-1 transition-transform duration-300
      ${isDarkMode ? 'translate-x-[18px]' : 'translate-x-0'}
    `}
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                        }}
                    >
                        {isDarkMode
                            ? <Moon size={9} className="text-purplePrimary" />
                            : <SunIcon />
                        }
                    </span>
                </button>
                <div className='flex gap-1 items-center justify-center'>
                    <TimerIcon className="text-greyPrimary dark:text-white" />
                    <span className="text-base font-normal text-greyPrimary dark:text-white mr-2">Time Left:</span>
                    {(() => {
                        const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
                        const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
                        const seconds = String(timeLeft % 60).padStart(2, '0');
                        const boxClass = "h-6 w-[30px] grid place-content-center bg-greyPrimary text-white p-1 rounded-[5px] text-sm font-bold text-center border-2 border-[#A4A4A4]";
                        return (
                            <div className="flex items-center gap-2">
                                <span className={boxClass}>{hours}</span>
                                <span className="text-black dark:text-white font-bold">:</span>
                                <span className={boxClass}>{minutes}</span>
                                <span className="text-black dark:text-white font-bold">:</span>
                                <span className={boxClass}>{seconds}</span>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
