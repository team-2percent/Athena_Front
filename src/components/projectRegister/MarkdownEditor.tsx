"use client"
import MarkdownRenderer from "./MarkdownRenderer"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-100 p-2 border-b">
        <div className="flex gap-2">
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)
              const newText = before + "**" + (selection || "굵은 텍스트") + "**" + after
              onChange(newText)
              // 포커스 유지 및 선택 영역 조정
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(start + 2, start + 2 + (selection || "굵은 텍스트").length)
              }, 0)
            }}
          >
            <span className="font-bold">B</span>
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)
              const newText = before + "*" + (selection || "기울임꼴 텍스트") + "*" + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(start + 1, start + 1 + (selection || "기울임꼴 텍스트").length)
              }, 0)
            }}
          >
            <span className="italic">I</span>
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)
              const newText = before + "<ins>" + (selection || "밑줄 텍스트") + "</ins>" + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(start + 5, start + 5 + (selection || "밑줄 텍스트").length)
              }, 0)
            }}
          >
            <span className="underline">U</span>
          </button>
          {/* 취소선 버튼 추가 */}
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)
              const newText = before + "~~" + (selection || "취소선 텍스트") + "~~" + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(start + 2, start + 2 + (selection || "취소선 텍스트").length)
              }, 0)
            }}
          >
            <span className="line-through">S</span>
          </button>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)

              // 현재 줄의 시작 위치 찾기
              let lineStart = start
              while (lineStart > 0 && text[lineStart - 1] !== "\n") {
                lineStart--
              }

              const newText =
                before.substring(0, lineStart) + "# " + before.substring(lineStart) + (selection || "제목 1") + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(
                  lineStart + 2 + (before.length - lineStart),
                  lineStart + 2 + (before.length - lineStart) + (selection || "제목 1").length,
                )
              }, 0)
            }}
          >
            H1
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)

              // 현재 줄의 시작 위치 찾기
              let lineStart = start
              while (lineStart > 0 && text[lineStart - 1] !== "\n") {
                lineStart--
              }

              const newText =
                before.substring(0, lineStart) + "## " + before.substring(lineStart) + (selection || "제목 2") + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(
                  lineStart + 3 + (before.length - lineStart),
                  lineStart + 3 + (before.length - lineStart) + (selection || "제목 2").length,
                )
              }, 0)
            }}
          >
            H2
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)

              // 현재 줄의 시작 위치 찾기
              let lineStart = start
              while (lineStart > 0 && text[lineStart - 1] !== "\n") {
                lineStart--
              }

              const newText =
                before.substring(0, lineStart) + "### " + before.substring(lineStart) + (selection || "제목 3") + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(
                  lineStart + 4 + (before.length - lineStart),
                  lineStart + 4 + (before.length - lineStart) + (selection || "제목 3").length,
                )
              }, 0)
            }}
          >
            H3
          </button>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)

              // 현재 줄의 시작 위치 찾기
              let lineStart = start
              while (lineStart > 0 && text[lineStart - 1] !== "\n") {
                lineStart--
              }

              const newText =
                before.substring(0, lineStart) + "- " + before.substring(lineStart) + (selection || "목록 항목") + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(
                  lineStart + 2 + (before.length - lineStart),
                  lineStart + 2 + (before.length - lineStart) + (selection || "목록 항목").length,
                )
              }, 0)
            }}
          >
            <span>• 목록</span>
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)

              // 현재 줄의 시작 위치 찾기
              let lineStart = start
              while (lineStart > 0 && text[lineStart - 1] !== "\n") {
                lineStart--
              }

              const newText =
                before.substring(0, lineStart) +
                "1. " +
                before.substring(lineStart) +
                (selection || "번호 항목") +
                after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(
                  lineStart + 3 + (before.length - lineStart),
                  lineStart + 3 + (before.length - lineStart) + (selection || "번호 항목").length,
                )
              }, 0)
            }}
          >
            <span>1. 번호</span>
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)

              // 현재 줄의 시작 위치 찾기
              let lineStart = start
              while (lineStart > 0 && text[lineStart - 1] !== "\n") {
                lineStart--
              }

              const newText =
                before.substring(0, lineStart) + "> " + before.substring(lineStart) + (selection || "인용구") + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(
                  lineStart + 2 + (before.length - lineStart),
                  lineStart + 2 + (before.length - lineStart) + (selection || "인용구").length,
                )
              }, 0)
            }}
          >
            <span>인용구</span>
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)
              const newText = before + "[" + (selection || "링크 텍스트") + "](https://example.com)" + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                if (selection) {
                  textarea.setSelectionRange(start + selection.length + 3, start + selection.length + 3 + 18)
                } else {
                  textarea.setSelectionRange(start + 1, start + 1 + "링크 텍스트".length)
                }
              }, 0)
            }}
          >
            <span>링크</span>
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => {
              const textarea = document.querySelector("textarea") as HTMLTextAreaElement
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const text = textarea.value
              const before = text.substring(0, start)
              const selection = text.substring(start, end)
              const after = text.substring(end)
              const newText = before + "![" + (selection || "이미지 설명") + "](https://example.com/image.jpg)" + after
              onChange(newText)
              setTimeout(() => {
                textarea.focus()
                if (selection) {
                  textarea.setSelectionRange(start + selection.length + 4, start + selection.length + 4 + 26)
                } else {
                  textarea.setSelectionRange(start + 2, start + 2 + "이미지 설명".length)
                }
              }, 0)
            }}
          >
            <span>이미지</span>
          </button>
        </div>
      </div>
      <div className="flex h-[500px]">
        <div className="w-1/2 p-4 border-r">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full resize-none focus:outline-none font-mono"
          />
        </div>
        <div className="w-1/2 p-4 overflow-auto">
          {/* 커스텀 마크다운 렌더러 사용 */}
          <MarkdownRenderer content={value} />
        </div>
      </div>
    </div>
  )
}
