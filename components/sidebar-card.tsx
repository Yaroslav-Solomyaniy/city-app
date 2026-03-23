import { Card, CardContent } from "@/components/ui/card"
import React from "react"

interface SidebarCardProps {
  title?: string
  children: React.ReactNode
}

export function SidebarCard({ title, children }: SidebarCardProps) {
  return (
    <Card className="gap-0 p-0">
      <CardContent className="p-5">
        {title && <p className="mb-4 text-xs font-semibold tracking-widest text-primary uppercase">{title}</p>}
        {children}
      </CardContent>
    </Card>
  )
}
