"use client"

import { useState, useRef } from "react"
import { Search } from "lucide-react"
import { SEARCH_MAX_LENGTH } from "@/lib/validationConstant"

interface SearchBarProps {
  isLogin: boolean
  searchWord: string
  onSearchChange: (word: string) => void
  onSearch: (word: string) => void
}

export default function SearchBar({ isLogin, searchWord, onSearchChange, onSearch }: SearchBarProps) {
  const [recentSearches, setRecentSearches] = useState<{ id: number, word: string }[]>([]) // 최근 검색어
  const searchRef = useRef<HTMLDivElement>(null)

  // 검색
  const search = () => {
    if (searchWord.trim()) {
      onSearch(searchWord);
    }
  }

  // 엔터키로 검색
  const activeEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchWord.trim()) {
      e.preventDefault();
      onSearch(searchWord);
    }
  }

  return (
    <div ref={searchRef} className="w-full max-w-xl relative h-10">
      <div className="flex gap-2 rounded-full border border-gray-300 px-4 py-3 h-full">
        <input
          type="text"
          value={searchWord}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => activeEnter(e)}
          className="w-full h-full focus:outline-none text-sm"
          maxLength={SEARCH_MAX_LENGTH}
          data-cy="search-input"
        />
        <button
          type="button"
          className={`${!searchWord.trim() ? 'cursor-not-allowed' : ''}`}
          onClick={search}
          disabled={!searchWord.trim()}
          data-cy="search-button"
        >
          <Search className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}