import React from "react"

interface StatItem {
  label: string
  value: string | number
}

interface Props {
  items: StatItem[]
}

const SidebarStats = ({ items }: Props) => {
  return (
    <div>
      {items.map((s) => (
        <div key={s.label} className="flex items-center justify-between border-b py-2.5 last:border-0">
          <span className="text-[13px] text-muted-foreground">{s.label}</span>
          <span className="text-[15px] font-bold text-foreground">{s.value}</span>
        </div>
      ))}
    </div>
  )
}

export default SidebarStats
