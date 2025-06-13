"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import Spinner from "../common/Spinner"
import { useApi } from "@/hooks/useApi"
import ServerErrorComponent from "../common/ServerErrorComponent"

interface CategoryMenuProps {
    categoryId: number
    handleCategoryError: () => void
}

export default function CategoryMenu({ categoryId, handleCategoryError }: CategoryMenuProps) {
    const [categories, setCategories] = useState<{id: number, categoryName: string}[]>([])
    const [serverError, setServerError] = useState(false)
    const router = useRouter()
    const { isLoading, apiCall } = useApi()

    const containerRef = useRef<HTMLDivElement | null>(null)
    const itemRefs = useRef<Record<number, HTMLDivElement | null>>({})

    const loadCategories = () => {
        apiCall<{id: number, categoryName: string}[]>("/api/category", "GET").then(({data, error, status}) => {
            if (data) setCategories(data)
            else if (error && status === 500) {
                setServerError(true)
                handleCategoryError()
            }
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

    if (serverError) return <ServerErrorComponent message="카테고리를 불러오는 중 오류가 발생했습니다." onRetry={loadCategories} />

    return (
        <div className="w-full mx-0 py-4" data-cy="category-list">
        {isLoading ?
            <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-12 rounded-lg bg-gray-200 animate-pulse" />
                ))}
            </div>
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
                data-cy="category-list-item"
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
                data-cy="category-list-item"
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