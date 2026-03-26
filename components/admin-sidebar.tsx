"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sun, Moon, ExternalLink, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { signOut } from "@/lib/auth-client"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import { ADMIN_NAV_LINKS } from "@/constants/nav"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

function NavButton({
  asChild,
  isActive,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean; isActive?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

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
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/")

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* ── Header ── */}
      <div className="pb-0">
        <Link href="/" className="relative flex flex-col items-center gap-2 px-2 pt-5 pb-4 no-underline">
          <div className="absolute top-3 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
          <div className="relative">
            <Image src="/1.png" alt="Айдентика міста Че" width={250} height={60} priority />
          </div>
          <div className="mt-4 flex flex-col items-center gap-0.5 leading-tight">
            <span className="text-[18px] font-bold tracking-wide text-foreground">СітіЧЕ</span>
            <span className="mt-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-[12px] font-bold tracking-[0.18em] text-primary uppercase">
              Адмін-панель
            </span>
          </div>
        </Link>
      </div>

      <Separator />

      {/* ── Nav ── */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
        {ADMIN_NAV_LINKS.map((section) => (
          <div key={section.title} className="flex flex-col gap-1 p-2">
            <p className="mb-1 px-2 text-xs font-medium text-sidebar-foreground/70">{section.title}</p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <NavButton asChild isActive={active}>
                      <Link href={item.href}>
                        <Icon size={18} strokeWidth={active ? 2 : 1.7} />
                        <span>{item.label}</span>
                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                      </Link>
                    </NavButton>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <Separator />

      {/* ── Footer ── */}
      <div className="flex flex-col gap-1 p-2">
        <NavButton onClick={toggleTheme}>
          {mounted && isDark ? <Sun size={17} /> : <Moon size={15} />}
          <span>{mounted && isDark ? "Світла тема" : "Темна тема"}</span>
        </NavButton>

        <NavButton asChild>
          <Link href="/">
            <ExternalLink size={17} />
            <span>Переглянути сайт</span>
          </Link>
        </NavButton>

        <NavButton
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
        </NavButton>
      </div>
    </div>
  )
}
