import ListPage from "@/components/list/ListPage";

export default function NewPage() {
    return (
        <div className="flex flex-col items-center w-[var(--content-width)]">
        <ListPage type="new" />
        </div>
    )
}