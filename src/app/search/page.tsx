"use client"

import ListPage from "@/components/list/ListPage";
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
    const searchParams = useSearchParams()
    const searchWord = searchParams.get('query') ?? undefined
    return (
        <ListPage type="search" searchWord={searchWord} />
    )
}