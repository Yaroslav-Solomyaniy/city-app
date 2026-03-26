"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { AdminSidebar } from "@/components/admin-sidebar"

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setOpen(false)
    }
  }, [pathname])

  return (
    <div className="relative overflow-x-hidden lg:flex lg:min-h-screen lg:overflow-x-visible">

        {/* Backdrop — тільки мобайл/планшет */}
        {open && (
          <div
            className="fixed inset-0 z-20 bg-black/25 backdrop-blur-[1px] lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar:
            мобайл/планшет — fixed, виїжджає зліва (translateX)
            десктоп — static у flex-потоці, завжди видимий */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 border-r bg-sidebar transition-transform duration-200 ease-in-out",
            "lg:static lg:shrink-0 lg:translate-x-0 lg:transition-none",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col overflow-y-auto">
            <AdminSidebar />
          </div>
        </aside>

        {/* Контент:
            мобайл/планшет — зсувається вправо при відкритому sidebar (ефект push)
            десктоп — flex-1, ніяких трансформацій */}
        <div
          className={cn(
            "flex min-h-screen w-full flex-col transition-transform duration-200 ease-in-out",
            "lg:min-w-0 lg:flex-1 lg:translate-x-0 lg:transition-none",
            open ? "translate-x-64" : "translate-x-0"
          )}
        >
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur-md">
            <button
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Відкрити меню"
            >
              <PanelLeft className="size-4" />
            </button>
            <span className="text-[13px] font-bold text-foreground">Адмін-панель</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
  )
}
