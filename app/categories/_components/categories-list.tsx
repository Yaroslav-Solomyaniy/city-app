import React from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { CategoryWithCount } from "@/types/action"
import { ICON_MAP } from "@/constants/icon-map"
import { plural } from "@/lib/plural"

interface Props {
  categories: CategoryWithCount[]
}

export default function CategoriesList({ categories }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => {
        const Icon = ICON_MAP[cat.iconName] ?? Building2
        const count = cat._count.resources

        return (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm transition-all duration-200 hover:translate-x-1 hover:shadow-md"
          >
            <div className="w-1 shrink-0 self-stretch rounded-full" style={{ background: cat.accent }} />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: cat.bg }}>
              <Icon size={18} color={cat.accent} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-tight font-semibold text-foreground">{cat.title}</p>
              <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{cat.services.join(", ")}</p>
            </div>
<span
              className="shrink-0 text-[13px] font-medium transition-transform duration-150 group-hover:translate-x-0.5"
              style={{ color: cat.accent }}
            >
              →
            </span>
          </Link>
        )
      })}
    </div>
  )
}
