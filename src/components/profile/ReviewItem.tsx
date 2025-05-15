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
      <div className="mb-8">
        <div className="flex gap-6">
          {/* 영역 1: 상품 이미지 */}
          <div className="relative w-60 h-60 flex-shrink-0">
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
            <button
              type="button"
              className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-md"
              aria-label="좋아요"
            >
              <Heart className="h-5 w-5 text-sub-gray" />
            </button>
          </div>

          {/* 영역 2, 3: 후기 내용 */}
          <div className="flex-1 flex flex-col w-64">
            {/* 영역 2: 판매자/상품 정보, 날짜 및 좋아요/싫어요 */}
            <div className="mb-2">
              {/* 판매자 및 상품 정보 */}
              <div className="mb-1 text-sub-gray">{sellerName}</div>
              <h3 className="text-xl font-medium mb-1">{projectName}</h3>
            </div>

            <div className="flex items-center gap-4 mb-2">
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

            {/* 영역 3: 댓글 내용 카드 */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex-grow bg-white rounded-2xl border border-gray-200 px-4 py-3 text-left overflow-hidden shadow-sm hover:shadow-md transition-shadow mt-auto"
            >
              <div className="overflow-hidden">
                <p className="line-clamp-4 text-gray-700 whitespace-pre-wrap break-words">{reviewContent}</p>
              </div>
            </button>
          </div>
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
