"use client"

import React, { useId, useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UPLOAD_ALLOWED_TYPES, UPLOAD_MAX_SIZE, UploadFolder } from "@/constants/upload"

interface Props {
  value: string
  onChange: (url: string) => void
  onPendingChange?: (pending: string | null) => void
  folder?: UploadFolder
  label?: string
}

export default function ImageUpload({ value, onChange, onPendingChange, folder = "categories", label }: Props) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File) {
    setError(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/api/upload?folder=${folder}`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Помилка завантаження")
        return
      }

      onChange(data.url)
      onPendingChange?.(data.url)
    } catch {
      setError("Помилка завантаження")
    } finally {
      setIsUploading(false)
    }
  }

  // Просто очищаємо UI — файл з диску НЕ видаляємо тут
  // Видалення старого файлу відбувається в handleEdit після успішного save
  function remove() {
    onChange("")
    onPendingChange?.(null)
  }

  function handleFile(file: File) {
    if (!UPLOAD_ALLOWED_TYPES.includes(file.type as never)) {
      setError("Дозволено лише jpg, png, webp")
      return
    }
    if (file.size > UPLOAD_MAX_SIZE) {
      setError("Файл перевищує 2MB")
      return
    }
    upload(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={id} className="text-xs tracking-wider uppercase">
          {label}
        </Label>
      )}

      {value ? (
        /* ── Preview ── */
        <div className="relative overflow-hidden rounded-lg border border-input bg-muted">
          <div className="relative h-36 w-full">
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized={value.includes("/upload_")} />
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2">
            <p className="truncate text-[11px] text-muted-foreground">{value}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={remove}
            >
              <X size={13} />
            </Button>
          </div>
        </div>
      ) : (
        /* ── Drop zone ── */
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed px-4 py-8 text-sm transition-colors",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
            isDragging ? "border-ring bg-accent" : "border-input bg-transparent hover:border-ring/50 hover:bg-accent/50",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-xs">
              <ImageIcon size={16} className="text-muted-foreground" />
            </div>
          )}

          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{isUploading ? "Завантаження..." : "Перетягніть або виберіть файл"}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">JPG, PNG, WebP · до 2MB</p>
          </div>

          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isUploading}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ""
            }}
          />
        </label>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-destructive">
          <X size={11} />
          {error}
        </p>
      )}
    </div>
  )
}
