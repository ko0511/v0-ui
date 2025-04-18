"use client"

import { useState } from "react"
import type { CategoryCount } from "@/types/song"

interface CategoryFilterProps {
  categories: string[]
  selectedCategories: Set<string>
  categoryCounts: CategoryCount
  onToggleCategory: (category: string) => void
  onClearCategories: () => void
  artistCategories?: string[] // 歌手分類
  languageCategories?: string[] // 語言分類
  categoryOrder?: Record<string, number> // 分類的原始順序
  highlightedCategories?: string[] // 需要突出顯示的分類
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  categoryCounts,
  onToggleCategory,
  onClearCategories,
  artistCategories = [],
  languageCategories = [],
  categoryOrder = {},
  highlightedCategories = [],
}: CategoryFilterProps) {
  const [activeTab, setActiveTab] = useState<"all" | "artists" | "languages" | "others">("all")

  // 將分類分組並保持原始順序
  const getGroupedCategories = () => {
    // 按原始順序排序
    const sortedCategories = [...categories].sort((a, b) => {
      const orderA = categoryOrder[a] !== undefined ? categoryOrder[a] : Number.MAX_SAFE_INTEGER
      const orderB = categoryOrder[b] !== undefined ? categoryOrder[b] : Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })

    // 分組
    const artists = sortedCategories.filter((cat) => artistCategories.includes(cat))
    const languages = sortedCategories.filter((cat) => languageCategories.includes(cat))
    const others = sortedCategories.filter(
      (cat) => !artistCategories.includes(cat) && !languageCategories.includes(cat),
    )

    return { artists, languages, others, all: sortedCategories }
  }

  const { artists, languages, others, all } = getGroupedCategories()

  // 根據當前標籤顯示相應的分類
  const getDisplayCategories = () => {
    switch (activeTab) {
      case "artists":
        return artists
      case "languages":
        return languages
      case "others":
        return others
      case "all":
      default:
        return all
    }
  }

  const displayCategories = getDisplayCategories()

  // 渲染分類按鈕
  const renderCategoryButton = (category: string) => (
    <button
      key={category}
      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium flex items-center text-xs sm:text-sm transition-all duration-200 ${
        selectedCategories.has(category)
          ? "bg-purple-500 text-white hover:bg-purple-600 -translate-y-1 shadow-md"
          : highlightedCategories.includes(category)
            ? "bg-red-100 hover:bg-red-200 text-red-700"
            : "bg-purple-100 hover:bg-purple-200 text-purple-700"
      }`}
      onClick={() => onToggleCategory(category)}
    >
      <span className={`line-clamp-1 ${highlightedCategories.includes(category) ? "font-bold" : ""}`}>{category}</span>
      <span
        className={`ml-1 inline-flex items-center justify-center min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 px-1 sm:px-1.5 rounded-full text-xs font-semibold ${
          selectedCategories.has(category)
            ? "bg-white/30 text-white"
            : highlightedCategories.includes(category)
              ? "bg-red-200 text-red-800"
              : "bg-purple-200 text-purple-800"
        }`}
      >
        {categoryCounts[category] || 0}
      </span>
    </button>
  )

  return (
    <div className="space-y-3">
      {/* 分類標籤 */}
      <div className="flex border-b border-gray-200 overflow-x-auto pb-1 hide-scrollbar">
        <button
          className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "all" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          全部
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">
            {categories.length}
          </span>
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "artists"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("artists")}
        >
          歌手
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">{artists.length}</span>
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "languages"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("languages")}
        >
          語言
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">
            {languages.length}
          </span>
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
            activeTab === "others"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("others")}
        >
          其他
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full">{others.length}</span>
        </button>
      </div>

      {/* 分類按鈕 */}
      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
        {displayCategories.map((category) => renderCategoryButton(category))}
      </div>
    </div>
  )
}
