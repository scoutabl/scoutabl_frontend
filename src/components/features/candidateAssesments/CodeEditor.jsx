import { useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import CodeNavBar from './CodeNavBar'
import { CODE_SNIPPETS } from '@/lib/constants'
import Output from './Output'
import { useCodingAssesment } from './CodingAssesmentContext';

const MIN_OUTPUT_HEIGHT = 60;
const MIN_EDITOR_HEIGHT = 100;

const CodeEditor = ({ testCases, inputVars, callPattern, collapsed }) => {
    const [value, setValue] = useState('')
    const [language, setLanguage] = useState('python')
    const editorRef = useRef()
    const [output, setOutput] = useState([])
    const [userTestCases, setUserTestCases] = useState([])
    const [selectedCase, setSelectedCase] = useState(0)
    const [activeTab, setActiveTab] = useState('cases')
    const [loading, setLoading] = useState(false)
    const [editorHeight, setEditorHeight] = useState(400); // px, default height
    const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);
    const [isEditorCollapsed, setIsEditorCollapsed] = useState(false); // New state for editor collapse
    const isResizing = useRef(false);
    const { isFullscreen, setIsFullscreen } = useCodingAssesment();

    const onMount = (editor) => {
        editorRef.current = editor
        editor.focus()
    }

    const onSelect = (language) => {
        setLanguage(language)
        setValue(CODE_SNIPPETS[language])
    }

    // Mouse event handlers for resizing
    const handleMouseDown = (e) => {
        isResizing.current = true;
        document.body.style.cursor = 'row-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const container = document.querySelector('.editor-output-container');
        const containerTop = container.getBoundingClientRect().top;
        const containerHeight = container.offsetHeight;
        const newEditorHeight = e.clientY - containerTop;
        const newOutputHeight = containerHeight - newEditorHeight - 8; // 8px for resizer

        // Collapse Output if too small
        setIsOutputCollapsed(newOutputHeight <= MIN_OUTPUT_HEIGHT);

        // Prevent editor from being too small or too large
        if (newEditorHeight > MIN_EDITOR_HEIGHT && newOutputHeight > MIN_OUTPUT_HEIGHT) {
            setEditorHeight(newEditorHeight);
        }
    };
    const handleMouseUp = () => {
        isResizing.current = false;
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    if (isFullscreen) {
        // Fullscreen: only show CodeNavBar and Editor, fill 100% height
        return (
            <div className="flex flex-col h-full w-full" style={{ height: '100vh', width: '100vw', background: '#18181b' }}>
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
                        callPattern={callPattern}
                        onExitFullscreen={() => setIsFullscreen(false)}
                    />
                </div>
                <div className="flex-1 min-h-0 rounded-bl-2xl rounded-br-2xl overflow-auto border border-gray-200">
                    <Editor
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]}
                        height="100%"
                        width="100%"
                        theme='vs-dark'
                        onMount={onMount}
                        value={value}
                        onChange={(value) => setValue(value)}
                    />
                </div>
            </div>
        )
    }

    if (collapsed) {
        return (
            <div className='flex flex-col h-[calc(100vh_-_116px)] gap-3 min-h-0 overflow-hidden'>
                <CodeNavBar
                    collapsed
                    setLoading={setLoading}
                    loading={loading}
                    onFullscreen={() => setIsFullscreen(true)}
                />
                {/* resizer bar */}
                <div className="h-2 w-full flex items-center justify-center cursor-row-resize">
                    <div className="w-12 h-1 rounded-full bg-greyAccent" />
                </div>
                <Output
                    collapsed
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
        )
    }

    // Always render the full editor and output, never collapse
    return (
        <div className="flex flex-col h-full min-h-0 overflow-x-auto">
            <div style={{ height: isEditorCollapsed ? 'auto' : editorHeight, minHeight: isEditorCollapsed ? 'auto' : MIN_EDITOR_HEIGHT }} className="rounded-2xl flex flex-col">
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
                    callPattern={callPattern}
                    onFullscreen={() => setIsFullscreen(true)}
                    onCollapse={() => setIsEditorCollapsed(!isEditorCollapsed)}
                    isEditorCollapsed={isEditorCollapsed}
                />
                {/* we hide the editor if collapsed */}
                {!isEditorCollapsed && (
                    <div className="flex-1 min-h-0 rounded-bl-2xl rounded-br-2xl overflow-auto border border-gray-200">
                        <Editor
                            language={language}
                            defaultValue={CODE_SNIPPETS[language]}
                            height="100%"
                            width="100%"
                            theme='vs-dark'
                            onMount={onMount}
                            value={value}
                            onChange={(value) => setValue(value)}
                        />
                    </div>
                )}
            </div>
            {/* Resizer bar */}
            <div
                className="h-2 w-full flex items-center justify-center cursor-row-resize"
                onMouseDown={handleMouseDown}
                style={{ minHeight: 8, maxHeight: 8 }}
            >
                <div className="w-12 h-1 rounded-full bg-greyAccent" />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
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
                    collapsed={isOutputCollapsed}
                />
            </div>
        </div>
    )
}

export default CodeEditor