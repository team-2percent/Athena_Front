"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import { Check, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  id: number
  image: string
  sellerName: string
  projectName: string
  achievementRate: number
  size?: number
  liked: boolean
  rankElement?: ReactNode
  showProgressBar?: boolean
  daysLeft?: number
  description?: string
  className?: string
}

export default function ProjectCard({
  id,
  image,
  sellerName,
  projectName,
  achievementRate,
  size = 220,
  liked,
  rankElement,
  showProgressBar = false,
  daysLeft,
  description,
  className,
}: ProjectCardProps) {
  const isDeadlineSoon = daysLeft !== undefined && daysLeft <= 3 && daysLeft > 0; // 마감 임박 여부 확인 추후 수정
  const [likedCheck, setLikedCheck] = useState(liked);
  const router = useRouter();
  const isSoldOut = daysLeft !== undefined && daysLeft <= 0;
  const isOverAchieved = achievementRate * 100 > 100;
  const handleLikedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 좋아요 변경 api 호출
    setLikedCheck(!likedCheck);
  }

  const handleCardClick = () => {
    router.push(`/project/${id}`);
  }

  return (
    <div className={cn("relative", "w-fit", "flex-col", className)}>
      {/* Custom rank element */}
      {rankElement && <div className="mb-2">{rankElement}</div>}
      {/* 마감 임박 */}
      {isDeadlineSoon &&
        <div className="absolute top-2 left-2 z-20 bg-[#FF0040] text-white px-3 py-1 rounded-sm text-xs font-bold">
          마감임박
        </div>
      }

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div onClick={handleCardClick} className="w-fit rounded-lg overflow-hidden text-left">
        <div className="relative" style={{ width: size, height: size }}>
          {/* 판매 완료 오버레이 */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-white">
              <div className="bg-white rounded-full p-2 mb-2">
                <Check className="w-6 h-6 text-gray-500" />
              </div>
              <p className="font-bold text-lg">판매 종료</p>
              <p className="text-sm">감사합니다.</p>
            </div>
          )}
          <Image src={image || "/placeholder.svg"} alt={projectName} fill className="rounded-lg object-cover" />
          <button
            type="button"
            onClick={handleLikedClick}
            className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
          >
            {likedCheck ? (
              <Heart className="w-3 h-3 text-[#FF0040] fill-[#FF0040]" />
            ) : (
              <Heart className="w-3 h-3 text-black/50" />
            )}
          </button>
        </div>

        <div className="p-1 pt-2" style={{ width: size }}>
          <p className="text-sm text-[#545454]">{sellerName}</p>
          <p className="text-sm font-medium">{projectName}</p>
          {description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>}
          <p
            className={cn("text-sm font-bold", isSoldOut ? "text-[#808080]" : "text-[#ff8fab]", showProgressBar ? "mt-8" : "mt-0")}
          >{achievementRate * 100}% 달성!</p>
          {showProgressBar && (
            <div className="mt-1">
              <div className="relative w-full h-3 bg-[#d9d9d9] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "text-sm font-bold h-full",
                    isSoldOut ? "bg-[#808080]" : isOverAchieved ? "bg-gradient-to-r from-[#ff8fab] to-[#ff5d8f]" : "text-[#ff8fab]",
                  )}
                  style={{ width: `${isOverAchieved || isSoldOut ? 100 : achievementRate * 100}%` }} // 동적으로 width 설정
                />
              </div>
              <div className="flex justify-end mt-1">
                {
                  isSoldOut ?
                  <p className="text-xs font-semibold">종료되었어요.</p>
                  :
                  <p className="text-xs font-semibold">{daysLeft}일 남았어요.</p>
                }
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
