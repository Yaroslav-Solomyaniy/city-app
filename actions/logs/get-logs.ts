"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/require-auth"
import { LogEntry } from "@/types/action"

const VALID_ACTIONS = ["create", "edit", "delete", "login", "logout", "invite"] as const
type LogAction = (typeof VALID_ACTIONS)[number]

interface GetLogsParams {
  q?: string
  action?: string
  user?: string
}

export async function getLogs(params: GetLogsParams = {}): Promise<LogEntry[]> {
  await requireAuth()

  const { q, action, user } = params

  const actionUpper = action && VALID_ACTIONS.includes(action as LogAction) ? action.toUpperCase() : undefined

  const logs = await prisma.activityLog.findMany({
    where: {
      ...(actionUpper ? { action: actionUpper as any } : {}),
      ...(user ? { userName: user } : {}),
      ...(q
        ? {
            OR: [
              { entityName: { contains: q, mode: "insensitive" } },
              { userName: { contains: q, mode: "insensitive" } },
              { details: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  })

  return logs.map((l) => ({
    id: l.id,
    action: l.action.toLowerCase(),
    entity: l.entity.toLowerCase(),
    entityName: l.entityName,
    userName: l.userName,
    userId: l.userId,
    details: l.details,
    createdAt: l.createdAt.toISOString(),
  }))
}

// Список унікальних юзерів для фільтру — завжди без фільтрів
export async function getLogUsers(): Promise<string[]> {
  await requireAuth()

  const logs = await prisma.activityLog.findMany({
    select: { userName: true },
    distinct: ["userName"],
    orderBy: { userName: "asc" },
  })

  return logs.map((l) => l.userName).filter(Boolean)
}
