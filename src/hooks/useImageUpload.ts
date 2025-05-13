"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

interface UploadResponse {
    success: boolean
    error: string | null
    data: any
}

export function useImageUpload() {
    const [isUploading, setIsUploading] = useState(false)
    const { logout } = useAuth()

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

            const response = await fetch("http://localhost:3000/api/images", {
                method: "POST",
                headers: {
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                body: formData,
            })

            const responseData = await response.json()

            if (!response.ok) {
                if (response.status === 401) {
                    // 인증 실패 시 로그아웃
                    logout()
                    return {
                        success: false,
                        error: "Authentication failed. Please log in again.",
                        data: null,
                    }
                }

                return {
                    success: false,
                    error: responseData.message || "Image upload failed",
                    data: responseData,
                }
            }

            return {
                success: true,
                error: null,
                data: responseData,
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
