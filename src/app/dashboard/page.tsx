"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users, Home, UserCheck, TrendingUp, Globe, Vote,
  ArrowRight, Plus, Activity
} from "lucide-react"

interface ReportData {
  overview: {
    totalFamilies: number
    totalMembers: number
    totalCommittees: number
    maleCount: number
    femaleCount: number
    abroadCount: number
    voterCount: number
  }
  recentFamilies: Array<{
    id: string
    familyNumber: string
    houseName: string
    createdAt: string
    _count: { members: number }
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/reports")
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stats = [
    {
      label: "Total Families",
      value: data?.overview?.totalFamilies || 0,
      icon: Home,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
      href: "/dashboard/families"
    },
    {
      label: "Total Members",
      value: data?.overview?.totalMembers || 0,
      icon: Users,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)",
      href: "/dashboard/members"
    },
    {
      label: "Committees",
      value: data?.overview?.totalCommittees || 0,
      icon: UserCheck,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
      href: "/dashboard/committees"
    },
    {
      label: "Males",
      value: data?.overview?.maleCount || 0,
      icon: TrendingUp,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      border: "rgba(139,92,246,0.2)",
      href: "/dashboard/reports"
    },
    {
      label: "Females",
      value: data?.overview?.femaleCount || 0,
      icon: TrendingUp,
      color: "#ec4899",
      bg: "rgba(236,72,153,0.1)",
      border: "rgba(236,72,153,0.2)",
      href: "/dashboard/reports"
    },
    {
      label: "Abroad",
      value: data?.overview?.abroadCount || 0,
      icon: Globe,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.1)",
      border: "rgba(6,182,212,0.2)",
      href: "/dashboard/members"
    },
  ]

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "32px" }}>Dashboard</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton" style={{ height: "140px" }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Overview of Muneerul Islam Mahallu
          </p>
        </div>
        <Link href="/dashboard/families" className="btn-primary" style={{ textDecoration: "none" }}>
          <Plus size={18} />
          Add Family
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`glass-card animate-fade-in stagger-${i+1}`}
              style={{
                padding: "24px",
                textDecoration: "none",
                opacity: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: stat.bg, border: `1px solid ${stat.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
                <ArrowRight size={16} style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="stat-number" style={{ color: stat.color, marginBottom: "4px" }}>{stat.value}</p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Recent Families */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} style={{ color: "var(--emerald-400)" }} />
            Quick Actions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Register New Family", href: "/dashboard/families", icon: Home, color: "#10b981" },
              { label: "Add New Member", href: "/dashboard/members", icon: Users, color: "#3b82f6" },
              { label: "Manage Committees", href: "/dashboard/committees", icon: UserCheck, color: "#f59e0b" },
              { label: "View Reports", href: "/dashboard/reports", icon: TrendingUp, color: "#8b5cf6" },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 16px", borderRadius: "10px",
                    background: "var(--bg-primary)", border: "1px solid var(--border-color)",
                    textDecoration: "none", color: "var(--text-primary)",
                    fontSize: "14px", transition: "all 0.2s ease"
                  }}
                >
                  <Icon size={18} style={{ color: action.color }} />
                  <span style={{ flex: 1 }}>{action.label}</span>
                  <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Families */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Home size={18} style={{ color: "var(--emerald-400)" }} />
            Recent Families
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data?.recentFamilies?.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "20px" }}>
                No families registered yet
              </p>
            )}
            {data?.recentFamilies?.map((family) => (
              <Link
                key={family.id}
                href={`/dashboard/families/${family.id}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: "10px",
                  background: "var(--bg-primary)", border: "1px solid var(--border-color)",
                  textDecoration: "none", color: "var(--text-primary)",
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600 }}>{family.houseName}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {family.familyNumber} · {family._count.members} members
                  </p>
                </div>
                <span className="badge badge-emerald">{family._count.members}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
