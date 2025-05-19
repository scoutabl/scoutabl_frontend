import testCaseIcon from '/testCaseIcon.svg';
import testResultIcon from '/testResultIcon.svg';
import { cn } from '@/lib/utils';
const OutputNavBar = ({ activeTab, setActiveTab }) => {
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