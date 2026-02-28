"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  PiSquaresFour, PiUsers, PiHouse, PiUserCheck, PiCalendarBlank,
  PiMegaphone, PiChartBar, PiGear, PiSignOut, PiList, PiX, PiCaretRight,
  PiWallet, PiReceipt, PiBank, PiListChecks
} from "react-icons/pi"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: PiSquaresFour },
  { href: "/dashboard/families", label: "Families", icon: PiHouse },
  { href: "/dashboard/members", label: "Members", icon: PiUsers },
  { href: "/dashboard/committees", label: "Committees", icon: PiUserCheck },
  { href: "/dashboard/events", label: "Events", icon: PiCalendarBlank },
  { href: "/dashboard/announcements", label: "Announcements", icon: PiMegaphone },
  { href: "/dashboard/finance/funds", label: "Funds", icon: PiBank },
  { href: "/dashboard/finance/incomes", label: "Incomes Check", icon: PiWallet },
  { href: "/dashboard/finance/expenses", label: "Expenses", icon: PiReceipt },
  { href: "/dashboard/finance/reports", label: "Finance Reports", icon: PiListChecks },
  { href: "/dashboard/reports", label: "General Reports", icon: PiChartBar },
  { href: "/dashboard/settings", label: "Settings", icon: PiGear },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    const { signOut } = await import("next-auth/react")
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex min-h-screen bg-bg-secondary w-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-bg-card border-r border-border-color flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border-color flex items-center justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-xl flex items-center justify-center text-xl shadow-inner">
              🕌
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary leading-tight">Muneerul Islam</h2>
              <p className="text-[11px] text-text-muted font-medium">Management System</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-muted hover:text-text-primary bg-bg-secondary p-1.5 rounded-md"
          >
            <PiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto w-full">
          <div className="mb-3 px-2">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Main Menu</p>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1.5 text-sm transition-all duration-200 group ${
                  isActive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold shadow-sm"
                    : "text-text-secondary hover:text-emerald-400 hover:bg-emerald-500/5 font-medium border border-transparent"
                }`}
              >
                <Icon size={20} className={isActive ? "text-emerald-400" : "text-text-muted group-hover:text-emerald-400 transition-colors"} />
                <span className="flex-1">{item.label}</span>
                {isActive && <PiCaretRight size={14} className="opacity-50" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border-color">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 hover:text-red-300 transition-all font-medium"
          >
            <PiSignOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen lg:ml-64 w-full">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-bg-card/80 backdrop-blur-md border-b border-border-color px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text-primary hover:text-emerald-400 transition-colors p-1"
            >
              <PiList size={26} />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text-muted">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-bg-secondary">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-x-hidden w-full max-w-[100vw]">
          {children}
        </div>
      </main>
    </div>
  )
}
