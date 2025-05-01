"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false) // 드롭다운 열림 여부
  const [searchTerm, setSearchTerm] = useState("") // 검색어
  const [autoCompletes, setAutoCompletes] = useState<string[]>([]) // 자동완성 단어
  const [recentSearches, setRecentSearches] = useState<{ id: number, word: string }[]>([]) // 최근 검색어
  const searchRef = useRef<HTMLDivElement>(null)

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
    if (searchTerm) {
      // 불러오기 로직 삽입 필요
      setAutoCompletes(autoCompleteItems);
    }
  }, [searchTerm])

  // 최근 검색어 중 삭제
  const removeRecentSearch = (id: number) => {
    // 최근 검색어 삭제 로직
    setRecentSearches(recentSearches.filter((v) => v.id !== id))
    console.log(`삭제된 검색어: ${id}`)
  }

  // 검색
  const search = () => {
    console.log("검색");
    setIsOpen(false);
    // 검색 페이지로 이동
  }

  // 검색어 클릭
  const handleSearchWordClick = (word: string) => {
    setSearchTerm(word);
    search();
  }

  return (
    <div ref={searchRef} className="w-100 max-w-xl relative">
      <div className="relative">
        <input
          type="text"
          placeholder="제목, 작가로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={search}
        >
          <Search className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white rounded-3xl border border-gray-300 shadow-lg z-10">
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
            <div>
              <h3 className="text-lg font-bold mb-2">최근 검색어</h3>
              <div className="flex flex-col">
                {recentSearches.map(item => (
                  <div key={item.id} className="py-2 flex justify-between items-center">
                    <button
                      type="button"
                      className="text-left flex-grow hover:bg-gray-100"
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
          </div>
        </div>
      )}
    </div>
  )
}
