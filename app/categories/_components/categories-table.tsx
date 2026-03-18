import React from "react"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryWithCount } from "@/types/action"
import { ICON_MAP } from "@/constants/icon-map"

interface Props {
  categories: CategoryWithCount[]
  total: number
}

export default function CategoriesTable({ categories, total }: Props) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden rounded-2xl border p-0 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="pl-5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Категорія</TableHead>
              <TableHead className="hidden text-[11px] font-bold tracking-wider text-muted-foreground uppercase md:table-cell">
                Послуги
              </TableHead>
              <TableHead className="hidden text-[11px] font-bold tracking-wider text-muted-foreground uppercase sm:table-cell">
                Ресурсів
              </TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => {
              const Icon = ICON_MAP[cat.iconName] ?? Building2
              const count = cat._count.resources

              return (
                <TableRow
                  key={cat.id}
                  className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/30"
                  onClick={() => router.push(`/categories/${cat.slug}`)}
                >
                  <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: cat.bg }}>
                        <Icon size={14} color={cat.accent} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-foreground">{cat.title}</p>
                        {cat.titleEn && <p className="text-[11px] text-muted-foreground">{cat.titleEn}</p>}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden py-3.5 md:table-cell">
                    <span className="text-[12.5px] text-muted-foreground">{cat.services.join(" · ")}</span>
                  </TableCell>

                  <TableCell className="hidden py-3.5 sm:table-cell">
                    <span
                      className="inline-flex items-center rounded-lg px-2.5 py-1 text-[11.5px] font-semibold"
                      style={{ background: cat.bg, color: cat.accent }}
                    >
                      {count}
                    </span>
                  </TableCell>

                  <TableCell className="py-3.5 pr-4 text-right">
                    <span
                      className="text-[13px] font-medium transition-transform duration-150 group-hover:translate-x-0.5"
                      style={{ color: cat.accent }}
                    >
                      →
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Separator />
        <div className="px-5 py-3">
          <p className="text-[12px] text-muted-foreground">
            Показано <span className="font-semibold text-foreground">{categories.length}</span> з{" "}
            <span className="font-semibold text-foreground">{total}</span> категорій
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
