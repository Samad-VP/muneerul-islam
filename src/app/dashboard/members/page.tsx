"use client"
import { useEffect, useState } from "react"
import { PiMagnifyingGlass, PiUsersDuotone, PiFadersDuotone, PiSpinner, PiGlobeDuotone, PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi"

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ gender: "", bloodGroup: "", education: "", abroad: "" })
  const [showFilters, setShowFilters] = useState(false)

  const fetchMembers = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: page.toString(), search })
    if (filters.gender) params.set("gender", filters.gender)
    if (filters.bloodGroup) params.set("bloodGroup", filters.bloodGroup)
    if (filters.education) params.set("education", filters.education)
    if (filters.abroad) params.set("abroad", filters.abroad)

    fetch(`/api/members?${params}`)
      .then(res => res.json())
      .then(data => {
        setMembers(data.members || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchMembers() }, [search, page, filters])

  return (
    <div className="animate-fade-in w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 w-full">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tighter">
            Member <span className="gradient-text">Directory</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/10">
              {total} Total Profiles
            </span>
          </div>
        </div>
        <button
          className={`btn-secondary py-4 px-8 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all ${showFilters ? "bg-emerald-500 text-white shadow-premium shadow-emerald-500/20 border-none" : "border-emerald-500/10"}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <PiFadersDuotone size={20} /> 
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mb-10 w-full space-y-6">
        <div className="relative group w-full max-w-2xl">
          <PiMagnifyingGlass size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-primary/30 group-focus-within:text-emerald-500 transition-colors" />
          <input
            className="input-field !pl-14 w-full py-5 bg-white dark:bg-bg-primary/50 border-emerald-500/10 focus:border-emerald-500/40 rounded-3xl font-bold shadow-sm text-lg"
            placeholder="Search by name, phone or house..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {showFilters && (
          <div className="glass-card animate-slide-up p-8 sm:p-10 rounded-[2.5rem] border-none shadow-premium flex flex-wrap gap-8 w-full bg-gradient-to-br from-white to-emerald-500/5 dark:from-bg-card dark:to-emerald-500/5">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.2em] mb-3 block ml-1">Identity / Gender</label>
              <select className="input-field w-full py-4 rounded-2xl bg-bg-secondary/30 border-emerald-500/10 font-bold" value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})}>
                <option value="">All Genders</option>
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.2em] mb-3 block ml-1">Blood Registry</label>
              <select className="input-field w-full py-4 rounded-2xl bg-bg-secondary/30 border-emerald-500/10 font-bold" value={filters.bloodGroup} onChange={e => setFilters({...filters, bloodGroup: e.target.value})}>
                <option value="">Any Group</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.2em] mb-3 block ml-1">Academic Status</label>
              <select className="input-field w-full py-4 rounded-2xl bg-bg-secondary/30 border-emerald-500/10 font-bold" value={filters.education} onChange={e => setFilters({...filters, education: e.target.value})}>
                <option value="">Any Education</option>
                <option value="Primary">Primary</option>
                <option value="SSLC">SSLC</option>
                <option value="Plus Two">Plus Two</option>
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.2em] mb-3 block ml-1">Location Status</label>
              <select className="input-field w-full py-4 rounded-2xl bg-bg-secondary/30 border-emerald-500/10 font-bold" value={filters.abroad} onChange={e => setFilters({...filters, abroad: e.target.value})}>
                <option value="">Global View</option>
                <option value="true">Abroad Only</option>
              </select>
            </div>
            <div className="flex items-end shrink-0">
              <button className="btn-secondary py-4 px-8 rounded-2xl border-rose-500/10 hover:bg-rose-500 hover:text-white font-black text-[10px] uppercase tracking-widest" onClick={() => setFilters({ gender: "", bloodGroup: "", education: "", abroad: "" })}>
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members directory */}
      <div className="w-full">
        {loading ? (
          <div className="glass-card p-24 text-center rounded-[2.5rem] border-none shadow-premium">
            <PiSpinner size={48} className="animate-spin text-emerald-500 mx-auto" />
            <p className="mt-4 text-text-primary/40 font-black uppercase tracking-widest text-sm">Indexing Directory...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="glass-card p-24 text-center rounded-[2.5rem] border-none shadow-premium">
            <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center text-text-primary/10 mx-auto mb-8 border border-border-color/30">
              <PiUsersDuotone size={48} />
            </div>
            <p className="text-text-primary/40 font-black uppercase tracking-widest text-sm mb-4">No match found in records</p>
            <button className="text-emerald-500 font-bold text-xs uppercase tracking-widest hover:underline" onClick={() => {setSearch(""); setFilters({gender:"", bloodGroup:"", education:"", abroad:""})}}>Clear Search filters</button>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-6 w-full md:hidden">
              {members.map(m => (
                <div key={`mobile-${m.id}`} className="glass-card p-6 flex flex-col gap-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent -z-10" />
                  <div className="flex items-center gap-5 w-full">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-lg border-2 ${
                      m.gender === "Male" ? "bg-blue-500 text-white border-white/20 shadow-blue-500/20" : "bg-rose-500 text-white border-white/20 shadow-rose-500/20"
                    }`}>
                      {m.name?.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-lg text-text-primary leading-tight tracking-tight truncate uppercase">{m.name}</h3>
                        {m.abroad && (
                          <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                            <PiGlobeDuotone size={14} />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/30 mt-1 truncate">{m.family?.houseName || "UNSPECIFIED HOUSE"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 py-1.5 px-3 rounded-full border border-emerald-500/10">{m.relationToHead}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-bg-secondary text-text-primary/40 py-1.5 px-3 rounded-full border border-border-color/30">{m.gender}</span>
                    {m.bloodGroup && <span className="text-[9px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 py-1.5 px-3 rounded-full border border-rose-500/10">{m.bloodGroup}</span>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border-color/20">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-text-primary/30 font-black block">Education</span>
                      <span className="font-black text-xs text-text-primary truncate block">{m.education || "—"}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-text-primary/30 font-black block">Occupation</span>
                      <span className="font-black text-xs text-text-primary truncate block">{m.occupation || "—"}</span>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-text-primary/30 font-black block">Contact</span>
                      <span className="font-black text-xs text-emerald-500 tracking-wider block">{m.phone || "—"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block glass-card rounded-[2.5rem] border-none shadow-premium overflow-hidden">
              <div className="overflow-x-auto w-full custom-scrollbar">
                <table className="data-table w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-border-color/30">
                      <th className="py-7 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Profile</th>
                      <th className="py-7 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Family Link</th>
                      <th className="py-7 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Relationship</th>
                      <th className="py-7 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Metrics</th>
                      <th className="py-7 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Academic / Pro</th>
                      <th className="py-7 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Security Group</th>
                      <th className="py-7 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Contact Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} className="group border-b border-border-color/10 hover:bg-emerald-500/5 transition-all duration-300">
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shrink-0 border-2 ${
                              m.gender === "Male" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}>
                              {m.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-text-primary group-hover:text-emerald-600 transition-colors uppercase tracking-tight flex items-center gap-2">
                                {m.name}
                                {m.abroad && <PiGlobeDuotone size={14} className="text-cyan-500" title="Abroad Status" />}
                              </p>
                              <p className="text-[10px] text-text-primary/30 font-bold uppercase tracking-widest mt-1">System User</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <p className="text-xs font-black text-text-primary/60 uppercase tracking-tight truncate max-w-[150px]">{m.family?.houseName || "—"}</p>
                        </td>
                        <td className="py-6 px-8">
                          <span className="text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{m.relationToHead}</span>
                        </td>
                        <td className="py-6 px-8 text-xs font-black text-text-primary/40">{m.gender}</td>
                        <td className="py-6 px-8">
                          <p className="text-[10px] font-black text-text-primary uppercase tracking-wider">{m.education || "—"}</p>
                          <p className="text-[9px] text-text-primary/30 font-bold uppercase mt-1 truncate max-w-[120px]">{m.occupation || "—"}</p>
                        </td>
                        <td className="py-6 px-8">
                          {m.bloodGroup ? (
                            <span className="text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                              {m.bloodGroup}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="py-6 px-8 text-right">
                          <p className="font-black text-xs text-emerald-500/70 tracking-tighter">{m.phone || "—"}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center items-center gap-6 mt-12 pb-10">
          <button
            className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-primary/30 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-bg-secondary disabled:hover:text-text-primary/30 shadow-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <PiArrowLeftBold size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary/20">Page</span>
            <span className="text-lg font-black text-text-primary">{page}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary/20">of {Math.ceil(total / 20)}</span>
          </div>

          <button
            className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-primary/30 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-bg-secondary disabled:hover:text-text-primary/30 shadow-sm"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage(page + 1)}
          >
            <PiArrowRightBold size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
