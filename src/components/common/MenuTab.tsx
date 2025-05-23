import clsx from "clsx"

interface MenuTabProps {
    size?: "base" | "lg"
    tabs: string[],
    activeTab: string
    onClickTab: (tab: string) => void
    className?: string
}

export default function MenuTab({size="base", tabs, activeTab, onClickTab, className}: MenuTabProps) {
    const sizeDesign = {
        "button": {
            "base": "text-base",
            "lg": "text-lg"
        }
    }
    return <nav className={clsx("flex space-x-8", className)}>
        {tabs.map((tab) => (
            <button
                type="button"
                key={tab}
                className={clsx("relative pb-1 font-medium",
                tab === activeTab ? "text-main-color" : "text-sub-gray",
                sizeDesign.button[size]
                )}
                onClick={() => onClickTab(tab)}
            >
                {tab}
                {tab === activeTab && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-main-color" />}
            </button>
            ))}
        </nav>
}