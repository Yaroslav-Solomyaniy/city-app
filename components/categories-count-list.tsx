import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CategoryItem {
  id: string
  slug: string
  title: string
  count: number
}

interface Props {
  categories: CategoryItem[]
  activeSlug: string
  totalCount: number
  onSelect: (slug: string) => void
}

export default function CategoriesCountList({ categories, activeSlug, totalCount, onSelect }: Props) {
  function handleSelect(slug: string, title?: string) {
    onSelect(slug)
    if (slug === "all") {
      toast("Показано всі категорії")
    } else {
      toast(`Обрано категорію «${title}»`)
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <Button
        variant="ghost"
        onClick={() => handleSelect("all")}
        className={cn(
          "h-auto justify-start gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium",
          activeSlug === "all" ? "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary" : "text-muted-foreground"
        )}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
        Всі категорії
        <span className="ml-auto text-[11px] font-semibold opacity-60">{totalCount}</span>
      </Button>

      {categories.map((cat) => {
        if (!cat.count) return null
        const isActive = activeSlug === cat.slug
        return (
          <Button
            key={cat.id}
            variant="ghost"
            onClick={() => handleSelect(cat.slug, cat.title)}
            className={cn(
              "h-auto justify-start gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium",
              isActive ? "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary" : "text-muted-foreground"
            )}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
            {cat.title}
            <span className="ml-auto text-[11px] font-semibold opacity-60">{cat.count}</span>
          </Button>
        )
      })}
    </div>
  )
}
