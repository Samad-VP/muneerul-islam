"use client"
<<<<<<< HEAD
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { PiMoonDuotone, PiSunDuotone, PiDesktopDuotone } from "react-icons/pi"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

=======

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { PiSunDuotone, PiMoonDuotone, PiDesktopDuotone } from "react-icons/pi"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch by waiting for component to mount
>>>>>>> main
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
<<<<<<< HEAD
    return <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bg-secondary animate-pulse" />
  }

  return (
    <div className="relative group/toggle">
      <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bg-secondary border border-border-color flex items-center justify-center text-text-secondary hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-sm">
        {theme === "dark" ? (
          <PiMoonDuotone size={20} />
        ) : theme === "light" ? (
          <PiSunDuotone size={20} />
        ) : (
          <PiDesktopDuotone size={20} />
        )}
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 top-full mt-2 w-36 bg-bg-card border border-border-color rounded-xl shadow-xl opacity-0 invisible group-hover/toggle:opacity-100 group-hover/toggle:visible transition-all origin-top-right z-50 overflow-hidden">
        <div className="p-1.5 flex flex-col gap-1">
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === "light" ? "bg-emerald-500/10 text-emerald-400 font-semibold" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            }`}
          >
            <PiSunDuotone size={16} className={theme === "light" ? "text-emerald-400" : "text-text-muted"} />
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === "dark" ? "bg-emerald-500/10 text-emerald-400 font-semibold" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            }`}
          >
            <PiMoonDuotone size={16} className={theme === "dark" ? "text-emerald-400" : "text-text-muted"} />
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === "system" ? "bg-emerald-500/10 text-emerald-400 font-semibold" : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            }`}
          >
            <PiDesktopDuotone size={16} className={theme === "system" ? "text-emerald-400" : "text-text-muted"} />
            System
          </button>
        </div>
      </div>
=======
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
>>>>>>> main
    </div>
  )
}
