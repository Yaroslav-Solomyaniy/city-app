"use client"

import { parseAsString, useQueryState } from "nuqs"
import { DEFAULT_VIEW } from "@/constants/view-mode"

interface UseSearchViewOptions {
  limitUrlUpdates?: { method: "debounce" | "throttle"; timeMs: number }
  shallow?: boolean
}

export function useSearchView({
  limitUrlUpdates = { method: "debounce", timeMs: 400 },
  shallow = false,
}: UseSearchViewOptions = {}) {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ limitUrlUpdates, shallow })
  )
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault(DEFAULT_VIEW).withOptions({ shallow })
  )

  return { search, setSearch, view, setView }
}
