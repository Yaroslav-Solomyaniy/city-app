"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteAdmin } from "@/actions/administrators/delete-admin"

interface Props {
  adminId: string | null
  onClose: () => void
}

export default function ModalDeleteAdmin({ adminId, onClose }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (!adminId) return
    setLoading(true)

    const result = await deleteAdmin(adminId)
    setLoading(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    toast.success("Адміністратора видалено")
    onClose()
  }

  return (
    <Dialog
      open={!!adminId}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
    >
      <DialogContent className="max-w-90">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
            <Trash2 size={20} className="text-destructive" />
          </div>
          <DialogTitle className="text-center">Бажаєте видалити адміністратора?</DialogTitle>
        </DialogHeader>
        <p className="text-center text-[13px] text-muted-foreground">Адмін втратить доступ до панелі. Цю дію не можна відмінити.</p>
        <DialogFooter className="mt-2 flex gap-3 sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Скасувати
          </Button>
          <Button variant="destructive" className="flex-1" disabled={loading} onClick={handleConfirm}>
            {loading ? "Видаляємо..." : "Видалити"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
