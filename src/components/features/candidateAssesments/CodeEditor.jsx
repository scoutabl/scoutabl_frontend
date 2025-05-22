import { useRef, useState, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import CodeNavBar from './CodeNavBar'
import { CODE_SNIPPETS } from '@/lib/constants'
import Output from './Output'
import { useCodingAssesment } from './CodingAssesmentContext';
import { motion, AnimatePresence } from 'framer-motion';
import monokaiTheme from 'monaco-themes/themes/Monokai.json';
import githubLight from 'monaco-themes/themes/GitHub Light.json';
const MIN_OUTPUT_HEIGHT = 60;
const MIN_EDITOR_HEIGHT = 100;
const RESIZER_HEIGHT = 4;

const CodeEditor = ({ testCases, inputVars, callPattern, collapsed }) => {
    const containerRef = useRef(null);
    const editorWrapperRef = useRef(null);
    const [value, setValue] = useState('')
    const [language, setLanguage] = useState('python')
    const editorRef = useRef()
    const [output, setOutput] = useState([])
    const [userTestCases, setUserTestCases] = useState([])
    const [selectedCase, setSelectedCase] = useState(0)
    const [activeTab, setActiveTab] = useState('cases')
    const [loading, setLoading] = useState(false)
    const [editorHeight, setEditorHeight] = useState(0); // px, will be set to 50% on mount
    const [lastEditorHeight, setLastEditorHeight] = useState(0); // remembers last expanded height
    const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);
    const [isEditorCollapsed, setIsEditorCollapsed] = useState(false); // New state for editor collapse
    const isResizing = useRef(false);
    const { isFullscreen, setIsFullscreen } = useCodingAssesment();
    const [currentLine, setCurrentLine] = useState(0);
    const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

    // Set initial 50/50 split and layout editor
    useEffect(() => {
        if (containerRef.current && editorHeight === 0) {
            const totalHeight = containerRef.current.offsetHeight;
            const half = Math.max(Math.floor(totalHeight / 2), MIN_EDITOR_HEIGHT);
            setEditorHeight(half);
            setLastEditorHeight(half);
        }
    }, [containerRef.current]);

    // Use ResizeObserver to call editor.layout() when the wrapper resizes
    useEffect(() => {
        if (!editorWrapperRef.current || !editorRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            if (editorRef.current) {
                editorRef.current.layout();
            }
        });

        resizeObserver.observe(editorWrapperRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [editorWrapperRef.current, editorRef.current]); // Re-run if refs change

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
        setCursorPosition({
            line: editor.getPosition()?.lineNumber || 1,
            column: editor.getPosition()?.column || 1
        });
        editor.onDidChangeCursorPosition(e => {
            setCursorPosition({
                line: e.position.lineNumber,
                column: e.position.column
            });
        });
    }

    const onSelect = (language) => {
        setLanguage(language)
        setValue(CODE_SNIPPETS[language])
    }

    // Collapse button logic
    const handleCollapseButton = () => {
        if (isEditorCollapsed) {
            setIsEditorCollapsed(false);
            setIsOutputCollapsed(false);
            setEditorHeight(lastEditorHeight || 200); // restore last or fallback
            // editor.layout() will be called by ResizeObserver
        } else {
            setIsEditorCollapsed(true);
            setIsOutputCollapsed(false);
            setLastEditorHeight(editorHeight);
        }
    };

    // Handler for manually collapsing/expanding the Output section
    const handleOutputCollapseButton = () => {
        if (isOutputCollapsed) {
            setIsOutputCollapsed(false);
            setIsEditorCollapsed(false);
            // No need to set editorHeight here, flex: 1 on output and editor will distribute space
        } else {
            setIsOutputCollapsed(true);
            setIsEditorCollapsed(false);
        }
    };

    // Mouse event handlers for resizing
    const handleMouseDown = (e) => {
        isResizing.current = true;
        document.body.style.cursor = 'row-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const container = containerRef.current;
        if (!container) return;
        const containerTop = container.getBoundingClientRect().top;
        const containerHeight = container.offsetHeight;
        const y = e.clientY - containerTop;

        // Collapse editor if dragged near top
        if (y < MIN_EDITOR_HEIGHT / 2) {
            setIsEditorCollapsed(true);
            setIsOutputCollapsed(false);
            setLastEditorHeight(editorHeight);
            setEditorHeight(MIN_EDITOR_HEIGHT); // Keep a small height for the navbar to be visible
            return;
        }
        // Collapse output if dragged near bottom
        if (containerHeight - y < MIN_OUTPUT_HEIGHT / 2) {
            setIsOutputCollapsed(true);
            setIsEditorCollapsed(false);
            setEditorHeight(containerHeight - RESIZER_HEIGHT); // Editor takes almost full height above resizer
            return;
        }
        // Normal resize
        setIsEditorCollapsed(false);
        setIsOutputCollapsed(false);
        const newHeight = Math.max(y, MIN_EDITOR_HEIGHT);
        if (newHeight <= MIN_EDITOR_HEIGHT) {
            setIsEditorCollapsed(true);
            setIsOutputCollapsed(false);
            setLastEditorHeight(editorHeight);
            setEditorHeight(MIN_EDITOR_HEIGHT);
            return;
        }
        setEditorHeight(newHeight);
        setLastEditorHeight(newHeight);
        // editor.layout() will be called by ResizeObserver
    };
    const handleMouseUp = () => {
        isResizing.current = false;
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    // Update beforeMount handler to use monaco-themes
    const handleEditorBeforeMount = async (monaco) => {
        try {
            // monaco.editor.defineTheme('monokai-theme', {
            //     base: 'vs-light', // Monokai is a dark theme, so we use vs-dark as base
            //     inherit: true,
            //     ...monokaiTheme
            // });
            monaco.editor.defineTheme('github-light', {
                base: 'vs-light',
                inherit: true,
                ...githubLight
            });
        } catch (error) {
            console.error('Failed to load theme:', error);
            // Fallback to default theme if loading fails
            // monaco.editor.defineTheme('monokai-theme', {
            //     base: 'vs-dark',
            //     inherit: true,
            //     colors: {},
            //     tokenColors: []
            // });
            monaco.editor.defineTheme('github-light', {
                base: 'vs-light',
                inherit: true,
                ...githubLight
            });
        }
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
                        onMount={onMount}
                        value={value}
                        onChange={(value) => {
                            setValue(value);
                            setCurrentLine(editorRef.current.getPosition()?.lineNumber || 0);
                        }}
                        theme="github-light"
                        beforeMount={handleEditorBeforeMount}
                    />
                </div>
            </div>
        )
    }

    if (collapsed) {
        return (
            <div className='flex flex-col h-[calc(100vh_-_116px)] min-h-0 overflow-hidden'>
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
        <div ref={containerRef} className="flex flex-col h-full min-h-0 overflow-x-auto">
            {/* CodeNavBar always visible */}
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
                onCollapse={handleCollapseButton}
                isEditorCollapsed={isEditorCollapsed}
            />
            {/* Collapsible Editor + Status Bar */}
            <div
                ref={editorWrapperRef}
                style={{ height: isEditorCollapsed ? 0 : editorHeight, minHeight: isEditorCollapsed ? 0 : MIN_EDITOR_HEIGHT, transition: 'height 0.2s' }}
                className="flex flex-col rounded-bl-2xl rounded-br-2xl border border-gray-200 bg-white"
            >
                <AnimatePresence>
                    {!isEditorCollapsed && (
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 min-h-0"
                            style={{ overflow: 'hidden' }}
                        >
                            <Editor

                                language={language}
                                defaultValue={CODE_SNIPPETS[language]}
                                height="100%"
                                width="100%"
                                onMount={onMount}
                                value={value}
                                onChange={(value) => {
                                    setValue(value);
                                    setCurrentLine(editorRef.current.getPosition()?.lineNumber || 0);
                                }}
                                theme="github-light"
                                beforeMount={handleEditorBeforeMount}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Status bar */}
                {!isEditorCollapsed && (
                    <div className="flex items-center justify-between px-4 py-1 bg-white border-t border-gray-200 text-xs text-gray-500">
                        <div>

                            <span>Saved</span>

                        </div>
                        <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                    </div>
                )}
            </div>
            {/* Resizer */}
            <div
                className="my-3 h-1 w-full flex items-center justify-center cursor-row-resize"
                style={{ minHeight: RESIZER_HEIGHT, maxHeight: RESIZER_HEIGHT }}
                onMouseDown={handleMouseDown}
            >
                <div className="w-12 h-1 rounded-full bg-greyAccent" />
            </div>
            {/* Output Container */}
            <div className="flex-1 min-h-0 flex flex-col">
                <motion.div
                    animate={{
                        height: isOutputCollapsed ? RESIZER_HEIGHT + (collapsed ? 0 : 40) : undefined,
                        opacity: isOutputCollapsed ? 0 : 1,
                    }}
                    style={{
                        overflow: 'hidden',
                        minHeight: isOutputCollapsed ? 0 : MIN_OUTPUT_HEIGHT,
                        flex: isOutputCollapsed ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex-1 min-h-0"
                >
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
                        isOutputCollapsed={isOutputCollapsed}
                        isRightPanelCollapsed={collapsed}
                        onOutputCollapse={handleOutputCollapseButton}
                    />
                </motion.div>
            </div>
        </div>
    )
}

export default CodeEditor