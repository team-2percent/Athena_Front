"use client"

import ListPage from "@/components/list/ListPage";

export default function DeadlinePage() {
    return (
        <div className="flex flex-col items-center w-[var(--content-width)]">
        <ListPage type="deadline" />
        </div>
    )
}