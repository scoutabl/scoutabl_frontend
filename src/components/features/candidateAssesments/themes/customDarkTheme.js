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
