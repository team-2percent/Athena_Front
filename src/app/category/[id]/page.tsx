"use client"

import CategoryMenu from "@/components/list/CategoryMenu";
import ListPage from "@/components/list/ListPage";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CategoryPage() {
    const params = useParams<{ id: string }>()
    const categoryId = parseInt(params.id)
    const [categoryError, setCategoryError] = useState(false)
    const handleCategoryError = () => {
        setCategoryError(true)
    }
    return (
        <div className="flex flex-col items-center w-[var(--content-width)]">
            {/* 카테고리 메뉴 */}
            <CategoryMenu categoryId={categoryId} handleCategoryError={handleCategoryError} />
            {!categoryError && <ListPage type="category" categoryId={categoryId} />}
        </div>
    )
}