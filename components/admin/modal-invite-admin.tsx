"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle, Mail } from "lucide-react"
import { inviteAdmin } from "@/actions/administrators/invite"

interface Props {
  open: boolean
  onClose: () => void
}

export default function ModalInviteAdmin({ open, onClose }: Props) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  function handleOpenChange(o: boolean) {
    if (!o) handleClose()
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setEmail("")
      setError("")
      setSuccess(false)
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">Запрошення надіслано на {email}</p>
            </div>
            <p className="text-center text-[13px] text-muted-foreground">Адміністратор отримає лист із посиланням для реєстрації.</p>
            <Button onClick={handleClose}>Закрити</Button>
          </div>
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
