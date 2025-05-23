"use client"

import CategoryMenu from "@/components/list/CategoryMenu";
import ListPage from "@/components/list/ListPage";
import { useParams } from "next/navigation";

export default function CategoryPage() {
    const params = useParams<{ id: string }>()
    const categoryId = parseInt(params.id)
    return (
        <div className="flex flex-col items-center w-[var(--content-width)]">
            {/* 카테고리 메뉴 */}
            <CategoryMenu categoryId={categoryId} />
            <ListPage type="category" categoryId={categoryId} />
        </div>
    )
}