"use server"
import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"

export const getCategoriesWithSubs = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        subcategories: { orderBy: { order: "asc" } },
      },
    }),
  ["categories-with-subs"],
  { tags: ["categories"] }
)
