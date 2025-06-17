"use client"

interface ProfileSkeletonProps {
  type: "intro" | "coupon" | "selling" | "purchased" | "review"
}

export default function ProfileSkeleton({ type }: ProfileSkeletonProps) {
  if (type === "intro") {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-8 whitespace-pre-wrap break-words" />
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <div className="h-10 w-48 sm:h-12 sm:w-56 bg-gray-200 rounded-full" />
          <div className="h-10 w-48 sm:h-12 sm:w-56 bg-gray-200 rounded-full" />
        </div>
      </div>
    )
  }

  if (type === "coupon") {
    return (
      <div className="flex flex-col gap-3 sm:gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl sm:rounded-2xl border border-gray-border flex overflow-hidden min-h-[72px] sm:min-h-[100px]">
            {/* 왼쪽: 퍼센트 아이콘 영역 */}
            <div className="relative min-w-[48px] sm:min-w-[70px] bg-gray-200">
              <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full translate-x-1/2 translate-y-[-50%]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full translate-x-1/2 translate-y-[50%]" />
            </div>

            {/* 중앙: 쿠폰 제목 및 설명 */}
            <div className="flex-1 p-2 sm:p-4 flex flex-col justify-center">
              <div className="h-6 w-36 sm:h-7 sm:w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 sm:h-5 sm:w-32 bg-gray-200 rounded" />
            </div>

            {/* 구분선 */}
            <div className="w-0 border-l border-dashed border-gray-border my-2 sm:my-4" />

            {/* 오른쪽: 금액 및 유효기간 */}
            <div className="p-2 sm:p-4 flex flex-col justify-center items-end w-28 sm:w-60">
              <div className="h-6 w-20 sm:h-7 sm:w-28 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 sm:h-4 sm:w-32 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "selling" || type === "purchased") {
    return (
      <div className="space-y-6 sm:space-y-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {/* 상품 이미지 */}
              <div className="relative w-full h-40 sm:w-60 sm:h-60 flex-shrink-0">
                <div className="w-full h-full bg-gray-200 rounded-lg" />
              </div>

              {/* 상품 정보 */}
              <div className="flex-1 flex flex-col w-full sm:w-64">
                <div className="h-4 w-32 sm:h-5 sm:w-40 bg-gray-200 rounded mb-2" />
                <div className="h-6 w-48 sm:h-7 sm:w-56 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-40 sm:h-5 sm:w-48 bg-gray-200 rounded mb-4" />

                {/* 달성률 게이지 */}
                <div className="mt-auto">
                  <div className="flex justify-between mb-1">
                    <div className="h-4 w-24 sm:h-5 sm:w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="h-1.5 sm:h-2 w-full bg-gray-200 rounded-full" />
                  <div className="flex justify-end mt-1">
                    <div className="h-4 w-28 sm:h-5 sm:w-36 bg-gray-200 rounded" />
                  </div>

                  {/* 버튼 영역 */}
                  {type === "purchased" ? (
                    <div className="flex justify-end mt-3 sm:mt-4">
                      <div className="h-8 sm:h-10 w-full bg-gray-200 rounded-lg" />
                    </div>
                  ) : (
                    <div className="flex gap-2 sm:gap-4 mt-3 sm:mt-4 justify-end">
                      <div className="h-8 sm:h-10 w-full bg-gray-200 rounded-lg" />
                      <div className="h-8 sm:h-10 w-full bg-gray-200 rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "review") {
    return (
      <div className="space-y-6 sm:space-y-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {/* 상품 이미지 */}
              <div className="relative w-full h-40 sm:w-60 sm:h-60 flex-shrink-0">
                <div className="w-full h-full bg-gray-200 rounded-lg" />
              </div>

              {/* 리뷰 정보 */}
              <div className="flex-1 flex flex-col w-full sm:w-64">
                <div className="mb-2">
                  <div className="h-4 w-32 sm:h-5 sm:w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-48 sm:h-7 sm:w-56 bg-gray-200 rounded mb-2" />
                </div>

                <div className="flex items-center gap-2 sm:gap-4 mb-2">
                  <div className="h-4 w-32 sm:h-5 sm:w-40 bg-gray-200 rounded" />
                </div>

                {/* 리뷰 내용 카드 */}
                <div className="flex-grow bg-gray-200 rounded-2xl mt-auto h-[100px] sm:h-[120px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
} 