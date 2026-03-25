"use client"

import Image from "next/image"
import Link from "next/link"
import panorama from "@/public/new_pano.jpeg"
import iphone from "@/public/iphone.png"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Code2, Database, LayoutGrid } from "lucide-react"
import { TypingAnimation } from "@/components/ui/typing-animation"

const STATS = [
  { icon: LayoutGrid, value: "Усі послуги", label: "Адміністративні, соціальні та довідкові сервіси" },
  { icon: Clock, value: "24 / 7", label: "Доступно у будь-який час" },
  { icon: Database, value: "Актуально", label: "Оновлені ресурси та перевірені дані" },
]

export default function Hero() {
  return (
    <header className="relative flex min-h-screen flex-col overflow-hidden">
      {/* ── Full-bleed panorama background ── */}
      <div className="absolute inset-0 z-0">
        <Image src={panorama} alt="Панорама Черкас" fill priority quality={100} sizes="(max-width: 640px) 400vw, (max-width: 1280px) 200vw, 100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {/* ── Main content grid ── */}
      {/*
        mobile:  single column, card full width, no iPhone
        tablet:  two columns [3fr 2fr], card + smaller iPhone
        desktop: two columns [5fr 4fr], card + full iPhone
      */}
      <div
        className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-6 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-[3fr_2fr] md:gap-8 md:px-10 md:py-14 lg:grid-cols-[5fr_4fr] lg:gap-12 lg:px-16 lg:py-16 xl:gap-16 xl:px-24"
        style={{ minHeight: "100vh" }}
      >
        {/* ── LEFT: frosted content card ── */}
        <div
          className="flex flex-col gap-5 rounded-3xl p-6 sm:gap-6 sm:p-8 md:gap-6 md:p-8 lg:gap-8 lg:p-12"
          style={{
            background: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(24px) saturate(1.6)",
            WebkitBackdropFilter: "blur(24px) saturate(1.6)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.6) inset",
            border: "1px solid rgba(255,255,255,0.55)",
          }}
        >
          {/* badge */}
          <div className="flex items-center gap-2 self-start rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 shadow-sm sm:px-4 sm:py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold tracking-[0.16em] text-slate-500 uppercase sm:text-[11px]">Офіційний портал Черкас</span>
          </div>

          {/* logo */}
          <Image src="/1.png" alt="Черкаси" width={200} height={62} className="block w-[160px] sm:w-[190px] lg:w-[210px]" />

          {/* headline */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-[2.6rem] leading-[1.03] font-black tracking-tight text-slate-900 sm:text-[3rem] md:text-[2.8rem] lg:text-[clamp(3rem,4vw,4.8rem)]">
              <span
                style={{
                  background: "linear-gradient(100deg, #0369a1 0%, #0ea5e9 60%, #38bdf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                СітіЧЕ
              </span>
            </h1>
            <h2 className="text-[1.6rem] leading-[1.08] font-black tracking-tight text-slate-900 sm:text-[2rem] md:text-[1.75rem] lg:text-[clamp(1.8rem,2.8vw,3.2rem)]">
              Зручний пошук
              <br />
              онлайн-сервісів міста
            </h2>
            <p className="max-w-lg text-[14px] leading-relaxed font-semibold text-slate-600 sm:text-[15px] md:text-[14px] lg:text-[15px]">
              Від медицини та освіти до розкладу транспорту й державних сервісів — все зібрано в одному місці.
            </p>
          </div>

          {/* typing */}
          <div className="flex min-h-[24px] flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-slate-400 sm:text-[14px]">Наприклад:</span>
            <TypingAnimation
              typeSpeed={45}
              words={["Записатись до лікаря 🏥️", "Електронна черга до школи 🏫", "Соціальні послуги ♿️", "Комунальні сервіси 💧⚡"]}
              loop
              className="text-[13px] font-semibold text-sky-600 sm:text-[14px]"
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-nowrap sm:items-center">
            <Button asChild size="lg" className="w-full rounded-full px-6 text-[14px] sm:w-auto">
              <Link href="/categories" className="flex items-center gap-2">
                До категорій
                <LayoutGrid className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full border-slate-300/70 bg-white/30 px-6 text-[14px] backdrop-blur-sm hover:bg-slate-100 hover:text-slate-900 sm:w-auto"
            >
              <Link href="/resources" className="flex items-center gap-2">
                Всі ресурси
                <Database className="size-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full border-slate-300/70 bg-transparent px-6 text-[14px] text-slate-700 hover:bg-white/60 hover:text-slate-900 sm:w-auto"
            >
              <Link href="/about" className="flex items-center gap-2">
                Розробники
                <Code2 className="size-3.5" />
              </Link>
            </Button>
          </div>

          {/*/!* stats *!/*/}
          {/*<div className="grid grid-cols-3 gap-3 border-t border-slate-200/70 pt-4 sm:gap-6 sm:pt-6">*/}
          {/*  {STATS.map(({ icon: Icon, value, label }) => (*/}
          {/*    <div key={value} className="flex flex-col gap-1">*/}
          {/*      <div className="flex items-center gap-1.5">*/}
          {/*        <Icon className="size-3.5 shrink-0 text-sky-500" />*/}
          {/*        <span className="text-[11px] font-bold text-slate-800 sm:text-[13px]">{value}</span>*/}
          {/*      </div>*/}
          {/*      <p className="text-[9px] leading-snug text-slate-500 sm:text-[11px]">{label}</p>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}
        </div>

        {/* ── RIGHT: iPhone ── */}
        {/* hidden on mobile, visible tablet+ */}
        <div className="hidden w-full items-center justify-center self-center md:flex">
          <div className="relative w-[200px] drop-shadow-2xl lg:w-[280px] xl:w-[340px]">
            <Image src={iphone} alt="СітіЧЕ на iPhone" width={380} height={780} className="w-full object-contain" priority />
          </div>
        </div>
      </div>
    </header>
  )
}
