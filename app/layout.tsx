import { Geist_Mono, Nunito_Sans, Public_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import React from "react"
import { Metadata, Viewport } from "next"
import ConditionalHeader from "@/components/conditinal-header"
import "./globals.css"
import AdminPreviewBar from "@/components/admin-preview-bar"
import { Toaster } from "sonner"

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" })
const nunito = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  preload: true,
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-nunito",
})
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "CityChe — єдине вікно для взаємодії з Черкасами",
  description: "Офіційний вебпортал Черкаської міської громади.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // ← Safari safe-area fix
}

interface Props {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", publicSans.variable, nunito.variable)}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <ConditionalHeader />
            <Toaster position={"top-center"} />
            {children}
          </TooltipProvider>
        </ThemeProvider>
        <AdminPreviewBar />
      </body>
    </html>
  )
}
