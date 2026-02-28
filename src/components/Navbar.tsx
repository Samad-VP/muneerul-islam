"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { PiList, PiX, PiGlobe } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"

export default function Navbar() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.committee"), href: "/committee" },
    { name: t("nav.gallery"), href: "/gallery" },
    { name: t("nav.contact"), href: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        scrolled ? "bg-bg-primary/80 backdrop-blur-md border-b border-border-color py-3" : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
            <span className="text-lg sm:text-xl">🕌</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold gradient-text leading-none tracking-tight">Muneerul Islam</span>
            <span className="arabic-text text-[10px] sm:text-xs text-emerald-400/90 leading-tight">منیر الاسلام</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-6 xl:gap-8 mr-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-emerald-400 ${
                  pathname === link.href ? "text-emerald-400" : "text-text-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-bg-card border border-border-color rounded-lg p-1">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                language === "en" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted hover:text-text-primary"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ml")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                language === "ml" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted hover:text-text-primary"
              }`}
            >
              ML
            </button>
          </div>

          <Link href="/login" className="btn-primary text-xs py-2 px-6 ml-2">
            {t("nav.login")}
          </Link>
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Language Toggle */}
          <div className="flex items-center bg-bg-card border border-border-color rounded-lg p-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 text-[10px] font-bold rounded flex items-center justify-center transition-all ${
                language === "en" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ml")}
              className={`px-2 py-1 text-[10px] font-bold rounded flex items-center justify-center transition-all ${
                language === "ml" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted"
              }`}
            >
              ML
            </button>
          </div>
          <button 
            className="text-text-primary bg-bg-secondary p-1.5 rounded-md hover:text-emerald-400 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <PiX size={22} /> : <PiList size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-bg-card border-b border-border-color animate-fade-in shadow-2xl origin-top">
          <div className="flex flex-col p-4 sm:p-6 gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-base font-semibold px-4 py-3 rounded-lg transition-colors ${
                  pathname === link.href ? "text-emerald-400 bg-emerald-500/10" : "text-text-secondary hover:bg-bg-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="px-4 mt-2">
              <Link 
                href="/login" 
                className="btn-primary w-full justify-center py-3.5 text-sm"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.login")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
