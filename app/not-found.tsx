// app/not-found.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import React from "react"

const NotFoundPage = () => {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2.5">
      <Image src="/2.png" width={400} height={160} alt="Черкаси — найкраще місто" className={"pb-5"} />

      <h1 className="text-4xl font-bold tracking-tight text-foreground">Сторінка загубилася в Черкасах</h1>
      <p className="text-md mt-2 text-muted-foreground">Можливо, посилання застаріло або сторінку було переміщено.</p>

      <div className="flex gap-3">
        <Button variant="outline" size={"lg"} className={"px-6"} onClick={() => router.back()}>
          Назад
        </Button>
        <Button size={"lg"} className="px-8" asChild>
          <Link href="/">На головну</Link>
        </Button>
      </div>
    </main>
  )
}

export default NotFoundPage
