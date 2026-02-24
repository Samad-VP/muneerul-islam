"use client"
import { useEffect, useState } from "react"
import { BarChart3, Loader2, Users, Home, UserCheck, Globe, Vote } from "lucide-react"

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/reports")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "32px" }} className="gradient-text">Reports & Analytics</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: "300px" }} />)}
        </div>
      </div>
    )
  }

  const overview = data?.overview || {}
  const charts = data?.charts || {}

  const BarChartSimple = ({ data, title, color }: { data: any[]; title: string; color: string }) => {
    const maxVal = Math.max(...data.map((d: any) => d.value), 1)
    return (
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <BarChart3 size={18} style={{ color: "var(--emerald-400)" }} />
          {title}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {data.map((item: any, i: number) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item.name || "Unknown"}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color }}>{item.value}</span>
              </div>
              <div style={{ height: "8px", borderRadius: "4px", background: "var(--bg-primary)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "4px",
                  width: `${(item.value / maxVal) * 100}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}80)`,
                  transition: "width 1s ease"
                }} />
              </div>
            </div>
          ))}
          {data.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "20px" }}>No data available</p>}
        </div>
      </div>
    )
  }

  const PieChartSimple = ({ data, title, colors }: { data: any[]; title: string; colors: string[] }) => {
    const total = data.reduce((acc: number, d: any) => acc + d.value, 0) || 1
    return (
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>{title}</h3>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{
            width: "160px", height: "160px", borderRadius: "50%",
            background: `conic-gradient(${data.map((d: any, i: number) => {
              const startPct = data.slice(0, i).reduce((a: number, x: any) => a + (x.value / total) * 100, 0)
              const endPct = startPct + (d.value / total) * 100
              return `${colors[i % colors.length]} ${startPct}% ${endPct}%`
            }).join(", ")})`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              width: "100px", height: "100px", borderRadius: "50%",
              background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column"
            }}>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>{total}</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Total</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
          {data.map((d: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: colors[i % colors.length] }} />
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{d.name}: {d.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">Reports & Analytics</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>Community statistics and insights</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Families", value: overview.totalFamilies, icon: Home, color: "#10b981" },
          { label: "Members", value: overview.totalMembers, icon: Users, color: "#3b82f6" },
          { label: "Committees", value: overview.totalCommittees, icon: UserCheck, color: "#f59e0b" },
          { label: "Males", value: overview.maleCount, icon: Users, color: "#8b5cf6" },
          { label: "Females", value: overview.femaleCount, icon: Users, color: "#ec4899" },
          { label: "Abroad", value: overview.abroadCount, icon: Globe, color: "#06b6d4" },
          { label: "Voters", value: overview.voterCount, icon: Vote, color: "#f97316" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass-card" style={{ padding: "20px", textAlign: "center" }}>
              <Icon size={20} style={{ color: s.color, margin: "0 auto 8px" }} />
              <p style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value || 0}</p>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <PieChartSimple
          title="Gender Distribution"
          data={charts.genderDistribution || []}
          colors={["#3b82f6", "#ec4899"]}
        />
        <BarChartSimple
          title="Age Groups"
          data={charts.ageGroupDistribution || []}
          color="#10b981"
        />
        <BarChartSimple
          title="Education Levels"
          data={charts.educationDistribution || []}
          color="#8b5cf6"
        />
        <PieChartSimple
          title="Blood Group Distribution"
          data={charts.bloodGroupDistribution || []}
          colors={["#ef4444", "#f97316", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"]}
        />
        <BarChartSimple
          title="Top Occupations"
          data={charts.occupationDistribution || []}
          color="#f59e0b"
        />
      </div>
    </div>
  )
}
