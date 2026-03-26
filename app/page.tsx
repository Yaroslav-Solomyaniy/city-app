import { Metadata } from "next"
import Hero from "@/components/hero"
import { ogImageUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "СітіЧЕ — єдине вікно для взаємодії з Черкасами",
  description: "Знайдіть усі міські послуги, ресурси та онлайн-можливості Черкас в одному місці. Електронні петиції, звернення, комунальні служби та багато іншого.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "СітіЧЕ — єдине вікно для взаємодії з Черкасами",
    description: "Знайдіть усі міські послуги, ресурси та онлайн-можливості Черкас в одному місці. Електронні петиції, звернення, комунальні служби та багато іншого.",
    url: "/",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "СітіЧЕ — єдине вікно для взаємодії з Черкасами" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "СітіЧЕ — єдине вікно для взаємодії з Черкасами",
    description: "Знайдіть усі міські послуги, ресурси та онлайн-можливості Черкас в одному місці.",
    images: [ogImageUrl],
  },
}

export default function Home() {
  return <Hero />
}
