import React from "react"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"
import { CategoryWithCount } from "@/types/action"
import { ICON_MAP } from "@/constants/icon-map"

interface Props {
  categories: CategoryWithCount[]
  total: number
}

export default function CategoriesTable({ categories, total }: Props) {
  const router = useRouter()

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="py-3 pr-4 pl-5 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Категорія
            </th>
            <th className="hidden px-4 py-3 text-left text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell">
              Послуги
            </th>
            <th style={{ width: "40px" }} />
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] ?? Building2
            const count = cat._count.resources

            return (
              <tr
                key={cat.id}
                className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                onClick={() => router.push(`/categories/${cat.slug}`)}
              >
                <td className="py-3.5 pr-4 pl-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: cat.bg }}>
                      <Icon size={14} color={cat.accent} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-foreground">{cat.title}</p>
                      {cat.titleEn && <p className="text-[11px] text-muted-foreground">{cat.titleEn}</p>}
                      {cat.services.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1 md:hidden">
                          {cat.services.map((s) => (
                            <span
                              key={s}
                              className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                              style={{ background: cat.bg, color: cat.accent }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="hidden px-4 py-3.5 align-top md:table-cell">
                  <span className="text-[12.5px] text-muted-foreground">{cat.services.join(" · ")}</span>
                </td>

<td className="py-3.5 pr-4 text-right align-top">
                  <span
                    className="text-[13px] font-medium transition-transform duration-150 group-hover:translate-x-0.5"
                    style={{ color: cat.accent }}
                  >
                    →
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="border-t px-5 py-3">
        <p className="text-[12px] text-muted-foreground">
          Показано <span className="font-semibold text-foreground">{categories.length}</span> з{" "}
          <span className="font-semibold text-foreground">{total}</span> категорій
        </p>
      </div>
    </div>
  )
}
