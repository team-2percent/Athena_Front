"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import ProjectTabs from "./ProjectTabs"
import clsx from "clsx"

const ProjectDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [visibleImages, setVisibleImages] = useState<number[]>([])
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const metadataContainerRef = useRef<HTMLDivElement>(null)

  // API 호출에 따른 업데이트 예정
  // 피자 이미지 배열 (10개)
  const images = [
    "/pizza/pizza-variant1.jpg",
    "/pizza/pizza-variant2.png",
    "/pizza/pizza-variant3.png",
    "/pizza/pizza-variant4.png",
    "/pizza/pizza-variant5.png",
    "/pizza/pizza-variant6.png",
    "/pizza/pizza-variant7.png",
    "/pizza/pizza-variant8.png",
    "/pizza/pizza-variant9.png",
    "/pizza/pizza-variant10.png",
  ]

  // 이미지 목록에 표시할 이미지 인덱스 계산
  useEffect(() => {
    updateVisibleImages(currentImageIndex)
  }, [currentImageIndex])

  // 현재 이미지 인덱스를 기준으로 표시할 이미지 목록 업데이트
  const updateVisibleImages = (currentIdx: number) => {
    const totalImages = images.length
    const visibleCount = 5 // 한 번에 보여줄 이미지 수

    // 현재 이미지를 중심으로 앞뒤로 이미지를 배치
    let startIdx = currentIdx - Math.floor(visibleCount / 2)

    // 경계 조건 처리
    if (startIdx < 0) {
      // 시작 인덱스가 0보다 작으면 0부터 시작
      startIdx = 0
    } else if (startIdx + visibleCount > totalImages) {
      // 끝 인덱스가 총 이미지 수를 초과하면 조정
      startIdx = totalImages - visibleCount
    }

    // 표시할 이미지 인덱스 배열 생성
    const newVisibleImages = Array.from({ length: visibleCount }, (_, i) => {
      const idx = (startIdx + i) % totalImages
      return idx >= 0 ? idx : idx + totalImages
    })

    setVisibleImages(newVisibleImages)
  }

  const handleLikeClick = () => {
    setIsLiked(!isLiked)
  }

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length
    setCurrentImageIndex(newIndex)
  }

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length
    setCurrentImageIndex(newIndex)
  }

  const nextThumbnails = () => {
    // 현재 표시된 이미지 중 마지막 이미지의 다음 이미지로 이동
    const lastVisibleIndex = visibleImages[visibleImages.length - 1]
    const nextIndex = (lastVisibleIndex + 1) % images.length
    setCurrentImageIndex(nextIndex)
  }

  const prevThumbnails = () => {
    // 현재 표시된 이미지 중 첫 번째 이미지의 이전 이미지로 이동
    const firstVisibleIndex = visibleImages[0]
    const prevIndex = (firstVisibleIndex - 1 + images.length) % images.length
    setCurrentImageIndex(prevIndex)
  }

  return (
    <div className="mx-auto max-w-6xl pb-20">
      {/* 상품 정보 영역 */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* 왼쪽: 이미지 영역 */}
        <div className="flex flex-col">
          {/* 이미지 표시 영역 (캐러셀) */}
          <div ref={imageContainerRef} className="relative aspect-square w-full overflow-hidden rounded-3xl">
            <Image src={images[currentImageIndex] || "/placeholder.svg"} alt="게살피자" fill className="object-cover" />

            {/* 캐러셀 좌우 버튼 */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-sub-gray shadow-md hover:bg-white"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-sub-gray shadow-md hover:bg-white"
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* 이미지 목록 */}
          <div className="relative mt-4 flex items-center">
            {/* 왼쪽 버튼 */}
            <button onClick={prevThumbnails} className="mr-2 text-sub-gray" aria-label="이전 이미지 목록">
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex flex-1 justify-between">
              {visibleImages.map((idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ${
                    currentImageIndex === idx
                      ? "ring-4 ring-main-color"
                      : "hover:ring-2 hover:ring-main-color"
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <div className="relative h-20 w-20">
                    <Image
                      src={images[idx] || "/placeholder.svg"}
                      alt={`피자 이미지 ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 오른쪽 버튼 */}
            <button onClick={nextThumbnails} className="ml-2 text-sub-gray" aria-label="다음 이미지 목록">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 오른쪽: 메타데이터 영역 */}
        <div ref={metadataContainerRef} className="flex flex-col justify-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold">게살피자</h1>
            <h2 className="mb-6 text-2xl text-red-800">Smilegate Megaport</h2>

            <div className="mb-4">
              <p className="mb-3 text-gray-700">달성 금액</p>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-main-color">40,000,000</span>
                <span className="ml-2 text-xl text-sub-gray">/ 10,000,000 원</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium text-main-color">목표 금액의 400% 달성</p>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-gray-700">펀딩 마감까지</p>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-main-color">15일</span>
                <span className="ml-2 text-xl text-sub-gray">/ 2025. 05. 15</span>
              </div>
            </div>
          </div>

          {/* 찜, 공유, 후원하기 버튼을 같은 행에 배치 */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex space-x-12">
              <button onClick={handleLikeClick} className="flex flex-col items-center">
                <Heart className={`h-8 w-8 ${isLiked ? "fill-point-color text-point-color" : "text-sub-gray"}`} />
                <span className={clsx("mt-2 text-lg font-medium", isLiked ? "text-point-color" : "text-sub-gray")}>867</span>
              </button>
              <button className="flex flex-col items-center">
                <Share2 className="h-8 w-8 text-sub-gray" />
                <span className="mt-2 text-lg font-medium text-sub-gray">238</span>
              </button>
            </div>

            {/* 후원하기 버튼과 후원 중 표시 */}
            <div className="relative w-2/3">
              <button
                className="w-full rounded-xl bg-main-color py-4 text-center text-xl font-bold text-white hover:bg-secondary-color-dark"
                onClick={() => {
                  // 이벤트 이름 변경
                  const event = new CustomEvent("toggleDonateDock")
                  window.dispatchEvent(event)
                }}
              >
                후원하기
              </button>
              {/* 배지 형태로 표시. 위치는 후원하기 버튼에 의존함. */}
              <div className="absolute -right-3 -top-4">
                <div className="rounded-full border-2 border-main-color bg-white px-6 py-1 text-main-color shadow-md">
                  <span className="text-lg">125명 후원 중!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 및 소개 영역 추가 */}
      <ProjectTabs />
    </div>
  )
}

export default ProjectDetail
