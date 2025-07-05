import { useState, useEffect } from 'react'
import CustomDropdown from './CustomDropdown';
import ResetIcon from '@/assets/resetIcon.svg?react'
const SimpleCodeNavbar = ({ languages, selectedLang, setSelectedLang, loading, isOpen, setIsOpen }) => {
    const [error, setError] = useState(null);

    const monacoLanguageMap = {
        python3: 'python',
        python: 'python',
        nodejs: 'javascript',
        js: 'javascript',
        javascript: 'javascript',
        cpp: 'cpp',
        java: 'java',
        csharp: 'csharp',
        ruby: 'ruby',
        go: 'go',
        php: 'php',
        swift: 'swift',
        kotlin: 'kotlin',
    };

    useEffect(() => {
        if (languages && languages.length > 0) {
            setSelectedLang(languages[0]);
            console.log("selectedLang", selectedLang?.default_template?.content);
        }
    }, [languages]);

    return (
        <div className='flex items-center justify-between bg-purpleSecondary px-6 py-3 rounded-xl'>
            <CustomDropdown
                languages={languages}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                loading={loading}
            />
            <button onClick={(e) => e.preventDefault()} className='px-3 py-[4px] flex items-center gap-1 text-white text-xs bg-purplePrimary rounded-md'>
                <ResetIcon className="text-white size-3" />
                Reset to Default
            </button>
        </div>
    )
}

export default SimpleCodeNavbar