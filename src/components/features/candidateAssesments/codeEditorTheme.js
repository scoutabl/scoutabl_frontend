export const customDarkTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "comment", foreground: "1EA378", fontStyle: "italic" },
        { token: "keyword", foreground: "8B5CF6" }, // import, export, from, const
        { token: "identifier", foreground: "0077C2" }, // mongoose, collection
        { token: "string", foreground: "FFFFFF" },
        { token: "variable", foreground: "0077C2" },
        { token: "type", foreground: "FFFFFF" }, // String, Schema
    ],
    colors: {
        "editor.background": "#0F1112",
        "editor.foreground": "#FFFFFF",
        "editorLineNumber.foreground": "#555",
        "editorCursor.foreground": "#FFFFFF",
        "editor.lineHighlightBackground": "#1a1c1d",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#3a3d41"
    }
};

export const customLightTheme = {
    base: "vs", // use "vs" for light mode
    inherit: true,
    rules: [
        { token: "comment", foreground: "66BB6A", fontStyle: "italic" },
        { token: "keyword", foreground: "BA68C8" }, // import, export, from, const
        { token: "identifier", foreground: "2F4A56" }, // mongoose, collection
        { token: "string", foreground: "430B0B" },
        { token: "variable", foreground: "111122" },
        { token: "type", foreground: "000000" }, // String, Schema
        {token: "bo"}
    ],
    colors: {
        "editor.background": "#FFFFFF",
        "editor.foreground": "#1A1A1A",
        "editorLineNumber.foreground": "#B0B0B0",
        "editorCursor.foreground": "#333333",
        "editor.lineHighlightBackground": "#F5F5F5",
        "editor.selectionBackground": "#B4D5FE",
        "editor.inactiveSelectionBackground": "#E0E0E0",
        "editorIndentGuide.background": "#E0E0E0",
        "editorIndentGuide.activeBackground": "#B0B0B0"
    }
};
