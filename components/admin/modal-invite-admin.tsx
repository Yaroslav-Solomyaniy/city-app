"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle, Mail, Copy, Check } from "lucide-react"
import { inviteAdmin } from "@/actions/administrators/invite"

interface Props {
  open: boolean
  onClose: () => void
}

function SuccessView({ email, warning, inviteLink, onClose }: { email: string; warning: string; inviteLink: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      {warning ? (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-[13px] font-semibold text-amber-700 dark:text-amber-400">{warning}</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">Запрошення надіслано на {email}</p>
        </div>
      )}

      {inviteLink && (
        <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2">
          <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">{inviteLink}</p>
          <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={copy}>
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </Button>
        </div>
      )}

      <Button onClick={onClose}>Закрити</Button>
    </div>
  )
}

export default function ModalInviteAdmin({ open, onClose }: Props) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [warning, setWarning] = useState("")
  const [inviteLink, setInviteLink] = useState("")

  function handleOpenChange(o: boolean) {
    if (!o) handleClose()
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setEmail("")
      setError("")
      setSuccess(false)
      setWarning("")
      setInviteLink("")
    }, 200)
  }

  async function handleSubmit(e: React.ChangeEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await inviteAdmin(email)
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    if (result.data?.warning) setWarning(result.data.warning)
    if (result.data?.invite.link) setInviteLink(result.data.invite.link)
    setSuccess(true)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-110">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <Mail size={20} className="text-primary" />
          </div>
          <DialogTitle className="text-center">{success ? "Запрошення надіслано" : "Запросити адміністратора"}</DialogTitle>
          {!success && <p className="text-center text-[13px] text-muted-foreground">На пошту прийде посилання для реєстрації</p>}
        </DialogHeader>

        {success ? (
          <SuccessView email={email} warning={warning} inviteLink={inviteLink} onClose={handleClose} />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="invite-email">Email нового адміністратора</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@cityche.ua"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            <DialogFooter className="flex gap-3 sm:flex-row">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Скасувати
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || !email}>
                {loading ? "Надсилаємо..." : "Надіслати запрошення"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
