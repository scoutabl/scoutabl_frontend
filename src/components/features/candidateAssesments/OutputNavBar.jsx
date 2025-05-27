import testCaseIcon from '/testCaseIcon.svg';
import testResultIcon from '/testResultIcon.svg';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Minimize } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCodingAssesment } from './CodingAssesmentContext';
// Only handle horizontal collapse
const OutputNavBar = ({ activeTab, setActiveTab, collapsed, isOutputCollapsed, onOutputCollapse, collapseDirection, fullscreen, onFullscreen, onExitFullscreen }) => {
    const { setIsOutputFullscreen } = useCodingAssesment();
    // Render vertical OutputNavBar if horizontally collapsed
    if (collapseDirection === 'horizontal' || collapsed) {
        return (
            <div className="min-h-[54px] max-h-[54px] py-3 min-w-[52px] max-w-[52px] flex flex-col items-center gap-4 bg-white justify-between rounded-xl">
                <button
                    className={cn("flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary": activeTab === 'cases',
                        }
                    )}
                    style={{ transform: 'rotate(180deg)' }}
                    onClick={() => setActiveTab && setActiveTab('cases')}
                >
                    <span
                        className='text-sm font-medium text-greyPrimary'
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
                    className={cn("flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary": activeTab === 'results',
                        }
                    )}
                    style={{ transform: 'rotate(180deg)' }}
                    onClick={() => setActiveTab && setActiveTab('results')}
                >
                    <span
                        className='text-sm font-medium text-greyPrimary'
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
                {/* <button
                    className="mt-2 p-2 rounded hover:bg-purpleSecondary"
                    onClick={fullscreen ? onExitFullscreen : onFullscreen}
                    title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                    {fullscreen ? (
                        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M9 9h-6v-6h6v2h-4v4h4v2zm6-6h6v6h-2v-4h-4v-2zm6 12v6h-6v-2h4v-4h2zm-12 6h-6v-6h2v4h4v2z" /></svg>
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.833 5.5H5.5V2.833M12.167 9.5H9.5V12.167M5.5 2.833L1.5 6.833M9.5 12.167L13.5 8.167" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    )}
                </button> */}
            </div>
        )
    }

    // Default: Render full OutputNavBar (horizontal)
    return (
        <div className={cn("px-6 flex items-center justify-between gap-4 bg-white min-h-[52px]", {
            'min-h-[52px]': !isOutputCollapsed,
            'rounded-tl-xl rounded-tr-xl pt-6': fullscreen,
        })}>
            <div className='flex items-center gap-4'>
                <button
                    className={cn(
                        "text-nowrap flex items-center gap-2 px-4 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary": activeTab === 'cases',
                        }
                    )}
                    onClick={() => setActiveTab('cases')}
                >
                    <img src={testCaseIcon} alt="testCaseIcon" />
                    Test cases
                </button>
                <button
                    className={cn(
                        "text-nowrap flex items-center gap-2 px-4 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-md hover:bg-purpleSecondary",
                        {
                            "bg-purpleSecondary": activeTab === 'results',
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
                        className="ml-2 p-2 rounded hover:bg-purpleSecondary duration-300 transition-all"
                        onClick={onExitFullscreen}
                        title='Exit Fullscreen'
                    >
                        <Minimize className="w-4 h-4 text-greyPrimary" />
                    </button>
                ) : (
                    // Show collapse and fullscreen button (SVG icon)
                    <>
                        {!fullscreen && ( // Keep existing logic for collapse button visibility
                            <button
                                className='h-8 w-8 grid place-content-center rounded-[8px] hover:bg-purpleSecondary transition-all duration-300 ease-in-out'
                                onClick={onOutputCollapse}
                                title={isOutputCollapsed ? "Expand Output" : "Collapse Output"}
                            >
                                <motion.div
                                    animate={{ rotate: isOutputCollapsed ? 0 : 180 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ display: 'inline-block' }}
                                >
                                    <ChevronUp />
                                </motion.div>
                            </button>
                        )}
                        {onFullscreen && ( // Check if onFullscreen prop is provided
                            <button
                                className="ml-2 p-2 rounded hover:bg-purpleSecondary duration-300 transition-all"
                                onClick={onFullscreen}
                                title='Fullscreen'
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 1.5H2.83333C2.09695 1.5 1.5 2.09695 1.5 2.83333V5.5M5.5 13.5H2.83333C2.09695 13.5 1.5 12.903 1.5 12.1667V9.5M9.5 1.5H12.1667C12.903 1.5 13.5 2.09695 13.5 2.83333V5.5M13.5 9.5V12.1667C13.5 12.903 12.903 13.5 12.1667 13.5H9.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OutputNavBar; 