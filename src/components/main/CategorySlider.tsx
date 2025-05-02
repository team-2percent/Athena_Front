"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import CategoryProduct from "./CategoryProduct"
import { useRouter } from "next/navigation"

interface Product {
  id: number
  image: string
  sellerName: string
  productName: string
  achievementRate: number
  liked: boolean
  daysLeft: number
}

interface CategorySliderProps {
  category: { id: number, name: string, image: string}
  products: Product[]
  className?: string
}

export default function CategorySlider({ category, products, className }: CategorySliderProps) {
  const logoSize = 100; // 카테고리 로고 이미지 사이즈
  const viewSize = 4; // 한 번에 보여줄 상품 수
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentStartIndex, setCurrentStartIndex] = useState(0); // 현재 보여지는 상품의 시작 인덱스
  const disableLeft = currentStartIndex === 0; // 이동 버튼 diabled 여부
  const disableRight = currentStartIndex + viewSize >= products.length - 1;
  const router = useRouter();

  // 슬라이드 이동
  const handlePrev = () => {
    setCurrentStartIndex(currentStartIndex - viewSize);
  }
  const handleNext = () => {
    setCurrentStartIndex(currentStartIndex + viewSize);
  }

  // 카테고리 목록 페이지로 이동
  const handleCategoryClick = () => {
    router.push(`/category/${category.id}`);
  }

  return (
    <div className={cn("flex", className)}>
      <div className="flex flex-col items-center justify-between w-[180px] gap-4">
        <div className="flex flex-col items-center justify-center mb-4">
          {/* Category image & name */}
          <Image
              src={category.image}
              alt={category.name}
              width={logoSize}
              height={logoSize}
              className="object-cover rounded-lg"
          />
          <span className="text-sm font-bold mt-2">{category.name}</span>
        </div>
        

        {/* Category view button */}
        <div className="mb-4">
          <button
            type="button"
            className="px-6 py-3 rounded-full border border-gray-200 text-sm font-medium"
            onClick={handleCategoryClick}
          >
            카테고리 보기
          </button>
        </div>
      </div>
      

      {/* Products slider */}
      <div className="flex justify-center gap-6 w-fit items-center" >
        {/* Navigation buttons */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10 mb-10"
          disabled={disableLeft}
        >
          <ChevronLeft className={cn("w-5 h-5", disableLeft && "text-gray-400")} />
        </button>
        <div ref={scrollContainerRef} className="flex gap-4 hide-scrollbar pb-4">
          {products.slice(currentStartIndex, currentStartIndex + 4).map(product => (
              <CategoryProduct
                key={product.id}
                {...product}               
              />
          ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center z-10 mb-10"
          disabled={disableRight}
        >
          <ChevronRight className={cn("w-5 h-5", disableRight && "text-gray-400")} />
        </button>
      </div>
    </div>
  )
}
