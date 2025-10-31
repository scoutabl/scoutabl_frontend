import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import SimpleCodeNavbar from './SimpleCodeNavbar';
import ResetIcon from '@/assets/resetIcon.svg?react';

export default function SimpleCodeEditor({ value, onChange, height = 350, languages, loading }) {
    const [selectedLang, setSelectedLang] = useState(() => {
        // Better initialization with fallback
        if (languages && languages.length > 0) {
            return languages[0];
        }
        return null;
    });

    // Always show a valid language after language list changes
    useEffect(() => {
        if (languages && languages.length > 0) {
            // If not actually in the list, reset
            if (!selectedLang || !languages.some(l => l.name === selectedLang.name)) {
                setSelectedLang(languages[0]);
            }
        } else {
            setSelectedLang(null);
        }
    }, [languages]);

    // Safety: never send undefined to Monaco value prop
    let codeValue = '';
    if (selectedLang && value && typeof value === 'object') {
        codeValue = value[selectedLang.name] || '';
    }

    // Add a safety check for the entire component
    if (!languages || languages.length === 0) {
        return (
            <div className='flex flex-col gap-4'>
                <div className='text-center text-gray-500 py-8'>
                    No programming languages available
                </div>
            </div>
        );
    }

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

    // Handler passed to navbar to do per-language reset
    const handleResetToDefault = (langName, defaultValue) => {
        if (onChange && langName) {
            onChange({ ...value, [langName]: defaultValue });
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            <SimpleCodeNavbar
                languages={languages}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                loading={loading}
                onResetToDefault={handleResetToDefault}
                value={value}
            />
            <div className='border border-gray-300 rounded-lg overflow-hidden'>
                {selectedLang ? (
                    <Editor
                        height={height}
                        language={selectedLang ? monacoLanguageMap[selectedLang.name] || 'javascript' : 'javascript'}
                        value={codeValue}
                        onChange={val => onChange && onChange({ ...value, [selectedLang.name]: val || '' })}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            lineNumbers: 'on',
                            wordWrap: 'on',
                        }}
                    />
                ) : (
                    <div className='text-center text-greyAccent p-8'>No language selected</div>
                )}
            </div>
            <div className='flex flex-col gap-1'>
                <span className='text-xs font-normal text-greyPrimary'>
                    File extension: {selectedLang?.fileExtension || 'N/A'}
                </span>
                <span className='text-xs font-normal text-greyPrimary'>
                    {`Run: node {file}`}
                </span>
            </div>
        </div>
    );
}