import React from 'react'

const RichText = () => {
    return (
        <EditorProvider extensions={extensions} content={content}>
            <FloatingMenu editor={null}>This is the floating menu</FloatingMenu>
            <BubbleMenu editor={null}>This is the bubble menu</BubbleMenu>
        </EditorProvider>
    )
}

export default RichText