"use client"
import { useEffect, useState } from "react"
import { PiPlusBold, PiUsersDuotone, PiUserCheckDuotone, PiXBold, PiSpinner, PiTrashDuotone } from "react-icons/pi"

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

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null)

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

  const openEditCommittee = (committee: any) => {
    setEditingCommitteeId(committee.id)
    setForm({
      name: committee.name || "",
      description: committee.description || "",
      type: committee.type || "Education"
    })
    setShowEditModal(true)
  }

  const editCommittee = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/committees/${editingCommitteeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowEditModal(false)
        setEditingCommitteeId(null)
        setForm({ name: "", description: "", type: "Education" })
        fetchCommittees()
      }
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
    <>
      <div className="animate-fade-in w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Committees</h1>
          <p className="text-text-secondary text-sm mt-1">{committees.length} committees</p>
        </div>
        <button className="btn-primary w-full sm:w-auto justify-center" onClick={() => setShowModal(true)}>
          <PiPlusBold size={18} /> New Committee
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {[1,2,3].map(i => <div key={i} className="skeleton h-[200px] rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {committees.map(committee => {
            const color = typeColors[committee.type] || "#10b981"
            return (
              <div key={committee.id} className="glass-card p-5 sm:p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{
                        background: `${color}15`, border: `1px solid ${color}30`
                      }}>
                        <PiUserCheckDuotone size={20} style={{ color }} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-text-primary leading-tight">{committee.name}</h3>
                    </div>
                    <span className="badge badge-blue text-[11px] ml-12">{committee.type}</span>
                  </div>
                  <div className="flex gap-1.5 ml-2 shrink-0">
                    <button onClick={() => openEditCommittee(committee)} className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Edit Committee">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l12.69-12.69L204.69,96Z"></path></svg>
                    </button>
                    <button onClick={() => openAssign(committee)} className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Assign Member">
                      <PiPlusBold size={16} />
                    </button>
                    <button onClick={() => deleteCommittee(committee.id)} className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete Committee">
                      <PiTrashDuotone size={16} />
                    </button>
                  </div>
                </div>

                {committee.description && (
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed">{committee.description}</p>
                )}

                <div className="mt-auto border-t border-border-color pt-4">
                  <p className="text-xs font-semibold text-text-muted mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <PiUsersDuotone size={14} /> Members ({committee._count?.members || 0})
                  </p>
                  {committee.members?.length === 0 ? (
                    <p className="text-text-muted text-sm italic">No members yet</p>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {committee.members?.map((cm: any) => (
                        <div key={cm.id} className="flex justify-between items-center px-3 py-2 rounded-xl bg-bg-secondary/50 border border-border-color text-sm">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="font-semibold text-text-primary truncate">{cm.member?.name}</span>
                            <span className="badge badge-gold text-[10px] shrink-0">{cm.role}</span>
                          </div>
                          <button onClick={() => removeMemberFromCommittee(cm.member?.id, committee.id)} className="text-text-muted hover:text-red-400 p-1 transition-colors shrink-0 ml-2">
                            <PiXBold size={14} />
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
      </div>

      {/* Create Committee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6" onClick={() => setShowModal(false)}>
          <div className="bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl">
              <h2 className="text-xl font-bold gradient-text">New Committee</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary p-1.5 bg-bg-secondary hover:bg-bg-card-hover rounded-lg transition-colors"><PiXBold size={20} /></button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6">
              <form onSubmit={createCommittee} className="flex flex-col">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Name *</label>
                    <input className="input-field w-full" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Committee name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Type *</label>
                    <select className="input-field w-full" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
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
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                    <textarea className="input-field w-full" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 pt-6 border-t border-border-color">
                  <button type="button" className="btn-secondary w-full sm:w-auto justify-center" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={submitting}>
                    {submitting ? <PiSpinner size={18} className="animate-spin" /> : <PiPlusBold size={18} />}
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Member Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6" onClick={() => setShowAssignModal(false)}>
          <div className="bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl">
              <h2 className="text-xl font-bold gradient-text">Assign Member</h2>
              <button type="button" onClick={() => setShowAssignModal(false)} className="text-text-muted hover:text-text-primary p-1.5 bg-bg-secondary hover:bg-bg-card-hover rounded-lg transition-colors"><PiXBold size={20} /></button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6">
              <form onSubmit={assignMember} className="flex flex-col">
                <p className="text-sm text-text-secondary mb-5">Assigning to <span className="font-semibold text-emerald-400">{selectedCommittee?.name}</span></p>
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Select Member *</label>
                    <select className="input-field w-full" required value={assignForm.memberId} onChange={e => setAssignForm({...assignForm, memberId: e.target.value})}>
                      <option value="">Choose a member</option>
                      {allMembers.map((m: any) => (
                        <option key={m.id} value={m.id}>{m.name} — {m.family?.houseName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Role</label>
                    <select className="input-field w-full" value={assignForm.role} onChange={e => setAssignForm({...assignForm, role: e.target.value})}>
                      <option value="member">Member</option>
                      <option value="president">President</option>
                      <option value="secretary">Secretary</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="coordinator">Coordinator</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 pt-6 border-t border-border-color">
                  <button type="button" className="btn-secondary w-full sm:w-auto justify-center" onClick={() => setShowAssignModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={submitting}>
                    {submitting ? <PiSpinner size={18} className="animate-spin" /> : "Assign"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Committee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6" onClick={() => setShowEditModal(false)}>
          <div className="bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl">
              <h2 className="text-xl font-bold gradient-text">Edit Committee</h2>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-text-muted hover:text-text-primary p-1.5 bg-bg-secondary hover:bg-bg-card-hover rounded-lg transition-colors"><PiXBold size={20} /></button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6">
              <form onSubmit={editCommittee} className="flex flex-col">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Name *</label>
                    <input className="input-field w-full" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Committee name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Type *</label>
                    <select className="input-field w-full" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
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
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                    <textarea className="input-field w-full" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 pt-6 border-t border-border-color">
                  <button type="button" className="btn-secondary w-full sm:w-auto justify-center" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={submitting}>
                    {submitting ? <PiSpinner size={18} className="animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
