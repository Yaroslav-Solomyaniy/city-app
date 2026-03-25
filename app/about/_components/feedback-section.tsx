"use client"

import React, { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FeedBackFormType, IFeedBackFormVariant } from "@/types/feedback"
import { ArrowRight, CheckCircle2, MessageSquare, MinusCircle, PlusCircle, Tag } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FeedBackFormContent from "@/app/about/_components/feedback-form-content"
import { CategoryWithCount, ResourceWithCategory } from "@/types/action"

const FeedBackVariant: IFeedBackFormVariant[] = [
  {
    id: "feedback",
    label: "Відгук або помилка",
    description: "Повідомте про проблему або залиште відгук",
    icon: MessageSquare,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-900",
  },
  {
    id: "add-resource",
    label: "Запропонувати ресурс",
    description: "Додайте корисне посилання на портал",
    icon: PlusCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-900",
  },
  {
    id: "remove-resource",
    label: "Видалити ресурс",
    description: "Застаріле або невірне посилання",
    icon: MinusCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-900",
  },
  {
    id: "add-category",
    label: "Нова категорія",
    description: "Запропонуйте новий розділ для порталу",
    icon: Tag,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-900",
  },
]

interface Props {
  categories: CategoryWithCount[]
  resources: ResourceWithCategory[]
}

const FeedbackSection = ({ categories, resources }: Props) => {
  const [selected, setSelected] = useState<FeedBackFormType>("feedback")
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const meta = FeedBackVariant.find((t) => t.id === selected)!

  function handleOpen() {
    setSent(false)
    setOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <RadioGroup
          value={selected}
          onValueChange={(v) => setSelected(v as FeedBackFormType)}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {FeedBackVariant.map(({ id, label, description, icon: Icon, color, bg, border }) => {
            const active = selected === id
            return (
              <Label
                key={id}
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all",
                  active ? cn(bg, border) : "border-border hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value={id} id={id} className="mt-0.5 shrink-0" />
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", active ? bg : "bg-muted")}>
                  <Icon size={16} className={active ? color : "text-muted-foreground"} />
                </div>
                <div className="min-w-0">
                  <p className={cn("text-[13.5px] font-semibold", active ? color : "text-foreground")}>{label}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{description}</p>
                </div>
              </Label>
            )
          })}
        </RadioGroup>

        <Button className="w-fit gap-2" onClick={handleOpen}>
          Продовжити
          <ArrowRight size={14} />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mb-1 text-lg font-bold text-foreground">Дякуємо!</p>
              <p className="max-w-xs text-sm text-muted-foreground">Ми отримали ваше звернення і розглянемо його найближчим часом.</p>
              <Button variant="link" className="mt-4" onClick={() => setOpen(false)}>
                Закрити
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", meta.bg)}>
                      <meta.icon size={18} className={meta.color} />
                    </div>
                    <div>
                      <DialogTitle className="sr-only">{meta.label}</DialogTitle>
                      <DialogDescription className="mt-0.5">{meta.description}</DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <FeedBackFormContent type={selected} categories={categories} resources={resources} onSuccess={() => setSent(true)} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FeedbackSection
