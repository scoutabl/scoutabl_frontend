// import React from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Table from '@tiptap/extension-table';
// import TableRow from '@tiptap/extension-table-row';
// import TableCell from '@tiptap/extension-table-cell';
// import TableHeader from '@tiptap/extension-table-header';
// import Subscript from '@tiptap/extension-subscript';
// import Superscript from '@tiptap/extension-superscript';

// const MenuBar = ({ editor }) => {
//     if (!editor) return null;

//     return (
//         <div className="flex items-center gap-1 p-2 border-b">
//             {/* Font size dropdown */}
//             <select
//                 className="h-8 px-2 border rounded-md text-sm bg-white"
//                 onChange={e => editor.chain().focus().setFontSize(e.target.value + 'px').run()}
//                 defaultValue="16"
//             >
//                 {[12, 14, 16, 18, 20, 24, 32].map(size => (
//                     <option key={size} value={size}>{size}</option>
//                 ))}
//             </select>

//             {/* Color picker */}
//             <input
//                 type="color"
//                 className="h-8 w-8 p-1 border rounded-md cursor-pointer"
//                 onInput={e => editor.chain().focus().setColor(e.target.value).run()}
//             />

//             {/* Heading buttons */}
//             <div className="flex gap-1 border-l pl-2">
//                 <button
//                     onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M4 12h16M4 6h16M4 18h16" />
//                     </svg>
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
//                 >
//                     H2
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
//                 >
//                     H3
//                 </button>
//             </div>

//             {/* Text formatting */}
//             <div className="flex gap-1 border-l pl-2">
//                 <button
//                     onClick={() => editor.chain().focus().toggleBold().run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
//                         <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
//                     </svg>
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().toggleItalic().run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <line x1="19" y1="4" x2="10" y2="4" />
//                         <line x1="14" y1="20" x2="5" y2="20" />
//                         <line x1="15" y1="4" x2="9" y2="20" />
//                     </svg>
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().toggleUnderline().run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
//                         <line x1="4" y1="21" x2="20" y2="21" />
//                     </svg>
//                 </button>
//             </div>

//             {/* Lists */}
//             <div className="flex gap-1 border-l pl-2">
//                 <button
//                     onClick={() => editor.chain().focus().toggleBulletList().run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <line x1="9" y1="6" x2="20" y2="6" />
//                         <line x1="9" y1="12" x2="20" y2="12" />
//                         <line x1="9" y1="18" x2="20" y2="18" />
//                         <circle cx="5" cy="6" r="2" />
//                         <circle cx="5" cy="12" r="2" />
//                         <circle cx="5" cy="18" r="2" />
//                     </svg>
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().toggleOrderedList().run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <line x1="10" y1="6" x2="21" y2="6" />
//                         <line x1="10" y1="12" x2="21" y2="12" />
//                         <line x1="10" y1="18" x2="21" y2="18" />
//                         <path d="M4 6h1v4" />
//                         <path d="M4 10h2" />
//                         <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
//                     </svg>
//                 </button>
//             </div>

//             {/* Text alignment */}
//             <div className="flex gap-1 border-l pl-2">
//                 <button
//                     onClick={() => editor.chain().focus().setTextAlign('left').run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <line x1="3" y1="6" x2="21" y2="6" />
//                         <line x1="3" y1="12" x2="15" y2="12" />
//                         <line x1="3" y1="18" x2="18" y2="18" />
//                     </svg>
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().setTextAlign('center').run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <line x1="3" y1="6" x2="21" y2="6" />
//                         <line x1="6" y1="12" x2="18" y2="12" />
//                         <line x1="3" y1="18" x2="21" y2="18" />
//                     </svg>
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().setTextAlign('right').run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <line x1="3" y1="6" x2="21" y2="6" />
//                         <line x1="9" y1="12" x2="21" y2="12" />
//                         <line x1="6" y1="18" x2="21" y2="18" />
//                     </svg>
//                 </button>
//             </div>

//             {/* Media buttons */}
//             <div className="flex gap-1 border-l pl-2">
//                 <button
//                     onClick={() => editor.chain().focus().setImage({ src: prompt('Image URL') }).run()}
//                     className="p-2 rounded hover:bg-gray-100"
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <rect x="3" y="3" width="18" height="18" rx="2" />
//                         <circle cx="8.5" cy="8.5" r="1.5" />
//                         <path d="M20.4 14.5L16 10 4 20" />
//                     </svg>
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().setLink({ href: prompt('URL') }).run()}
//                     className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
//                         <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// };

