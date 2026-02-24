"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Users, Home, UserCheck, Calendar,
  Megaphone, BarChart3, Settings, LogOut, Menu, X, ChevronRight
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/families", label: "Families", icon: Home },
  { href: "/dashboard/members", label: "Members", icon: Users },
  { href: "/dashboard/committees", label: "Committees", icon: UserCheck },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    const { signOut } = await import("next-auth/react")
    signOut({ callbackUrl: "/" })
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 40, display: "none"
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : undefined,
          transition: "transform 0.3s ease",
        }}
      >
        {/* Logo */}
        <div style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--border-color)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "42px", height: "42px",
              background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px"
            }}>
              🕌
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                Muneerul Islam
              </h2>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <div style={{ marginBottom: "8px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 8px", marginBottom: "8px" }}>
              Menu
            </p>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--emerald-400)" : "var(--text-secondary)",
                  background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  border: isActive ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
                }}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid var(--border-color)" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "10px", width: "100%",
              fontSize: "14px", color: "#f87171", background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.15)", cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: "260px", minHeight: "100vh" }}>
        {/* Top bar */}
        <header style={{
          padding: "16px 32px",
          borderBottom: "1px solid var(--border-color)",
          background: "var(--bg-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: "none", // Show only on mobile via media query if needed
              background: "none", border: "none", color: "var(--text-primary)",
              cursor: "pointer",
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--emerald-600), var(--emerald-800))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: 700, color: "white"
            }}>
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  )
}
