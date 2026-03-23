"use server"

import prisma from "@/lib/prisma"

export async function getResources(params?: { q?: string; categorySlug?: string }) {
  const { q, categorySlug } = params ?? {}

  return prisma.resource.findMany({
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
    include: {
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
    },
  })
}
