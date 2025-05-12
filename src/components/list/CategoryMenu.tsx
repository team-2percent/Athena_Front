"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"

export default function CategoryMenu({ categoryId }: {categoryId : number}) {
    const [categories, setCategories] = useState<{id: number, name: string, image: string}[]>([])
    const router = useRouter()
    useEffect(() => {
        // 카테고리 불러오기 로직
        setCategories(
            [
                { id: 0, name: "전체", image: "/abstract-profile.png" },
                { id: 1, name: "카테고리 1", image: "/abstract-profile.png" },
                { id: 2, name: "카테고리 2", image: "/abstract-profile.png" },
                { id: 3, name: "카테고리 3", image: "/abstract-profile.png" },
                { id: 4, name: "카테고리 4", image: "/abstract-profile.png" },
                { id: 5, name: "카테고리 5", image: "/abstract-profile.png" },
                { id: 6, name: "카테고리 6", image: "/abstract-profile.png" },
                { id: 7, name: "카테고리 7", image: "/abstract-profile.png" },
                { id: 8, name: "카테고리 8", image: "/abstract-profile.png" },
                { id: 9, name: "카테고리 9", image: "/abstract-profile.png" },
                { id: 10, name: "카테고리 10", image: "/abstract-profile.png" },
                { id: 11, name: "카테고리 11", image: "/abstract-profile.png" },
                { id: 12, name: "카테고리 12", image: "/abstract-profile.png" },
                { id: 13, name: "카테고리 13", image: "/abstract-profile.png" },
                { id: 14, name: "카테고리 14", image: "/abstract-profile.png" },
            ]
        )
    }, []);

    const handleCategoryClick = (id: number) => {
        if (id === 0) router.push("/category")
        else router.push(`/category/${id}`)
    }
    return (
        <div className="max-w-7xl mx-auto py-4 px-4">
        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 justify-items-center">
            {categories.map((category) => (
            <div
                key={category.id}
                className={clsx("flex flex-col items-center cursor-pointer p-3 rounded-lg w-23", categoryId === category.id && "bg-gray-200")}
                onClick={() => handleCategoryClick(category.id)}
            >
                <div
                className="relative w-16 h-16 overflow-hidden bg-gray-200 mb-2 rounded-lg"
                >
                <img
                    src={category.image || "/placeholder.svg?height=80&width=80&query=category"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                />
                </div>
                <span className="text-sm text-center text-sub-gray">
                {category.name}
                </span>
            </div>
            ))}
        </div>
        </div>
    )
}