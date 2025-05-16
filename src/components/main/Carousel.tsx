"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApi } from "@/hooks/useApi"
import Spinner from "../common/Spinner"

export default function CardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { isLoading, apiCall } = useApi();
  const [categoryTopProjects, setCategoryTopProjects] = useState<{
    id: number;
    imageUrl: string;
    title: string;
    categoryId: number;
    categoryName: string;
  }[]>([]);

  const loadCategoryTopProjects = () => {
    apiCall<{
      id: number;
      imageUrl: string;
      title: string;
      categoryId: number;
      categoryName: string;
    }[]>("/api/project/categoryTop", "GET").then(({data}) => {
      if (data) setCategoryTopProjects(data);
    })
  }

  // 캐러셀 이동
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    const isFirstCard = currentIndex === 0
    const newIndex = isFirstCard ? categoryTopProjects.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const isLastCard = currentIndex === categoryTopProjects.length - 1
    const newIndex = isLastCard ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  // 캐러셀 상품 클릭 시 상품 페이지로 이동
  const handleCardClick = () => {
    router.push(`/project/${categoryTopProjects[currentIndex].id}`);
  }

  const currentCard = categoryTopProjects[currentIndex];

  useEffect(() => {
    loadCategoryTopProjects();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const isLastCard = currentIndex === categoryTopProjects.length - 1
      const newIndex = isLastCard ? 0 : currentIndex + 1
      setCurrentIndex(newIndex)
    }, 5000);

    return () => clearInterval(timeout);
  }, [currentIndex]);

  if (isLoading) return <Spinner message="Loading..." />;

  if (currentCard) return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
        className="relative bg-[#d9d9d9] w-full max-w-[900px] h-[200px] sm:h-[250px] md:h-[300px] my-2 mx-auto rounded-lg overflow-hidden cursor-pointer"
        onClick={handleCardClick}
    >
      {/* Background Card Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentCard.imageUrl || "/placeholder.svg"}
          alt={currentCard.title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20 z-10 bg-[linear-gradient(180deg,rgba(51,51,51,0)60%,rgba(51,51,51,0.1)65%,rgba(51,51,51,0.5)80%,rgba(51,51,51,0.8)100%)]" />

      {/* Title at bottom left with semi-transparent background */}
      <div className="absolute bottom-0 left-0 p-8 z-20 rounded-tr-lg">
        <p className="text-lg mb-1 text-white/90">{currentCard.categoryName}</p>
        <h2 className="text-2xl font-bold text-white">{currentCard.title}</h2>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-2 right-2 flex gap-2 z-20">
        {/* Card Counter */}
        <div className="px-2 h-7 w-11 rounded-full bg-black flex items-center justify-center z-10">
          <span className="text-xs text-white">
            {currentIndex + 1}/{categoryTopProjects.length}
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
