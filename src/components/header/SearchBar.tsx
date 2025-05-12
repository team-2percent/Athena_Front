"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  isLogin: boolean
  searchWord: string
  onSearchChange: (word: string) => void
  onSearch: (word: string) => void
}

export default function SearchBar({ isLogin, searchWord, onSearchChange, onSearch }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false) // 드롭다운 열림 여부
  const [autoCompletes, setAutoCompletes] = useState<string[]>([]) // 자동완성 단어
  const [recentSearches, setRecentSearches] = useState<{ id: number, word: string }[]>([]) // 최근 검색어
  const searchRef = useRef<HTMLDivElement>(null)
  const maxLength = 30;

  // mock data. 로직 구현 후 삭제
  const autoCompleteItems = ["타로 버블티", "타로 버블티 품추가", "타로 버블티 버블 추가"]
  const recentSearchItems = [
    {
      id: 1, word: "타로1"
    },
    {
      id: 2, word: "타로2"
    },
    {
      id: 3, word: "타로3"
    },
    {
      id: 4, word: "타로4"
    },
  ]

  // 외부 클릭 시 드롭 다운 닫음
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // 렌더링 시 최근 검색어 불러오기
    setRecentSearches(recentSearchItems);

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 검색어 변화 시 자동완성 단어 불러오기
  useEffect(() => {
    if (searchWord) {
      // 불러오기 로직 삽입 필요
      setAutoCompletes(autoCompleteItems);
    }
  }, [searchWord])

  // 최근 검색어 중 삭제
  const removeRecentSearch = (id: number) => {
    // 최근 검색어 삭제 로직
    setRecentSearches(recentSearches.filter((v) => v.id !== id))
    console.log(`삭제된 검색어: ${id}`)
  }

  // 검색
  const search = () => {
    setIsOpen(false);
    onSearch(searchWord);
  }

  // 검색어 클릭
  const handleSearchWordClick = (word: string) => {
    onSearchChange(word);
    onSearch(word);
  }

  // 엔터키로 검색
  const activeEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsOpen(false);
      onSearch(searchWord);
    }
  }

  return (
    <div ref={searchRef} className="w-80 max-w-xl relative h-10">
      <div className="flex gap-2 rounded-full border border-gray-300 px-4 py-3 h-full">
        <input
          type="text"
          placeholder="제목, 작가로 검색"
          value={searchWord}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => activeEnter(e)}
          className="w-full h-full focus:outline-none text-sm"
          maxLength={maxLength}
        />
        <button
          type="button"
          className=""
          onClick={search}
        >
          <Search className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white rounded-3xl border border-gray-300 shadow-lg z-30">
          <div className="p-4">
            {/* Auto-complete section */}
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">자동 완성</h3>
              <div className="flex flex-col">
                {autoCompletes.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="py-2 text-left hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSearchWordClick(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent searches section */}
            {isLogin &&
              <div>
              <h3 className="text-lg font-bold mb-2">최근 검색어</h3>
              <div className="flex flex-col">
                {recentSearches.map(item => (
                  <div key={item.id} className="py-2 flex justify-between items-center hover:bg-gray-100">
                    <button
                      type="button"
                      className="text-left flex-grow"
                      onClick={() => handleSearchWordClick(item.word)}
                    >
                      {item.word}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRecentSearch(item.id)
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 ml-2"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            }
            
            
          </div>
        </div>
      )}
    </div>
  )
}