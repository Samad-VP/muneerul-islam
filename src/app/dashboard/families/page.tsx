"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Home, Plus, Search, Eye, Trash2, Loader2, X, Users } from "lucide-react"

interface Family {
  id: string
  familyNumber: string
  houseName: string
  houseNumber: string
  address: string
  ward: string
  phone: string
  isActive: boolean
  _count: { members: number }
  members: any[]
}

export default function FamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [mahalluId, setMahalluId] = useState("")

  // Form state
  const [form, setForm] = useState({
    familyNumber: "", houseName: "", houseNumber: "", address: "", ward: "", phone: "", rationCardNo: "", annualIncome: "", notes: "",
  })
  const [members, setMembers] = useState<any[]>([{
    name: "", relationToHead: "Head", gender: "Male", dob: "", maritalStatus: "Single",
    phone: "", bloodGroup: "", education: "", occupation: "", abroad: false,
  }])
  const [submitting, setSubmitting] = useState(false)

  // Get mahallu ID
  useEffect(() => {
    fetch("/api/mahallu").then(res => res.json()).then(data => {
      if (data?.length > 0) setMahalluId(data[0].id)
    })
  }, [])

  const fetchFamilies = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: page.toString(), search })
    if (mahalluId) params.set("mahalluId", mahalluId)
    fetch(`/api/families?${params}`)
      .then(res => res.json())
      .then(data => {
        setFamilies(data.families || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { if (mahalluId) fetchFamilies() }, [mahalluId, page, search])

  const addMember = () => {
    setMembers([...members, {
      name: "", relationToHead: "", gender: "Male", dob: "", maritalStatus: "Single",
      phone: "", bloodGroup: "", education: "", occupation: "", abroad: false,
    }])
  }

  const removeMember = (idx: number) => {
    if (members.length > 1) setMembers(members.filter((_, i) => i !== idx))
  }

  const updateMember = (idx: number, field: string, value: any) => {
    setMembers(members.map((m, i) => i === idx ? { ...m, [field]: value } : m))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mahalluId, members }),
      })
      if (res.ok) {
        setShowModal(false)
        setForm({ familyNumber: "", houseName: "", houseNumber: "", address: "", ward: "", phone: "", rationCardNo: "", annualIncome: "", notes: "" })
        setMembers([{ name: "", relationToHead: "Head", gender: "Male", dob: "", maritalStatus: "Single", phone: "", bloodGroup: "", education: "", occupation: "", abroad: false }])
        fetchFamilies()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const deleteFamily = async (id: string) => {
    if (!confirm("Are you sure you want to delete this family?")) return
    await fetch(`/api/families/${id}`, { method: "DELETE" })
    fetchFamilies()
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">Families</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            {total} families registered
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Register Family
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "24px", position: "relative", maxWidth: "400px" }}>
        <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          className="input-field"
          style={{ paddingLeft: "42px" }}
          placeholder="Search by house name, family number..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      {/* Families Table */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "var(--emerald-400)", margin: "0 auto" }} />
          </div>
        ) : families.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <Home size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No families found</p>
            <button className="btn-primary" style={{ marginTop: "16px" }} onClick={() => setShowModal(true)}>
              <Plus size={18} /> Register First Family
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Family No.</th>
                <th>House Name</th>
                <th>Ward</th>
                <th>Phone</th>
                <th>Members</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {families.map(family => (
                <tr key={family.id}>
                  <td><span className="badge badge-emerald">{family.familyNumber}</span></td>
                  <td style={{ fontWeight: 600 }}>{family.houseName}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{family.ward || "—"}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{family.phone || "—"}</td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Users size={14} style={{ color: "var(--emerald-400)" }} />
                      {family._count?.members || family.members?.length || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${family.isActive ? "badge-emerald" : "badge-red"}`}>
                      {family.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        href={`/dashboard/families/${family.id}`}
                        style={{ padding: "6px 10px", borderRadius: "8px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", textDecoration: "none" }}
                      >
                        <Eye size={14} /> View
                      </Link>
                      <button
                        onClick={() => deleteFamily(family.id)}
                        style={{ padding: "6px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Family Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "900px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700 }} className="gradient-text">Register New Family</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Family Details */}
              <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px", color: "var(--emerald-400)" }}>
                Family Details
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Family Number *</label>
                  <input className="input-field" required value={form.familyNumber} onChange={e => setForm({...form, familyNumber: e.target.value})} placeholder="MUI-004" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>House Name *</label>
                  <input className="input-field" required value={form.houseName} onChange={e => setForm({...form, houseName: e.target.value})} placeholder="Enter house name" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>House Number</label>
                  <input className="input-field" value={form.houseNumber} onChange={e => setForm({...form, houseNumber: e.target.value})} placeholder="12/456" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Ward</label>
                  <input className="input-field" value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} placeholder="Ward 1" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Phone</label>
                  <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="9876543210" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Address</label>
                  <input className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Address" />
                </div>
              </div>

              {/* Members */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--emerald-400)" }}>
                  Family Members ({members.length})
                </h3>
                <button type="button" className="btn-secondary" onClick={addMember} style={{ padding: "6px 14px", fontSize: "13px" }}>
                  <Plus size={14} /> Add Member
                </button>
              </div>

              {members.map((member, idx) => (
                <div key={idx} style={{
                  padding: "16px", marginBottom: "12px", borderRadius: "12px",
                  background: "var(--bg-primary)", border: "1px solid var(--border-color)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Member {idx + 1}</span>
                    {members.length > 1 && (
                      <button type="button" onClick={() => removeMember(idx)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Name *</label>
                      <input className="input-field" required value={member.name} onChange={e => updateMember(idx, "name", e.target.value)} placeholder="Full name" />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Relation *</label>
                      <select className="input-field" value={member.relationToHead} onChange={e => updateMember(idx, "relationToHead", e.target.value)}>
                        <option value="Head">Head</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Gender *</label>
                      <select className="input-field" value={member.gender} onChange={e => updateMember(idx, "gender", e.target.value)}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Date of Birth</label>
                      <input className="input-field" type="date" value={member.dob} onChange={e => updateMember(idx, "dob", e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Education</label>
                      <select className="input-field" value={member.education} onChange={e => updateMember(idx, "education", e.target.value)}>
                        <option value="">Select</option>
                        <option value="Primary">Primary</option>
                        <option value="SSLC">SSLC</option>
                        <option value="Plus Two">Plus Two</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Post Graduation">Post Graduation</option>
                        <option value="PhD">PhD</option>
                        <option value="Islamic Studies">Islamic Studies</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Occupation</label>
                      <input className="input-field" value={member.occupation} onChange={e => updateMember(idx, "occupation", e.target.value)} placeholder="Occupation" />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Blood Group</label>
                      <select className="input-field" value={member.bloodGroup} onChange={e => updateMember(idx, "bloodGroup", e.target.value)}>
                        <option value="">Select</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Phone</label>
                      <input className="input-field" value={member.phone} onChange={e => updateMember(idx, "phone", e.target.value)} placeholder="Phone" />
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  {submitting ? "Registering..." : "Register Family"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
