"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Users, Phone, MapPin, Hash, Plus, X, Loader2,
  User, Calendar, Droplets, GraduationCap, Briefcase, Globe, Edit
} from "lucide-react"

export default function FamilyDetailPage() {
  const params = useParams()
  const [family, setFamily] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [memberForm, setMemberForm] = useState({
    name: "", relationToHead: "", gender: "Male", dob: "", maritalStatus: "Single",
    phone: "", bloodGroup: "", education: "", occupation: "", abroad: false, abroadCountry: "",
    healthIssues: "", remarks: "",
  })

  const fetchFamily = () => {
    setLoading(true)
    fetch(`/api/families/${params.id}`)
      .then(res => res.json())
      .then(data => { setFamily(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchFamily() }, [params.id])

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...memberForm, familyId: params.id }),
      })
      if (res.ok) {
        setShowAddMember(false)
        setMemberForm({ name: "", relationToHead: "", gender: "Male", dob: "", maritalStatus: "Single", phone: "", bloodGroup: "", education: "", occupation: "", abroad: false, abroadCountry: "", healthIssues: "", remarks: "" })
        fetchFamily()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const deleteMember = async (memberId: string) => {
    if (!confirm("Delete this member?")) return
    await fetch(`/api/members/${memberId}`, { method: "DELETE" })
    fetchFamily()
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "var(--emerald-400)" }} />
      </div>
    )
  }

  if (!family) return <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>Family not found</div>

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <Link href="/dashboard/families" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px", marginBottom: "20px" }}>
        <ArrowLeft size={16} /> Back to Families
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">{family.houseName}</h1>
          <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <Hash size={14} /> {family.familyNumber}
            </span>
            {family.ward && <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <MapPin size={14} /> {family.ward}
            </span>}
            {family.phone && <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <Phone size={14} /> {family.phone}
            </span>}
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <Users size={14} /> {family.members?.length} members
            </span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowAddMember(true)}>
          <Plus size={18} /> Add Member
        </button>
      </div>

      {/* Members Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
        {family.members?.map((member: any, idx: number) => (
          <div key={member.id} className="glass-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: member.gender === "Male"
                    ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))"
                    : "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))",
                  border: `1px solid ${member.gender === "Male" ? "rgba(59,130,246,0.3)" : "rgba(236,72,153,0.3)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: 700,
                  color: member.gender === "Male" ? "#60a5fa" : "#f472b6"
                }}>
                  {member.name?.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{member.name}</h3>
                  <span className={`badge ${member.relationToHead === "Head" ? "badge-gold" : "badge-blue"}`} style={{ fontSize: "11px" }}>
                    {member.relationToHead}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteMember(member.id)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
              {member.dob && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                  <Calendar size={13} style={{ color: "var(--text-muted)" }} />
                  {new Date(member.dob).toLocaleDateString("en-IN")}
                </div>
              )}
              {member.bloodGroup && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                  <Droplets size={13} style={{ color: "#ef4444" }} />
                  {member.bloodGroup}
                </div>
              )}
              {member.education && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                  <GraduationCap size={13} style={{ color: "var(--gold)" }} />
                  {member.education}
                </div>
              )}
              {member.occupation && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                  <Briefcase size={13} style={{ color: "var(--emerald-400)" }} />
                  {member.occupation}
                </div>
              )}
              {member.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                  <Phone size={13} style={{ color: "var(--text-muted)" }} />
                  {member.phone}
                </div>
              )}
              {member.abroad && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                  <Globe size={13} style={{ color: "#06b6d4" }} />
                  {member.abroadCountry || "Abroad"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="modal-overlay" onClick={() => setShowAddMember(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700 }} className="gradient-text">Add Family Member</h2>
              <button onClick={() => setShowAddMember(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={24} /></button>
            </div>
            <form onSubmit={addMember}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Name *</label>
                  <input className="input-field" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Relation to Head *</label>
                  <select className="input-field" required value={memberForm.relationToHead} onChange={e => setMemberForm({...memberForm, relationToHead: e.target.value})}>
                    <option value="">Select</option>
                    <option value="Head">Head</option><option value="Spouse">Spouse</option>
                    <option value="Son">Son</option><option value="Daughter">Daughter</option>
                    <option value="Father">Father</option><option value="Mother">Mother</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Gender *</label>
                  <select className="input-field" value={memberForm.gender} onChange={e => setMemberForm({...memberForm, gender: e.target.value})}>
                    <option value="Male">Male</option><option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Date of Birth</label>
                  <input className="input-field" type="date" value={memberForm.dob} onChange={e => setMemberForm({...memberForm, dob: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Education</label>
                  <select className="input-field" value={memberForm.education} onChange={e => setMemberForm({...memberForm, education: e.target.value})}>
                    <option value="">Select</option>
                    <option value="Primary">Primary</option><option value="SSLC">SSLC</option>
                    <option value="Plus Two">Plus Two</option><option value="Graduation">Graduation</option>
                    <option value="Post Graduation">Post Graduation</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Occupation</label>
                  <input className="input-field" value={memberForm.occupation} onChange={e => setMemberForm({...memberForm, occupation: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Blood Group</label>
                  <select className="input-field" value={memberForm.bloodGroup} onChange={e => setMemberForm({...memberForm, bloodGroup: e.target.value})}>
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Phone</label>
                  <input className="input-field" value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddMember(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  {submitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
