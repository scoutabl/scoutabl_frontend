//menu bar

import React from 'react'
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
    Quote
} from "lucide-react";
import blockQuote from "/blockQuote.svg"
import { Toggle } from './ui/toggle';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null
    }
    const Options = [
        {
            icon: <Heading1 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: editor.isActive("heading", { level: 1 }),
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor.isActive("heading", { level: 2 }),
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor.isActive("heading", { level: 3 }),
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive("bold"),
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editor.isActive("italic"),
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editor.isActive("strike"),
        },
        {
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            pressed: editor.isActive({ textAlign: "left" }),
        },
        {
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            pressed: editor.isActive({ textAlign: "center" }),
        },
        {
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            pressed: editor.isActive({ textAlign: "right" }),
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: editor.isActive("bulletList"),
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: editor.isActive("orderedList"),
        },
        {
            icon: <Highlighter className="size-4" />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            pressed: editor.isActive("highlight"),
        },
        {
            icon: <Quote className="size-4" />,
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
            pressed: editor.isActive("blockquote"),
        },
        // {
        //     icon: <img src="/code.svg" className="size-4" />,
        //     onClick: () => editor.chain().focus().toggleCodeBlock().run(),
        //     pressed: editor.isActive("codeBlock"),
        // },
        // {
        //     icon: <img src="/code.svg" className="size-4" />,
        //     onClick: () => editor.chain().focus().setHardBreak().run(),
        //     pressed: false,
        // },
    ];

    return (
        <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
            {Options.map((option, index) => (
                <Toggle
                    key={index}
                    pressed={option.pressed}
                    onPressedChange={option.onClick}
                >
                    {option.icon}
                </Toggle>
            ))}
        </div>
    )
}

export default MenuBar