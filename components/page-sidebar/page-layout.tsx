"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarCard } from "@/components/sidebar-card"
import PageSidebarSearch from "@/components/page-sidebar/page-sidebar-search"
import SidebarViewToggle from "@/components/page-sidebar/sidebar-view-toggle"
import MobileFab from "@/components/mobile-fab"
import { ViewMode } from "@/constants/view-mode"
import { PanelRight } from "lucide-react"

export interface SidebarSlotItem {
  title: string
  content: React.ReactNode
  raw?: boolean
  visibility?: "both" | "desktop" | "mobile"
}

interface Props {
  children: React.ReactNode
  sidebarSlot?: SidebarSlotItem[]
  search: string
  setSearch: (v: string) => void
  view: ViewMode
  setView: (v: ViewMode) => void
  searchPlaceholder?: string
  stickyTop?: number
  showMoreButton?: boolean
}

export default function PageLayout({
  children,
  sidebarSlot = [],
  search,
  setSearch,
  view,
  setView,
  searchPlaceholder = "Пошук...",
  stickyTop = 88,
  showMoreButton = true,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const desktopItems = sidebarSlot.filter((item) => item.visibility !== "mobile")
  const mobileItems = sidebarSlot.filter((item) => item.visibility !== "desktop")

  return (
    <>
      {/* ── Мобільний рядок ── */}
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:hidden">
        <PageSidebarSearch search={search} setSearch={setSearch} placeholder={searchPlaceholder} />
        <div className="mt-2">
          <SidebarViewToggle view={view} setView={setView} />
        </div>
        {mobileItems.length > 0 && showMoreButton && (
          <div className="mt-2">
            <Button variant="outline" onClick={() => setMobileOpen(true)} className="h-9 w-full gap-1.5 text-[13px] font-medium">
              <PanelRight size={15} />
              <span>Більше</span>
            </Button>
          </div>
        )}
      </div>

      {/* ── Основний layout ── */}
      <div className="mx-auto flex max-w-7xl items-start gap-6 px-4 pb-16 sm:px-6">
        <div className="min-w-0 flex-1">{children}</div>

        {desktopItems.length > 0 && (
          <aside className="hidden w-75 shrink-0 flex-col gap-4 lg:flex xl:w-[320px]" style={{ position: "sticky", top: stickyTop }}>
            <Image src="/Cherkasy_Color_Mini.png" width={450} height={400} alt="Герб" priority className="transition-transform duration-200" />
            <PageSidebarSearch search={search} setSearch={setSearch} placeholder={searchPlaceholder} />
            <SidebarViewToggle view={view} setView={setView} />
            {desktopItems.map((item) =>
              item.raw ? (
                <div key={item.title}>{item.content}</div>
              ) : (
                <SidebarCard key={item.title} title={item.title}>
                  {item.content}
                </SidebarCard>
              )
            )}
          </aside>
        )}
      </div>

      {/* ── Floating кнопка вгору ── */}
      {sidebarSlot.length > 0 && <MobileFab />}

      {/* ── Мобільна модалка з табами ── */}
      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="flex max-h-[85vh] max-w-md flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b px-5 py-4">
            <DialogTitle className="text-[15px]">Додаткова інформація</DialogTitle>
          </DialogHeader>

          {mobileItems.length === 1 ? (
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {mobileItems[0].raw ? mobileItems[0].content : <SidebarCard>{mobileItems[0].content}</SidebarCard>}
            </div>
          ) : (
            <Tabs defaultValue="0" className="flex flex-1 flex-col overflow-hidden">
              <TabsList className="mx-4 mt-3 mb-1 shrink-0 gap-3 self-center">
                {mobileItems.map((item, i) => (
                  <TabsTrigger key={i} value={String(i)}>
                    {item.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {mobileItems.map((item, i) => (
                <TabsContent key={i} value={String(i)} className="mt-0 flex-1 overflow-y-auto px-5 py-4">
                  {item.raw ? item.content : <SidebarCard>{item.content}</SidebarCard>}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
