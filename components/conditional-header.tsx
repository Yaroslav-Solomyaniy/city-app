// components/conditinal-header.tsx
"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/header"

export default function ConditionalHeader() {
  const pathname = usePathname()

  // На головній nav вбудовано в Hero — хедер не потрібен
  const hideHeader = pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/auth")

  if (hideHeader) return null
  return <Header />
}
