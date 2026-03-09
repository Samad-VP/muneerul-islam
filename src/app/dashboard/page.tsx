"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  PiUsersDuotone, PiHouseDuotone, PiUserCheckDuotone, PiTrendUpDuotone, PiGlobeDuotone,
  PiArrowRight, PiPlusBold, PiPulseDuotone, PiHouseLight, PiIdentificationCardDuotone,
  PiTrophyDuotone, PiChartBar
} from "react-icons/pi"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useLanguage } from "@/context/LanguageContext"

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
  const { t } = useLanguage()

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
      color: "emerald",
      href: "/dashboard/families"
    },
    {
      label: "Total Members",
      value: data?.overview?.totalMembers || 0,
      icon: PiUsersDuotone,
      color: "blue",
      href: "/dashboard/members"
    },
    {
      label: "Committees",
      value: data?.overview?.totalCommittees || 0,
      icon: PiUserCheckDuotone,
      color: "gold",
      href: "/dashboard/committees"
    },
    {
      label: "Voters",
      value: data?.overview?.voterCount || 0,
      icon: PiIdentificationCardDuotone,
      color: "violet",
      href: "/dashboard/reports"
    },
    {
      label: "Abroad",
      value: data?.overview?.abroadCount || 0,
      icon: PiGlobeDuotone,
      color: "cyan",
      href: "/dashboard/members"
    },
    {
      label: "Growth",
      value: "+12%",
      icon: PiTrendUpDuotone,
      color: "emerald",
      href: "/dashboard/reports"
    },
  ]

  if (loading) {
    return (
      <div className="w-full space-y-8">
        <div className="h-12 w-48 skeleton rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton h-40 rounded-[2rem]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tighter">
            System <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-text-primary/60 text-sm sm:text-base mt-2 font-bold uppercase tracking-widest">
            {t("dashboard.nav.managementSystem")}
          </p>
        </div>
        <Link href="/dashboard/families" className="btn-primary shrink-0 w-full sm:w-auto justify-center py-4 px-8 rounded-2xl glow-effect text-base">
          <PiPlusBold size={20} />
          Add Family
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          const colorClass = stat.color === 'emerald' ? 'text-emerald-500' :
                             stat.color === 'blue' ? 'text-blue-500' :
                             stat.color === 'gold' ? 'text-gold' :
                             stat.color === 'violet' ? 'text-violet-500' : 'text-cyan-500'
          
          const bgClass = stat.color === 'emerald' ? 'bg-emerald-500/10' :
                          stat.color === 'blue' ? 'bg-blue-500/10' :
                          stat.color === 'gold' ? 'bg-gold/10' :
                          stat.color === 'violet' ? 'bg-violet-500/10' : 'bg-cyan-500/10'

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`glass-card p-8 group relative overflow-hidden rounded-[2rem] border-border-color/30 hover:shadow-premium transition-all duration-500 animate-fade-in stagger-${i+1}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={28} className={colorClass} />
                </div>
                <div className="w-10 h-10 rounded-full border border-border-color/30 flex items-center justify-center text-text-primary/20 group-hover:text-emerald-500 group-hover:border-emerald-500/30 transition-all duration-500">
                  <PiArrowRight size={20} />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className={`text-4xl font-black ${colorClass} tracking-tighter`}>{stat.value}</p>
                <p className="text-sm font-black text-text-primary/50 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Demographics & Recent Families */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* Demographics Chart */}
        <div className="lg:col-span-7 glass-card p-8 sm:p-10 flex flex-col h-[500px] rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/20 via-gold/20 to-emerald-500/20" />
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black flex items-center gap-3 text-text-primary uppercase tracking-widest text-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <PiChartBar size={18} />
              </div>
              Member Demographics
            </h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-gold" />
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
             {data ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Males', count: data.overview.maleCount, color: '#10b981' },
                    { name: 'Females', count: data.overview.femaleCount, color: '#f59e0b' },
                    { name: 'Abroad', count: data.overview.abroadCount, color: '#3b82f6' },
                    { name: 'Voters', count: data.overview.voterCount, color: '#8b5cf6' }
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(16, 185, 129, 0.03)' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="glass-card p-4 border-none shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                              <p className="text-[10px] font-black uppercase tracking-widest text-text-primary/40 mb-1">{label}</p>
                              <p className="text-lg font-black text-emerald-500">
                                {payload[0].value} <span className="text-[10px] text-text-primary/20 uppercase tracking-tighter">Individuals</span>
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="count" radius={[12, 12, 4, 4]} barSize={40}>
                      {[
                        { name: 'Males', count: data.overview.maleCount, color: '#10b981' },
                        { name: 'Females', count: data.overview.femaleCount, color: '#f59e0b' },
                        { name: 'Abroad', count: data.overview.abroadCount, color: '#3b82f6' },
                        { name: 'Voters', count: data.overview.voterCount, color: '#8b5cf6' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">Loading chart...</div>
              )}
          </div>
        </div>

        {/* Recent Families */}
        <div className="lg:col-span-5 glass-card p-8 sm:p-10 flex flex-col h-[500px] rounded-[2.5rem] relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black flex items-center gap-3 text-text-primary uppercase tracking-widest text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <PiHouseDuotone size={18} />
              </div>
              Recent Families
            </h3>
            <Link href="/dashboard/families" className="text-xs font-black text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors uppercase tracking-widest">
              See All
              <PiArrowRight size={14} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {!data || data.recentFamilies?.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center bg-bg-secondary/40 dark:bg-bg-secondary/10 rounded-[2rem] border border-dashed border-border-color/50">
                <div className="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center text-text-primary/10 mb-6 border border-border-color/30 shadow-inner">
                  <PiHouseLight size={40} />
                </div>
                <p className="text-text-primary/40 font-bold text-sm tracking-tight">{loading ? "Synchronizing Data..." : "No families registered yet"}</p>
              </div>
            ) : (
              data.recentFamilies.map((family) => (
                <Link
                  key={family.id}
                  href={`/dashboard/families/${family.id}`}
                  className="flex items-center justify-between p-5 rounded-2xl bg-bg-card hover:bg-bg-card-hover border border-border-color/20 hover:border-emerald-500/30 hover:shadow-premium transition-all group shrink-0 backdrop-blur-md"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-base sm:text-lg font-black text-text-primary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate tracking-tight">{family.houseName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-primary/40 py-1 px-3 rounded-full bg-bg-secondary/50 dark:bg-bg-primary/30 border border-border-color/30">{family.familyNumber}</span>
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <PiUsersDuotone size={14} />
                        {family._count.members}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-bg-secondary/50 dark:bg-bg-card flex items-center justify-center text-text-primary/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm shrink-0 border border-border-color/10">
                    <PiArrowRight size={18} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions at bottom */}
      <div className="glass-card p-10 sm:p-14 w-full rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10" />
          <h3 className="text-xl font-black flex items-center gap-3 text-text-primary uppercase tracking-widest text-xs mb-10">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
              <PiPulseDuotone size={18} />
            </div>
            Quick Command Center
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Register Family", href: "/dashboard/families", icon: PiPlusBold, color: "emerald", desc: "Add new family record" },
              { label: "Community", href: "/dashboard/members", icon: PiUsersDuotone, color: "blue", desc: "Manage all members" },
              { label: "Leadership", href: "/dashboard/committees", icon: PiTrophyDuotone, color: "gold", desc: "Committee management" },
              { label: "Statistics", href: "/dashboard/reports", icon: PiTrendUpDuotone, color: "violet", desc: "System wide reports" },
            ].map((action) => {
              const Icon = action.icon
              const colorClass = action.color === 'emerald' ? 'text-emerald-500 group-hover:text-emerald-400' :
                                 action.color === 'blue' ? 'text-blue-500 group-hover:text-blue-400' :
                                 action.color === 'gold' ? 'text-gold group-hover:text-gold' : 'text-violet-500 group-hover:text-violet-400'
              
              const borderHover = action.color === 'emerald' ? 'hover:border-emerald-500/30' :
                                  action.color === 'blue' ? 'hover:border-blue-500/30' :
                                  action.color === 'gold' ? 'hover:border-gold/30' : 'hover:border-violet-500/30'
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col gap-5 p-8 rounded-3xl bg-bg-primary/50 border border-border-color/30 ${borderHover} hover:shadow-premium transition-all duration-500 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon size={32} className={`${colorClass} transition-all duration-500 group-hover:scale-110 relative z-10`} />
                  <div className="relative z-10">
                    <span className="block text-lg font-black text-text-primary mb-1 tracking-tight">{action.label}</span>
                    <span className="block text-xs font-bold text-text-primary/40 uppercase tracking-widest leading-relaxed">{action.desc}</span>
                  </div>
                </Link>
              )
            })}
          </div>
      </div>
    </div>
  )
}
