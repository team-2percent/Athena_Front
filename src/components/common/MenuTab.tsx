import clsx from "clsx"
import { useRef, useLayoutEffect, useState } from "react"

interface MenuTabProps {
    size?: "base" | "lg"
    tabs: string[],
    activeTab: string
    onClickTab: (tab: string) => void
    className?: string
    hideUnderline?: boolean
}

export default function MenuTab({size="base", tabs, activeTab, onClickTab, className, hideUnderline}: MenuTabProps) {
    const sizeDesign = {
        "button": {
            "base": "text-base",
            "lg": "text-lg"
        }
    }
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })

    useLayoutEffect(() => {
        const idx = tabs.indexOf(activeTab)
        const node = tabRefs.current[idx]
        if (node) {
            setUnderlineStyle({
                left: node.offsetLeft,
                width: node.offsetWidth,
            })
        }
    }, [activeTab, tabs.length])

    return <nav className={clsx("flex space-x-8 relative", className)}>
        {tabs.map((tab, idx) => (
            <button
                type="button"
                key={tab}
                ref={el => { tabRefs.current[idx] = el; }}
                className={clsx("relative pb-1 font-medium",
                tab === activeTab ? "text-main-color" : "text-sub-gray",
                sizeDesign.button[size]
                )}
                onClick={() => onClickTab(tab)}
            >
                {tab}
            </button>
            ))}
        {!hideUnderline && (
            <span
                className="absolute bottom-0 h-0.5 bg-main-color transition-all duration-300"
                style={{ left: underlineStyle.left, width: underlineStyle.width }}
            />
        )}
    </nav>
}