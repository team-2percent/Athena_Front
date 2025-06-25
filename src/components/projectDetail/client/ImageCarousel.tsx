"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"
import Image from "next/image"
import customLoader from "@/lib/customLoader"

interface ImageCarouselProps {
  images: string[]
  title: string
}

const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>("right")
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])

  const slideTo = (dir: 'left' | 'right') => {
    if (isSliding || images.length <= 1) return
    setIsSliding(true)
    setSlideDirection(dir)
    setPrevImageIndex(currentImageIndex)
    let nextIdx
    if (dir === 'right') {
      nextIdx = (currentImageIndex + 1) % images.length
    } else {
      nextIdx = (currentImageIndex - 1 + images.length) % images.length
    }
    setCurrentImageIndex(nextIdx)
  }

  const nextImage = () => slideTo('right')
  const prevImage = () => slideTo('left')

  useEffect(() => {
    if (prevImageIndex === null || prevImageIndex === currentImageIndex) return
    const prevImg = imageRefs.current[0]
    const currImg = imageRefs.current[1]
    if (!prevImg || !currImg) {
      setIsSliding(false)
      setPrevImageIndex(null)
      return
    }
    gsap.set(prevImg, { xPercent: 0, zIndex: 1 })
    gsap.set(currImg, { xPercent: slideDirection === 'right' ? 100 : -100, zIndex: 2 })
    gsap.to(prevImg, {
      xPercent: slideDirection === 'right' ? -100 : 100,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsSliding(false)
        setPrevImageIndex(null)
      }
    })
    gsap.to(currImg, {
      xPercent: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    })
  }, [currentImageIndex, prevImageIndex, slideDirection])

  return (
    <>
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
        {images.length > 0 ? (
          <>
            {prevImageIndex !== null && prevImageIndex !== currentImageIndex && (
              <Image
                loader={customLoader}
                data-cy="project-image"
                key={prevImageIndex}
                ref={el => { imageRefs.current[0] = el }}
                src={images[prevImageIndex] || "/placeholder.svg"}
                alt={title}
                className="absolute top-0 left-0 object-cover"
                style={{ zIndex: 1 }}
                fill
              />
            )}
            <Image
              loader={customLoader}
              data-cy="project-image"
              key={currentImageIndex}
              ref={el => { imageRefs.current[1] = el }}
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={title}
              className="absolute top-0 left-0 object-cover"
              style={{ zIndex: 2 }}
              fill
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-sub-gray shadow-md hover:bg-white z-4"
                  aria-label="이전 이미지"
                  disabled={isSliding}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-sub-gray shadow-md hover:bg-white z-4"
                  aria-label="다음 이미지"
                  disabled={isSliding}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-xl font-medium">이미지 없음</p>
            </div>
          </div>
        )}
      </div>
      {images.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-center gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ${
                  currentImageIndex === idx ? "ring-4 ring-main-color" : "hover:ring-2 hover:ring-main-color"
                }`}
                onClick={() => !isSliding && setCurrentImageIndex(idx)}
              >
                <div className="relative h-20 w-20">
                  <Image
                    loader={customLoader}
                    src={img || "/placeholder.svg"}
                    alt={`프로젝트 이미지 ${idx + 1}`}
                    className="w-full h-full object-cover"
                    fill
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageCarousel 