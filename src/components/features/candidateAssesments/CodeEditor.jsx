import { useEffect, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import CodeNavBar from './CodeNavBar'
import { CODE_SNIPPETS } from '@/lib/constants'
import Output from './Output'
const CodeEditor = () => {
    const [value, setValue] = useState('')
    const [language, setLanguage] = useState('python')
    const editorRef = useRef()
    const [output, setOutput] = useState('')

    const onMount = (editor) => {
        editorRef.current = editor
        editor.focus()
    }

    const onSelect = (language) => {
        setLanguage(language)
        setValue(CODE_SNIPPETS[language])
    }

    return (
        <div className='flex flex-col gap-3'>
            <div className='h-[474px] rounded-2xl'>
                <div className='px-6 py-3 bg-purpleSecondary rounded-tl-2xl rounded-tr-2xl'>
                    <CodeNavBar language={language} onSelect={onSelect} editorRef={editorRef} setOutput={setOutput} />
                </div>
                <Editor
                    language={language}
                    defaultValue={CODE_SNIPPETS[language]}
                    height="100%"
                    theme='vs-dark'
                    onMount={onMount}
                    value={value}
                    onChange={(value) => setValue(value)}
                />
            </div>
            <div>
                <Output output={output} />
            </div>
        </div>
    )
}

export default CodeEditor