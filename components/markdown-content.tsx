import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { memo } from "react"

interface MarkdownContentProps {
  content: string
}

// Memoize the component to prevent unnecessary re-renders
export const MarkdownContent = memo(function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">{children}</h3>,
        p: ({ children }) => <p className="leading-relaxed mb-4 text-pretty">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-border pl-4 italic my-4 text-muted-foreground">
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isInline = !className
          return isInline ? (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
          ) : (
            <code className={`block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono ${className}`}>
              {children}
            </code>
          )
        },
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            className="rounded-lg my-4 max-w-full h-auto"
            loading="lazy"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
})
