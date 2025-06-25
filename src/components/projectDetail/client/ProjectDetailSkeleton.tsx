"use client"

export default function ProjectDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* 왼쪽: 이미지 캐러셀 스켈레톤 */}
      <div className="flex flex-col">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gray-200 animate-pulse flex items-center justify-center">
        </div>
        <div className="mt-4 flex justify-center gap-4">
          {[0,1,2,3,4].map(idx => (
            <div key={idx} className="h-20 w-20 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
      {/* 오른쪽: 메타데이터 스켈레톤 */}
      <div className="flex flex-col justify-center px-4 md:px-0">
        <div className="mb-4">
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-6 w-1/2 bg-gray-100 rounded mb-6 animate-pulse" />
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="h-6 w-1/4 bg-gray-100 rounded mb-6 animate-pulse" />
          <div className="h-8 w-1/2 bg-gray-200 rounded mb-8 animate-pulse" />
        </div>
        <div className="flex gap-2 mt-6">
          <div className="h-12 w-1/2 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-12 w-1/2 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
