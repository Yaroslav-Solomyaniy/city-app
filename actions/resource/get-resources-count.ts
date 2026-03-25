"use server"
import prisma from "@/lib/prisma"
import { unstable_cache } from "next/cache"

export const getResourcesCount = unstable_cache(
  async () => prisma.resource.count(),
  ["resources-count"],
  { tags: ["resources"] }
)
