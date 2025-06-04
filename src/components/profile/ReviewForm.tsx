"use client"

import type React from "react"

import { useState } from "react"
import { useApi } from "@/hooks/useApi"
import Modal from "@/components/common/Modal"
import TextArea from "../common/TextArea"
import { reviewContentSchema } from "@/lib/validationSchemas"
import { REVIEW_CONTENT_MAX_LENGTH } from "@/lib/validationConstant"
import InputInfo from "../common/InputInfo"
import { CancelButton, PrimaryButton } from "../common/Button"

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
  projectId: number
  projectName: string
  sellerName: string
  load: () => void
}

export default function ReviewForm({ isOpen, onClose, projectId, projectName, sellerName, load }: ReviewFormProps) {
  const { apiCall, isLoading: apiLoading } = useApi()
  const [reviewContent, setReviewContent] = useState("")
  const [reviewsError, setReviewsError] = useState<string>("")

  const validate = (content: string) => {
    const result = reviewContentSchema.safeParse(content)
    if (!result.success) {
      setReviewsError(result.error.message)
      return content.slice(0, REVIEW_CONTENT_MAX_LENGTH)
    }
    setReviewsError("")
    return content
  }

  const handleChangeReviewContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = validate(e.target.value)
    setReviewContent(result)
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reviewContent.trim()) return

    try {
      const { data, error, status } = await apiCall(
        `/api/comment/create?projectId=${projectId}`,
        "POST",
        {
          content: reviewContent
        }
      )

      if (error) {
        setReviewsError(error)
        return
      }

      console.log("리뷰 제출 성공:", data)
      onClose() // 모달 닫기

      // 리뷰 제출 후 입력 필드 초기화 및 리뷰 목록 새로고침
      setReviewContent("")
      load()
    } catch (err) {
      setReviewsError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      console.error("리뷰 제출 오류:", err)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="후기 작성" size="lg" dataCy="review-form">
      <div className="mb-4">
        <p className="font-medium">{projectName}</p>
        <p className="text-sub-gray text-sm">{sellerName}</p>
      </div>

      <form onSubmit={handleReviewSubmit}>
        <div className="mb-4">
          <TextArea
            value={reviewContent}
            onChange={handleChangeReviewContent}
            placeholder="상품에 대한 후기를 작성해주세요."
            isError={!!reviewsError}
            dataCy="review-content"
          />
          <InputInfo
            errorMessage={reviewsError}
            errorMessageDataCy="content-error-message"
            showLength
            maxLength={REVIEW_CONTENT_MAX_LENGTH}
            length={reviewContent.length}
          />
        </div>

        <div className="flex justify-end gap-3">
          <CancelButton
            type="button"
            onClick={onClose}
            dataCy="cancel-button"
          >
            취소
          </CancelButton>
          <PrimaryButton
            type="submit"
            dataCy="submit-button"
            disabled={!reviewContent.trim() || !!reviewsError}
          >
            등록하기
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  )
}
