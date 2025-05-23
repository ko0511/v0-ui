"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import SongCard from "./song-card"
import CategoryFilter from "./category-filter"
import LanguageFilter from "./language-filter"
import StatsDisplay from "./stats-display"
import type { Song, CategoryCount, CategoryOrder } from "@/types/song"
import BackToTop from "./back-to-top"

export default function SongLibrary() {
  const [allSongs, setAllSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentLanguageFilter, setCurrentLanguageFilter] = useState("all")
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [languages, setLanguages] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount>({})
  const [categoryOrder, setCategoryOrder] = useState<CategoryOrder>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSheetData()
  }, [])

  useEffect(() => {
    filterSongs()
  }, [searchTerm, currentLanguageFilter, selectedCategories, allSongs])

  const fetchSheetData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Google Sheet ID
      const sheetId = "1z-kl4dUioRrhJaq82O283991VPtg2PfXqx4eN5fQ9-8"
      const apiUrl = `https://opensheet.elk.sh/${sheetId}/sheet1`

      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      processSheetData(data)
    } catch (error) {
      console.error("Error fetching sheet data:", error)
      setError("無法獲取歌曲數據")
    } finally {
      setIsLoading(false)
    }
  }

  const processSheetData = (data: any[]) => {
    const newLanguages = new Set<string>()
    const newCategories = new Set<string>()
    const newCategoryCounts: CategoryCount = {}
    const newCategoryOrder: CategoryOrder = {}

    // 首先處理 F 欄的「分類項目」來獲取分類順序
    data.forEach((row) => {
      const categoryItem = row.分類項目 || row["分類項目"] || row.CategoryItem || ""
      if (categoryItem && !newCategoryOrder[categoryItem]) {
        // 使用 Object.keys(newCategoryOrder).length 作為順序索引
        // 這樣可以確保按照在試算表中出現的順序排列
        newCategoryOrder[categoryItem] = Object.keys(newCategoryOrder).length
        // 同時將其添加到分類集合中
        newCategories.add(categoryItem)
      }
    })

    // 然後處理歌曲數據
    const processedSongs = data.map((row, index) => {
      const song: Song = {
        id: index + 1,
        title: row.歌名 || row.title || row.Song || "",
        artist: row.歌手 || row.artist || row.Artist || "",
        language: row.語言 || row.language || row.Language || "",
        category: row.分類 || row.category || row.Category || "",
        notes: row.備註 || row.notes || row.Notes || "",
        categories: [],
      }

      if (song.language) {
        newLanguages.add(song.language)
      }

      if (song.category) {
        const categoryList = song.category.split(",").map((cat: string) => cat.trim())
        song.categories = categoryList

        categoryList.forEach((cat: string) => {
          if (cat) {
            // 確保所有出現在歌曲中的分類也被添加到分類集合中
            newCategories.add(cat)
            // 更新分類計數
            newCategoryCounts[cat] = (newCategoryCounts[cat] || 0) + 1

            // 如果這個分類還沒有順序（不在 F 欄中），給它一個較大的順序值
            if (newCategoryOrder[cat] === undefined) {
              newCategoryOrder[cat] = 1000 + Object.keys(newCategoryOrder).length
            }
          }
        })
      }

      return song
    })

    setAllSongs(processedSongs)
    setFilteredSongs(processedSongs)
    setLanguages(newLanguages)
    setCategories(newCategories)
    setCategoryCounts(newCategoryCounts)
    setCategoryOrder(newCategoryOrder)
  }

  const filterSongs = () => {
    let filtered = allSongs

    // Apply language filter
    if (currentLanguageFilter !== "all") {
      filtered = filtered.filter((song) => song.language === currentLanguageFilter)
    }

    // Apply category filters
    if (selectedCategories.size > 0) {
      filtered = filtered.filter((song) => {
        for (const category of selectedCategories) {
          if (!song.categories.includes(category)) {
            return false
          }
        }
        return true
      })
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (song) =>
          (song.title && song.title.toLowerCase().includes(term)) ||
          (song.artist && song.artist.toLowerCase().includes(term)) ||
          (song.language && song.language.toLowerCase().includes(term)) ||
          (song.category && song.category.toLowerCase().includes(term)) ||
          (song.notes && song.notes.toLowerCase().includes(term)),
      )
    }

    // Update filtered category counts
    updateCategoryCounts(filtered)

    setFilteredSongs(filtered)
  }

  const updateCategoryCounts = (songs: Song[]) => {
    const newCounts: CategoryCount = {}

    songs.forEach((song) => {
      if (song.categories && song.categories.length > 0) {
        song.categories.forEach((cat) => {
          if (cat) {
            newCounts[cat] = (newCounts[cat] || 0) + 1
          }
        })
      }
    })

    setCategoryCounts(newCounts)
  }

  const handleLanguageFilter = (language: string) => {
    setCurrentLanguageFilter(language)
  }

  const handleCategoryToggle = (category: string) => {
    const newSelectedCategories = new Set(selectedCategories)

    if (newSelectedCategories.has(category)) {
      newSelectedCategories.delete(category)
    } else {
      newSelectedCategories.add(category)
    }

    setSelectedCategories(newSelectedCategories)
  }

  const clearCategories = () => {
    setSelectedCategories(new Set())
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <header className="text-center mb-6 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-800 mb-1 sm:mb-2">我的歌曲庫</h1>
        <p className="text-gray-600 text-base sm:text-lg">找到你喜歡的歌了嗎~💜</p>
      </header>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        {/* Search bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜尋歌曲、歌手或語言..."
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="h-4 w-4 sm:h-5 sm:w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">分類</h3>
          </div>

          <CategoryFilter
            categories={Array.from(categories)}
            selectedCategories={selectedCategories}
            categoryCounts={categoryCounts}
            categoryOrder={categoryOrder}
            onToggleCategory={handleCategoryToggle}
            onClearCategories={clearCategories}
          />

          {/* Active filters */}
          {selectedCategories.size > 0 && (
            <div className="flex items-center mt-3">
              <button
                onClick={clearCategories}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium mr-2 px-3 py-1 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                清除所有
              </button>
              <div className="flex-grow px-3 py-2 bg-purple-50 rounded-lg">
                <div className="flex flex-wrap gap-1">
                  {Array.from(selectedCategories).map((category) => (
                    <div
                      key={category}
                      className="filter-tag bg-purple-200 text-purple-800 cursor-pointer text-xs px-2 py-1 rounded-full flex items-center mr-2 mb-1"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      <span>{category}</span>
                      <X className="h-3 w-3 ml-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <LanguageFilter
            languages={Array.from(languages)}
            currentLanguage={currentLanguageFilter}
            onSelectLanguage={handleLanguageFilter}
          />
        </div>

        <div className="text-gray-600 mb-4">
          <span className="font-medium">{filteredSongs.length}</span> 首歌曲
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-10">
            <div className="h-16 w-16 mx-auto text-red-400 mb-4">⚠️</div>
            <p className="text-gray-600 text-lg">{error}</p>
            <p className="text-gray-500 mt-2">請確保Google Sheet格式正確，並且可以公開訪問</p>
            <button
              onClick={fetchSheetData}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              重試
            </button>
          </div>
        )}

        {/* Songs grid */}
        {!isLoading && !error && (
          <>
            {filteredSongs.length === 0 ? (
              <div className="text-center py-10">
                <div className="h-16 w-16 mx-auto text-gray-400 mb-4">😕</div>
                <p className="text-gray-600 text-lg">沒有找到符合的歌曲</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    selectedCategories={selectedCategories}
                    onCategoryClick={handleCategoryToggle}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats section */}
      <StatsDisplay
        totalSongs={allSongs.length}
        languages={Array.from(languages)}
        languageCounts={allSongs.reduce((counts: Record<string, number>, song) => {
          if (song.language) {
            counts[song.language] = (counts[song.language] || 0) + 1
          }
          return counts
        }, {})}
        categoryCounts={categoryCounts}
      />

      {/* Back to top button */}
      <BackToTop />
    </div>
  )
}
