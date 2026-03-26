"use client"

import React, { useState } from "react"
import { Clock, Plus, Shield, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ModalInviteAdmin from "@/components/admin/modal-invite-admin"
import ModalDeleteAdmin from "@/components/admin/modal-delete-admin"
import InviteAdminList from "@/components/admin/invite-admin-list"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ROUTES } from "@/constants/routes"
import { Admin, InvitePayload } from "@/types/action"
import { AVATAR_COLORS } from "@/constants/avatar-colors"

interface Props {
  admins: Admin[]
  invites: InvitePayload[]
  currentUserId: string
}

export default function AdministratorsClient({ admins, invites, currentUserId }: Props) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-[1400px] space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Breadcrumb items={[ROUTES.ADMIN.ROOT, ROUTES.ADMIN.ADMINISTRATORS]} />
          <h1 className="text-[32px] font-bold tracking-tight text-foreground">Адміністратори</h1>
          <p className="mt-1 text-sm text-muted-foreground">Керування доступом до адмін-панелі</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="mt-1 shrink-0 gap-2 rounded-xl">
          <Plus size={15} /> Запросити адміністратора
        </Button>
      </div>

      {/* Active admins */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-blue-500" />
          <h2 className="text-[13px] font-semibold tracking-widest text-muted-foreground uppercase">Активні · {admins.length}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin, idx) => (
            <div
              key={admin.id}
              className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-200 hover:border-border/80 hover:shadow-md"
            >
              <div
                className={cn(
                  "absolute -top-6 -right-6 h-20 w-20 rounded-full bg-linear-to-br opacity-[0.07] blur-2xl",
                  AVATAR_COLORS[idx % AVATAR_COLORS.length]
                )}
              />
              {admin.id !== currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteAdminId(admin.id)}
                  className="absolute top-3 right-3 h-7 w-7 text-transparent transition-all group-hover:text-muted-foreground hover:bg-destructive/10 hover:text-destructive!"
                >
                  <Trash2 size={13} />
                </Button>
              )}

              <div
                className={cn(
                  "mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br text-[15px] font-bold text-white shadow-sm",
                  AVATAR_COLORS[idx % AVATAR_COLORS.length]
                )}
              >
                {(admin.name ?? admin.email)[0].toUpperCase()}
              </div>

              <div className="space-y-0.5">
                <p className="leading-tight font-semibold text-foreground">{admin.name ?? "—"}</p>
                <p className="truncate text-[12px] text-muted-foreground">{admin.email}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={11} />
                  <span className="text-[11px]">{admin.lastSeenAt ? new Date(admin.lastSeenAt).toLocaleDateString("uk-UA") : "Ніколи"}</span>
                </div>
                <span className="text-[11px] text-muted-foreground/60">з {new Date(admin.createdAt).toLocaleDateString("uk-UA")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending invites */}
      <InviteAdminList invites={invites} />

      {/* Modals */}
      <ModalInviteAdmin open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <ModalDeleteAdmin adminId={deleteAdminId} onClose={() => setDeleteAdminId(null)} />
    </div>
  )
}
