"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  PiUsersDuotone, PiHouseDuotone, PiUserCheckDuotone, PiTrendUpDuotone, PiGlobeDuotone,
  PiArrowRight, PiPlusBold, PiPulseDuotone, PiHouseLight
} from "react-icons/pi"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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
      icon: PiHouseDuotone,
      color: "#10b981",
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
      textClass: "text-emerald-500",
      href: "/dashboard/families"
    },
    {
      label: "Total Members",
      value: data?.overview?.totalMembers || 0,
      icon: PiUsersDuotone,
      color: "#3b82f6",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/20",
      textClass: "text-blue-500",
      href: "/dashboard/members"
    },
    {
      label: "Committees",
      value: data?.overview?.totalCommittees || 0,
      icon: PiUserCheckDuotone,
      color: "#f59e0b",
      bgClass: "bg-amber-500/10",
      borderClass: "border-amber-500/20",
      textClass: "text-amber-500",
      href: "/dashboard/committees"
    },
    {
      label: "Males",
      value: data?.overview?.maleCount || 0,
      icon: PiTrendUpDuotone,
      color: "#8b5cf6",
      bgClass: "bg-violet-500/10",
      borderClass: "border-violet-500/20",
      textClass: "text-violet-500",
      href: "/dashboard/reports"
    },
    {
      label: "Females",
      value: data?.overview?.femaleCount || 0,
      icon: PiTrendUpDuotone,
      color: "#ec4899",
      bgClass: "bg-pink-500/10",
      borderClass: "border-pink-500/20",
      textClass: "text-pink-500",
      href: "/dashboard/reports"
    },
    {
      label: "Abroad",
      value: data?.overview?.abroadCount || 0,
      icon: PiGlobeDuotone,
      color: "#06b6d4",
      bgClass: "bg-cyan-500/10",
      borderClass: "border-cyan-500/20",
      textClass: "text-cyan-500",
      href: "/dashboard/members"
    },
  ]

  if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Dashboard</h1>
          <p className="text-text-secondary text-sm sm:text-base mt-1">
            Overview of Muneerul Islam Mahallu
          </p>
        </div>
        <Link href="/dashboard/families" className="btn-primary shrink-0 w-full sm:w-auto justify-center">
          <PiPlusBold size={18} />
          Add Family
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 w-full">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`glass-card p-5 sm:p-6 hover:-translate-y-1 transition-transform animate-fade-in stagger-${i+1} group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${stat.bgClass} border ${stat.borderClass} flex items-center justify-center`}>
                  <Icon size={24} className={stat.textClass} />
                </div>
                <PiArrowRight size={20} className="text-text-muted group-hover:text-text-primary transition-colors" />
              </div>
              <p className={`text-2xl sm:text-3xl font-bold mb-1 ${stat.textClass}`}>{stat.value}</p>
              <p className="text-xs sm:text-sm font-medium text-text-secondary">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Demographics Chart & Recent Families */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-8">
        
        {/* Demographics Chart */}
        <div className="glass-card p-5 sm:p-6 flex flex-col h-[400px]">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-text-primary">
            <PiUsersDuotone size={22} className="text-emerald-400" />
            Member Demographics
          </h3>
          <div className="flex-1 w-full min-h-0">
             {data ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Males', count: data.overview.maleCount, fill: '#10b981' },
                    { name: 'Females', count: data.overview.femaleCount, fill: '#f59e0b' },
                    { name: 'Abroad', count: data.overview.abroadCount, fill: '#3b82f6' },
                    { name: 'Voters', count: data.overview.voterCount, fill: '#8b5cf6' }
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4a" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                      contentStyle={{ backgroundColor: '#1a2332', borderColor: '#2a3a4a', borderRadius: '12px', color: '#f1f5f9' }} 
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">Loading chart...</div>
              )}
          </div>
        </div>

        {/* Recent Families */}
        <div className="glass-card p-5 sm:p-6 overflow-hidden flex flex-col h-[400px]">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <PiHouseDuotone size={22} className="text-emerald-400" />
            Recent Families
          </h3>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
            {data?.recentFamilies?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-bg-primary/50 text-text-primary rounded-xl border border-dashed border-border-color h-full">
                <PiHouseLight size={32} className="text-text-muted mb-3" />
                <p className="text-text-muted text-sm font-medium">No families registered yet</p>
              </div>
            )}
            {data?.recentFamilies?.map((family) => (
              <Link
                key={family.id}
                href={`/dashboard/families/${family.id}`}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-bg-primary border border-border-color hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all group shrink-0"
              >
                <div>
                  <p className="text-sm sm:text-base font-bold text-text-primary group-hover:text-emerald-400 transition-colors">{family.houseName}</p>
                  <p className="text-xs sm:text-sm text-text-muted font-medium mt-0.5 flex items-center gap-1.5">
                    <span className="bg-bg-secondary px-1.5 py-0.5 rounded text-text-secondary border border-border-color">{family.familyNumber}</span>
                    <span>·</span>
                    <span>{family._count.members} members</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge badge-emerald hidden sm:flex">{family._count.members} Members</span>
                  <PiArrowRight size={18} className="text-text-muted group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions at bottom */}
      <div className="glass-card p-5 sm:p-6 w-full">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-text-primary">
            <PiPulseDuotone size={22} className="text-gold" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Register Family", href: "/dashboard/families", icon: PiHouseDuotone, color: "emerald" },
              { label: "Add Member", href: "/dashboard/members", icon: PiUsersDuotone, color: "blue" },
              { label: "Committees", href: "/dashboard/committees", icon: PiUserCheckDuotone, color: "gold" },
              { label: "View Reports", href: "/dashboard/reports", icon: PiTrendUpDuotone, color: "violet" },
            ].map((action) => {
              const Icon = action.icon
              const colorClass = action.color === 'emerald' ? 'text-emerald-500 group-hover:text-emerald-400' :
                                 action.color === 'blue' ? 'text-blue-500 group-hover:text-blue-400' :
                                 action.color === 'gold' ? 'text-amber-500 group-hover:text-amber-400' : 'text-violet-500 group-hover:text-violet-400'
              
              const borderHover = action.color === 'emerald' ? 'hover:border-emerald-500/30' :
                                  action.color === 'blue' ? 'hover:border-blue-500/30' :
                                  action.color === 'gold' ? 'hover:border-amber-500/30' : 'hover:border-violet-500/30'
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-bg-primary border border-border-color ${borderHover} hover:shadow-md transition-all group`}
                >
                  <Icon size={24} className={colorClass} />
                  <span className="flex-1 text-sm font-bold text-text-primary transition-colors">{action.label}</span>
                  <PiArrowRight size={18} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )
            })}
          </div>
      </div>
    </div>
  )
}
