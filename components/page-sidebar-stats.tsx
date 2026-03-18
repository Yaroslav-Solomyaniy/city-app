// components/sidebar-stats.tsx
import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
  label: string
  value: string | number
}

interface Props {
  items: StatItem[]
  title?: string
}

const SidebarStats = ({ items, title = "Загальна статистика" }: Props) => {
  return (
    <Card className="gap-0 p-0">
      <CardContent className="p-5">
        <p className="mb-4 text-xs font-semibold tracking-widest text-primary uppercase">{title}</p>
        {items.map((s) => (
          <div key={s.label} className="flex items-center justify-between border-b py-2.5 last:border-0">
            <span className="text-[13px] text-muted-foreground">{s.label}</span>
            <span className="text-[15px] font-bold text-foreground">{s.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default SidebarStats
