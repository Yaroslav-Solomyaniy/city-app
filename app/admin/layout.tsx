export const dynamic = "force-dynamic"

import React from "react"
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur-md lg:hidden">
          <SidebarTrigger />
          <span className="text-[13px] font-bold text-foreground">
            Адмін-панель
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
