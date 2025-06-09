import React, { useState } from "react"
import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import type { MarkdownImageFile } from "@/stores/useProjectFormStore"

interface MarkdownRendererProps {
  content: string
  markdownImages?: MarkdownImageFile[]
}

type ComponentProps = {
  children?: ReactNode
}

// Code 컴포넌트를 위한 타입 정의
interface CodeProps extends ComponentProps {
  inline?: boolean
  className?: string
  node?: any
}

// 마크다운 콘텐츠 전처리 함수 - 인라인 코드(백틱 한 개)를 일반 텍스트로 변환
const preprocessMarkdown = (content: string): string => {
  // 코드 블록(백틱 세 개)을 임시로 보호
  const codeBlocks: string[] = []
  let processedContent = content.replace(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length
    codeBlocks.push(match)
    return `__CODE_BLOCK_${index}__`
  })

  // 인라인 코드(백틱 한 개)를 일반 텍스트로 변환
  processedContent = processedContent.replace(/`([^`\n]+)`/g, "$1")

  // 코드 블록을 다시 복원
  codeBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(`__CODE_BLOCK_${index}__`, block)
  })

  return processedContent
}

// 텍스트를 URL 친화적인 ID로 변환하는 함수
const createSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-가-힣]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

// 제목 컴포넌트들 - ID 추가
const Heading1: React.FC<ComponentProps> = ({ children }) => {
  const text = typeof children === "string" ? children : children?.toString() || ""
  const id = createSlug(text)

  return (
    <h1
      id={id}
      className="text-3xl md:text-4xl font-bold text-foreground mb-6 mt-8 first:mt-0 pb-3 border-b border-[var(--color-gray-border)] scroll-mt-20"
    >
      {children}
    </h1>
  )
}

const Heading2: React.FC<ComponentProps> = ({ children }) => {
  const text = typeof children === "string" ? children : children?.toString() || ""
  const id = createSlug(text)

  return (
    <h2 id={id} className="text-2xl md:text-3xl font-semibold text-foreground mb-4 mt-6 first:mt-0 scroll-mt-20">
      {children}
    </h2>
  )
}

const Heading3: React.FC<ComponentProps> = ({ children }) => {
  const text = typeof children === "string" ? children : children?.toString() || ""
  const id = createSlug(text)

  return (
    <h3 id={id} className="text-xl md:text-2xl font-semibold text-foreground mb-3 mt-5 first:mt-0 scroll-mt-20">
      {children}
    </h3>
  )
}

const Heading4: React.FC<ComponentProps> = ({ children }) => (
  <h4 className="text-lg md:text-xl font-semibold text-foreground mb-2 mt-4 first:mt-0">{children}</h4>
)

const Heading5: React.FC<ComponentProps> = ({ children }) => (
  <h5 className="text-base md:text-lg font-semibold text-foreground mb-2 mt-3 first:mt-0">{children}</h5>
)

const Heading6: React.FC<ComponentProps> = ({ children }) => (
  <h6 className="text-sm md:text-base font-semibold text-foreground mb-2 mt-3 first:mt-0">{children}</h6>
)

// 리스트 컴포넌트들
const UnorderedList: React.FC<ComponentProps> = ({ children }) => (
  <ul className="mb-4 pl-6 space-y-1 list-disc marker:text-[var(--color-sub-gray)]">{children}</ul>
)

const OrderedList: React.FC<ComponentProps> = ({ children }) => (
  <ol className="mb-4 pl-6 space-y-1 list-decimal marker:text-[var(--color-sub-gray)]">{children}</ol>
)

const ListItem: React.FC<ComponentProps> = ({ children }) => (
  <li className="text-foreground text-sm md:text-base leading-relaxed">{children}</li>
)

// 인용문
const Blockquote: React.FC<ComponentProps> = ({ children }) => (
  <blockquote className="border-l-4 border-[var(--color-main-color)] bg-secondary/50 pl-4 pr-4 py-3 my-4 rounded-r-md">
    <div className="text-[var(--color-sub-gray)] text-sm md:text-base italic">{children}</div>
  </blockquote>
)

// 텍스트 스타일링
const Emphasis: React.FC<ComponentProps> = ({ children }) => <em className="italic text-foreground">{children}</em>

const Strong: React.FC<ComponentProps> = ({ children }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
)

const Delete: React.FC<ComponentProps> = ({ children }) => (
  <del className="line-through text-[var(--color-disabled-text)]">{children}</del>
)

// 인라인 코드 - 이제 사용되지 않음 (전처리에서 제거됨)
const InlineCode: React.FC<ComponentProps> = ({ children }) => (
  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-[var(--color-main-color)] border border-[var(--color-gray-border)]">
    {children}
  </code>
)

// 코드 블록
const CodeBlock: React.FC<ComponentProps & { className?: string }> = ({ children, className }) => {
  const language = className?.replace("language-", "") || "text"

  return (
    <div className="my-4">
      {language !== "text" && (
        <div className="bg-[var(--color-sub-gray)] text-white px-3 py-1 text-xs font-mono rounded-t-md">{language}</div>
      )}
      <pre
        className={`bg-muted p-4 rounded-md ${language !== "text" ? "rounded-t-none" : ""} overflow-x-auto border border-[var(--color-gray-border)]`}
      >
        <code className="text-sm font-mono text-foreground whitespace-pre">{children}</code>
      </pre>
    </div>
  )
}

// 링크
interface LinkProps extends ComponentProps {
  href?: string
}

const Link: React.FC<LinkProps> = ({ href, children }) => (
  <a
    href={href}
    className="text-[var(--color-main-color)] hover:text-[var(--color-secondary-color-dark)] underline decoration-2 underline-offset-2 transition-colors duration-200"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
)

// 테이블 컴포넌트들
const Table: React.FC<ComponentProps> = ({ children }) => (
  <div className="overflow-x-auto my-4 rounded-md border border-[var(--color-gray-border)]">
    <table className="min-w-full divide-y divide-[var(--color-gray-border)]">{children}</table>
  </div>
)

const TableHead: React.FC<ComponentProps> = ({ children }) => <thead className="bg-secondary">{children}</thead>

const TableRow: React.FC<ComponentProps> = ({ children }) => (
  <tr className="divide-x divide-[var(--color-gray-border)] hover:bg-secondary/30 transition-colors duration-150">
    {children}
  </tr>
)

const TableCell: React.FC<ComponentProps> = ({ children }) => (
  <td className="px-4 py-3 text-sm md:text-base text-foreground">{children}</td>
)

const TableHeader: React.FC<ComponentProps> = ({ children }) => (
  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{children}</th>
)

// 수평선
const HorizontalRule: React.FC = () => <hr className="my-6 border-0 h-px bg-[var(--color-gray-border)]" />

// 이미지 캡션을 위한 특별한 paragraph 컴포넌트
const CustomParagraph: React.FC<ComponentProps> = ({ children }) => {
  // 자식 요소들을 배열로 변환
  const childrenArray = React.Children.toArray(children)

  // 이미지가 포함된 paragraph인지 확인
  const hasImages = childrenArray.some((child) => {
    if (!React.isValidElement(child)) return false

    // 이미지 컴포넌트인지 확인 (props에 src가 있는지 확인)
    return (
      child.props &&
      typeof child.props === "object" &&
      child.props !== null &&
      "src" in child.props &&
      typeof (child.props as any).src === "string"
    )
  })

  // 이미지가 포함된 경우 특별한 스타일 적용
  if (hasImages) {
    return <p className="text-center my-4">{children}</p>
  }

  // 그 외의 경우 일반 p 태그로 렌더링
  return <p className="text-foreground leading-relaxed mb-4 text-sm md:text-base">{children}</p>
}

// 이미지 로딩 스켈레톤 컴포넌트
const ImageSkeleton = () => (
  <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md" />
)

const MarkdownImage = ({ src, alt, title, ...props }: { src?: string, alt?: string, title?: string }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className="relative w-full flex flex-col items-center">
      {loading && !error && <ImageSkeleton />}
      {!error ? (
        <img
          src={src}
          alt={alt || "이미지"}
          title={title}
          className={`max-w-full h-auto rounded-md border border-[var(--color-gray-border)] shadow-sm mx-auto block ${loading ? "hidden" : ""}`}
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
          {...props}
        />
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-md border border-[var(--color-gray-border)] shadow-sm">
          <span className="text-gray-500 text-base font-semibold">이미지를 불러올 수 없습니다</span>
        </div>
      )}
      {alt && !loading && !error && (
        <span className="block text-center text-sm text-[var(--color-sub-gray)] mt-2 italic">{alt}</span>
      )}
    </div>
  )
}

export default function MarkdownRenderer({ content, markdownImages = [] }: MarkdownRendererProps) {
  // 마크다운 콘텐츠를 전처리하여 인라인 코드를 제거
  const processedContent = preprocessMarkdown(content)

  return (
    <div className="markdown-content max-w-none prose-sm md:prose-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({ node, ...props }) => <Heading1 {...props} />,
          h2: ({ node, ...props }) => <Heading2 {...props} />,
          h3: ({ node, ...props }) => <Heading3 {...props} />,
          h4: ({ node, ...props }) => <Heading4 {...props} />,
          h5: ({ node, ...props }) => <Heading5 {...props} />,
          h6: ({ node, ...props }) => <Heading6 {...props} />,
          // 마크다운 이미지를 포함할 수 있는 paragraph만 특별 처리
          p: ({ node, ...props }) => <CustomParagraph {...props} />,
          ul: ({ node, ...props }) => <UnorderedList {...props} />,
          ol: ({ node, ...props }) => <OrderedList {...props} />,
          li: ({ node, ...props }) => <ListItem {...props} />,
          blockquote: ({ node, ...props }) => <Blockquote {...props} />,
          em: ({ node, ...props }) => <Emphasis {...props} />,
          strong: ({ node, ...props }) => <Strong {...props} />,
          del: ({ node, ...props }) => <Delete {...props} />,
          code: ({ node, inline, className, children, ...props }: CodeProps) => {
            if (inline) {
              return <InlineCode {...props}>{children}</InlineCode>
            }
            return (
              <CodeBlock className={className} {...props}>
                {children}
              </CodeBlock>
            )
          },
          pre: ({ node, children, ...props }) => <>{children}</>, // pre는 CodeBlock에서 처리
          a: ({ node, ...props }) => <Link {...props} />,
          // 마크다운 문법으로 작성된 이미지만 처리 - 이미지와 캡션을 분리
          img: ({ node, src, alt, title, ...props }) => {
            const srcString = typeof src === "string" ? src : String(src || "")

            // 마크다운 이미지 라우팅 처리
            if (srcString.startsWith("/markdown-image/")) {
              const imageId = srcString.replace("/markdown-image/", "")
              const markdownImage = markdownImages.find((img) => img.id === imageId)

              if (markdownImage) {
                return (
                  <>
                    <MarkdownImage
                      src={markdownImage.preview || "/placeholder.svg"}
                      alt={alt || "붙여넣은 이미지"}
                      title={title}
                      {...props}
                    />
                    {alt && (
                      <span className="block text-center text-sm text-[var(--color-sub-gray)] mt-2 italic">{alt}</span>
                    )}
                  </>
                )
              }

              return (
                <span className="inline-block bg-[var(--color-disabled-background)] border border-[var(--color-gray-border)] rounded-md px-2 py-1 text-xs text-[var(--color-disabled-text)]">
                  이미지를 찾을 수 없습니다: {imageId}
                </span>
              )
            }

            // 일반 마크다운 이미지 - 이미지와 캡션을 분리
            return (
              <>
                <MarkdownImage
                  src={srcString || "/placeholder.svg"}
                  alt={alt || "이미지"}
                  title={title}
                  {...props}
                />
                {alt && (
                  <span className="block text-center text-sm text-[var(--color-sub-gray)] mt-2 italic">{alt}</span>
                )}
              </>
            )
          },
          table: ({ node, ...props }) => <Table {...props} />,
          thead: ({ node, ...props }) => <TableHead {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => <TableRow {...props} />,
          td: ({ node, ...props }) => <TableCell {...props} />,
          th: ({ node, ...props }) => <TableHeader {...props} />,
          hr: ({ node, ...props }) => <HorizontalRule {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

// 마크다운에서 헤딩 추출하는 유틸리티 함수
export const extractHeadings = (markdown: string) => {
  // 코드 블록을 먼저 제거한 후 헤딩 추출
  const codeBlocks: string[] = []
  const processedMarkdown = markdown.replace(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length
    codeBlocks.push(match)
    return `__CODE_BLOCK_${index}__`
  })

  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const headings: Array<{ level: number; text: string; id: string }> = []

  let match
  while ((match = headingRegex.exec(processedMarkdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()

    // 코드 블록 플레이스홀더가 포함된 헤딩은 제외
    if (!text.includes("__CODE_BLOCK_")) {
      const id = createSlug(text)
      headings.push({ level, text, id })
    }
  }

  return headings
}
