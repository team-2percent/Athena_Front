"use client"

import { useState } from "react"

interface MenuProps {
    menus: {
        id: number
        state: string
        name: string
    }[]
    currentMenu: string
    onMenuChange: (menu: string) => void
}

export default function Menu({ menus, currentMenu, onMenuChange }: MenuProps) {
    return (
        <div className="w-full border-b mx-auto max-w-6xl border-gray-200">
            <div className="flex gap-x-8">
                {menus.map(menu => 
                <button
                    key={menu.id}
                    type="button"
                    className={`relative pb-3 text-xl font-medium ${currentMenu === menu.state ? "text-pink-500" : "text-gray-800"}`}
                    onClick={() => onMenuChange(menu.state)}
                >
                    <p>{menu.name}</p>
                    {currentMenu === menu.state && <span className="absolute bottom-0 left-0 h-1 w-full bg-pink-500"></span>}
                </button>
                )}
            </div>
        </div>
    )
}