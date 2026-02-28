"use client"
import { useEffect, useState } from "react"
import { PiChartBarDuotone, PiSpinner, PiUsersDuotone, PiHouseDuotone, PiUserCheckDuotone, PiGlobeDuotone, PiCheckSquareOffsetDuotone } from "react-icons/pi"

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
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 gradient-text">Reports & Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-[300px] rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const overview = data?.overview || {}
  const charts = data?.charts || {}

  const BarChartSimple = ({ data, title, color }: { data: any[]; title: string; color: string }) => {
    const maxVal = Math.max(...data.map((d: any) => d.value), 1)
    return (
      <div className="glass-card p-5 sm:p-6 w-full">
        <h3 className="text-base sm:text-lg font-bold mb-5 flex items-center gap-2 text-text-primary">
          <PiChartBarDuotone size={20} className="text-emerald-400" />
          {title}
        </h3>
        <div className="flex flex-col gap-3">
          {data.map((item: any, i: number) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5 font-medium">
                <span className="text-xs sm:text-sm text-text-secondary">{item.name || "Unknown"}</span>
                <span className="text-xs sm:text-sm" style={{ color }}>{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-bg-secondary overflow-hidden">
                <div style={{
                  height: "100%", borderRadius: "4px",
                  width: `${(item.value / maxVal) * 100}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}80)`,
                  transition: "width 1s ease"
                }} />
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="text-text-muted text-sm text-center py-5">No data available</p>}
        </div>
      </div>
    )
  }

  const PieChartSimple = ({ data, title, colors }: { data: any[]; title: string; colors: string[] }) => {
    const total = data.reduce((acc: number, d: any) => acc + d.value, 0) || 1
    return (
      <div className="glass-card p-5 sm:p-6 w-full flex flex-col items-center">
        <h3 className="text-base sm:text-lg font-bold mb-6 w-full text-left text-text-primary">{title}</h3>
        <div className="flex justify-center mb-6">
          <div style={{
            width: "140px", height: "140px", borderRadius: "50%",
            background: `conic-gradient(${data.map((d: any, i: number) => {
              const startPct = data.slice(0, i).reduce((a: number, x: any) => a + (x.value / total) * 100, 0)
              const endPct = startPct + (d.value / total) * 100
              return `${colors[i % colors.length]} ${startPct}% ${endPct}%`
            }).join(", ")})`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div className="w-[85px] h-[85px] rounded-full bg-bg-card flex flex-col items-center justify-center shadow-inner">
              <span className="text-xl sm:text-2xl font-extrabold text-text-primary leading-none">{total}</span>
              <span className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wider font-semibold">Total</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center w-full">
          {data.map((d: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[i % colors.length] }} />
              <span className="text-xs font-medium text-text-secondary">{d.name}: <strong className="text-text-primary">{d.value}</strong></span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Reports & Analytics</h1>
        <p className="text-text-secondary text-sm mt-1 sm:mt-2">Community statistics and insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
        {[
          { label: "Families", value: overview.totalFamilies, icon: PiHouseDuotone, color: "#10b981" },
          { label: "Members", value: overview.totalMembers, icon: PiUsersDuotone, color: "#3b82f6" },
          { label: "Committees", value: overview.totalCommittees, icon: PiUserCheckDuotone, color: "#f59e0b" },
          { label: "Males", value: overview.maleCount, icon: PiUsersDuotone, color: "#8b5cf6" },
          { label: "Females", value: overview.femaleCount, icon: PiUsersDuotone, color: "#ec4899" },
          { label: "Abroad", value: overview.abroadCount, icon: PiGlobeDuotone, color: "#06b6d4" },
          { label: "Voters", value: overview.voterCount, icon: PiCheckSquareOffsetDuotone, color: "#f97316" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass-card p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
               <div className="p-2 sm:p-2.5 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${s.color}15` }}>
                 <Icon size={24} style={{ color: s.color }} />
               </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: s.color }}>{s.value || 0}</p>
              <p className="text-[11px] sm:text-xs font-semibold text-text-secondary mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full">
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
        <div className="lg:col-span-2">
           <BarChartSimple
            title="Top Occupations"
            data={charts.occupationDistribution || []}
            color="#f59e0b"
          />
        </div>
      </div>
    </div>
  )
}
