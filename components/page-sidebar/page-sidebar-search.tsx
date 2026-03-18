import React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  search: string
  setSearch: (search: string) => void
  placeholder: string
}

const PageSidebarSearch = ({ search, setSearch, placeholder }: Props) => {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 pr-9 pl-9" />
      {search && (
        <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1 -translate-y-1/2" onClick={() => setSearch("")}>
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

export default PageSidebarSearch
