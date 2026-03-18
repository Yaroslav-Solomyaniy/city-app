"use server"

import prisma from "@/lib/prisma"
import { sendInviteEmail } from "@/lib/mailer"
import { Action } from "@/types/action"
import { requireAuth } from "@/lib/require-auth"

export async function resendInvite(inviteId: string): Promise<Action> {
 const user = await requireAuth()

  const invite = await prisma.inviteToken.findUnique({ where: { id: inviteId } })
  if (!invite) return { ok: false, error: "Запрошення не знайдено" }

  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
  const link = `${baseUrl}/auth/register/${invite.token}`

  try {
    await sendInviteEmail({
      to: invite.email,
      url: link,
      host: new URL(baseUrl).hostname,
      invitedBy: user.name ?? user.email ?? undefined,
    })
  } catch (err) {
    console.error("[resendInvite] помилка:", err)
    return { ok: false, error: "Не вдалося надіслати лист" }
  }

  return { ok: true }
}
