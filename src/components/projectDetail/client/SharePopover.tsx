"use client"

import { useState, useEffect } from "react"
import { Share2, X, Copy, Check } from "lucide-react"
import { GhostButton, OutlineButton, PrimaryButton } from "../../common/Button"

const SharePopover = () => {
  const [showSharePopover, setShowSharePopover] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const copyToClipboard = async () => {
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)
      setCopySuccess(true)
      setTimeout(() => {
        setCopySuccess(false)
        setShowSharePopover(false)
      }, 3000)
    } catch (err) {
      // fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => {
        setCopySuccess(false)
        setShowSharePopover(false)
      }, 2000)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showSharePopover && !target.closest(".relative")) {
        setShowSharePopover(false)
      }
    }
    if (showSharePopover) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSharePopover])

  return (
    <div className="relative w-full md:w-1/3">
      <OutlineButton
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 md:py-4 text-base md:text-xl text-gray-700 hover:bg-gray-50"
        onClick={() => setShowSharePopover(!showSharePopover)}
      >
        <Share2 className="h-5 w-5 md:h-6 md:w-6" />
        공유하기
      </OutlineButton>
      <div
        className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 transition-all duration-75 ease-out
          ${showSharePopover ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{transformOrigin: 'top left'}}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">프로젝트 공유하기</h3>
          <GhostButton onClick={() => setShowSharePopover(false)} className="p-1 rounded-full">
            <X className="h-4 w-4" />
          </GhostButton>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border text-sm text-gray-600">
            <span className="flex-1 truncate">
              {typeof window !== "undefined" ? window.location.href : ""}
            </span>
          </div>
          <PrimaryButton
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors"
            disabled={copySuccess}
          >
            {copySuccess ? (
              <>
                <Check className="h-4 w-4" />
                복사 완료!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                URL 복사하기
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default SharePopover 