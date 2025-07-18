export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    typescript: "5.0.4",
    python: "3.10.0",
    java: "15.0.2",
    csharp: "6.12.0",
    php: "8.0.3",

}

export const CODE_SNIPPETS = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    csharp:
        'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    php: "<?php\n\n$name = 'Alex';\necho $name;\n",
};

export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const SCOUTABL_PURPLE = "#8B5CF6";
export const SCOUTABL_PURPLE_SECONDARY = "#CFDDFD";
export const SCOUTABL_PINK = "#FAEEFF";
export const SCOUTABL_MUTED_SECONDARY = "#EEF2FC";
export const SCOUTABL_WHITE = "#FFFFFF";
export const SCOUTABL_BLACK = "#4F4F4F";
export const SCOUTABL_TEXT = "#333333"
export const SCOUTABL_TEXT_SECONDARY = "#5C5C5C"
export const SCOUTABL_MUTED_PRIMARY = "#E0E0E0";
export const SCOUTABL_RED = "#EB5757";
export const DEFAULT_LIST_API_PARAMS = {
    page: 1,
    page_size: 10,
    ordering: "-created_at",
}
export const COMMON_VARIANTS = {
    outline: `broder border-2 border-[${SCOUTABL_MUTED_PRIMARY}]`
}
