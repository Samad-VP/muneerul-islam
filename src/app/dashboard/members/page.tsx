"use client"
import { useEffect, useState } from "react"
import { Search, Users, Filter, Loader2, Globe, Droplets, GraduationCap, Briefcase } from "lucide-react"

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
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">Members Directory</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            {total} members found
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ position: "relative", maxWidth: "400px", marginBottom: showFilters ? "16px" : 0 }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            className="input-field"
            style={{ paddingLeft: "42px" }}
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {showFilters && (
          <div className="glass-card animate-fade-in" style={{ padding: "20px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Gender</label>
              <select className="input-field" style={{ width: "150px" }} value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})}>
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Blood Group</label>
              <select className="input-field" style={{ width: "150px" }} value={filters.bloodGroup} onChange={e => setFilters({...filters, bloodGroup: e.target.value})}>
                <option value="">All</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Education</label>
              <select className="input-field" style={{ width: "150px" }} value={filters.education} onChange={e => setFilters({...filters, education: e.target.value})}>
                <option value="">All</option>
                <option value="Primary">Primary</option>
                <option value="SSLC">SSLC</option>
                <option value="Plus Two">Plus Two</option>
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Abroad</label>
              <select className="input-field" style={{ width: "150px" }} value={filters.abroad} onChange={e => setFilters({...filters, abroad: e.target.value})}>
                <option value="">All</option>
                <option value="true">Abroad Only</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button className="btn-secondary" style={{ padding: "8px 14px" }} onClick={() => setFilters({ gender: "", bloodGroup: "", education: "", abroad: "" })}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members Table */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "var(--emerald-400)", margin: "0 auto" }} />
          </div>
        ) : members.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <Users size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No members found</p>
          </div>
        ) : (
          <table className="data-table">
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
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: m.gender === "Male" ? "rgba(59,130,246,0.15)" : "rgba(236,72,153,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: 700,
                        color: m.gender === "Male" ? "#60a5fa" : "#f472b6"
                      }}>
                        {m.name?.charAt(0)}
                      </div>
                      <div>
                        {m.name}
                        {m.abroad && <Globe size={12} style={{ marginLeft: "6px", color: "#06b6d4" }} />}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{m.family?.houseName || "—"}</td>
                  <td><span className="badge badge-blue" style={{ fontSize: "11px" }}>{m.relationToHead}</span></td>
                  <td style={{ color: "var(--text-secondary)" }}>{m.gender}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{m.education || "—"}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{m.occupation || "—"}</td>
                  <td>{m.bloodGroup ? <span className="badge badge-red" style={{ fontSize: "11px" }}>{m.bloodGroup}</span> : "—"}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{m.phone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          <button
            className="btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{ padding: "8px 16px" }}
          >
            Previous
          </button>
          <span style={{ display: "flex", alignItems: "center", padding: "0 16px", color: "var(--text-secondary)", fontSize: "14px" }}>
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            className="btn-secondary"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage(page + 1)}
            style={{ padding: "8px 16px" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
