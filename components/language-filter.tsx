"use client"

interface LanguageFilterProps {
  languages: string[]
  currentLanguage: string
  onSelectLanguage: (language: string) => void
}

export default function LanguageFilter({ languages, currentLanguage, onSelectLanguage }: LanguageFilterProps) {
  return (
    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
      {languages.sort().map((language) => (
        <button
          key={language}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs sm:text-sm transition-colors ${
            currentLanguage === language ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""
          }`}
          onClick={() => onSelectLanguage(language)}
        >
          {language}
        </button>
      ))}
    </div>
  )
}
