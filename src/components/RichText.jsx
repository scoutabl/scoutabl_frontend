//editore component

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './MenuBar'
import Highlight from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import Blockquote from '@tiptap/extension-blockquote'
// define your extension array

const RichText = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [StarterKit.configure({
            bulletList: {
                HTMLAttributes: {
                    class: 'list-disc disc-inside ml-4',
                }
            },
            orderedList: {
                HTMLAttributes: {
                    class: 'list-decimal decimal-inside ml-4',
                }
            },
            blockquote: {
                HTMLAttributes: {
                    class: 'border-l-4 border-gray-300 pl-4 my-4',
                }
            }
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph']
        }),
        Highlight.configure({
            HTMLAttributes: {
                class: 'my-custom-class',
            },
        }),
        ],

        content: content,
        editorProps: {
            attributes: {
                class: 'h-full bg-[#F4F6FA] p-4 rounded-[20px] shadow-md',
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        }
    })

    return (
        <div className='h-full flex flex-col mb-6'>
            <MenuBar editor={editor} />
            <EditorContent className='h-full break-words break-all' editor={editor} />
        </div>
    )
}

export default RichText