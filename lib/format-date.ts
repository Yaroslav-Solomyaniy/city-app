// lib/format-date.ts

export function formatDate(date: Date): string {
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return "Сьогодні"
  if (d.toDateString() === yesterday.toDateString()) return "Вчора"
  return d.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })
}

export function groupByDate<T extends { createdAt: string }>(items: T[]): { date: string; items: T[] }[] {
  const map = new Map<string, T[]>()
  items.forEach((item) => {
    const date = item.createdAt.split("T")[0]
    if (!map.has(date)) map.set(date, [])
    map.get(date)!.push(item)
  })
  return Array.from(map.entries()).map(([date, items]) => ({ date, items }))
}
