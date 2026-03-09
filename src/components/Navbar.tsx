"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { PiList, PiX } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"
import { useSession } from "next-auth/react"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const { data: _session, status } = useSession()
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full ${
        isOpen 
          ? "bg-bg-primary/95 backdrop-blur-xl border-b border-border-color py-4" 
          : scrolled 
            ? "bg-bg-primary/80 backdrop-blur-lg border-b border-border-color/50 py-3 shadow-premium" 
            : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-emerald-400/30 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-500 shadow-premium overflow-hidden bg-white p-1">
            <Image src="/logo.png" alt="Muneerul Islam Logo" width={44} height={44} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-body-lg sm:text-h4 font-black gradient-text leading-none tracking-tighter">Muneerul Islam</span>
            <span className="arabic-text gradient-text text-tiny sm:text-xs-label text-emerald-500/80 leading-tight font-bold">منیر الاسلام</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-small font-bold tracking-wide transition-all duration-300 hover:text-emerald-500 relative group/link ${
                  pathname === link.href ? "text-emerald-500" : "text-text-primary/70"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${
                  pathname === link.href ? "w-full" : "w-0 group-hover/link:w-2/3"
                }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <div className="flex items-center bg-bg-card border border-border-color rounded-lg p-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 text-xs-label font-bold rounded-md transition-all ${
                  language === "en" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("ml")}
                className={`px-3 py-1.5 text-xs-label font-bold rounded-md transition-all ${
                  language === "ml" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                }`}
              >
                ML
              </button>
            </div>
          </div>

          {status === "authenticated" ? (
            <Link href="/dashboard" className="btn-primary text-xs-label py-2 px-6 ml-2">
              {t("dashboard.nav.dashboard")}
            </Link>
          ) : (
            <Link href="/login" className="btn-primary text-xs-label py-2 px-6 ml-2">
              {t("nav.login")}
            </Link>
          )}
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile Language Toggle */}
          <div className="hidden sm:flex items-center bg-bg-card border border-border-color rounded-lg p-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 text-tiny font-bold rounded flex items-center justify-center transition-all ${
                language === "en" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ml")}
              className={`px-2 py-1 text-tiny font-bold rounded flex items-center justify-center transition-all ${
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
        <div className="lg:hidden absolute top-full left-0 right-0 h-[calc(100vh-70px)] bg-bg-primary z-[100] animate-fade-in origin-top overflow-y-auto isolate">
          <div className="flex flex-col p-4 sm:p-6 gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-body font-semibold px-4 py-3 rounded-lg transition-colors ${
                  pathname === link.href ? "text-emerald-400 bg-emerald-500/10" : "text-text-secondary hover:bg-bg-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Menu Language Toggle */}
            <div className="px-4 py-2 border-t border-border-color mt-2 pt-4">
              <span className="text-xs-label font-semibold text-text-secondary uppercase tracking-wider mb-3 block">
                {language === "ml" ? "ഭാഷ തിരഞ്ഞെടുക്കുക" : "Select Language"}
              </span>
              <div className="flex items-center bg-bg-card border border-border-color rounded-lg p-1 gap-1 w-fit">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 text-tiny font-bold rounded-md transition-all ${
                    language === "en" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("ml")}
                  className={`px-4 py-2 text-tiny font-bold rounded-md transition-all ${
                    language === "ml" ? "bg-emerald-600 text-white shadow-sm" : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  മലയാളം
                </button>
              </div>
            </div>
            
            <div className="px-4 mt-2">
              {status === "authenticated" ? (
                <Link 
                  href="/dashboard" 
                  className="btn-primary w-full justify-center py-3.5 text-small"
                  onClick={() => setIsOpen(false)}
                >
                  {t("dashboard.nav.dashboard")}
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="btn-primary w-full justify-center py-3.5 text-small"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
