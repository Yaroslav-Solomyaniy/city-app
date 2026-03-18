"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, CheckCircle2, Clock, XCircle, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { SignUpSchema } from "@/lib/zod"
import { TokenStatus } from "@/types/action"
import { verifyInviteToken } from "@/actions/auth/verify-token"
import { SignUp } from "@/actions/auth/sign-up"
import { BorderBeam } from "@/components/ui/border-beam"

export default function RegisterPage() {
  const router = useRouter()
  const { token } = useParams<{ token: string }>()

  const [status, setStatus] = useState<TokenStatus | "loading">("loading")
  const [email, setEmail] = useState("")

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "password" | "confirm", string>>>({})
  const [serverError, setServerError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) return
    verifyInviteToken(token).then(({ status, email }: { status: TokenStatus; email?: string }) => {
      setStatus(status)
      if (email) setEmail(email)
    })
  }, [token])

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")

    const parsed = SignUpSchema.safeParse({ name, password, confirm })
    if (!parsed.success) {
      const errors: typeof fieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof errors
        if (!errors[key]) errors[key] = issue.message
      }
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    setSubmitting(true)
    const result = await SignUp(token, parsed.data.name, parsed.data.password)
    setSubmitting(false)

    if (!result.ok) {
      setServerError(result.error)
      return
    }
    router.push("/auth/sign-in?registered=1")
  }

  // ── Non-form states ──────────────────────────────────────────

  if (status === "loading")
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Перевіряємо посилання...</p>
        </div>
      </Shell>
    )

  if (status !== "valid")
    return (
      <Shell>
        <StatusCard status={status} />
      </Shell>
    )

  // ── Registration form ────────────────────────────────────────

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
                  <h1 className="text-xl font-bold tracking-tight">Реєстрація</h1>
                  <p className="text-sm text-muted-foreground">Тебе запросили до адмін-панелі СітіЧЕ</p>
                </div>

                {/* Email readonly */}
                <Field className="gap-2">
                  <FieldLabel htmlFor="email" className="text-muted-foreground">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="cursor-default bg-muted text-muted-foreground focus-visible:ring-0"
                  />
                </Field>

                {/* Name */}
                <Field data-invalid={!!fieldErrors.name || undefined} className="gap-2">
                  <FieldLabel htmlFor="name">Ім&apos;я та прізвище</FieldLabel>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setFieldErrors((p) => ({ ...p, name: undefined }))
                    }}
                    placeholder="Іван Петренко"
                    autoFocus
                    aria-invalid={!!fieldErrors.name}
                  />
                  <FieldError>{fieldErrors.name}</FieldError>
                </Field>

                {/* Password */}
                <Field data-invalid={!!fieldErrors.password || undefined} className="gap-2">
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setFieldErrors((p) => ({ ...p, password: undefined }))
                      }}
                      placeholder="Мінімум 8 символів"
                      autoComplete="new-password"
                      aria-invalid={!!fieldErrors.password}
                      className="pr-10"
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
                  {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
                </Field>

                {/* Confirm */}
                <Field data-invalid={!!fieldErrors.confirm || undefined} className="gap-2">
                  <FieldLabel htmlFor="confirm">Повтори пароль</FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value)
                        setFieldErrors((p) => ({ ...p, confirm: undefined }))
                      }}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-invalid={!!fieldErrors.confirm}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      tabIndex={-1}
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </Button>
                  </div>
                  <FieldError>{fieldErrors.confirm}</FieldError>
                </Field>

                {serverError && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>}

                <Field>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Реєструємо...
                      </>
                    ) : (
                      "Створити акаунт"
                    )}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Вже маєш акаунт? <Link href="/auth/sign-in">Увійти</Link>
                </FieldDescription>
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

          {/* BorderBeam поверх всього */}
          <div className="pointer-events-none absolute inset-0 z-50 rounded-[inherit]">
            <BorderBeam duration={6} size={700} borderWidth={2} delay={5} colorFrom="transparent" colorTo="#f59e0b" />
            <BorderBeam duration={6} delay={5} size={400} borderWidth={2} colorFrom="transparent" colorTo="#ef4444" />
          </div>
        </Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute -top-32 -left-32 h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-100 w-100 rounded-full bg-violet-500/5 blur-[120px]" />
      <div className="relative z-10 w-full max-w-105">{children}</div>
    </main>
  )
}

const STATUS_CONFIG = {
  used: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    title: "Посилання вже використане",
    description: "Реєстрація за цим запрошенням вже відбулась. Увійди за своїми даними.",
    action: { label: "Перейти до входу", href: "/auth/sign-in" },
  },
  expired: {
    icon: Clock,
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    title: "Посилання застаріло",
    description: "Термін дії запрошення минув. Попроси адміністратора надіслати нове.",
    action: null,
  },
  invalid: {
    icon: XCircle,
    iconClass: "text-destructive",
    bgClass: "bg-destructive/10",
    title: "Недійсне посилання",
    description: "Це запрошення не існує або було скасоване.",
    action: null,
  },
} as const

function StatusCard({ status }: { status: "used" | "expired" | "invalid" }) {
  const { icon: Icon, iconClass, bgClass, title, description, action } = STATUS_CONFIG[status]
  return (
    <div className="flex max-w-85 flex-col items-center gap-5 text-center">
      <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl", bgClass)}>
        <Icon size={28} className={iconClass} />
      </div>
      <div>
        <h1 className="mb-2 text-xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
