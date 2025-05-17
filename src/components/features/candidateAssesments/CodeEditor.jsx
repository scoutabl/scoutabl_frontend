import { useEffect, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import CodeNavBar from './CodeNavBar'
import { CODE_SNIPPETS } from '@/lib/constants'
import Output from './Output'

const CodeEditor = ({ testCases, inputVars }) => {
    const [value, setValue] = useState('')
    const [language, setLanguage] = useState('python')
    const editorRef = useRef()
    const [output, setOutput] = useState([])
    const [userTestCases, setUserTestCases] = useState([])
    const [selectedCase, setSelectedCase] = useState(0)
    const [activeTab, setActiveTab] = useState('cases')
    const [loading, setLoading] = useState(false)

    const onMount = (editor) => {
        editorRef.current = editor
        editor.focus()
    }

    const onSelect = (language) => {
        setLanguage(language)
        setValue(CODE_SNIPPETS[language])
    }

    return (
        <div className="flex-1 flex flex-col gap-3">
            <div className="flex-1 flex flex-col min-h-0 rounded-2xl">
                <div className='px-6 py-3 bg-purpleSecondary rounded-tl-2xl rounded-tr-2xl'>
                    <CodeNavBar
                        language={language}
                        onSelect={onSelect}
                        editorRef={editorRef}
                        setOutput={setOutput}
                        testCases={testCases}
                        userTestCases={userTestCases}
                        inputVars={inputVars}
                        selectedCase={selectedCase}
                        setActiveTab={setActiveTab}
                        setLoading={setLoading}
                        loading={loading}
                    />
                </div>
                <div className="flex-1 min-h-0 rounded-bl-2xl round-br-2xl overflow-hidden border border-gray-200">
                    <Editor
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]}
                        height="525px"
                        theme='vs-dark'
                        onMount={onMount}
                        value={value}
                        onChange={(value) => setValue(value)}
                    />
                </div>
            </div>
            <Output
                output={output}
                testCases={testCases}
                userTestCases={userTestCases}
                setUserTestCases={setUserTestCases}
                inputVars={inputVars}
                selectedCase={selectedCase}
                setSelectedCase={setSelectedCase}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                loading={loading}
            />
        </div>
    )
}

export default CodeEditor