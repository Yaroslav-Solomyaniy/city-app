import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.city-che.ck.ua"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      subcategories: { select: { slug: true }, orderBy: { order: "asc" } },
    },
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/categories`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/resources`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const subcategoryRoutes: MetadataRoute.Sitemap = categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      url: `${siteUrl}/categories/${cat.slug}/${sub.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  )

  return [...staticRoutes, ...categoryRoutes, ...subcategoryRoutes]
}
