import testCaseIcon from '/testCaseIcon.svg';
import testResultIcon from '/testResultIcon.svg';
import { cn } from '@/lib/utils';
const OutputNavBar = ({ activeTab, setActiveTab, collapsed }) => {

    if (collapsed) {
        return (
            <div className="py-8 min-w-[82px] max-w-[82px] flex flex-col items-center gap-4 bg-purpleSecondary justify-around rounded-xl">
                <button
                    style={{ transform: 'rotate(180deg)' }}
                    className={cn(
                        "flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                        {
                            "bg-white": activeTab === 'cases',
                        }
                    )}
                    onClick={() => setActiveTab && setActiveTab('cases')}
                >
                    <span style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>Testcase</span>
                    <img src={testCaseIcon} alt="testCaseIcon" style={{ transform: 'rotate(-90deg)' }} />
                </button>
                <button
                    style={{ transform: 'rotate(180deg)' }}
                    className={cn(
                        "flex flex-col items-center gap-2 px-2 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                        {
                            "bg-white": activeTab === 'results',
                        }
                    )}
                    onClick={() => setActiveTab && setActiveTab('results')}
                >
                    <span style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>Test Result</span>
                    <img src={testResultIcon} alt="testResultIcon" style={{ transform: 'rotate(-90deg)' }} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 bg-purpleSecondary px-6 py-3">
            <button
                className={cn(
                    "flex items-center gap-2 px-4 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                    {
                        "bg-white": activeTab === 'cases',
                    }
                )}
                onClick={() => setActiveTab('cases')}
            >
                <img src={testCaseIcon} alt="testCaseIcon" />
                Testcase
            </button>
            <button
                className={cn(
                    "flex items-center gap-2 px-4 py-2 text-greyPrimary text-sm font-medium border-b-2 transition-colors duration-200 border-transparent rounded-full",
                    {
                        "bg-white": activeTab === 'results',
                    }
                )}
                onClick={() => setActiveTab('results')}
            >
                <img src={testResultIcon} alt="testResultIcon" />
                Test Result
            </button>
        </div>
    );
};

export default OutputNavBar; 