"use client"

import ListPage from "@/components/list/ListPage";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'

const Search = () => {
    const searchParams = useSearchParams()
    const searchWord = searchParams.get('query') ?? undefined
    return (
        <div className="flex flex-col items-center w-[var(--content-width)]">
         <ListPage type="search" searchWord={searchWord} />
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense>
            <Search />
        </Suspense>
    )
    
}