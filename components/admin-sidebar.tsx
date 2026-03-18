"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sun, Moon, ExternalLink, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { signOut } from "@/lib/auth-client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ADMIN_NAV_lINKS } from "@/constants/nav"
import Image from "next/image"

export function AdminSidebar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  const isDark = resolvedTheme === "dark"
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/"))

  return (
    <Sidebar collapsible="icon">
      {/* ── Header ── */}
      <SidebarHeader className="pb-0">
        <Link href="/" className="relative flex flex-col items-center gap-2 px-2 pt-5 pb-4 no-underline">
          {/* Soft glow */}
          <div className="absolute top-3 h-16 w-16 rounded-full bg-primary/10 blur-xl transition-all duration-300" />

          {/* Герб */}
          <div className="relative">
            <Image src="/1.png" alt="Айдентика міста Че" width={250} height={60} priority />
          </div>

          {/* Text */}
          <div className="mt-4 flex flex-col items-center gap-0.5 leading-tight">
            <span className="text-[18px] font-bold tracking-wide text-foreground">СітіЧЕ</span>
            <span className="mt-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-bold tracking-[0.18em] text-primary uppercase">
              Адмін-панель
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Nav ── */}
      <SidebarContent>
        {ADMIN_NAV_lINKS.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={cn(active && "bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary")}
                    >
                      <Link href={item.href}>
                        <Icon size={18} strokeWidth={active ? 2 : 1.7} />
                        <span>{item.label}</span>
                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* ── Footer ── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={mounted && isDark ? "Світла тема" : "Темна тема"} onClick={toggleTheme}>
              {mounted && isDark ? <Sun size={17} /> : <Moon size={15} />}
              <span>{mounted && isDark ? "Світла тема" : "Темна тема"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Переглянути сайт">
              <Link href="/">
                <ExternalLink size={17} />
                <span>Переглянути сайт</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Вийти"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() =>
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/auth/sign-in"
                    },
                  },
                })
              }
            >
              <LogOut size={17} />
              <span>Вийти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
