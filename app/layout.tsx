import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { Geist_Mono, Nunito_Sans, Public_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import React from "react"
import { Metadata, Viewport } from "next"
import ConditionalHeader from "@/components/conditional-header"
import ScrollToTop from "@/components/scroll-to-top"
import "./globals.css"
import AdminPreviewBar from "@/components/admin-preview-bar"
import { Toaster } from "sonner"
import { NuqsAdapter } from "nuqs/adapters/next"

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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://city-che.ck.ua"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "СітіЧЕ — єдине вікно для взаємодії з Черкасами",
    template: "%s | СітіЧЕ",
  },
  description: "Офіційний вебпортал Черкаської міської громади. Знайдіть усі міські послуги, ресурси та онлайн-можливості Черкас в одному місці.",
  keywords: ["Черкаси", "міські послуги", "онлайн-сервіси", "Черкаська громада", "електронні послуги", "СітіЧЕ"],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: "СітіЧЕ",
    images: [{ url: "/panorama.jpg", width: 1200, height: 630, alt: "СітіЧЕ — вебпортал Черкаської громади" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cityche",
  },
  robots: { index: true, follow: true },
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
      lang="uk"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", publicSans.variable, nunito.variable)}
    >
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <NuqsAdapter>
          <ThemeProvider>
            <TooltipProvider>
              <ScrollToTop />
              <ConditionalHeader />
              <Toaster position={"top-center"} />
              {children}
              <AdminPreviewBar />
            </TooltipProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
