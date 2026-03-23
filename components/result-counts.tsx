import React from "react"

interface Props {
  count: number
  total: number
  word: string
}

export default function ResultsCount({ count, total, word }: Props) {
  const hasFilters = count !== total

  return (
    <p className="mb-4 text-[13px] text-muted-foreground">
      {hasFilters ? (
        <>
          Знайдено <span className="font-semibold text-foreground">{count}</span> з{" "}
          <span className="font-semibold text-foreground">{total}</span> {word}
        </>
      ) : (
        <>
          Всього <span className="font-semibold text-foreground">{count}</span> {word}
        </>
      )}
    </p>
  )
}
