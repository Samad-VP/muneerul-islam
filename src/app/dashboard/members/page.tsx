"use client"
import { useEffect, useState } from "react"
import { PiMagnifyingGlass, PiUsersDuotone, PiFadersDuotone, PiSpinner, PiGlobeDuotone, PiDropDuotone, PiGraduationCapDuotone, PiBriefcaseDuotone } from "react-icons/pi"

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

  useEffect(() => { fetchMembers() }, [search, page, filters])

  return (
    <div className="animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Members Directory</h1>
          <p className="text-text-secondary text-sm mt-1">
            {total} members found
          </p>
        </div>
        <button
          className="btn-secondary w-full sm:w-auto justify-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <PiFadersDuotone size={18} /> Filters
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 w-full">
        <div className={`relative w-full sm:w-[400px] ${showFilters ? "mb-4" : ""}`}>
          <PiMagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="input-field !pl-10 w-full"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {showFilters && (
          <div className="glass-card animate-fade-in p-4 sm:p-5 flex flex-wrap gap-4 w-full">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Gender</label>
              <select className="input-field w-full sm:w-[150px]" value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})}>
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Blood Group</label>
              <select className="input-field w-full sm:w-[150px]" value={filters.bloodGroup} onChange={e => setFilters({...filters, bloodGroup: e.target.value})}>
                <option value="">All</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Education</label>
              <select className="input-field w-full sm:w-[150px]" value={filters.education} onChange={e => setFilters({...filters, education: e.target.value})}>
                <option value="">All</option>
                <option value="Primary">Primary</option>
                <option value="SSLC">SSLC</option>
                <option value="Plus Two">Plus Two</option>
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Abroad</label>
              <select className="input-field w-full sm:w-[150px]" value={filters.abroad} onChange={e => setFilters({...filters, abroad: e.target.value})}>
                <option value="">All</option>
                <option value="true">Abroad Only</option>
              </select>
            </div>
            <div className="flex items-end w-full sm:w-auto mt-2 sm:mt-0">
              <button className="btn-secondary w-full sm:w-auto justify-center px-4 py-2" onClick={() => setFilters({ gender: "", bloodGroup: "", education: "", abroad: "" })}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members Table */}
      <div className="glass-card shadow-sm border border-border-color overflow-hidden w-full">
        {loading ? (
          <div className="p-16 text-center">
            <PiSpinner size={32} className="animate-spin text-emerald-400 mx-auto" />
          </div>
        ) : members.length === 0 ? (
          <div className="p-16 text-center">
            <PiUsersDuotone size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-base">No members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="data-table w-full min-w-[900px]">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Family</th>
                  <th>Relation</th>
                  <th>Gender</th>
                  <th>Education</th>
                  <th>Occupation</th>
                  <th>Blood Group</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-bg-secondary/50 transition-colors">
                    <td className="font-semibold text-text-primary">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          m.gender === "Male" ? "bg-blue-500/15 text-blue-400" : "bg-pink-500/15 text-pink-400"
                        }`}>
                          {m.name?.charAt(0)}
                        </div>
                        <div className="flex items-center">
                          {m.name}
                          {m.abroad && <PiGlobeDuotone size={14} className="ml-1.5 text-cyan-400" />}
                        </div>
                      </div>
                    </td>
                    <td className="text-text-secondary">{m.family?.houseName || "—"}</td>
                    <td><span className="badge badge-blue text-[11px]">{m.relationToHead}</span></td>
                    <td className="text-text-secondary">{m.gender}</td>
                    <td className="text-text-secondary">{m.education || "—"}</td>
                    <td className="text-text-secondary">{m.occupation || "—"}</td>
                    <td>{m.bloodGroup ? <span className="badge badge-red text-[11px]">{m.bloodGroup}</span> : "—"}</td>
                    <td className="text-text-secondary">{m.phone || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="btn-secondary px-4 py-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="px-4 text-sm font-medium text-text-secondary">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            className="btn-secondary px-4 py-2"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
