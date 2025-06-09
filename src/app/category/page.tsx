"use client"

import CategoryMenu from "@/components/list/CategoryMenu";
import ListPage from "@/components/list/ListPage";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CategoryPage() {
    const [categoryError, setCategoryError] = useState(false)
    const handleCategoryError = () => {
        setCategoryError(true)
    }
    return (
        <div className="flex flex-col items-center w-[var(--content-width)]">
            {/* 카테고리 메뉴 */}
            <CategoryMenu categoryId={0} handleCategoryError={handleCategoryError} />
            {!categoryError && <ListPage type="category" categoryId={0} />}
        </div>
    )
}