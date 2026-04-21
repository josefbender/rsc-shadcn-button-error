import { highlighterPromise } from "@/lib/shiki"
import type { Post } from "@/lib/types"
import { Link } from "@tanstack/react-router"
import type { ComponentPropsWithoutRef } from "react"
import { Suspense, use } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "./ui/button"

type PostContentProps = {
  post: Post
}

function HighlightedCode({ code, lang }: { code: string; lang: string }) {
  const highlighter = use(highlighterPromise)
  const validLang = highlighter.getLoadedLanguages().includes(lang)
    ? lang
    : "text"
  const html = highlighter.codeToHtml(code, {
    lang: validLang,
    theme: "github-dark",
  })
  return (
    <div
      className="[&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function CodeBlock({ children, className }: ComponentPropsWithoutRef<"code">) {
  const lang = className?.replace("language-", "") ?? "text"
  const code = String(children).trimEnd()

  return (
    <Suspense
      fallback={
        <pre className="overflow-x-auto rounded-lg p-4 text-sm">
          <code>{code}</code>
        </pre>
      }
    >
      <HighlightedCode code={code} lang={lang} />
    </Suspense>
  )
}

export const PostContent = ({ post }: PostContentProps) => {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4">
        <Button variant="ghost" size="sm">
          <Link to="/posts">&larr; Back to posts</Link>
        </Button>
      </div>

      <article>
        <header className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            By {post.author_email} &middot;{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </header>

        <div className="prose prose-invert">
          <ReactMarkdown components={{ code: CodeBlock }}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
