import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import SimpleCodeNavbar from './SimpleCodeNavbar';

export default function SimpleCodeEditor({ value, onChange, height = 350, languages, loading }) {
    const [selectedLang, setSelectedLang] = useState(() => {
        // Better initialization with fallback
        if (languages && languages.length > 0) {
            return languages[0];
        }
        return null;
    });

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

    return (
        <div className='flex flex-col gap-4'>
            <SimpleCodeNavbar
                languages={languages}
                selectedLang={selectedLang}
                setSelectedLang={setSelectedLang}
                loading={loading}
            />
            <div className='border border-gray-300 rounded-lg overflow-hidden'>
                <Editor
                    height={height}
                    language={selectedLang ? monacoLanguageMap[selectedLang.name] || 'javascript' : 'javascript'}
                    value={value}
                    onChange={onChange}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                    }}
                />
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