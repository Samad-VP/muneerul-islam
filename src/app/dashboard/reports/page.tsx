"use client"
import { useEffect, useState } from "react"
import { 
  PiChartBarDuotone, 
  PiUsersDuotone, 
  PiHouseDuotone, 
  PiUserCheckDuotone, 
  PiGlobeDuotone, 
  PiCheckSquareOffsetDuotone,
  PiSpinner,
  PiTrendUpBold,
  PiGenderMaleBold,
  PiGenderFemaleBold,
  PiGraduationCapDuotone,
  PiBriefcaseDuotone,
  PiDropDuotone,
  PiCalendarBlankDuotone
} from "react-icons/pi"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts"

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
      <div className="w-full flex flex-col items-center justify-center p-24 bg-bg-primary rounded-[2.5rem]">
        <PiSpinner size={48} className="animate-spin text-emerald-500 mb-6" />
        <p className="text-tiny font-black uppercase tracking-[0.3em] text-text-primary/30">Analytics Engine Warming Up...</p>
      </div>
    )
  }

  const overview = data?.overview || {}
  const charts = data?.charts || {}

  const COLORS = [
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#ef4444'  // Red
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border-none shadow-2xl bg-gray-900/90 backdrop-blur-xl">
          <p className="text-tiny font-black uppercase tracking-widest text-white/40 mb-1">{label}</p>
          <p className="text-body-lg font-black text-emerald-400">
            {payload[0].value} <span className="text-tiny text-white/20 uppercase tracking-tighter">Individuals</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="animate-fade-in w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 w-full">
        <div>
          <h1 className="text-h3 sm:text-h2 font-black text-text-primary tracking-tighter uppercase">
            Community <span className="gradient-text">Insights</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-tiny font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Population Metrics
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-bg-secondary/50 px-6 py-4 rounded-2xl border border-border-color/10">
          <PiTrendUpBold size={20} className="text-emerald-500" />
          <span className="text-tiny font-black uppercase tracking-widest text-text-primary/60">Data Health: 100% Verified</span>
        </div>
      </div>

      {/* High-Impact Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
        {[
          { label: "Families", value: overview.totalFamilies, icon: PiHouseDuotone, color: "#10b981", bg: "bg-emerald-500/10" },
          { label: "Total Pop", value: overview.totalMembers, icon: PiUsersDuotone, color: "#3b82f6", bg: "bg-blue-500/10" },
          { label: "Males", value: overview.maleCount, icon: PiGenderMaleBold, color: "#0ea5e9", bg: "bg-sky-500/10" },
          { label: "Females", value: overview.femaleCount, icon: PiGenderFemaleBold, color: "#ec4899", bg: "bg-pink-500/10" },
          { label: "Abroad", value: overview.abroadCount, icon: PiGlobeDuotone, color: "#06b6d4", bg: "bg-cyan-500/10" },
          { label: "Voters", value: overview.voterCount, icon: PiCheckSquareOffsetDuotone, color: "#f97316", bg: "bg-orange-500/10" },
          { label: "Admins", value: overview.totalCommittees, icon: PiUserCheckDuotone, color: "#f59e0b", bg: "bg-amber-500/10" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass-card p-6 border-none shadow-premium flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-all duration-500">
               <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${s.bg}`}>
                 <Icon size={24} style={{ color: s.color }} />
               </div>
              <p className="text-h4 font-black tracking-tight text-text-primary leading-none mb-1.5">{s.value || 0}</p>
              <p className="text-tiny font-black text-text-primary/30 uppercase tracking-[0.2em]">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-6 gap-8">
        
        {/* Gender Portfolio */}
        <div className="xl:col-span-2 glass-card p-6 sm:p-10 rounded-[2.5rem] border-none shadow-premium flex flex-col min-h-[400px] sm:min-h-[450px]">
          <div className="flex items-center gap-4 mb-6 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-bg-secondary flex items-center justify-center text-rose-500">
               <PiGenderMaleBold size={20} className="sm:size-[24px] text-blue-500" />
               <PiGenderFemaleBold size={20} className="sm:size-[24px] -ml-2 text-pink-500" />
            </div>
            <div>
              <h2 className="text-small sm:text-body-lg font-black text-text-primary tracking-tight uppercase">Population Mix</h2>
              <p className="text-[10px] sm:text-tiny font-black text-text-primary/40 uppercase tracking-widest mt-1">Gender Balance Analysis</p>
            </div>
          </div>
          
          <div className="flex-1 relative flex flex-col items-center justify-center">
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.genderDistribution}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={10}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ec4899" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-4">
              <span className="text-tiny font-black uppercase tracking-[0.3em] text-text-primary/20">Aggregate</span>
              <span className="text-h3 font-black text-text-primary tracking-tighter">{overview.totalMembers}</span>
            </div>
            
            <div className="flex gap-10 mt-8">
               <div className="flex flex-col items-center">
                  <span className="text-blue-500 font-black text-body-lg">{((overview.maleCount / overview.totalMembers) * 100).toFixed(1)}%</span>
                  <span className="text-tiny font-black text-text-primary/30 uppercase tracking-widest">Male</span>
               </div>
               <div className="flex flex-col items-center">
                  <span className="text-pink-500 font-black text-body-lg">{((overview.femaleCount / overview.totalMembers) * 100).toFixed(1)}%</span>
                  <span className="text-tiny font-black text-text-primary/30 uppercase tracking-widest">Female</span>
               </div>
            </div>
          </div>
        </div>

        {/* Age Demographics */}
        <div className="xl:col-span-4 glass-card p-6 sm:p-10 rounded-[2.5rem] border-none shadow-premium flex flex-col min-h-[400px] sm:min-h-[450px]">
          <div className="flex items-center gap-4 mb-6 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-bg-secondary flex items-center justify-center text-emerald-500">
               <PiCalendarBlankDuotone size={20} className="sm:size-[24px]" />
            </div>
            <div>
              <h2 className="text-small sm:text-body-lg font-black text-text-primary tracking-tight uppercase">Age Maturity</h2>
              <p className="text-[10px] sm:text-tiny font-black text-text-primary/40 uppercase tracking-widest mt-1">Generation-wise Population Distribution</p>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.ageGroupDistribution}>
                <defs>
                  <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888888', fontSize: 10, fontWeight: 900 }} 
                  dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#888888', fontSize: 10, fontWeight: 900 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorAge)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Education & Careers */}
        <div className="xl:col-span-3 glass-card p-6 sm:p-10 rounded-[2.5rem] border-none shadow-premium min-h-[450px] sm:min-h-[500px] flex flex-col">
          <div className="flex items-center gap-4 mb-6 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-bg-secondary flex items-center justify-center text-purple-500">
               <PiGraduationCapDuotone size={20} className="sm:size-[24px]" />
            </div>
            <div>
              <h2 className="text-small sm:text-body-lg font-black text-text-primary tracking-tight uppercase">Intellectual Capital</h2>
              <p className="text-[10px] sm:text-tiny font-black text-text-primary/40 uppercase tracking-widest mt-1">Educational Background Statistics</p>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.educationDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#88888810" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888888', fontSize: 9, fontWeight: 900 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {charts.educationDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Inventory Distribution */}
        <div className="xl:col-span-3 glass-card p-6 sm:p-10 rounded-[2.5rem] border-none shadow-premium min-h-[450px] sm:min-h-[500px] flex flex-col">
           <div className="flex items-center gap-4 mb-6 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-bg-secondary flex items-center justify-center text-rose-500">
               <PiDropDuotone size={20} className="sm:size-[24px]" />
            </div>
            <div>
              <h2 className="text-small sm:text-body-lg font-black text-text-primary tracking-tight uppercase">Blood Registry</h2>
              <p className="text-[10px] sm:text-tiny font-black text-text-primary/40 uppercase tracking-widest mt-1">Availability by Blood Group</p>
            </div>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.bloodGroupDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    strokeWidth={0}
                  >
                    {charts.bloodGroupDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               {charts.bloodGroupDistribution.map((b: any, i: number) => (
                 <div key={b.name} className="p-4 rounded-2xl bg-bg-secondary/30 border border-border-color/10 flex flex-col">
                    <span className="text-tiny font-black text-text-primary/30 uppercase tracking-widest mb-1">{b.name} Registry</span>
                    <span className="text-body-lg font-black text-text-primary">{b.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Occupational Focus */}
        <div className="xl:col-span-6 glass-card p-6 sm:p-10 rounded-[2.5rem] border-none shadow-premium min-h-[400px] flex flex-col">
          <div className="flex items-center gap-4 mb-6 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-bg-secondary flex items-center justify-center text-amber-500">
               <PiBriefcaseDuotone size={20} className="sm:size-[24px]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-small sm:text-body-lg font-black text-text-primary tracking-tight uppercase truncate">Economic Engine</h2>
              <p className="text-[10px] sm:text-tiny font-black text-text-primary/40 uppercase tracking-widest mt-1 truncate">Leading Occupations within Community</p>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.occupationDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#888888', fontSize: 9, fontWeight: 900 }} 
                   height={60} 
                   interval={0} 
                   tickFormatter={(val) => val.length > 10 ? `${val.slice(0, 10)}...` : val}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 10, fontWeight: 900 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {charts.occupationDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
