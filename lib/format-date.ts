// lib/format-date.ts

import { format, isToday, isYesterday } from "date-fns"
import { uk } from "date-fns/locale"

export function formatDate(date: Date): string {
  return format(date, "dd.MM.yyyy", { locale: uk })
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr)

  if (isToday(date)) return "Сьогодні"
  if (isYesterday(date)) return "Вчора"

  return format(date, "d MMMM yyyy", { locale: uk })
}

export function groupByDate<T extends { createdAt: string }>(items: T[]): { date: string; items: T[] }[] {
  const map = new Map<string, T[]>()

  items.forEach((item) => {
    const dateKey = format(new Date(item.createdAt), "yyyy-MM-dd")

    if (!map.has(dateKey)) map.set(dateKey, [])
    map.get(dateKey)!.push(item)
  })

  return Array.from(map.entries()).map(([date, items]) => ({
    date,
    items,
  }))
}
