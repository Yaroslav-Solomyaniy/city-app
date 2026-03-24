import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Building2 } from "lucide-react"
import { CategoryWithCount } from "@/types/action"
import { ICON_MAP } from "@/constants/icon-map"
import { plural } from "@/lib/plural"

interface Props {
  categories: CategoryWithCount[]
}

export default function CategoriesGrid({ categories }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((cat) => {
        const Icon = ICON_MAP[cat.iconName] ?? Building2
        const count = cat._count.resources

        return (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-1 opacity-80" style={{ background: cat.accent }} />

            {cat.photo && (
              <div className="relative h-32 overflow-hidden bg-muted">
                <Image src={cat.photo} width={300} height={250} alt={cat.title} priority={true} className="h-full w-full object-cover" unoptimized />
              </div>
            )}

            <div className="flex flex-1 flex-col p-4">
              {/* Іконка + назва */}
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: cat.bg }}>
                    <Icon size={17} color={cat.accent} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] leading-tight font-semibold text-foreground">{cat.title}</p>
                    {cat.titleEn && <p className="text-[11px] text-muted-foreground">{cat.titleEn}</p>}
                  </div>
                </div>
              </div>

              {/* Список послуг */}
              <ul className="mb-3 flex flex-1 list-none flex-col gap-1 p-0">
                {cat.services.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                    <span className="h-1 w-1 shrink-0 rounded-full opacity-50" style={{ background: cat.accent }} />
                    {s}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between border-t pt-3">
                <span className="text-[11px] text-muted-foreground">{plural(count, 'ресурс')}</span>
                <span className="text-[12.5px] font-semibold" style={{ color: cat.accent }}>
                  Переглянути →
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
