"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // Sample card data for the carousel
  const carouselCards = [
    {
      id: 1,
      image: "/product-test.png",
      title: "마녀로 마법사로\n변신한 고양이",
      description: "고양이 일러스트 PVC 스티커",
    },
    {
      id: 2,
      image: "/product-test2.png",
      title: "마법의 세계로\n떠나는 여행",
      description: "판타지 일러스트 컬렉션",
    },
    {
      id: 3,
      image: "/product-test3.png",
      title: "신비로운 숲속의\n마법 생물들",
      description: "환상적인 생물 스티커 세트",
    },
  ]

  // 캐러셀 이동
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    const isFirstCard = currentIndex === 0
    const newIndex = isFirstCard ? carouselCards.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const isLastCard = currentIndex === carouselCards.length - 1
    const newIndex = isLastCard ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  // 캐러셀 상품 클릭 시 상품 페이지로 이동
  const handleCardClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`/product/${carouselCards[currentIndex].id}`);
  }

  const currentCard = carouselCards[currentIndex]

  return (
    <div
        className="relative bg-[#d9d9d9] w-[720px] h-[300px] my-2 mx-2 rounded-lg overflow-hidden"
        onClick={handleCardClick}
    >
      {/* Background Card Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentCard.image || "/placeholder.svg"}
          alt={currentCard.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20 z-10 bg-[linear-gradient(180deg,rgba(51,51,51,0)0%,rgba(51,51,51,0.1)65%,rgba(51,51,51,0.5)80%,rgba(51,51,51,0.8)100%)]" />

      {/* Title at bottom left with semi-transparent background */}
      <div className="absolute bottom-0 left-0 p-4 z-20 rounded-tr-lg">
        <h2 className="text-lg font-bold text-white">{currentCard.title}</h2>
        <p className="text-xs mt-1 text-white/80">{currentCard.description}</p>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-2 right-2 flex gap-2 z-20">
        {/* Card Counter */}
        <div className="px-2 h-7 w-11 rounded-full bg-black flex items-center justify-center z-10">
          <span className="text-xs text-white">
            {currentIndex + 1}/{carouselCards.length}
          </span>
        </div>
        {/* Move Arrow */}
        <button
          type="button"
          onClick={goToPrevious}
          className="w-7 h-7 rounded-full bg-black flex items-center justify-center z-10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="w-7 h-7 rounded-full bg-black flex items-center justify-center z-10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}
