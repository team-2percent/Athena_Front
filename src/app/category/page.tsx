"use client"

import CategoryMenu from "@/components/list/CategoryMenu";
import ListPage from "@/components/list/ListPage";
import { useParams } from "next/navigation";

export default function CategoryPage() {
    return (
        <div className="flex flex-col items-center w-[var(--content-width)]">
            {/* 카테고리 메뉴 */}
            <CategoryMenu categoryId={0} />
            <ListPage type="category" categoryId={0} />
        </div>
    )
}