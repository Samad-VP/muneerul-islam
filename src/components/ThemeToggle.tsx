"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { PiSunDuotone, PiMoonDuotone, PiDesktopDuotone } from "react-icons/pi"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch by waiting for component to mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex bg-bg-card border border-border-color rounded-lg p-1 min-w-[100px] h-8 animate-pulse">
        <div className="w-full h-full bg-bg-secondary rounded-md rounded-r-none"></div>
        <div className="w-full h-full bg-transparent"></div>
        <div className="w-full h-full bg-transparent rounded-l-none"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center bg-bg-card border border-border-color rounded-lg p-0.5 sm:p-1 relative">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold rounded-md flex items-center justify-center transition-all z-10 ${
          theme === "light" 
            ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 shadow-sm" 
            : "text-text-muted hover:text-text-primary"
        }`}
        aria-label="Light Mode"
        title="Warm Light"
      >
        <PiSunDuotone size={16} />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold rounded-md flex items-center justify-center transition-all z-10 ${
          theme === "system" 
            ? "text-blue-500 bg-blue-500/10 shadow-sm" 
            : "text-text-muted hover:text-text-primary"
        }`}
        aria-label="System Match"
        title="System Default"
      >
        <PiDesktopDuotone size={16} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold rounded-md flex items-center justify-center transition-all z-10 ${
          theme === "dark" 
            ? "text-purple-400 bg-purple-500/10 shadow-sm" 
            : "text-text-muted hover:text-text-primary"
        }`}
        aria-label="Dark Mode"
        title="Deep Dark"
      >
        <PiMoonDuotone size={16} />
      </button>
    </div>
  )
}
