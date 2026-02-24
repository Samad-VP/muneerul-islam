"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, Globe } from "lucide-react"
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-bg-primary/80 backdrop-blur-md border-b border-border-color py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl">🕌</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold gradient-text leading-tight">Muneerul Islam</span>
            <span className="arabic-text text-xs text-emerald-400 opacity-80">منیر الاسلام</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                  pathname === link.href ? "text-emerald-400" : "text-text-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-bg-card border border-border-color rounded-lg p-1 mr-4">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                language === "en" ? "bg-emerald-600 text-white" : "text-text-muted hover:text-text-primary"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ml")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                language === "ml" ? "bg-emerald-600 text-white" : "text-text-muted hover:text-text-primary"
              }`}
            >
              ML
            </button>
          </div>

          <Link href="/login" className="btn-primary text-xs py-2 px-6">
            {t("nav.login")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Language Toggle */}
            <div className="flex items-center bg-bg-card border border-border-color rounded-lg p-1">
                <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 text-[10px] font-bold rounded flex items-center justify-center transition-all ${
                    language === "en" ? "bg-emerald-600 text-white" : "text-text-muted"
                }`}
                >
                EN
                </button>
                <button
                onClick={() => setLanguage("ml")}
                className={`px-2 py-1 text-[10px] font-bold rounded flex items-center justify-center transition-all ${
                    language === "ml" ? "bg-emerald-600 text-white" : "text-text-muted"
                }`}
                >
                ML
                </button>
            </div>
            <button 
            className="text-text-primary"
            onClick={() => setIsOpen(!isOpen)}
            >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-card border-b border-border-color animate-fade-in shadow-2xl">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-base font-medium py-2 ${
                  pathname === link.href ? "text-emerald-400" : "text-text-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/login" 
              className="btn-primary w-full justify-center mt-2 py-3"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.login")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
