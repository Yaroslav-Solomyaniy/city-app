export const dynamic = "force-dynamic"

import React from "react"
import { Metadata } from "next"
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}
