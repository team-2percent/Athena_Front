"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import ReviewModal from "./ReviewModal"

interface ReviewItemProps {
  id: number
  sellerName: string
  productName: string
  reviewDate: string
  reviewContent: string
  productImage: string
  likes: number
}

export default function ReviewItem({
  id,
  sellerName,
  productName,
  reviewDate,
  reviewContent,
  productImage,
  likes,
}: ReviewItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-6 mb-8">
        {/* 영역 1: 상품 이미지 */}
        <div className="relative w-64 h-48 flex-shrink-0">
          <Image
            src={productImage || "/placeholder.svg"}
            alt={productName}
            width={256}
            height={192}
            className="w-full h-full object-cover rounded-lg"
          />

          {/* 하트 아이콘 */}
          <div className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
        </div>

        {/* 영역 2, 3: 후기 내용 */}
        <div className="w-[calc(100%-16rem-1.5rem)] flex flex-col h-48">
          {/* 영역 2: 판매자/상품 정보, 날짜 및 좋아요/싫어요 */}
          <div className="mb-3">
            {/* 판매자 및 상품 정보 */}
            <div className="mb-3">
              <span className="font-medium">{productName}</span>
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
