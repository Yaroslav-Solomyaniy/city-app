"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, Facebook, Globe, Landmark, Menu, Search, X } from "lucide-react"

import { NAV_LINKS } from "@/constants/nav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import GlobalSearch from "@/components/global-search"
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

            <Button
              variant="outline"
              onClick={() => setSearchOpen(true)}
              className="hidden w-36 justify-start lg:w-56 gap-2 rounded-full border-border/50 bg-muted/40 text-muted-foreground hover:bg-muted md:flex"
            >
              <Search size={13} />
              <span className="flex-1 text-left text-[12.5px]">Пошук...</span>
            </Button>

            <Button variant="ghost" size="icon-sm" className="rounded-xl md:hidden" onClick={() => setSearchOpen(true)}>
              <Search className="size-3.5" />
            </Button>

            <MobileMenu isActive={isActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} closeMenu={closeMenu} />
          </div>

          <img src="/kozak.png" alt="Козак" className="block h-8 object-contain" />

          <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
      </div>
    )
  }

  // ── Simple sticky (всі інші сторінки) ─────────────────────
  return (
    <header className="sticky -top-px z-40 border-b bg-background pt-px backdrop-blur-md">
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

        <Button
          variant="outline"
          onClick={() => setSearchOpen(true)}
          className="hidden w-36 justify-start lg:w-56 gap-2 rounded-full text-muted-foreground hover:bg-muted md:flex"
        >
          <Search size={13} />
          <span className="flex-1 text-left text-[12.5px]">Пошук...</span>
        </Button>

        <Button variant="ghost" size="icon-sm" className="rounded-xl md:hidden" onClick={() => setSearchOpen(true)}>
          <Search className="size-3.5" />
        </Button>

        <MobileMenu isActive={isActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} closeMenu={closeMenu} />
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
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
      <SheetContent side="right" className="flex w-72 flex-col p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        {/* Top — лого + заголовок */}
        <SheetHeader className="flex flex-col items-center gap-2 border-b px-4 pt-8 pb-5">
          <Image src="/1.png" alt="СітіЧЕ" width={200} height={100} priority />
          <div className="mt-5 text-center">
            <SheetTitle className="text-[28px] leading-tight font-bold">СітіЧЕ</SheetTitle>
            <p className="text-[14px] text-muted-foreground">Довідник електронних сервісів громади</p>
          </div>
        </SheetHeader>

        {/* Навігація */}
        <nav className="flex flex-col gap-0.5 px-3 py-3">
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

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-3 border-t px-4 py-4">
          <p className="text-center text-[12px] leading-relaxed text-muted-foreground">
            КП «Інститут розвитку міста та цифрової трансформації» Черкаської міської ради
          </p>

          <div className="flex items-center justify-center gap-3">
            <a
              href="https://kpcifra.ck.ua"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Наш сайт"
            >
              <Globe size={15} />
            </a>
            <a
              href="https://www.facebook.com/KPCifra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Facebook"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://cherkasy-rada.gov.ua"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Facebook"
            >
              <Landmark size={15} />
            </a>
          </div>
          <p className="text-center text-[12px] leading-relaxed text-muted-foreground">За підтримки черкаської міської ради</p>

          <p className="на mt-5 flex items-center justify-center gap-3 text-center text-[12px] leading-relaxed text-muted-foreground">
            <img src="https://flagcdn.com/w20/ua.png" alt="UA" className={"rounded"} />
            Слава Україні! — Героям слава!
            <img src="https://flagcdn.com/w20/ua.png" alt="UA" className={"rounded"} />
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
