import type React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

interface MarkdownRendererProps {
  content: string
}

// 타입 정의 수정 - children을 선택적으로 변경
type ComponentProps = {
  children?: React.ReactNode
  // 다른 필요한 props도 추가할 수 있습니다
}

// 마크다운 요소에 대한 커스텀 컴포넌트
const Heading1: React.FC<ComponentProps> = ({ children }) => (
  <h1 className="text-4xl font-bold mb-8">{children}</h1>
)

const Heading2: React.FC<ComponentProps> = ({ children }) => (
  <h2 className="text-3xl font-semibold mb-6">{children}</h2>
)

const Heading3: React.FC<ComponentProps> = ({ children }) => (
  <h3 className="text-2xl font-semibold mb-4">{children}</h3>
)

const Paragraph: React.FC<ComponentProps> = ({ children }) => <p className="mb-5 leading-relaxed">{children}</p>

const UnorderedList: React.FC<ComponentProps> = ({ children }) => <ul className="mb-5 pl-8 list-disc">{children}</ul>

const OrderedList: React.FC<ComponentProps> = ({ children }) => <ol className="mb-5 pl-8 list-decimal">{children}</ol>

const ListItem: React.FC<ComponentProps> = ({ children }) => <li className="mb-2">{children}</li>

// const Blockquote: React.FC<ComponentProps> = ({ children }) => (
//   <blockquote className="border-l-4 border-gray-400 pl-6 pr-2 py-4 italic text-gray-600 my-4 bg-gray-50">{children}</blockquote>
// )
const Blockquote: React.FC<ComponentProps> = ({ children }) => (
  <blockquote className="border-l-4 border-gray-400 pl-6 pr-2 pt-4 italic text-gray-600 my-4 bg-gray-50 content-start">
    {children}
  </blockquote>
)

// 기울임꼴 컴포넌트 수정 - transform 사용
const Emphasis: React.FC<ComponentProps> = ({ children }) => (
  <span style={{ display: "inline-block", transform: "skewX(-10deg)" }}>{children}</span>
)

// 굵은 텍스트 컴포넌트 추가
const Strong: React.FC<ComponentProps> = ({ children }) => <strong className="font-bold">{children}</strong>

// 링크 컴포넌트 - href prop 추가
interface LinkProps extends ComponentProps {
  href?: string
}

const Link: React.FC<LinkProps> = ({ href, children }) => (
  <a href={href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

const Table: React.FC<ComponentProps> = ({ children }) => (
  <div className="overflow-x-auto mb-5">
    <table className="min-w-full border-collapse border border-gray-300">{children}</table>
  </div>
)

const TableHead: React.FC<ComponentProps> = ({ children }) => <thead className="bg-gray-100">{children}</thead>

const TableRow: React.FC<ComponentProps> = ({ children }) => <tr className="border-b border-gray-300">{children}</tr>

const TableCell: React.FC<ComponentProps> = ({ children }) => (
  <td className="border border-gray-300 px-4 py-3">{children}</td>
)

const TableHeader: React.FC<ComponentProps> = ({ children }) => (
  <th className="border border-gray-300 px-4 py-3 font-semibold">{children}</th>
)

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content p-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({ node, ...props }) => <Heading1 {...props} />,
          h2: ({ node, ...props }) => <Heading2 {...props} />,
          h3: ({ node, ...props }) => <Heading3 {...props} />,
          p: ({ node, ...props }) => <Paragraph {...props} />,
          ul: ({ node, ...props }) => <UnorderedList {...props} />,
          ol: ({ node, ...props }) => <OrderedList {...props} />,
          li: ({ node, ...props }) => <ListItem {...props} />,
          blockquote: ({ node, ...props }) => <Blockquote {...props} />,
          em: ({ node, ...props }) => <Emphasis {...props} />, // 기울임꼴 추가
          strong: ({ node, ...props }) => <Strong {...props} />, // 굵은 텍스트 추가
          a: ({ node, ...props }) => <Link {...props} />,
          table: ({ node, ...props }) => <Table {...props} />,
          thead: ({ node, ...props }) => <TableHead {...props} />,
          tr: ({ node, ...props }) => <TableRow {...props} />,
          td: ({ node, ...props }) => <TableCell {...props} />,
          th: ({ node, ...props }) => <TableHeader {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
