"use server"

import { Action } from "@/types/action"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/require-auth"

export async function revokeInvite(inviteId: string): Promise<Action> {
  await requireAuth()

  await prisma.inviteToken.delete({ where: { id: inviteId } })
  revalidatePath("/admin/administrators")
  return { ok: true }
}
