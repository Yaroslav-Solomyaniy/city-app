"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { BorderBeam } from "@/components/ui/border-beam"
import { signIn } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered") === "1"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")
    setLoading(true)

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: "/admin",
    })

    setLoading(false)

    if (error) {
      setServerError("Невірний email або пароль")
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="relative overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* ── Form side ── */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <FieldGroup className="gap-4">
                <Link
                  href="/"
                  className="mb-5 flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft size={14} />
                  На головну
                </Link>

                <div className="flex flex-col items-center gap-2 text-center">
                  <Image src="/1.png" width={200} height={40} alt="Айдентика міста черкаси" className="mb-4" />
                  <h1 className="text-xl font-bold tracking-tight">Вхід</h1>
                  <p className="text-sm text-muted-foreground">Вхід до адміністративної панелі</p>
                </div>

                {registered && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
                    <CheckCircle2 size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-[13px] font-medium text-emerald-700 dark:text-emerald-400">Акаунт створено! Тепер можеш увійти.</p>
                  </div>
                )}

                <Field className="gap-2">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cityche.ua"
                    autoComplete="email"
                    autoFocus
                    required
                  />
                </Field>

                <Field className="gap-2">
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      tabIndex={-1}
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </Button>
                  </div>
                </Field>

                {serverError && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>}

                <Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Входимо...
                      </>
                    ) : (
                      "Увійти"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            {/* ── Image side ── */}
            <div className="relative hidden md:block">
              <Image src="/new_pano.jpeg" alt="Черкаси" fill className="object-cover dark:brightness-[0.3] dark:grayscale" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute right-8 bottom-8 left-8">
                <p className="text-lg font-semibold text-white">Сіті-ЧЕ</p>
                <p className="mt-1 text-sm text-white/70">Єдине вікно для взаємодії з Черкасами</p>
              </div>
            </div>
          </CardContent>

          <div className="pointer-events-none absolute inset-0 z-50 rounded-[inherit]">
            <BorderBeam duration={6} size={400} colorFrom="transparent" colorTo="#f59e0b" />
            <BorderBeam duration={6} delay={3} size={400} borderWidth={2} colorFrom="transparent" colorTo="#ef4444" />
          </div>
        </Card>
      </div>
    </div>
  )
}
