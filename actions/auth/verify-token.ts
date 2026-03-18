'use server'
// ─── Verify Invite Token ──────────────────────────────────────

import prisma from "@/lib/prisma"
import { TokenStatus } from "@/types/action"


export async function verifyInviteToken(token: string): Promise<{ status: TokenStatus; email?: string }> {
  const invite = await prisma.inviteToken.findUnique({ where: { token } })

  if (!invite) return { status: "invalid" }
  if (invite.used) return { status: "used" }
  if (invite.expires < new Date()) return { status: "expired" }

  return { status: "valid", email: invite.email }
}
