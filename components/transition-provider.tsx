"use client"

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react"
import { usePathname } from "next/navigation"

const TransitionContext = createContext({})
export const usePageTransition = () => useContext(TransitionContext)

const DELAY_MS = 300

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // New page loaded — hide overlay
      if (timerRef.current) clearTimeout(timerRef.current)
      setVisible(false)
      prevPathname.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a")
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href) return
      if (href.startsWith("/") && !href.startsWith("//") && !anchor.target && !anchor.download) {
        // Show overlay only if navigation takes longer than DELAY_MS
        timerRef.current = setTimeout(() => setVisible(true), DELAY_MS)
      }
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <TransitionContext.Provider value={{}}>
      {children}
      {visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <img src="/2.png" alt="" className="h-40 w-auto object-contain" />
        </div>
      )}
    </TransitionContext.Provider>
  )
}
