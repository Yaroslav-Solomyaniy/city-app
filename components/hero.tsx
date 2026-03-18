// components/hero.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import panorama from "@/public/new_pano.jpeg"
import { ArrowRight, Menu, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { NAV_LINKS } from "@/constants/nav"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Hero() {
  const pathname = usePathname()
  const [loaded, setLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href))

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="relative overflow-hidden bg-black" style={{ height: "100dvh", minHeight: 580 }}>
      {/* ── Фото з parallax ── */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.28}px) scale(1.08)`,
          transformOrigin: "center top",
        }}
      >
        <Image src={panorama} alt="Панорама Черкас" fill priority quality={95} sizes="100vw" className="object-cover object-center" />
      </div>

      {/* ── Градієнти ── */}
      {/* Верх — дуже легкий, щоб небо дихало */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
      {/* Низ — основний, під контент */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black via-black/75 to-transparent" />
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* ── Burger — верхній правий (мобайл) ── */}
      <div
        className="absolute top-4 right-4 z-20 md:hidden"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease 0.4s",
        }}
      >
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="rounded-xl text-white/70 hover:bg-white/15 hover:text-white">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72" onOpenAutoFocus={(e) => e.preventDefault()}>
            <SheetHeader>
              <SheetTitle className="text-left text-sm">СітіЧЕ — Громадський портал Черкас</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-2">
              <Input placeholder="Пошук по порталу..." className="h-9" />
            </div>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
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
      </div>

      {/* ── Весь контент — прилипає до низу ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-7 sm:px-10 sm:pb-10">
        <div className="mx-auto max-w-6xl">
          {/* Надзаголовок */}
          <div
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
            }}
          >
            <span className="mb-2 inline-block text-[10px] font-semibold tracking-[0.32em] text-white/40 uppercase sm:text-[11px]">
              Офіційний портал громади · Черкаси
            </span>
          </div>

          {/* Заголовок */}
          <div
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s",
            }}
          >
            <h1
              className="mb-1 leading-[0.88] font-black text-white"
              style={{
                fontSize: "clamp(52px, 9.5vw, 124px)",
                letterSpacing: "-0.035em",
                textShadow: "0 2px 32px rgba(0,0,0,0.35)",
              }}
            >
              Сіті
              <span
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f97316 40%, #ef4444 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ЧЕ
              </span>
            </h1>
          </div>

          {/* Розділювач + опис + nav + кнопки — все в одному рядку на десктопі */}
          <div
            className="mt-4 mb-5 flex flex-col gap-4 sm:mt-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 1s ease 0.35s, transform 1s ease 0.35s",
            }}
          >
            {/* Ліво: опис */}
            <p
              className="max-w-xs text-[13px] leading-relaxed text-white/55 sm:text-[15px] lg:max-w-sm"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
            >
              Єдине вікно для взаємодії з містом — сервіси, організації та ресурси для мешканців Черкас.
            </p>

            {/* Право: nav + пошук + кнопки */}
            <div className="flex flex-col gap-3 lg:items-end">

              {/* Кнопки */}
              <div className="flex gap-2">
                <Link
                  href="/categories"
                  className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)] sm:px-6 sm:text-[14px]"
                >
                  Категорії
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/resources"
                  className="flex items-center rounded-full border border-white/22 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/18 sm:px-6 sm:text-[14px]"
                >
                  Ресурси
                </Link>
                <Link
                  href="/about"
                  className="flex items-center rounded-full border border-white/22 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/18 sm:px-6 sm:text-[14px]"
                >
                  Про нас
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
