"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ProjectOverlayItemProps {
    id: number
  className?: string
  isDeadlineSoon?: boolean
  imageUrl?: string
  projectName: string
  sellerName: string
  description: string
  achievementRate: number
  daysLeft?: number
}

export default function ProjectOverlayItem({
  className,
  isDeadlineSoon,
  id,
  imageUrl,
  projectName,
  sellerName,
  description,
  achievementRate,
  daysLeft,
}: ProjectOverlayItemProps) {

    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/project/${id}`)
    }

  return (
    <div className={cn("relative flex", className)}>
      {/* 마감 임박 */}
      {isDeadlineSoon && (
        <div className="absolute top-2 left-2 z-20 bg-point-color text-white px-3 py-1 rounded-sm text-xs font-bold">
          마감임박
        </div>
      )}
      <div
        onClick={handleCardClick}
        className="w-full flex flex-col rounded-lg overflow-hidden text-left cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-lg aspect-square group">
          {/* 이미지 */}
          <img
            src={imageUrl || "/placeholder/project-placeholder.png"}
            alt={projectName}
            className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-black/70 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out flex flex-col justify-end p-4">
            <div className="text-white">
              <p className="text-sm opacity-90 mb-0">{sellerName}</p>
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{projectName}</h3>
              <p className="text-sm opacity-90 mb-2 line-clamp-3">{description}</p>

              <div className="space-y-2">
                <p className={"text-main-color font-semibold"}>
                  {achievementRate}% 달성!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
