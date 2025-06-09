"use client"

import { useState } from "react"

interface UploadResponse {
  success: boolean
  error: string | null
  data: any
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)

  const uploadImages = async (imageGroupId: number, files: File[]): Promise<UploadResponse> => {
    setIsUploading(true)

    try {
      const formData = new FormData()

      // 이미지 그룹 ID 추가
      formData.append("imageGroupId", imageGroupId.toString())

      // 파일들 추가
      files.forEach((file, index) => {
        formData.append(`files`, file)
      })

      const accessToken = localStorage.getItem("accessToken")

      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(apiBase + "/api/image", {
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: formData,
      })

      // 응답 상태 코드만 확인하고 데이터는 파싱하지 않음
      if (!response.ok) {
        if (response.status === 401) {
          // 인증 실패 시 에러 반환
          return {
            success: false,
            error: "Authentication failed. Please log in again.",
            data: null,
          }
        }

        let errorMessage = "Image upload failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // JSON 파싱 실패 시 기본 에러 메시지 사용
        }

        return {
          success: false,
          error: errorMessage,
          data: null,
        }
      }

      // 성공 시 응답 데이터 없이 성공 상태만 반환
      return {
        success: true,
        error: null,
        data: { imageGroupId }, // 업로드에 사용된 imageGroupId만 반환
      }
    } catch (error) {
      console.error("Image upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during upload",
        data: null,
      }
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadImages, isUploading }
}
