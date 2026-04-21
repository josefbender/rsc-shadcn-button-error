import { highlighterPromise } from "@/lib/shiki"
import { use } from "react"

type CodeBlockProps = {
  className?: string
  children?: React.ReactNode
  node?: unknown
}

const REGISTERED_LANGS = new Set([
  "bash", "css", "go", "html", "javascript", "json", "jsx",
  "markdown", "python", "rust", "shell", "sql", "tsx", "typescript",
])

export const CodeBlock = ({ className, children, node: _node, ...props }: CodeBlockProps) => {
  const language = className?.replace("language-", "")

  if (!language) {
    return (
      <code
        className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    )
  }

  const code = String(children).replace(/\n$/, "")
  const highlighter = use(highlighterPromise)
  const lang = REGISTERED_LANGS.has(language) ? language : "text"

  const html = highlighter.codeToHtml(code, { lang, theme: "ayu-dark" })

  return (
    <div
      className="my-4 [&>pre]:overflow-x-clip rounded-lg text-sm [&>pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
