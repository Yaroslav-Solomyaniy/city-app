"use client"

import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import PageSidebarSearch from "@/components/page-sidebar/page-sidebar-search"
import SidebarViewToggle from "@/components/page-sidebar/sidebar-view-toggle"
import { ViewMode } from "@/constants/view-mode"

export interface BottomNavItem {
  key: string
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}

interface Props {
  children: React.ReactNode
  sidebarSlot?: React.ReactNode
  extraNavItems?: BottomNavItem[]
  search: string
  setSearch: (v: string) => void
  view: ViewMode
  setView: (v: ViewMode) => void
  searchPlaceholder?: string
  stickyTop?: number
}

export default function PageLayout({
  children,
  sidebarSlot,
  extraNavItems = [],
  search,
  setSearch,
  view,
  setView,
  searchPlaceholder = "Пошук...",
  stickyTop = 88,
}: Props) {
  return (
    <>
      {/* Мобільний рядок: пошук + toggle + dropdown */}
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:hidden">
        <div className="flex h-10 gap-2">
          <div className="flex-1">
            <PageSidebarSearch search={search} setSearch={setSearch} placeholder={searchPlaceholder} />
          </div>
          <SidebarViewToggle view={view} setView={setView} compact />
          {extraNavItems.map((item) => (
            <Button
              key={item.key}
              variant="outline"
              size="sm"
              className={cn("h-10 w-10 shrink-0 p-0", item.active && "border-primary text-primary")}
              onClick={item.onClick}
            >
              {item.icon}
            </Button>
          ))}
        </div>
      </div>

      {/* Основний layout */}
      <div className="mx-auto flex max-w-7xl items-start gap-6 px-4 pb-16 sm:px-6">
        <div className="min-w-0 flex-1">{children}</div>

        {/* Desktop sidebar */}
        <aside className="hidden w-75 shrink-0 flex-col gap-4 lg:flex xl:w-[320px]" style={{ position: "sticky", top: stickyTop }}>
          <Image src="/Cherkasy_Color_Mini.png" width={450} height={400} alt="Герб" priority className="transition-transform duration-200" />
          <PageSidebarSearch search={search} setSearch={setSearch} placeholder={searchPlaceholder} />
          <SidebarViewToggle view={view} setView={setView} />
          {sidebarSlot}
        </aside>
      </div>
    </>
  )
}
