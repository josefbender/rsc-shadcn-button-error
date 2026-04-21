import { createHighlighter } from "shiki";

export const highlighterPromise = createHighlighter({
  themes: ["ayu-dark"],
  langs: [
    "bash",
    "css",
    "go",
    "html",
    "javascript",
    "json",
    "jsx",
    "markdown",
    "python",
    "rust",
    "shell",
    "sql",
    "tsx",
    "typescript",
  ],
});
