import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import CodeNavBar from './CodeNavBar'
import Output from './Output'
import { useCodingAssesment } from './CodingAssesmentContext';
import { motion, AnimatePresence } from 'framer-motion';
import codeUpload from '/codeUpload.svg'
import githubLight from 'monaco-themes/themes/GitHub Light.json';
import githubDark from 'monaco-themes/themes/GitHub Dark.json';
// import { customDarkTheme } from './themes/customDarkTheme';
import { customDarkTheme, customLightTheme } from './codeEditorTheme';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext'
const MIN_OUTPUT_HEIGHT = 60;
const MIN_EDITOR_HEIGHT = 100;
const RESIZER_HEIGHT = 4;

// Monaco language mapping
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
    // add more as needed
};

const CodeEditor = ({ testCases, inputVars, collapsed, isFullscreen, setIsFullscreen, currentTestData, languageTemplates }) => {
    const containerRef = useRef(null);
    const editorWrapperRef = useRef(null);
    const [value, setValue] = useState('')
    const [language, setLanguage] = useState(currentTestData?.languages?.[0]?.code)
    const editorRef = useRef()
    const [output, setOutput] = useState([])
    const [userTestCases, setUserTestCases] = useState([])
    const [selectedCase, setSelectedCase] = useState(0)
    const [activeTab, setActiveTab] = useState('cases')
    const [loading, setLoading] = useState(false)
    const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);
    const [isEditorCollapsed, setIsEditorCollapsed] = useState(false); // New state for editor collapse
    const isResizing = useRef(false);
    const [isDraggingResizer, setIsDraggingResizer] = useState(false); // New state for drag cursor
    const { editorHeight, setEditorHeight, lastEditorHeight, setLastEditorHeight, isOutputFullscreen, setIsOutputFullscreen } = useCodingAssesment();
    const [currentLine, setCurrentLine] = useState(0);
    const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });


    const { isDarkMode } = useTheme();
    // New state to remember the last output height before collapsing
    const [lastOutputHeight, setLastOutputHeight] = useState(null);
    const [isEditorLoading, setIsEditorLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saving...' | 'Saved'

    // Set initial 50/50 split and layout editor
    useLayoutEffect(() => {
        if (containerRef.current && editorHeight === 0) {
            const totalHeight = containerRef.current.offsetHeight;
            const navBarHeight = 60;
            const resizerHeight = 24;
            const availableHeight = totalHeight - navBarHeight - resizerHeight;
            const half = Math.max(Math.floor(availableHeight / 1.5), MIN_EDITOR_HEIGHT);
            setEditorHeight(half);
            setLastEditorHeight(half);
        }
    }, [editorHeight]);

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

    // Add this useEffect hook inside the CodeEditor component
    useEffect(() => {
        // When exiting fullscreen
        if (!isFullscreen) {
            // Ensure loading is false
            setLoading(false);
        }
        // We don't need to do anything when entering fullscreen regarding loading state
    }, [isFullscreen]); // Depend on isFullscreen state

    // Load code from localStorage on mount or when question/language changes
    useEffect(() => {
        const key = `code_${currentTestData?.id}_${language}`;
        const savedCode = localStorage.getItem(key);
        if (savedCode && editorRef.current && editorRef.current.setValue) {
            editorRef.current.setValue(savedCode);
            setValue(savedCode);
        }
    }, [currentTestData?.id, language, editorRef]);

    //set default template code when language changes
    useEffect(() => {
        const key = `code_${currentTestData?.id}_${language}`;
        const savedCode = localStorage.getItem(key);
        if (savedCode) {
            setValue(savedCode);
            if (editorRef.current && editorRef.current.setValue) {
                editorRef.current.setValue(savedCode);
            }
        } else if (languageTemplates?.[language]) {
            setValue(languageTemplates[language]);
            if (editorRef.current && editorRef.current.setValue) {
                editorRef.current.setValue(languageTemplates[language]);
            }
        }
    }, [language, currentTestData?.id, languageTemplates]);

    // Save code to localStorage and update status
    const saveCodeToLocalStorage = () => {
        setSaveStatus('Saving...');
        const code = editorRef?.current?.getValue?.() || '';
        const key = `code_${currentTestData?.id}_${language}`;
        localStorage.setItem(key, code);
        setTimeout(() => setSaveStatus('Saved'), 500); // Simulate save delay
    };

    const onMount = (editor) => {
        editorRef.current = editor;
        // Load code from localStorage here
        const key = `code_${currentTestData?.id}_${language}`;
        const savedCode = localStorage.getItem(key);
        if (savedCode) {
            editor.setValue(savedCode);
            setValue(savedCode);
        }
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
        handleEditorDidMount();
    }

    const onSelect = (language) => {
        setLanguage(language)
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
        const container = containerRef.current;
        if (!container) return;
        const containerHeight = container.offsetHeight;
        const RESIZER_HEIGHT = 4;
        const OUTPUT_NAVBAR_MIN_HEIGHT = 54;

        if (isOutputCollapsed) {
            // Expanding
            setIsOutputCollapsed(false);
            setIsEditorCollapsed(false); // Ensure editor is not collapsed either

            // Calculate potential editor height if restoring last output height
            const potentialEditorHeightFromLast = lastOutputHeight ? containerHeight - lastOutputHeight - RESIZER_HEIGHT : null;

            // If lastOutputHeight is valid and restoring it keeps editor > MIN_EDITOR_HEIGHT
            if (lastOutputHeight > OUTPUT_NAVBAR_MIN_HEIGHT && potentialEditorHeightFromLast >= MIN_EDITOR_HEIGHT) {
                // Restore to the remembered output height
                setEditorHeight(potentialEditorHeightFromLast);
            } else {
                // Return to default 50/50 split
                const half = Math.max(Math.floor(containerHeight / 2), MIN_EDITOR_HEIGHT);
                setEditorHeight(half);
            }
            setLastEditorHeight(editorHeight); // Update last editor height for editor collapse toggle

        } else {
            // Collapsing
            // Remember the current output height before collapsing
            const currentOutputHeight = containerHeight - editorHeight - RESIZER_HEIGHT;
            if (currentOutputHeight > OUTPUT_NAVBAR_MIN_HEIGHT) { // Only remember if it was larger than the collapsed height
                setLastOutputHeight(currentOutputHeight);
            }

            setIsOutputCollapsed(true);
            setIsEditorCollapsed(false); // Ensure editor is not collapsed when output collapses

            // Editor will take remaining height, handled by rendering logic
        }
    };

    // Mouse event handlers for resizing
    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent default browser behavior (like text selection)
        isResizing.current = true;
        setIsDraggingResizer(true); // Set dragging state to true
        document.body.style.cursor = 'row-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    const handleMouseMove = (e) => {
        e.preventDefault(); // Prevent default browser behavior (like text selection)
        if (!isResizing.current) return;
        const container = containerRef.current;
        if (!container) return;
        const containerTop = container.getBoundingClientRect().top;
        const containerHeight = container.offsetHeight;
        let y = e.clientY - containerTop; // Use 'let' so we can modify y

        const minAllowedY = MIN_EDITOR_HEIGHT;
        const maxAllowedY = containerHeight - 54; // 54 = OutputNavBar min height

        // Clamp y to be within the allowed range
        y = Math.max(minAllowedY, Math.min(y, maxAllowedY));

        // Use a threshold for collapse
        if (y <= minAllowedY) {
            setIsEditorCollapsed(true);
            setIsOutputCollapsed(false);
        } else if (y >= maxAllowedY - 1) { // threshold here
            setIsEditorCollapsed(false);
            setIsOutputCollapsed(true);
        } else {
            setIsEditorCollapsed(false);
            setIsOutputCollapsed(false);
        }

        // Set editor height based on the clamped y position
        setEditorHeight(y);
        setLastEditorHeight(y);

        // If not collapsed, remember the current output height for future collapse
        if (!isOutputCollapsed && y < maxAllowedY) { // Only remember if not fully collapsed to bottom
            setLastOutputHeight(containerHeight - y - RESIZER_HEIGHT);
        }

        // editor.layout() will be called by ResizeObserver
    };
    const handleMouseUp = () => {
        isResizing.current = false;
        setIsDraggingResizer(false); // Set dragging state to false
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    //setting them on editor mount
    const handleEditorBeforeMount = (monaco) => {
        handleEditorWillMount();
        monaco.editor.defineTheme('github-light', {
            base: 'vs-light',
            inherit: true,
            ...githubLight
        });
        monaco.editor.defineTheme('github-dark', {
            base: 'vs-dark',
            inherit: true,
            ...githubDark
        });
        monaco.editor.defineTheme('custom-dark', customDarkTheme);
        monaco.editor.defineTheme('custom-light', customLightTheme);
    };

    // Add handleReset function
    const handleReset = () => {
        setValue('');
        if (editorRef.current) {
            editorRef.current.setPosition({ lineNumber: 1, column: 1 });
            editorRef.current.focus();
        }
        setOutput([]);
        setUserTestCases([]);
    };

    // Add this after the onMount function
    const handleEditorWillMount = () => {
        setIsEditorLoading(true);
    };

    const handleEditorDidMount = () => {
        setIsEditorLoading(false);
    };

    // Patch CodeNavBar handlers to save code
    const handleRunCode = async () => {
        setCurrentAction && setCurrentAction('run');
        saveCodeToLocalStorage();
        executeCode && executeCode(true);
    };
    const handleSubmit = async () => {
        setCurrentAction && setCurrentAction('submit');
        saveCodeToLocalStorage();
        executeCode && executeCode(false);
    };

    // Output Full Screen
    if (isOutputFullscreen) {
        return (
            <div className="flex flex-col h-full w-full"> {/* Container to take full space of the right panel */}
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
                    isOutputCollapsed={false} // Output should not be collapsed in fullscreen
                    isRightPanelCollapsed={collapsed}
                    onOutputCollapse={handleOutputCollapseButton} // Keep collapse handler if needed in fullscreen nav
                    collapsed={collapsed}
                    onExitFullscreen={() => setIsOutputFullscreen(false)}
                    isOutputFullscreen={isOutputFullscreen} // Pass the fullscreen state
                />
            </div>
        )
    }

    // LeetCode-style codde editor fullscreen: expand editor, hide output
    if (isFullscreen) {
        return (
            <div className="flex flex-col h-full w-full">
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
                    onExitFullscreen={() => {
                        setIsFullscreen(false);
                        setLoading(false);
                    }}
                    onReset={handleReset}
                    questionId={currentTestData?.id}
                    currentTestData={currentTestData}
                    saveCodeToLocalStorage={saveCodeToLocalStorage}
                />
                <div className="flex-1 min-h-0  overflow-auto">
                    <Editor
                        language={monacoLanguageMap[language] || language}
                        defaultValue={languageTemplates?.[language] || ''}
                        height="100%"
                        width="100%"
                        onMount={onMount}
                        value={value}
                        onChange={(value) => {
                            setValue(value);
                            setCurrentLine(editorRef.current.getPosition()?.lineNumber || 0);
                        }}
                        theme={isDarkMode ? 'custom-dark' : 'custom-light'}
                        beforeMount={handleEditorBeforeMount}
                    />
                </div>
                <div className="pb-6 rounded-bl-2xl rounded-br-2xl flex items-center justify-between px-4 py-1 bg-white dark:bg-[#24292E] text-xs text-gray-500">
                    <div className='flex items-center gap-2'>
                        <img src={codeUpload} alt="save" className="w-6 h-6" />
                        <span className='text-greyTertiary text-sm'>{saveStatus}</span>
                    </div>
                    <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                </div>
            </div>
        )
    }

    if (collapsed) {
        // Calculate heights for vertical layout
        let outputNavBarHeight = 78; // OutputNavBar is 78px tall with padding
        let containerHeight = containerRef.current ? containerRef.current.offsetHeight : 0;
        let editorAreaHeight = Math.max(editorHeight, 54); // Clamp to min 54px
        if (isOutputCollapsed) {
            editorAreaHeight = containerHeight - outputNavBarHeight;
            if (editorAreaHeight < 54) editorAreaHeight = 54;
        }
        return (
            <div ref={containerRef} className='flex flex-col h-full min-h-0'>
                {/* Vertical CodeNavBar Wrapper (Resizable) */}
                <div
                    style={{
                        height: editorAreaHeight,
                        minHeight: 54,
                        // transition: 'height 0.2s'
                    }}
                    className="flex-shrink-0 flex flex-col items-center bg-purpleSecondary rounded-xl py-3 overflow-hidden"
                >
                    <CodeNavBar
                        collapsed={collapsed}
                        setLoading={setLoading}
                        loading={loading}
                        onFullscreen={() => setIsFullscreen(true)}
                        onCollapse={handleCollapseButton}
                        isEditorCollapsed={isEditorCollapsed}
                        onReset={handleReset}
                        questionId={currentTestData?.id}
                        currentTestData={currentTestData}
                        saveCodeToLocalStorage={saveCodeToLocalStorage}
                    />
                </div>
                {/* Vertical Resizer */}
                <div
                    className={cn("py-3 h-1 w-full flex items-center justify-center cursor-row-resize", {
                        'cursor-row-resize': isDraggingResizer
                    })}
                    style={{ minHeight: RESIZER_HEIGHT, maxHeight: RESIZER_HEIGHT }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-12 h-1 rounded-full bg-greyAccent" />
                </div>
                {/* Vertical Output Wrapper (Resizable) */}
                <div
                    style={{
                        height: isOutputCollapsed ? outputNavBarHeight : containerHeight - editorAreaHeight - RESIZER_HEIGHT,
                        minHeight: outputNavBarHeight,
                        maxHeight: isOutputCollapsed ? outputNavBarHeight : undefined,
                        // transition: 'height 0.2s ease-in',
                        //   overflow: 'hidden',
                    }}
                    className="flex flex-col bg-white dark:bg-blackPrimary rounded-xl overflow-hidden"
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
                        collapsed={collapsed}
                        onExitFullscreen={() => setIsOutputFullscreen(false)}
                    />
                </div>
            </div>
        )
    }

    // Expanded horizontal layout
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
                onFullscreen={() => setIsFullscreen(true)}
                onCollapse={handleCollapseButton}
                isEditorCollapsed={isEditorCollapsed}
                collapsed={collapsed}
                onReset={handleReset}
                questionId={currentTestData?.id}
                currentTestData={currentTestData}
                saveCodeToLocalStorage={saveCodeToLocalStorage}
            />
            {/* Collapsible Editor + Status Bar */}
            <div
                ref={editorWrapperRef}
                style={{
                    height: isEditorCollapsed ? 0 : (isOutputCollapsed ? `calc(100% - ${54 + RESIZER_HEIGHT}px)` : editorHeight),
                    minHeight: isEditorCollapsed ? 0 : MIN_EDITOR_HEIGHT,
                    transition: 'height 0.2s'
                }}
                className="flex flex-col rounded-bl-2xl rounded-br-2xl bg-white dark:bg-blackPrimary"
            >
                <AnimatePresence>
                    {!isEditorCollapsed && !collapsed && (
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
                                className='monaco-editor'
                                language={monacoLanguageMap[language] || language}
                                defaultValue={languageTemplates?.[language] || ''}
                                height="100%"
                                width="100%"
                                onMount={onMount}
                                value={value}
                                onChange={(value) => {
                                    setValue(value);
                                    setCurrentLine(editorRef.current.getPosition()?.lineNumber || 0);
                                }}
                                theme={isDarkMode ? 'custom-dark' : 'custom-light'}
                                beforeMount={handleEditorBeforeMount}
                                loading={<div className="h-full w-full bg-white dark:bg-blackPrimary" />}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: false,
                                    scrollbar: {
                                        vertical: 'visible',
                                        horizontal: 'visible',
                                        useShadows: false,
                                        verticalScrollbarSize: 10,
                                        horizontalScrollbarSize: 10
                                    }
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Status bar */}
                {!isEditorCollapsed && !collapsed && (
                    <div className="pb-6 rounded-bl-2xl rounded-br-2xl flex items-center justify-between px-4 py-1 bg-white dark:bg-blackPrimary text-xs text-gray-500">
                        <div className='flex items-center gap-2'>
                            <img src={codeUpload} alt="save" className="w-6 h-6" />
                            <span className='text-greyTertiary text-sm'>{saveStatus}</span>
                        </div>
                        <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                    </div>
                )}
            </div>
            {/* Resizer */}
            <div
                className={cn("py-3 h-1 w-full flex items-center justify-center cursor-row-resize", {
                    'cursor-row-resize': isDraggingResizer
                })}
                style={{ minHeight: RESIZER_HEIGHT, maxHeight: RESIZER_HEIGHT }}
                onMouseDown={handleMouseDown}
            >
                <div className="w-12 h-1 rounded-full bg-greyAccent" />
            </div>
            {/* Output Container */}
            <div
                className="flex flex-col"
                style={{
                    height: isOutputCollapsed ? 54 : undefined,
                    flex: isOutputCollapsed ? 0 : 1,
                    minHeight: isOutputCollapsed ? 54 : MIN_OUTPUT_HEIGHT,
                    overflow: 'hidden',
                }}
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
                    collapsed={collapsed}
                    onExitFullscreen={() => setIsOutputFullscreen(false)}
                />
            </div>
        </div>
    )
}

export default CodeEditor