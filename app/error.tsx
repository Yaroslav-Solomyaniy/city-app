// app/error.tsx
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute -top-40 -left-40 h-150 w-150 rounded-full bg-destructive/5 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-125 w-125 rounded-full bg-orange-500/5 blur-[140px]" />

      <div className="relative z-10 w-full max-w-120">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle size={28} className="text-destructive" />
          </div>
        </div>

        {/* Text */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Щось пішло не так</h1>
          <p className="mt-2 text-sm text-muted-foreground">Виникла неочікувана помилка. Спробуй оновити сторінку або повернись пізніше.</p>
        </div>

        {/* Error details card */}
        <div className="mb-6 overflow-hidden rounded-2xl border bg-card">
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-semibold text-foreground">Деталі помилки</span>
              {error.digest && (
                <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">#{error.digest}</span>
              )}
            </div>
            {showDetails ? (
              <ChevronUp size={15} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={15} className="text-muted-foreground" />
            )}
          </button>

          {showDetails && (
            <div className="border-t px-5 py-4">
              {/* Error name + message */}
              <div className="mb-3 space-y-1">
                <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Тип</p>
                <p className="font-mono text-[13px] text-destructive">{error.name}</p>
              </div>
              <div className="mb-3 space-y-1">
                <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Повідомлення</p>
                <p className="font-mono text-[13px] break-all text-foreground">{error.message || "Невідома помилка"}</p>
              </div>

              {/* Stack trace */}
              {error.stack && (
                <div className="space-y-1">
                  <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Stack trace</p>
                  <pre className="max-h-48 overflow-auto rounded-xl bg-muted p-3 font-mono text-[11px] leading-relaxed break-all whitespace-pre-wrap text-muted-foreground">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={reset}>
            <RefreshCw size={14} /> Спробувати знову
          </Button>
          <Button asChild className="flex-1">
            <Link href="/">На головну</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
