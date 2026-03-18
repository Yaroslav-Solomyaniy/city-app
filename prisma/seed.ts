// prisma/seed.ts

import "dotenv/config"
import { PrismaClient } from "./src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { auth } from "@/lib/auth"
import { toSlug } from "@/lib/slug"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

// ─── Admin ────────────────────────────────────────────────────

async function seedAdmin() {
  const email = "auth@cityche.ua"
  const password = "Admin1234!"
  const name = "Головний адмін"

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`✓ Seed-адмін вже існує: ${email}`)
    return
  }

  // Використовуємо better-auth API щоб пароль хешувався правильно
  await auth.api.signUpEmail({
    body: { email, password, name },
  })

  console.log("✓ Seed-адмін створений")
  console.log(`  Email:  ${email}`)
  console.log(`  Пароль: ${password}`)
  console.log("  Зміни пароль після першого входу!")
}

// ─── Categories ───────────────────────────────────────────────

async function seedCategories() {
  const categories = [
    {
      title: "Здоров'я",
      titleEn: "Health",
      iconName: "Heart",
      photo: "/category/health.jpg",
      description: "Медичні заклади, аптеки, лабораторії та інші ресурси у сфері охорони здоров'я.",
      accent: "#ef4444",
      bg: "#fef2f2",
      order: 1,
      services: ["Лікарні", "Поліклініки", "Аптеки", "Лабораторії"],
    },
    {
      title: "Освіта",
      titleEn: "Education",
      iconName: "GraduationCap",
      photo: "/category/education.jpg",
      description: "Школи, університети, курси та освітні платформи міста.",
      accent: "#3b82f6",
      bg: "#eff6ff",
      order: 2,
      services: ["Школи", "Університети", "Дитячі садки", "Курси"],
    },
    {
      title: "Транспорт",
      titleEn: "Transport",
      iconName: "Bus",
      photo: "/category/transport.jpg",
      description: "Громадський транспорт, таксі, залізниця та інші транспортні послуги.",
      accent: "#f59e0b",
      bg: "#fffbeb",
      order: 3,
      services: ["Автобуси", "Маршрутки", "Залізниця", "Таксі"],
    },
    {
      title: "Культура",
      titleEn: "Culture",
      iconName: "Theater",
      photo: "/category/culture.jpg",
      description: "Музеї, театри, бібліотеки, кінотеатри та культурні події.",
      accent: "#8b5cf6",
      bg: "#f5f3ff",
      order: 4,
      services: ["Музеї", "Театри", "Бібліотеки", "Кінотеатри"],
    },
    {
      title: "Спорт",
      titleEn: "Sport",
      iconName: "Dumbbell",
      photo: "/category/sport.jpg",
      description: "Спортивні клуби, стадіони, басейни та фітнес-центри.",
      accent: "#10b981",
      bg: "#ecfdf5",
      order: 5,
      services: ["Фітнес", "Стадіони", "Басейни", "Секції"],
    },
    {
      title: "Соціальний захист",
      titleEn: "Social",
      iconName: "HandHeart",
      photo: "/category/social.jpg",
      description: "Соціальні служби, центри допомоги, пільги та субсидії.",
      accent: "#f43f5e",
      bg: "#fff1f2",
      order: 6,
      services: ["Центри зайнятості", "Пенсійний фонд", "Субсидії", "Допомога"],
    },
    {
      title: "Бізнес",
      titleEn: "Business",
      iconName: "Briefcase",
      photo: "/category/business.jpg",
      description: "Підприємництво, реєстрація бізнесу, податкова служба та дозволи.",
      accent: "#0ea5e9",
      bg: "#f0f9ff",
      order: 7,
      services: ["ДПС", "Реєстрація ФОП", "Дозволи", "Бізнес-центри"],
    },
    {
      title: "Комунальні послуги",
      titleEn: "Utilities",
      iconName: "Zap",
      photo: "/category/utilities.jpg",
      description: "Електропостачання, водопостачання, газ, вивіз сміття та ЖКГ.",
      accent: "#64748b",
      bg: "#f8fafc",
      order: 8,
      services: ["Електрика", "Водопостачання", "Газ", "ЖКГ"],
    },
  ]

  console.log("Seeding category...")
  for (const data of categories) {
    const existing = await prisma.category.findFirst({ where: { titleEn: data.titleEn } })
    if (existing) {
      console.log(`— Вже існує: ${data.title}`)
      continue
    }
    await prisma.category.create({ data: { ...data, slug: toSlug(data.titleEn) } })
    console.log(`✓ ${data.title}`)
  }
}

// ─── Main ─────────────────────────────────────────────────────

const SEEDS: Record<string, () => Promise<void>> = {
  admin: seedAdmin,
  categories: seedCategories,
}

async function main() {
  const arg = process.argv[2]

  if (!arg) {
    console.log("Використання: tsx prisma/seed.ts <команда>")
    console.log("")
    console.log("Доступні команди:")
    console.log("  admin       — створити seed-адміна")
    console.log("  category  — заповнити категорії")
    console.log("  all         — запустити все")
    process.exit(0)
  }

  if (arg === "all") {
    for (const [name, fn] of Object.entries(SEEDS)) {
      console.log(`\n── ${name} ──`)
      await fn()
    }
    return
  }

  const fn = SEEDS[arg]
  if (!fn) {
    console.error(`Невідома команда: "${arg}"`)
    console.error(`Доступні: ${Object.keys(SEEDS).join(", ")}, all`)
    process.exit(1)
  }

  await fn()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
