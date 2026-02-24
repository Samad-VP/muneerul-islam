"use client"
import { useEffect, useState } from "react"
import { Plus, Users, UserCheck, X, Loader2, Trash2 } from "lucide-react"

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [mahalluId, setMahalluId] = useState("")
  const [form, setForm] = useState({ name: "", description: "", type: "Education" })
  const [submitting, setSubmitting] = useState(false)
  const [selectedCommittee, setSelectedCommittee] = useState<any>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [allMembers, setAllMembers] = useState<any[]>([])
  const [assignForm, setAssignForm] = useState({ memberId: "", role: "member" })

  useEffect(() => {
    fetch("/api/mahallu").then(res => res.json()).then(data => {
      if (data?.length > 0) setMahalluId(data[0].id)
    })
  }, [])

  const fetchCommittees = () => {
    if (!mahalluId) return
    setLoading(true)
    fetch(`/api/committees?mahalluId=${mahalluId}`)
      .then(res => res.json())
      .then(data => { setCommittees(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { if (mahalluId) fetchCommittees() }, [mahalluId])

  const createCommittee = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/committees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mahalluId }),
      })
      if (res.ok) { setShowModal(false); setForm({ name: "", description: "", type: "Education" }); fetchCommittees() }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const deleteCommittee = async (id: string) => {
    if (!confirm("Delete this committee?")) return
    await fetch(`/api/committees/${id}`, { method: "DELETE" })
    fetchCommittees()
  }

  const openAssign = async (committee: any) => {
    setSelectedCommittee(committee)
    const res = await fetch("/api/members?limit=100")
    const data = await res.json()
    setAllMembers(data.members || [])
    setShowAssignModal(true)
  }

  const assignMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/committees/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ committeeId: selectedCommittee.id, ...assignForm }),
      })
      if (res.ok) { setShowAssignModal(false); setAssignForm({ memberId: "", role: "member" }); fetchCommittees() }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const removeMemberFromCommittee = async (memberId: string, committeeId: string) => {
    await fetch(`/api/committees/members?memberId=${memberId}&committeeId=${committeeId}`, { method: "DELETE" })
    fetchCommittees()
  }

  const typeColors: Record<string, string> = {
    Education: "#3b82f6", Welfare: "#10b981", Youth: "#8b5cf6",
    Women: "#ec4899", Finance: "#f59e0b", Maintenance: "#06b6d4",
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">Committees</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>{committees.length} committees</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> New Committee</button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "200px" }} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {committees.map(committee => {
            const color = typeColors[committee.type] || "#10b981"
            return (
              <div key={committee.id} className="glass-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: `${color}15`, border: `1px solid ${color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <UserCheck size={18} style={{ color }} />
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{committee.name}</h3>
                    </div>
                    <span className="badge badge-blue" style={{ fontSize: "11px" }}>{committee.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => openAssign(committee)} style={{ padding: "6px", borderRadius: "6px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "var(--emerald-400)", cursor: "pointer" }}>
                      <Plus size={14} />
                    </button>
                    <button onClick={() => deleteCommittee(committee.id)} style={{ padding: "6px", borderRadius: "6px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {committee.description && (
                  <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>{committee.description}</p>
                )}

                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                    Members ({committee._count?.members || 0})
                  </p>
                  {committee.members?.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>No members yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {committee.members?.map((cm: any) => (
                        <div key={cm.id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "8px 12px", borderRadius: "8px", background: "var(--bg-primary)",
                          border: "1px solid var(--border-color)"
                        }}>
                          <div>
                            <span style={{ fontSize: "13px", fontWeight: 600 }}>{cm.member?.name}</span>
                            <span className="badge badge-gold" style={{ marginLeft: "8px", fontSize: "10px" }}>{cm.role}</span>
                          </div>
                          <button onClick={() => removeMemberFromCommittee(cm.member?.id, committee.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "2px" }}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Committee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px" }} className="gradient-text">New Committee</h2>
            <form onSubmit={createCommittee}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Name *</label>
                  <input className="input-field" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Committee name" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Type *</label>
                  <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="Education">Education</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Youth">Youth</option>
                    <option value="Women">Women</option>
                    <option value="Finance">Finance</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Description</label>
                  <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Member Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px" }} className="gradient-text">
              Assign Member to {selectedCommittee?.name}
            </h2>
            <form onSubmit={assignMember}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Select Member *</label>
                  <select className="input-field" required value={assignForm.memberId} onChange={e => setAssignForm({...assignForm, memberId: e.target.value})}>
                    <option value="">Choose a member</option>
                    {allMembers.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name} — {m.family?.houseName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Role</label>
                  <select className="input-field" value={assignForm.role} onChange={e => setAssignForm({...assignForm, role: e.target.value})}>
                    <option value="member">Member</option>
                    <option value="president">President</option>
                    <option value="secretary">Secretary</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
