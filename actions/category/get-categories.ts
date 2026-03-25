"use server"
import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"

export const getCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { resources: true },
        },
      },
    }),
  ["categories"],
  { tags: ["categories"] }
)
