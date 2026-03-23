"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, X } from "lucide-react"

import { NAV_LINKS } from "@/constants/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function Header() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === "/"

  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isHome])

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href))

  const closeMenu = () => setMobileOpen(false)

  // ── Floating (тільки головна) ──────────────────────────────
  if (isHome) {
    return (
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-40 px-4 pt-3 pb-1">
        <div
          className={cn(
            "pointer-events-auto mx-auto max-w-7xl rounded-2xl border border-border/50 bg-background/80 shadow-lg backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 contain-[layout]",
            scrolled ? "border-border/80 shadow-xl" : "border-border/30"
          )}
        >
          <div className="flex h-16 items-center gap-3 px-5">
            <Link href="/" className="group flex shrink-0 items-center gap-3">
              <img src="/gerb.png" alt="Герб" className="hidden h-13 lg:block" />
              <img src="/1.png" alt="Герб" className="block h-8 lg:hidden" />
              <div className="hidden flex-col leading-tight lg:flex">
                <p className="text-sm leading-snug font-bold whitespace-nowrap">СітіЧЕ — Черкаська міська громада</p>
                <p className="hidden text-[10.5px] leading-snug whitespace-nowrap text-muted-foreground lg:block">
                  КП «Інститут розвитку міста та цифрової трансформації» ЧМР
                </p>
              </div>
            </Link>

            <div className="hidden h-7 w-px shrink-0 bg-border/60 lg:block" />

            <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative rounded-xl px-3.5 py-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-all duration-200",
                    isActive(href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  )}
                >
                  {label}
                  {isActive(href) && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />}
                </Link>
              ))}
            </nav>

            <div className="flex-1 md:hidden" />
            <div className="hidden h-7 w-px shrink-0 bg-border/60 xl:block" />

            <div
              className={cn(
                "hidden items-center overflow-hidden rounded-full border transition-all duration-300 md:flex",
                searchOpen ? "w-50 border-primary/40 bg-muted/50" : "w-8.5 border-transparent"
              )}
            >
              <Button variant="ghost" size="icon-sm" onClick={() => setSearchOpen((o) => !o)} className="shrink-0 rounded-full">
                {searchOpen ? <X className="size-3.5" /> : <Search className="size-3.5" />}
              </Button>
              {searchOpen && (
                <Input
                  autoFocus
                  placeholder="Пошук..."
                  className="h-auto border-0 bg-transparent px-1 py-0 text-[13px] shadow-none focus-visible:ring-0"
                  onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                />
              )}
            </div>

            <Button variant="ghost" size="icon-sm" className="rounded-xl md:hidden" onClick={() => setSearchOpen((o) => !o)}>
              {searchOpen ? <X className="size-3.5" /> : <Search className="size-3.5" />}
            </Button>

            <MobileMenu isActive={isActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} closeMenu={closeMenu} />
          </div>

          <Image src="/kozak.png" alt="Козак" className="block h-8" width={32} height={32} priority={true} />

          {/*{searchOpen && (*/}
          {/*  <div className="border-t px-4 py-2.5 md:hidden">*/}
          {/*    <Input*/}
          {/*      autoFocus*/}
          {/*      placeholder="Пошук по порталу..."*/}
          {/*      className="h-9"*/}
          {/*      onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </div>
    )
  }

  // ── Simple sticky (всі інші сторінки) ─────────────────────
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <img src="/gerb.png" alt="Герб" className="hidden h-11 lg:block" />
          <img src="/1.png" alt="Герб" className="block h-7 lg:hidden" />
          <div className="hidden flex-col leading-tight lg:flex">
            <p className="text-sm leading-snug font-bold whitespace-nowrap">СітіЧЕ — Черкаська міська громада</p>
            <p className="text-[10.5px] leading-snug whitespace-nowrap text-muted-foreground">
              КП «Інститут розвитку міста та цифрової трансформації» ЧМР
            </p>
          </div>
        </Link>

        <div className="hidden h-6 w-px shrink-0 bg-border lg:block" />

        <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative rounded-xl px-3.5 py-1.5 text-[13.5px] font-semibold whitespace-nowrap transition-all duration-200",
                isActive(href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              {label}
              {isActive(href) && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />}
            </Link>
          ))}
        </nav>

        <div className="flex-1 md:hidden" />

        {/*<div*/}
        {/*  className={cn(*/}
        {/*    "hidden items-center overflow-hidden rounded-full border transition-all duration-300 md:flex",*/}
        {/*    searchOpen ? "w-50 border-primary/40 bg-muted/50" : "w-8.5 border-transparent"*/}
        {/*  )}*/}
        {/*>*/}
        {/*  <Button variant="ghost" size="icon-sm" onClick={() => setSearchOpen((o) => !o)} className="shrink-0 rounded-full">*/}
        {/*    {searchOpen ? <X className="size-3.5" /> : <Search className="size-3.5" />}*/}
        {/*  </Button>*/}
        {/*  {searchOpen && (*/}
        {/*    <Input*/}
        {/*      autoFocus*/}
        {/*      placeholder="Пошук..."*/}
        {/*      className="h-auto border-0 bg-transparent px-1 py-0 text-[13px] shadow-none focus-visible:ring-0"*/}
        {/*      onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</div>*/}

        <img src="/kozak.png" alt="Козак" className="w-8 object-contain" />

        {/*<Button variant="ghost" size="icon-sm" className="rounded-xl md:hidden" onClick={() => setSearchOpen((o) => !o)}>*/}
        {/*  {searchOpen ? <X className="size-3.5" /> : <Search className="size-3.5" />}*/}
        {/*</Button>*/}

        <MobileMenu isActive={isActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} closeMenu={closeMenu} />
      </div>

      {searchOpen && (
        <div className="border-t px-4 py-2.5 md:hidden">
          <Input autoFocus placeholder="Пошук по порталу..." className="h-9" onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)} />
        </div>
      )}
    </header>
  )
}

// ── Shared mobile menu ─────────────────────────────────────────

function MobileMenu({
  isActive,
  mobileOpen,
  setMobileOpen,
  closeMenu,
}: {
  isActive: (href: string) => boolean
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  closeMenu: () => void
}) {
  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="rounded-xl md:hidden">
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle className="text-left text-sm">СітіЧе — Громадський портал Черкас</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-2">
          <Input placeholder="Пошук по порталу..." className="h-9" />
        </div>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className={cn(
                "rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-all",
                isActive(href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto border-t px-4 pt-3 text-[10.5px] leading-relaxed text-muted-foreground">
          КП «Інститут розвитку міста» Черкаської міської ради
        </p>
      </SheetContent>
    </Sheet>
  )
}
