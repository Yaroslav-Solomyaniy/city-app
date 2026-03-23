"use server"

import prisma from "@/lib/prisma"

export async function getResourcesCount() {
  return prisma.resource.count()
}
