"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import Spinner from "../common/Spinner"
import { useApi } from "@/hooks/useApi"

export default function CategoryMenu({ categoryId }: {categoryId : number}) {
    const [categories, setCategories] = useState<{id: number, categoryName: string}[]>([])
    const router = useRouter()
    const { isLoading, apiCall } = useApi()

    const loadCategories = () => {
        apiCall<{id: number, categoryName: string}[]>("/api/category", "GET").then(({data}) => {
            if (data) setCategories(data)
        })
    }

    useEffect(() => {
        loadCategories()
    }, []);

    const handleCategoryClick = (id: number) => {
        if (id === 0) router.push("/category")
        else router.push(`/category/${id}`)
    }

    return (
        <div className="w-full mx-0 py-4">
        {isLoading ?
            <Spinner message="카테고리를 불러오는 중입니다..." />
        : (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 justify-items-center">
            <div
                key={0}
                className={clsx("w-full flex flex-col items-center cursor-pointer p-3 border-b-2 border-gray-border rounded-lg rounded-lg w-23 hover:bg-gray-50", categoryId === 0 && "bg-secondary-color border-main-color")}
                onClick={() => handleCategoryClick(0)}
            >
                <span className={clsx("text-sm text-center text-gray-500", categoryId === 0 && "text-main-color")}>
                전체
                </span>
            </div>
            {categories.map((category) => (
                <div
                key={category.id}
                className={clsx("w-full flex flex-col items-center cursor-pointer p-3 border-b-2 border-gray-border rounded-lg w-23 hover:bg-gray-50", categoryId === category.id && "bg-secondary-color border-main-color")}
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