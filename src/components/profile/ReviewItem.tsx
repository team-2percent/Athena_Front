"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import ReviewModal from "./ReviewModal"

interface ReviewItemProps {
  id: number
  sellerName: string
  projectName: string
  reviewDate: string
  reviewContent: string
  projectImage: string
  likes: number
  projectId: number
}

export default function ReviewItem({
  id,
  sellerName,
  projectName,
  reviewDate,
  reviewContent,
  projectImage,
  likes,
  projectId,
}: ReviewItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleProjectClick = () => {
    router.push(`/project/${projectId}`)
  }

  return (
    <>
      <div className="flex items-center gap-6 mb-8">
        {/* 영역 1: 상품 이미지 */}
        <div className="relative w-64 h-48 flex-shrink-0">
          {/* 상품 이미지 클릭 시 상품 상세 페이지로 이동 */}
          <div className="w-full h-full cursor-pointer" onClick={handleProjectClick}>
            <Image
              src={projectImage || "/placeholder.svg"}
              alt={projectName}
              width={256}
              height={192}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* 하트 아이콘 */}
          <div className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-md">
            <Heart className="p-1"/>
          </div>
        </div>

        {/* 영역 2, 3: 후기 내용 */}
        <div className="w-[calc(100%-16rem-1.5rem)] flex flex-col h-48">
          {/* 영역 2: 판매자/상품 정보, 날짜 및 좋아요/싫어요 */}
          <div className="mb-3">
            {/* 판매자 및 상품 정보 */}
            <div className="mb-3">
              <span className="font-medium">{projectName}</span>
              <span> / </span>
              <span className="text-gray-600">{sellerName}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-gray-500">{reviewDate}</div>
              <div className="flex items-center gap-4">
                <button type="button" className="flex items-center gap-1">
                  <ThumbsUp className="h-5 w-5" />
                  <span>{likes}</span>
                </button>
                <button type="button">
                  <ThumbsDown className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 영역 3: 댓글 내용 카드 */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-grow bg-white rounded-2xl border border-gray-200 px-4 py-3 text-left overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="overflow-hidden">
              <p className="line-clamp-4 text-gray-700 whitespace-pre-wrap break-words">{reviewContent}</p>
            </div>
          </button>
        </div>
      </div>

      {/* 댓글 모달 */}
      {isModalOpen && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reviewContent={reviewContent}
          reviewDate={reviewDate}
          likes={likes}
        />
      )}
    </>
  )
}
