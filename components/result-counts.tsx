import React from "react"
import { wordForm } from "@/lib/plural"

interface Props {
  count: number
  total: number
  /** Nominative singular, e.g. "ресурс", "категорія" */
  word: string
}

export default function ResultsCount({ count, total, word }: Props) {
  const hasFilters = count !== total

  return (
    <p className="mb-4 text-[13px] text-muted-foreground">
      {hasFilters ? (
        <>
          Знайдено <span className="font-semibold text-foreground">{count}</span> з{" "}
          <span className="font-semibold text-foreground">{total}</span> {wordForm(total, word)}
        </>
      ) : (
        <>
          Всього <span className="font-semibold text-foreground">{count}</span> {wordForm(count, word)}
        </>
      )}
    </p>
  )
}
