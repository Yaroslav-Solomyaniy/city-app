import { Metadata } from "next"
import Hero from "@/components/hero"

export const metadata: Metadata = {
  title: "СітіЧЕ — єдине вікно для взаємодії з Черкасами",
  description: "Знайдіть усі міські послуги, ресурси та онлайн-можливості Черкас в одному місці. Електронні петиції, звернення, комунальні служби та багато іншого.",
  openGraph: {
    title: "СітіЧЕ — єдине вікно для взаємодії з Черкасами",
    description: "Знайдіть усі міські послуги, ресурси та онлайн-можливості Черкас в одному місці.",
    url: "/",
  },
}

export default function Home() {
  return <Hero />
}
