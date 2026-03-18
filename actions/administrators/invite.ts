"use server"

import { Action, InvitePayload } from "@/types/action"
import prisma from "@/lib/prisma"
import { sendInviteEmail } from "@/lib/mailer"
import { revalidatePath } from "next/cache"
import { formatDate } from "@/lib/format-date"
import { requireAuth } from "@/lib/require-auth"

export async function inviteAdmin(email: string): Promise<Action<{ invite: InvitePayload; warning?: string }>> {
  const user = await requireAuth()

  const trimmed = email.trim().toLowerCase()
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, error: "Некоректний email" }
  }

  const existingUser = await prisma.user.findUnique({ where: { email: trimmed } })
  if (existingUser) {
    return { ok: false, error: "Адміністратор з таким email вже існує" }
  }

  const existingInvite = await prisma.inviteToken.findFirst({
    where: { email: trimmed, used: false, expires: { gt: new Date() } },
  })

  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"

  if (existingInvite) {
    const link = `${baseUrl}/auth/register/${existingInvite.token}`
    return {
      ok: true,
      data: {
        invite: {
          id: existingInvite.id,
          email: existingInvite.email,
          used: existingInvite.used,
          expires: formatDate(existingInvite.expires),
          createdAt: formatDate(existingInvite.createdAt),
          link,
        },
      },
    }
  }

  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000)
  const invite = await prisma.inviteToken.create({
    data: { email: trimmed, expires, createdBy: user.id },
  })

  await prisma.activityLog.create({
    data: {
      action: "INVITE",
      entity: "ADMIN",
      entityName: trimmed,
      details: `Надіслано запрошення на ${trimmed}`,
      userId: user.id,
      userName: user.name ?? user.email ?? "Невідомий",
    },
  })

  const link = `${baseUrl}/auth/register/${invite.token}`

  let warning: string | undefined
  try {
    await sendInviteEmail({
      to: trimmed,
      url: link,
      host: new URL(baseUrl).hostname,
      invitedBy: user.name ?? user.email ?? undefined,
    })
  } catch (err) {
    console.error("[inviteAdmin] помилка відправки листа:", err)
    warning = "Запрошення створено, але лист не надіслано. Скопіюй посилання вручну."
  }

  revalidatePath("/admin/administrators")

  return {
    ok: true,
    data: {
      invite: {
        id: invite.id,
        email: invite.email,
        used: invite.used,
        expires: formatDate(invite.expires),
        createdAt: formatDate(invite.createdAt),
        link,
      },
      warning,
    },
  }
}
