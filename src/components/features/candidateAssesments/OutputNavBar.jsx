import testCaseIcon from '/testCaseIcon.svg';
import testResultIcon from '/testResultIcon.svg';
import { cn } from '@/lib/utils';
import { ChevronUp, Minimize, Maximize } from 'lucide-react';
import MaximizeIcon from '@/assets/maximizeIcon.svg?react'
import ChevronDown from '@/assets/chevron-down.svg?react'
import { motion } from 'framer-motion';
import { useCodingAssesment } from './CodingAssesmentContext';
// Only handle horizontal collapse
const OutputNavBar = ({ activeTab, setActiveTab, collapsed, isOutputCollapsed, onOutputCollapse, collapseDirection, fullscreen, onFullscreen, onExitFullscreen }) => {
    const { setIsOutputFullscreen } = useCodingAssesment();
    // Render vertical OutputNavBar if horizontally collapsed
    if (collapseDirection === 'horizontal' || collapsed) {
        return (
            <div className="min-h-[54px] py-3 min-w-[52px] max-w-[52px] flex flex-col items-center gap-4 dark:bg-blackPrimary bg-white justify-between rounded-xl">
                <button
                    className={cn("flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary group",
                        {
                            "bg-purpleSecondary": activeTab === 'cases',
                        }
                    )}
                    style={{ transform: 'rotate(180deg)' }}
                    onClick={() => setActiveTab && setActiveTab('cases')}
                >
                    <span
                        className={cn('text-sm font-medium text-greyPrimary  dark:text-white group-hover:dark:text-greyPrimary',
                            { 'dark:text-greyPrimary ': activeTab === 'cases', }
                        )}
                        style={{
                            writingMode: 'vertical-lr',
                            textOrientation: 'mixed',
                            transform: 'rotate(180deg)',
                            marginTop: 2
                        }}
                    >
                        Test Cases
                    </span>
                    <img src={testCaseIcon} alt="testCaseIcon" style={{ transform: 'rotate(-90deg)' }} />
                </button>
                <button
                    className={cn("flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary group",
                        {
                            "bg-purpleSecondary": activeTab === 'results',
                        }
                    )}
                    style={{ transform: 'rotate(180deg)' }}
                    onClick={() => setActiveTab && setActiveTab('results')}
                >
                    <span
                        className={cn('text-sm font-medium text-greyPrimary  dark:text-white group-hover:dark:text-greyPrimary',
                            { 'dark:text-greyPrimary ': activeTab === 'results', }
                        )}
                        style={{
                            writingMode: 'vertical-lr',
                            textOrientation: 'mixed',
                            transform: 'rotate(180deg)',
                            marginTop: 2
                        }}
                    >
                        Test Results
                    </span>
                    <img src={testResultIcon} alt="testResultIcon" style={{ transform: 'rotate(-90deg)' }} />
                </button>
            </div >
        )
    }

    // Default: Render full OutputNavBar (horizontal)
    return (
        <div
            className={cn(
                "flex items-center justify-between gap-4 bg-white dark:bg-blackPrimary min-h-[52px] min-w-0 overflow-x-auto",
                isOutputCollapsed
                    ? "p-6"
                    : "px-6 pt-6"
            )}
        >
            <div className='flex items-center gap-4'>
                <button
                    className={cn(
                        "text-nowrap flex items-center gap-2 px-4 py-2 text-greyPrimary dark:text-white hover:dark:text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary dark:text-greyPrimary": activeTab === 'cases',
                        }
                    )}
                    onClick={() => setActiveTab('cases')}
                >
                    <img src={testCaseIcon} alt="testCaseIcon" />
                    Test cases
                </button>
                <button
                    className={cn(
                        "text-nowrap flex items-center gap-2 px-4 py-2 text-greyPrimary dark:text-white hover:dark:text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary dark:text-greyPrimary": activeTab === 'results',
                        }
                    )}
                    onClick={() => setActiveTab('results')}
                >
                    <img src={testResultIcon} alt="testResultIcon" />
                    Test Result
                </button>
            </div>
            <div className='flex items-center gap-[1rem]'>
                {/* Use onExitFullscreen prop to determine fullscreen state */}
                {onExitFullscreen ? (
                    // Show exit fullscreen button (Minimize icon)
                    <button
                        className="ml-2 p-2 rounded hover:bg-purpleSecondary duration-300 transition-all group"
                        onClick={onExitFullscreen}
                        title='Exit Fullscreen'
                    >
                        <Minimize className="w-4 h-4 text-greyPrimary dark:text-white group-hover:dark:text-greyPrimary" />
                    </button>
                ) : (
                    // Show collapse and fullscreen button (SVG icon)
                    <>
                        {!fullscreen && ( // Keep existing logic for collapse button visibility
                            <button
                                className='h-8 w-8 grid place-content-center rounded-[8px] hover:bg-purpleSecondary transition-all duration-300 ease-in-out group'
                                onClick={onOutputCollapse}
                                title={isOutputCollapsed ? "Expand Output" : "Collapse Output"}
                            >
                                <motion.div
                                    animate={{ rotate: isOutputCollapsed ? 0 : 180 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ display: 'inline-block' }}
                                >
                                    <ChevronDown className="dark:text-white group-hover:dark:text-greyPrimary" />
                                </motion.div>
                            </button>
                        )}
                        {onFullscreen && ( // Check if onFullscreen prop is provided
                            <button
                                className="ml-2 p-2 rounded hover:bg-purpleSecondary duration-300 transition-all group"
                                onClick={onFullscreen}
                                title='Fullscreen'
                            >
                                <MaximizeIcon className="dark:text-white group-hover:dark:text-greyPrimary" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OutputNavBar; 