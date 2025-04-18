"use client"

import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import type { Song } from "@/types/song"

interface SongCardProps {
  song: Song
  selectedCategories: Set<string>
  onCategoryClick: (category: string) => void
  highlightedCategories?: string[] // 需要突出顯示的分類
}

export default function SongCard({
  song,
  selectedCategories,
  onCategoryClick,
  highlightedCategories = [],
}: SongCardProps) {
  const [isCopied, setIsCopied] = useState(false)

  // 複製成功後重置狀態
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])

  const getLanguageColor = (language: string | undefined) => {
    if (!language) return "border-gray-500"

    // Create a consistent color based on the language string
    const colors = [
      "border-pink-500",
      "border-blue-500",
      "border-yellow-500",
      "border-green-500",
      "border-purple-500",
      "border-red-500",
      "border-indigo-500",
      "border-orange-500",
      "border-teal-500",
    ]

    // Simple hash function to get a consistent index
    let hash = 0
    for (let i = 0; i < language.length; i++) {
      hash = language.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  const getLanguageClass = (language: string | undefined) => {
    if (!language) return "bg-gray-100 text-gray-800"

    // Create a consistent color class based on the language string
    const classes = [
      "bg-pink-100 text-pink-800",
      "bg-blue-100 text-blue-800",
      "bg-yellow-100 text-yellow-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-red-100 text-red-800",
      "bg-indigo-100 text-indigo-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
    ]

    // Simple hash function to get a consistent index
    let hash = 0
    for (let i = 0; i < language.length; i++) {
      hash = language.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % classes.length
    return classes[index]
  }

  const handleCopy = () => {
    const textToCopy = `${song.artist} - ${song.title}`.trim()

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setIsCopied(true)
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
        })
    } else {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = textToCopy
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        setIsCopied(true)
      } catch (err) {
        console.error("Fallback: Copy command failed", err)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div
      className={`song-card bg-white rounded-lg shadow p-4 border-l-4 ${getLanguageColor(song.language)} hover:border-indigo-500 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
    >
      <h3 className="text-base sm:text-lg font-bold text-gray-800 pr-10 line-clamp-1">{song.title || ""}</h3>
      <div className="flex flex-wrap justify-between items-center mt-2 gap-1">
        <p className="text-sm sm:text-base text-gray-600 line-clamp-1 mr-2">{song.artist || ""}</p>
        {song.language && (
          <span
            className={`language-tag px-2 py-1 text-xs rounded-full ${getLanguageClass(song.language)} whitespace-nowrap`}
          >
            {song.language}
          </span>
        )}
      </div>

      {/* Category tags */}
      {song.categories && song.categories.length > 0 && (
        <div className="mt-2 flex flex-wrap">
          {song.categories.map(
            (category) =>
              category && (
                <span
                  key={category}
                  className={`inline-block px-2 py-1 text-xs rounded-full mr-1 mb-1 cursor-pointer ${
                    selectedCategories.has(category)
                      ? "bg-purple-200 text-purple-800 font-medium"
                      : highlightedCategories.includes(category)
                        ? "bg-red-100 text-red-800 font-bold"
                        : "bg-purple-100 text-purple-800"
                  }`}
                  onClick={() => onCategoryClick(category)}
                >
                  {category}
                </span>
              ),
          )}
        </div>
      )}

      {/* Notes */}
      {song.notes && (
        <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2">
          <span className="font-medium">備註:</span> {song.notes}
        </p>
      )}

      {/* Copy button with improved animation */}
      <div className="absolute top-3 right-3">
        <button
          className={`p-2 rounded-full focus:outline-none shadow-md transition-all duration-300 ${
            isCopied
              ? "bg-green-500 text-white rotate-0 scale-110"
              : "bg-pink-100 hover:bg-pink-200 text-pink-700 hover:-translate-y-1 active:scale-95"
          }`}
          onClick={handleCopy}
          aria-label={isCopied ? "已複製歌曲資訊" : "複製歌曲資訊"}
          disabled={isCopied}
        >
          {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </button>

        {/* Toast notification */}
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm shadow-lg transition-all duration-300 flex items-center gap-2 ${
            isCopied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <Check className="h-4 w-4" />
          <span>已複製到剪貼簿</span>
        </div>
      </div>
    </div>
  )
}
