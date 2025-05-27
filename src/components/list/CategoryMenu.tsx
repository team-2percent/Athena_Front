"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import Spinner from "../common/Spinner"
import { useApi } from "@/hooks/useApi"

export default function CategoryMenu({ categoryId }: {categoryId : number}) {
    const [categories, setCategories] = useState<{id: number, categoryName: string}[]>([])
    const router = useRouter()
    const { isLoading, apiCall } = useApi()

    const containerRef = useRef<HTMLDivElement | null>(null)
    const itemRefs = useRef<Record<number, HTMLDivElement | null>>({})

    const loadCategories = () => {
        apiCall<{id: number, categoryName: string}[]>("/api/category", "GET").then(({data}) => {
            if (data) setCategories(data)
        })
    }

    useEffect(() => {
        loadCategories()
    }, []);

    useEffect(() => {
        const target = itemRefs.current[categoryId]
        const container = containerRef.current
        if (target && container) {
            const containerRect = container.getBoundingClientRect()
            const targetRect = target.getBoundingClientRect()
            const scrollLeft = container.scrollLeft + (targetRect.left - containerRect.left) - 16 // 16px 여유
            container.scrollTo({ left: scrollLeft, behavior: "smooth" })
        }
    }, [categories, categoryId])

    const handleCategoryClick = (id: number) => {
        if (id === 0) router.push("/category")
        else router.push(`/category/${id}`)
    }

    return (
        <div className="w-full mx-0 py-4">
        {isLoading ?
            <Spinner message="카테고리를 불러오는 중입니다..." />
        : (
        <div
            className="flex overflow-x-auto gap-4 justify-items-center [&::-webkit-scrollbar]:hidden"
            ref={containerRef}
        >
            <div
                key={0}
                ref={(el: HTMLDivElement | null) => {
                    itemRefs.current[0] = el
                }}
                className={clsx("flex flex-col whitespace-nowrap items-center cursor-pointer p-3 border-b-2 border-gray-border rounded-lg rounded-lg w-20 min-w-20 hover:bg-gray-50", categoryId === 0 && "bg-secondary-color border-main-color")}
                onClick={() => handleCategoryClick(0)}
            >
                <span className={clsx("text-sm text-center text-gray-500", categoryId === 0 && "text-main-color")}>
                전체
                </span>
            </div>
            {categories.map((category) => (
                <div
                key={category.id}
                ref={(el: HTMLDivElement | null) => {
                    itemRefs.current[category.id] = el
                }}
                className={clsx("flex flex-col whitespace-nowrap items-center cursor-pointer p-3 border-b-2 border-gray-border rounded-lg w-20 min-w-20 hover:bg-gray-50", categoryId === category.id && "bg-secondary-color border-main-color")}
                onClick={() => handleCategoryClick(category.id)}
            >
                {/* <div
                className="relative w-16 h-16 overflow-hidden bg-gray-200 mb-2 rounded-lg"
                >
                <img
                    src={category.image || "/placeholder.svg?height=80&width=80&query=category"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                />
                </div> */}
                <span className={clsx("text-sm text-center text-gray-500", categoryId === category.id && "text-main-color")}>
                {category.categoryName}
                </span>
                </div>
                ))}
            </div>
        )}
        </div>
    )
}