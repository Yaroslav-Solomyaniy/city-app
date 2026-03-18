'use server'
import prisma from "@/lib/prisma"
import { formatDate } from "@/lib/format-date"
import { requireAuth } from "@/lib/require-auth"

export async function getAdministrators() {
  await requireAuth()

  const [admins, invites] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        lastSeenAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.inviteToken.findMany({
      where: { used: false, expires: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const baseUrl = process.env.NEXTAUTH_URL ?? ""

  return {
    admins,
    invites: invites.map((i) => ({
      ...i,
      link: `${baseUrl}/auth/register/${i.token}`,
      expires: formatDate(i.expires),
      createdAt: formatDate(i.createdAt),
    })),
  }
}