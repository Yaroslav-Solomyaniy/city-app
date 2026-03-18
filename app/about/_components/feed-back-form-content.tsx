"use client"

import React, { useState } from "react"
import { FeedBackFormType } from "@/types/feedback"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { createFeedback } from "@/actions/feedback/feedback"
import { toast } from "sonner"
import { CategoryWithCount, ResourceWithCategory } from "@/types/action"

const REMOVE_REASONS = [
  "Посилання застаріло або не працює",
  "Невірна інформація",
  "Дублікат іншого ресурсу",
  "Не відповідає тематиці порталу",
  "Інше",
]

interface Props {
  type: FeedBackFormType
  categories: CategoryWithCount[]
  resources: ResourceWithCategory[]
  onSuccess: () => void
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label} {optional && <span className="font-normal text-muted-foreground">(необов&#39;язково)</span>}
      </Label>
      {children}
    </div>
  )
}

const FeedBackFormContent = ({ type, categories, resources, onSuccess }: Props) => {
  const [category, setCategory] = useState("")
  const [resourceId, setResourceId] = useState("")
  const [reason, setReason] = useState("")

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = {
          type,
          ...Object.fromEntries(formData),
          ...(type === "add-resource" && { category }),
          ...(type === "remove-resource" && { reason, resourceId }),
        }

        const result = await createFeedback(data as Record<string, string>)
        if (!result.ok) {
          toast.error(result.error)
          return
        }

        onSuccess()
      }}
      className="flex flex-col gap-4"
    >
      {/* Common: name + email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ім'я">
          <Input name="author" required placeholder="Іван Петренко" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" required placeholder="email@example.com" />
        </Field>
      </div>

      {type === "feedback" && (
        <>
          <Field label="Тема">
            <Input name="subject" required placeholder="Коротко опишіть тему" />
          </Field>
          <Field label="Повідомлення">
            <Textarea name="message" required rows={4} placeholder="Ваше повідомлення..." className="resize-none" />
          </Field>
        </>
      )}

      {type === "add-resource" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Назва ресурсу">
              <Input name="name" required placeholder="Черкаський зоопарк" />
            </Field>
            <Field label="Посилання">
              <Input name="url" required type="url" placeholder="https://example.com" />
            </Field>
          </div>
          <Field label="Категорія">
            <Select required value={category} onValueChange={setCategory}>
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Оберіть категорію" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Короткий опис">
            <Textarea name="description" required rows={3} placeholder="Що можна знайти на цьому ресурсі?" className="resize-none" />
          </Field>
        </>
      )}

      {type === "remove-resource" && (
        <>
          <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-3.5 dark:border-yellow-900/50 dark:bg-yellow-950/30">
            <span className="mt-0.5 shrink-0">⚠️</span>
            <p className="text-sm leading-relaxed text-yellow-800 dark:text-yellow-200">
              Ми перевіримо обґрунтованість запиту перед видаленням.
            </p>
          </div>
          <Field label="Ресурс">
            <Select required value={resourceId} onValueChange={setResourceId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Оберіть ресурс зі списку" />
              </SelectTrigger>
              <SelectContent>
                {resources.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Причина видалення">
            <Select required value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Оберіть причину" />
              </SelectTrigger>
              <SelectContent>
                {REMOVE_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Коментар" optional>
            <Textarea name="comment" rows={3} placeholder="Додаткові деталі" className="resize-none" />
          </Field>
        </>
      )}

      {type === "add-category" && (
        <>
          <Field label="Назва категорії">
            <Input name="name" required placeholder="Культура та дозвілля" />
          </Field>
          <Field label="Опис категорії">
            <Textarea name="description" required rows={3} placeholder="Що буде включати ця категорія?" className="resize-none" />
          </Field>
          <Field label="Приклади ресурсів" optional>
            <Textarea name="examples" rows={3} placeholder="Перелічіть кілька ресурсів" className="resize-none" />
          </Field>
        </>
      )}

      <div className="mt-1 flex items-end justify-between gap-4">
        <Button type="submit" variant={type === "remove-resource" ? "destructive" : "default"} className="gap-2">
          {type === "feedback" ? "Надіслати" : "Надіслати запит"}
          <ArrowRight size={14} />
        </Button>
        <Image src="/1.png" alt="CityChe" width={150} height={45} priority />
      </div>
    </form>
  )
}

export default FeedBackFormContent
