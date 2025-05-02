"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  id: number
  image: string
  sellerName: string
  productName: string
  achievementRate: number
  size?: number
  liked: boolean
  rankElement?: ReactNode
  showProgressBar?: boolean
  daysLeft?: number
  description?: string
  className?: string
}

export default function ProductCard({
  id,
  image,
  sellerName,
  productName,
  achievementRate,
  size = 220,
  liked,
  rankElement,
  showProgressBar = false,
  daysLeft,
  description,
  className,
}: ProductCardProps) {
  const isDeadlineSoon = daysLeft && daysLeft <= 3 // 마감 임박 여부 확인 추후 수정
  const router = useRouter();

  const handleLikedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 좋아요 변경 api 호출
    liked = !liked;
  }

  const handleCardClick = () => {
    router.push(`/product/${id}`);
  }

  return (
    <div className={cn("relative", className)}>
      {/* Custom rank element */}
      {rankElement && <div className="absolute -top-6 left-0 z-10">{rankElement}</div>}
      {/* 마감 임박 */}
      {isDeadlineSoon &&
        <div className="absolute top-2 left-2 z-20 bg-[#FF0040] text-white px-3 py-1 rounded-sm text-sm font-bold">
          마감임박
        </div>
      }

      <button type="button" onClick={handleCardClick} className="w-full rounded-lg overflow-hidden text-left">
        <div className="relative" style={{ width: size, height: size }}>
          <Image src={image || "/placeholder.svg"} alt={productName} fill className="rounded-lg object-cover" />
          <button
            type="button"
            onClick={handleLikedClick}
            className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
          >
            {liked ? (
              <Heart className="w-3 h-3 text-[#FF0040] fill-[#FF0040]" />
            ) : (
              <Heart className="w-3 h-3 text-black/50" />
            )}
          </button>
        </div>

        <div className="p-2">
          <p className="text-xm text-[#545454]">{sellerName}</p>
          <p className="text-xm font-medium">{productName}</p>
          {description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>}
          <p
            className="text-xm font-bold text-[#ff8fab]"
            style={{ marginTop: showProgressBar ? "2rem" : "0" }}
          >{achievementRate * 100}% 달성!</p>
          {showProgressBar && daysLeft && (
            <div className="mt-1">
              <div className="relative w-full h-3 bg-[#d9d9d9] rounded-full overflow-hidden">
                <div
                  className={"absolute left-0 top-0 h-3 bg-[#ff8fab] rounded-full"}
                  style={{ width: `${achievementRate * 100}%` }} // 동적으로 width 설정
                />
              </div>
              <div className="flex justify-end mt-1">
                <p className="text-xm font-semibold">{daysLeft}일 남았어요.</p>
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
