"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  PiSquaresFour, PiUsers, PiHouse, PiUserCheck, PiCalendarBlank,
  PiMegaphone, PiChartBar, PiGear, PiSignOut, PiList, PiX, PiCaretRight,
  PiWallet, PiReceipt, PiBank, PiListChecks, PiGlobeDuotone
} from "react-icons/pi"
import ThemeToggle from "@/components/ThemeToggle"
import { useLanguage } from "@/context/LanguageContext"

const navItems = [
  { href: "/", labelKey: "dashboard.nav.home", icon: PiGlobeDuotone },
  { href: "/dashboard", labelKey: "dashboard.nav.dashboard", icon: PiSquaresFour },
  { href: "/dashboard/families", labelKey: "dashboard.nav.families", icon: PiHouse },
  { href: "/dashboard/members", labelKey: "dashboard.nav.members", icon: PiUsers },
  { href: "/dashboard/committees", labelKey: "dashboard.nav.committees", icon: PiUserCheck },
  { href: "/dashboard/events", labelKey: "dashboard.nav.events", icon: PiCalendarBlank },
  { href: "/dashboard/announcements", labelKey: "dashboard.nav.announcements", icon: PiMegaphone },
  { href: "/dashboard/finance/funds", labelKey: "dashboard.nav.funds", icon: PiBank },
  { href: "/dashboard/finance/incomes", labelKey: "dashboard.nav.incomes", icon: PiWallet },
  { href: "/dashboard/finance/expenses", labelKey: "dashboard.nav.expenses", icon: PiReceipt },
  { href: "/dashboard/finance/reports", labelKey: "dashboard.nav.financeReports", icon: PiListChecks },
  { href: "/dashboard/reports", labelKey: "dashboard.nav.generalReports", icon: PiChartBar },
  { href: "/dashboard/settings", labelKey: "dashboard.nav.settings", icon: PiGear },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    const { signOut } = await import("next-auth/react")
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex min-h-screen bg-bg-secondary w-full relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-4 left-4 bottom-4 z-50 w-72 bg-bg-card/90 backdrop-blur-xl border border-border-color/50 rounded-[2rem] flex flex-col transition-all duration-500 ease-in-out shadow-premium lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-8 border-b border-border-color/30 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-4 group min-w-0 flex-1">
            <div className="w-12 h-12 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-premium overflow-hidden bg-white shrink-0 group-hover:scale-105 transition-transform duration-500 p-1">
              <Image src="/logo.png" alt="Muneerul Islam Logo" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-body-lg font-black text-text-primary leading-tight tracking-tight truncate">Muneerul Islam</h2>
              <p className="text-tiny text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest truncate">{t("dashboard.nav.managementSystem")}</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-muted hover:text-text-primary bg-bg-secondary/50 p-2 rounded-xl transition-colors"
          >
            <PiX size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto w-full custom-scrollbar">
          <div className="mb-6 px-3">
            <p className="text-tiny font-black text-text-primary/40 uppercase tracking-[0.2em]">{t("dashboard.nav.mainMenu")}</p>
          </div>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-small transition-all duration-300 group ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-black shadow-sm"
                      : "text-text-primary/60 hover:text-text-primary hover:bg-bg-secondary/80 font-bold border border-transparent"
                  }`}
                >
                  <Icon size={22} className={isActive ? "text-emerald-500" : "text-text-primary/40 group-hover:text-emerald-500 transition-colors"} />
                  <span className="flex-1">{t(item.labelKey)}</span>
                  {isActive && <PiCaretRight size={14} className="opacity-50 group-hover:translate-x-1 transition-transform" />}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-border-color/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-small text-rose-500 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-300 font-black shadow-sm"
          >
            <PiSignOut size={22} />
            <span>{t("dashboard.nav.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen lg:ml-80 w-full p-4 lg:p-6">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-bg-card/70 backdrop-blur-xl border border-border-color/50 rounded-[2rem] px-6 sm:px-10 py-5 flex items-center justify-between shadow-premium mb-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text-primary hover:text-emerald-500 transition-colors p-2 bg-bg-secondary/50 rounded-xl"
            >
              <PiList size={26} />
            </button>
            <div className="hidden sm:block">
              <p className="text-small font-black text-text-primary/60 uppercase tracking-widest bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <div className="flex items-center bg-bg-secondary/50 border border-border-color/30 rounded-xl p-1 gap-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 text-tiny font-black rounded-lg transition-all ${
                  language === "en" ? "bg-emerald-600 text-white shadow-premium" : "text-text-primary/50 hover:text-text-primary"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("ml")}
                className={`px-4 py-2 text-tiny font-black rounded-lg transition-all ${
                  language === "ml" ? "bg-emerald-600 text-white shadow-premium" : "text-text-primary/50 hover:text-text-primary"
                }`}
              >
                ML
              </button>
            </div>

            <Link 
              href="/dashboard/settings"
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-base font-black text-white shadow-premium ring-4 ring-emerald-500/10 ml-2 cursor-pointer hover:scale-110 transition-transform"
            >
              A
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-0 sm:p-4 flex-1 overflow-x-hidden w-full max-w-[100vw] animate-fade-in relative">
          {children}
        </div>
      </main>
    </div>
  )
}
