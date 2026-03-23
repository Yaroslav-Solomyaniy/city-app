import React from "react"
import { Building2 } from "lucide-react"
import { ICON_MAP } from "@/constants/icon-map"
import Link from "next/link"
import { CategoryWithCount } from "@/types/action"

const LIMIT = 5

function getTopByResources(categories: CategoryWithCount[]) {
  return [...categories].sort((a, b) => b._count.resources - a._count.resources).slice(0, LIMIT)
}

interface Props {
  categories: CategoryWithCount[]
}

const TopCategoriesByResources = ({ categories }: Props) => {
  const items = getTopByResources(categories)

  if (items.length === 0)
    return <p className="text-[13px] text-muted-foreground">Виникла помилка при отриманні даних, зверніться до розробника</p>

  return (
    <div>
      {items.map((cat, i) => {
        const Icon = ICON_MAP[cat.iconName] ?? Building2
        return (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className={`flex items-center gap-3 px-5 py-2.5 text-[13px] transition-colors hover:bg-muted/40 ${i < items.length - 1 ? "border-b" : ""}`}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: cat.bg }}>
              <Icon size={13} color={cat.accent} strokeWidth={1.8} />
            </div>
            <span className="flex-1 truncate font-medium text-foreground">{cat.title}</span>
            <span className="rounded-full px-2 py-0.5 text-[11.5px] font-semibold" style={{ background: cat.bg, color: cat.accent }}>
              {cat._count.resources}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default TopCategoriesByResources
