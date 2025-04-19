"use client"

import type { CategoryCount, CategoryOrder } from "@/types/song"

interface CategoryFilterProps {
  categories: string[]
  selectedCategories: Set<string>
  categoryCounts: CategoryCount
  categoryOrder: CategoryOrder
  onToggleCategory: (category: string) => void
  onClearCategories: () => void
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  categoryCounts,
  categoryOrder,
  onToggleCategory,
  onClearCategories,
}: CategoryFilterProps) {
  // 按照原始順序排序分類
  const sortedCategories = [...categories].sort((a, b) => {
    // 如果沒有順序信息，則使用默認順序
    const orderA = categoryOrder[a] !== undefined ? categoryOrder[a] : Number.MAX_SAFE_INTEGER
    const orderB = categoryOrder[b] !== undefined ? categoryOrder[b] : Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })

  return (
    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
      {sortedCategories.map((category) => (
        <button
          key={category}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium flex items-center text-xs sm:text-sm transition-all duration-200 ${
            selectedCategories.has(category)
              ? "bg-purple-500 text-white hover:bg-purple-600 -translate-y-1 shadow-md"
              : ""
          }`}
          onClick={() => onToggleCategory(category)}
        >
          <span className="line-clamp-1">{category}</span>
          <span
            className={`ml-1 inline-flex items-center justify-center min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 px-1 sm:px-1.5 rounded-full text-xs font-semibold ${
              selectedCategories.has(category) ? "bg-white/30 text-white" : "bg-purple-200 text-purple-800"
            }`}
          >
            {categoryCounts[category] || 0}
          </span>
        </button>
      ))}
    </div>
  )
}
