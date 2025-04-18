interface StatsDisplayProps {
  totalSongs: number
  languages: string[]
  languageCounts: Record<string, number>
  categoryCounts: Record<string, number>
}

export default function StatsDisplay({ totalSongs, languages, languageCounts, categoryCounts }: StatsDisplayProps) {
  const getLanguageStatClass = (language: string) => {
    if (!language) return "bg-gray-50"

    // Simple hash function to get a consistent color
    const classes = [
      "bg-pink-50",
      "bg-blue-50",
      "bg-yellow-50",
      "bg-green-50",
      "bg-purple-50",
      "bg-red-50",
      "bg-indigo-50",
      "bg-orange-50",
      "bg-teal-50",
    ]

    let hash = 0
    for (let i = 0; i < language.length; i++) {
      hash = language.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % classes.length
    return classes[index]
  }

  const getLanguageStatTextClass = (language: string) => {
    if (!language) return "text-gray-600"

    // Simple hash function to get a consistent color
    const classes = [
      "text-pink-600",
      "text-blue-600",
      "text-yellow-600",
      "text-green-600",
      "text-purple-600",
      "text-red-600",
      "text-indigo-600",
      "text-orange-600",
      "text-teal-600",
    ]

    let hash = 0
    for (let i = 0; i < language.length; i++) {
      hash = language.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % classes.length
    return classes[index]
  }

  // Get top languages
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)

  // Get top category
  const topCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 1)

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-3 sm:mb-4">統計資訊</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-indigo-50 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{totalSongs}</div>
          <div className="text-xs sm:text-sm text-gray-600">總歌曲數</div>
        </div>

        {topLanguages.map(([language, count]) => (
          <div key={language} className={`${getLanguageStatClass(language)} rounded-lg p-3 sm:p-4 text-center`}>
            <div className={`text-2xl sm:text-3xl font-bold ${getLanguageStatTextClass(language)}`}>{count}</div>
            <div className="text-xs sm:text-sm text-gray-600">{language} 歌曲</div>
          </div>
        ))}

        {topCategory.map(([category, count]) => (
          <div key={category} className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">{count}</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">最多: {category}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
