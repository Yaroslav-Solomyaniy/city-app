"use client"

import React, { useState } from "react"
import { Mail, Clock, CheckCircle2, XCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { InvitePayload } from "@/types/action"
import { resendInvite } from "@/actions/administrators/resend-invite"
import { revokeInvite } from "@/actions/administrators/delete-invite"

interface Props {
  invites: InvitePayload[]
}

export default function InviteAdminList({ invites }: Props) {
  const [resendingId, setResendingId] = useState<string | null>(null)

  if (invites.length === 0) return null

  async function handleResend(id: string, email: string) {
    setResendingId(id)
    toast.promise(resendInvite(id), {
      loading: "Надсилаємо листа...",
      success: () => {
        setResendingId(null)
        return `Лист надіслано на ${email}`
      },
      error: () => {
        setResendingId(null)
        return "Не вдалося надіслати лист"
      },
    })
  }

  async function handleRevoke(id: string, email: string) {
    toast.promise(revokeInvite(id), {
      loading: "Скасовуємо запрошення...",
      success: `Запрошення для ${email} скасовано`,
      error: "Не вдалося скасувати запрошення",
    })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-amber-500" />
        <h2 className="text-[13px] font-semibold tracking-widest text-muted-foreground uppercase">Очікують реєстрації · {invites.length}</h2>
      </div>

      <div className="space-y-2">
        {invites.map((invite) => (
          <div key={invite.id} className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4 transition-colors hover:bg-muted/30">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                invite.used ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-amber-100 dark:bg-amber-900/30"
              )}
            >
              {invite.used ? (
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Clock size={16} className="text-amber-600 dark:text-amber-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-foreground">{invite.email}</p>
              <p className="text-[11.5px] text-muted-foreground">Діє до {invite.expires}</p>
            </div>

            {!invite.used && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResend(invite.id, invite.email)}
                disabled={resendingId === invite.id}
                className="h-8 shrink-0 gap-1.5 rounded-lg text-[12px]"
              >
                <Send size={12} className={cn(resendingId === invite.id && "animate-pulse")} />
                {resendingId === invite.id ? "Надсилаємо..." : "Надіслати повторно"}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleRevoke(invite.id, invite.email)}
            >
              <XCircle size={15} />
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