// const RichTextEditor = ({ content, onChange }) => {
//     const editor = useEditor({
//         extensions: [
//             StarterKit,
//             Underline,
//             TextStyle,
//             Color,
//             Link,
//             Image,
//             TextAlign.configure({ types: ['heading', 'paragraph'] }),
//             Table.configure({ resizable: true }),
//             TableRow,
//             TableCell,
//             TableHeader,
//             Subscript,
//             Superscript,
//         ],
//         content: content,
//         editorProps: {
//             attributes: {
//                 class: 'h-full bg-[#F4F6FA] p-4 rounded-[20px] shadow-md',
//             }
//         },
//         onUpdate: ({ editor }) => {
//             onChange(editor.getHTML())
//         }
//     });

//     return (
//         <div className="border rounded-lg overflow-hidden bg-white">
//             <MenuBar editor={editor} />
//             <EditorContent
//                 editor={editor}
//                 className="p-4 min-h-[200px] prose max-w-none"
//             />
//             <div className="p-2 border-t text-sm text-gray-500">
//                 250 words remaining
//             </div>
//         </div>
//     );
// };

// export default RichTextEditor;

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import FontFamily from '@tiptap/extension-font-family';
import MsExcelIcon from '@/assets/msExcelIcon.svg?react'
import VideoIcon from '@/assets/videoEditorIcon.svg?react'
import ImageIcon from '@/assets/imageIcon.svg?react'
import LinkIcon from '@/assets/linkIcon.svg?react'
import CodeIcon from '@/assets/codeIcon.svg?react'
import BlockQuoteIcon from '@/assets/blockQuoateIcon.svg?react'
import AlignRightIcon from '@/assets/alignRightIcon.svg?react'
import AlignCenterIcon from '@/assets/alignCenterIcon.svg?react'
import AlignLeftIcon from '@/assets/alignLeftIcon.svg?react'
import SubScriptIcon from '@/assets/xpowerupIcon.svg?react'
import SuperScriptIcon from '@/assets/xpowerdownIcon.svg?react'
import NumberListIcon from '@/assets/numberListIcon.svg?react'
import BulletListIcon from '@/assets/bulletListIcon.svg?react'
import UnderlineIcon from '@/assets/underlineIcon.svg?react'
import ItalicIcon from '@/assets/italicIcon.svg?react'
import BoldIcon from '@/assets/boldIcon.svg?react'
import Heading1 from '@/assets/h1Icon.svg?react'
import Heading2 from '@/assets/h2Icon.svg?react'
import Heading3 from '@/assets/h3Icon.svg?react'
const MenuBar = ({ editor }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [color, setColor] = useState('#000000')
    if (!editor) return null;

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setShowLinkModal(false);
        }
    };

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl('');
            setShowImageModal(false);
        }
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    return (
        <>
            <div className="flex items-center gap-1 p-3 border-b border-[#EBEBEB] bg-white flex-wrap rounded-tl-5xl rounded-tr-5xl">
                {/* Font Size */}
                <select
                    className="h-9 px-3 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={e => {
                        const size = e.target.value;
                        editor.chain().focus().setFontSize(size + 'px').run();
                    }}
                    defaultValue="16"
                >
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                    <option value="32">32</option>
                </select>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Color Picker */}
                <div className="relative">
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="p-[7px] rounded bg-purpleSecondary"
                        title="Text Color"
                    >
                        {/* <Palette size={16} /> */}
                        <div
                            className='h-4 w-4 rounded-full'
                            style={{ backgroundColor: color }}
                        />
                    </button>
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <div className="grid grid-cols-6 gap-1 min-w-[200px]">
                                {['#000000', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed', '#db2777'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            editor.chain().focus().setColor(color).run();
                                            setShowColorPicker(false);
                                            setColor(color)
                                        }}
                                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div >

                {/* Divider */}
                < div className="w-px h-6 bg-gray-300 mx-1" ></div >

                {/* Headings */}
                < div className='flex items-center gap-[6px]' >
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                            }`}
                        title="heading 3"
                    >
                        <Heading3 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                            }`}
                        title="heading 2"
                    >
                        <Heading2 />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                            }`}
                        title="heading 1"
                    >
                        <Heading1 />
                    </button>
                </div >

                {/* Divider */}
                < div className="w-px h-6 bg-gray-300 mx-1" ></div >

                {/* Text Formatting */}
                < button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('bold') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Bold"
                >
                    <BoldIcon />
                </button >

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('italic') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Italic"
                >
                    <ItalicIcon />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('underline') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Underline"
                >
                    <UnderlineIcon />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Lists */}

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('orderedList') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Numbered List"
                >
                    <NumberListIcon />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('bulletList') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Bullet List"
                >
                    <BulletListIcon />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Subscript/Superscript */}
                <button
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors text-sm font-bold ${editor.isActive('subscript') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Subscript"
                >
                    <SubScriptIcon />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors text-sm font-bold ${editor.isActive('superscript') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Superscript"
                >
                    <SuperScriptIcon />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Text Alignment */}
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Align Left"
                >
                    <AlignLeftIcon />
                </button>

                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Align Center"
                >
                    <AlignCenterIcon />
                </button>

                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Align Right"
                >
                    <AlignRightIcon />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Quote & Code */}
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('blockquote') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Quote"
                >
                    <BlockQuoteIcon />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('code') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Inline Code"
                >
                    <CodeIcon className="h-4 w-4" />
                </button>

                {/* Link */}
                <button
                    onClick={() => setShowLinkModal(true)}
                    className={`h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors ${editor.isActive('link') ? 'bg-purpleSecondary text-blue-600' : 'text-grayAccent'
                        }`}
                    title="Add Link"
                >
                    <LinkIcon />
                </button>

                {/* Image */}
                <button
                    onClick={() => setShowImageModal(true)}
                    className="h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors text-grayAccent"
                    title="Add Image"
                >
                    {/* <Image size={16} /> */}
                    <ImageIcon />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Table */}
                <button
                    onClick={insertTable}
                    className="h-[30px] w-[30px] p-[7.5px] grid place-content-center rounded hover:bg-purpleSecondary transition-colors text-grayAccent"
                    title="Insert Table"
                >
                    {/* <Table size={16} /> */}
                    <MsExcelIcon className="h-4 w-4" />
                </button>
            </div >

            {/* Link Modal */}
            {
                showLinkModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Add Link</h3>
                            <input
                                type="url"
                                placeholder="Enter URL"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={addLink}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add Link
                                </button>
                                <button
                                    onClick={() => setShowLinkModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-grayAccent rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Image Modal */}
            {
                showImageModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Add Image</h3>
                            <input
                                type="url"
                                placeholder="Enter image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={addImage}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add Image
                                </button>
                                <button
                                    onClick={() => setShowImageModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-grayAccent rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

const RichTextEditor = ({ content = '', onChange = () => { }, wordCountToggle, placeholder = '' }) => {
    const [wordCount, setWordCount] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(!content || content.trim() === '');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            FontFamily,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse border border-gray-300',
                },
            }),
            TableRow.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 bg-gray-50 font-bold p-2',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 p-2',
                },
            }),
            Subscript,
            Superscript,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose max-w-full focus:outline-none min-h-[300px] p-6 word-wrap break-words overflow-hidden',
                style: 'word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap;'
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const text = editor.getText();
            setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
            onChange(html);
            
            // Update placeholder visibility
            setShowPlaceholder(!text || text.trim() === '');
        },
        onFocus: () => {
            setShowPlaceholder(false);
        },
        onBlur: ({ editor }) => {
            const text = editor.getText();
            setShowPlaceholder(!text || text.trim() === '');
        },
    });

    // Update placeholder visibility when content changes
    useEffect(() => {
        if (editor) {
            const text = editor.getText();
            setShowPlaceholder(!text || text.trim() === '');
        }
    }, [content, editor]);

    return (
        <div className="flex flex-col h-full border-[1px] border-[rgba(224,224,224,0.65)] [box-shadow:0px_16px_24px_rgba(0,_0,_0,_0.06),_0px_2px_6px_rgba(0,_0,_0,_0.04)] rounded-5xl">
            <MenuBar editor={editor} />
            <div className="flex-1 min-h-0 bg-backgroundPrimary overflow-hidden rounded-bl-5xl rounded-br-5xl relative">
                <EditorContent
                    editor={editor}
                    className="h-full overflow-y-auto"
                    style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                    }}
                />
                {showPlaceholder && placeholder && (
                    <div 
                        className="absolute top-6 left-6 pointer-events-none text-gray-400 text-sm"
                        style={{ 
                            zIndex: 10
                        }}
                    >
                        {placeholder}
                    </div>
                )}
            </div>
            {wordCountToggle && (
                <div className="p-6 bg-backgroundPrimary rounded-bl-5xl rounded-br-5xl">
                    <span>{wordCount} words</span>
                </div>
            )}
        </div>
    );
};

export default RichTextEditor