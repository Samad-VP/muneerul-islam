"use client"
import Link from "next/link"
import { PiSignOut, PiHouse, PiWallet } from "react-icons/pi"
import { signOut } from "next-auth/react"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-secondary w-full">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-bg-card/80 backdrop-blur-md border-b border-border-color px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-xl flex items-center justify-center text-xl shadow-inner">
            🕌
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary leading-tight">Family Portal</h2>
            <p className="text-[11px] text-text-muted font-medium">Muneerul Islam Mahallu</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <Link href="/portal" className="hover:text-emerald-400 flex items-center gap-2 transition-colors">
              <PiHouse size={18} /> My Family
            </Link>
          </nav>
          
          <div className="w-px h-6 bg-border-color hidden md:block"></div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <PiSignOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
