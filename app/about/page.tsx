import React from "react"
import { CodeXml, Lightbulb, PencilRuler, SlidersHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FeedbackSection from "./_components/feedback-section"
import { getCategories } from "@/actions/category/get-categories"
import { getResources } from "@/actions/resource/get-resources"

const TEAM = [
  {
    icon: <CodeXml color="#f97316" />,
    role: "Розробник порталу",
    name: "Солом'яний Ярослав Сергійович",
    detail: "Розробка та технічна реалізація порталу",
  },
  {
    icon: <Lightbulb color="#a855f7" />,
    role: "Автор ідеї",
    name: "Холупняк Катерина Олександрівна",
    detail: "Концепція та стратегія розвитку",
  },
  {
    icon: <PencilRuler color="#ec4899" />,
    role: "Наповнення порталу",
    name: "Ткаченко Дмитро Олександрович, Самойленко Олександр Олександрович",
    detail: "Контент, категорії та ресурси",
  },
  {
    icon: <SlidersHorizontal color="#06b6d4" />,
    role: "Адміністрування порталу",
    name: "КП «Інститут розвитку міста та цифрової трансформації» ЧМР",
    detail: "Відповідає за наповнення, актуальність та підтримку",
  },
]

export default async function AboutPage() {
  const [categories, resources] = await Promise.all([getCategories(), getResources()])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* About */}
        <div className="mb-24 grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-4 text-xs tracking-widest uppercase">
              Про портал
            </Badge>
            <h1 className="mb-6 text-4xl leading-tight font-bold text-foreground md:text-5xl">
              Бібліотека сервісів
              <br />
              <span className="text-primary">м. Черкаси</span>
            </h1>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              Портал створено з метою забезпечення відкритого та зручного доступу мешканців до послуг різного роду, актуальної інформації та
              ресурсів міської громади.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Наша місія — цифровізувати взаємодію між мешканцями та місцевими органами влади, зробивши кожну послугу доступною в кілька кліків.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {TEAM.map((item) => (
              <Card key={item.role} className="p-0">
                <CardContent className="flex gap-4 p-5">
                  <span className="mt-0.5 shrink-0 text-2xl">{item.icon}</span>
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">{item.role}</p>
                    <p className="mb-0.5 font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div>
          <Badge variant="secondary" className="mb-4 text-xs tracking-widest uppercase">
            Зворотній зв&#39;язок
          </Badge>
          <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">Допоможіть зробити портал кращим</h2>
          <p className="mb-8 max-w-xl text-muted-foreground">
            Напишіть нам, запропонуйте новий ресурс або категорію, повідомте про застарілу інформацію.
          </p>
          <FeedbackSection categories={categories} resources={resources} />
        </div>
      </div>
    </div>
  )
}
