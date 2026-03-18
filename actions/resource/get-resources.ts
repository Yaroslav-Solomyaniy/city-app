"use server"

import prisma from "@/lib/prisma"

export async function getResources() {
  return prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: {
          id: true,
          title: true,
          slug: true,
          accent: true,
          bg: true,
        },
      },
    },
  })
}

