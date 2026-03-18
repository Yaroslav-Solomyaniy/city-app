"use client"

import { useSession, signOut } from "@/lib/auth-client"
import Link from "next/link"
import { LayoutDashboard, LogOut, X } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AdminPreviewBar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)

  if (isPending || !session || hidden || pathname.startsWith("/admin")) return null

  const initial = (session.user?.name ?? session.user?.email ?? "A")[0].toUpperCase()

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border bg-background/80 px-4 py-2 shadow-lg backdrop-blur-sm">
      <Avatar className="h-6 w-6 text-[11px]">
        <AvatarFallback className="bg-violet-500/15 text-[11px] font-bold text-violet-500">{initial}</AvatarFallback>
      </Avatar>

      <span className="hidden text-xs font-semibold text-muted-foreground sm:block">{session.user?.name ?? session.user?.email}</span>

      <Separator orientation="vertical" className="mx-1 h-4" />

      <Button variant="outline" size="sm" className="h-7 gap-1.5 rounded-xl text-xs" asChild>
        <Link href="/admin">
          <LayoutDashboard className="size-3.5" />
          Адмін-панель
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1.5 rounded-xl text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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
        <LogOut className="size-3.5" />
        <span className="hidden sm:block">Вийти</span>
      </Button>

      <Button variant="ghost" size="icon" className="ml-1 size-6 rounded-lg text-muted-foreground" onClick={() => setHidden(true)}>
        <X className="size-3.5" />
      </Button>
    </div>
  )
}
