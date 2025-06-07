"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import clsx from "clsx"

interface ProjectCardProps {
  id: number
  size?: "base" | "xl"
  imageUrl: string
  sellerName: string
  projectName: string
  achievementRate: number
  showProgressBar?: boolean
  daysLeft?: number
  description: string
  className?: string
}

const sizeDesign = {
  "sellerName": {
    "base": "text-sm",
    "xl": "text-xl"
  },
  "projectName": {
    "base": "text-sm",
    "xl": "text-xl"
  },
  "description": {
    "base": "text-xs",
    "xl": "text-lg"
  },
  "achievement": {
    "base": "text-xs",
    "xl": "text-lg"
  }
}

export default function ProjectCard({
  id,
  size = "base",
  imageUrl,
  sellerName,
  projectName,
  achievementRate,
  showProgressBar = false,
  daysLeft,
  description,
  className,
}: ProjectCardProps) {
  const isDeadlineSoon = daysLeft !== undefined && daysLeft <= 7 && daysLeft > 0; // 마감 임박 여부 확인 추후 수정
  const router = useRouter();
  const isSoldOut = daysLeft !== undefined && daysLeft <= 0;
  const isOverAchieved = achievementRate > 100;

  const handleCardClick = () => {
    router.push(`/project/${id}`);
  }

  return (
    <div className={cn("relative flex", className)} data-cy="project-list-item">
      {/* 마감 임박 */}
      {isDeadlineSoon &&
        <div className="absolute top-2 left-2 z-4 bg-point-color text-white px-3 py-1 rounded-sm text-xs font-bold">
          마감임박
        </div>
      }

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div onClick={handleCardClick} className="w-full flex flex-col rounded-lg overflow-hidden text-left">
        <div className="relative overflow-hidden rounded-lg">
          {/* 판매 완료 오버레이 */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-white">
              <div className="bg-white rounded-full p-2 mb-2">
                <Check className="w-6 h-6 text-sub-gray" />
              </div>
              <p className="font-bold text-lg">판매 종료</p>
              <p className="text-sm">감사합니다.</p>
            </div>
          )}
          <img src={imageUrl || "/placeholder/project-placeholder.png"} alt={projectName} className="rounded-lg object-cover w-full h-full" />
        </div>

        <div className="flex flex-col flex-1 justify-between p-1 pt-2">
          <div>
            <p className={clsx("text-sub-gray", sizeDesign.sellerName[size])}>{sellerName}</p>
            <p className={clsx("font-medium line-clamp-2", sizeDesign.projectName[size])}>{projectName}</p>
            <p className={clsx("text-sub-gray mt-1 line-clamp-2", sizeDesign.description[size])}>{description}</p>
            { !showProgressBar && <p
              className={cn("font-bold mt-1", isOverAchieved ? "text-point-color" : "text-main-color", isSoldOut ? "text-sub-gray" : "text-main-color", sizeDesign.achievement[size])}
            >{achievementRate}% 달성!</p>}
          </div>
          <div>
            { showProgressBar && <p
              className={cn("text-sm font-bold mt-8", isOverAchieved ? "text-point-color" : "text-main-color", isSoldOut ? "text-sub-gray" : "text-main-color")}
            >{achievementRate}% 달성!</p>}
            {showProgressBar && (
              <div className="mt-1">
                <div className="relative w-full h-3 bg-gray-border rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "text-sm font-bold h-full rounded-full",
                      isSoldOut ? "bg-sub-gray" : isOverAchieved ? "bg-gradient-to-r from-main-color to-point-color" : "bg-main-color",
                    )}
                    style={{ width: `${isOverAchieved || isSoldOut ? 100 : achievementRate}%` }} // 동적으로 width 설정
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
    </div>
  )
}
