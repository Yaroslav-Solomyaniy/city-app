"use server"
import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"

const RESOURCE_INCLUDE = {
  category: {
    select: {
      id: true,
      title: true,
      slug: true,
      accent: true,
      bg: true,
      iconName: true,
    },
  },
  subcategory: {
    select: {
      id: true,
      title: true,
    },
  },
} as const

export async function getResources(params?: { q?: string; categorySlug?: string }) {
  const q = params?.q ?? ""
  const categorySlug = params?.categorySlug ?? ""

  return unstable_cache(
    async () =>
      prisma.resource.findMany({
        where: {
          ...(categorySlug && categorySlug !== "all" ? { category: { slug: categorySlug } } : {}),
          ...(q
            ? {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                  { tags: { hasSome: [q] } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        include: RESOURCE_INCLUDE,
      }),
    ["resources", q, categorySlug],
    { tags: ["resources"] }
  )()
}

export async function getRecentResources(limit: number) {
  return unstable_cache(
    async () =>
      prisma.resource.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: RESOURCE_INCLUDE,
      }),
    ["resources-recent", String(limit)],
    { tags: ["resources"] }
  )()
}
