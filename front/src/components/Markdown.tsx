import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface MarkdownProps {
  content: string
}

interface CodeProps {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: CodeProps) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        // 기타 컴포넌트 오버라이드
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
        ),
        p: ({ node, ...props }) => <p className="my-3" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside my-3" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside my-3" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-500 pl-4 py-2 my-3 italic"
            {...props}
          />
        ),
      }}
      className="prose prose-invert max-w-none"
    >
      {content}
    </ReactMarkdown>
  )
}

export default Markdown
