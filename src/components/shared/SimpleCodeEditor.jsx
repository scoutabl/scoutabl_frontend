import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import SimpleCodeNavbar from './SimpleCodeNavbar';

export default function SimpleCodeEditor({ value, onChange, height = 350, languages, loading }) {
    const [selectedLang, setSelectedLang] = useState(languages && languages.length > 0 ? languages[0] : null);

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
            <div className='px-6 py-8 rounded-5xl border border-seperatorPrimary h-[394px] w-full'>
                <Editor
                    key={selectedLang ? selectedLang.name : 'editor'}
                    height='100%'
                    width='100%'
                    language={
                        selectedLang && selectedLang.name
                            ? monacoLanguageMap[selectedLang.name.toLowerCase().replace(/ /g, '')] || 'plaintext'
                            : 'plaintext'
                    }
                    value={
                        selectedLang && selectedLang.name && value
                            ? value[selectedLang.name] || ''
                            : ''
                    }
                    onChange={code => {
                        if (selectedLang && selectedLang.name) {
                            onChange({ ...value, [selectedLang.name]: code });
                        }
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        fixedOverflowWidgets: true,
                    }}
                />
            </div>
            <div className='flex flex-col gap-1'>
                {/* should be dynamic */}
                <span className='text-xs font-normal text-greyPrimary'>File extension: {selectedLang.fileExtension}</span>
                <span className='text-xs font-normal text-greyPrimary'>{`Run: node {file}`}</span>
            </div>
        </div>
    );
}