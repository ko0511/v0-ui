export interface Song {
  id: number
  title: string
  artist: string
  language: string
  category: string
  notes: string
  categories: string[]
}

export interface CategoryCount {
  [key: string]: number
}
