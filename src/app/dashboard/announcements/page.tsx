"use client"
import { useEffect, useState } from "react"
import { Megaphone, Plus, X, Loader2, AlertTriangle, Info, AlertCircle } from "lucide-react"

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [mahalluId, setMahalluId] = useState("")
  const [form, setForm] = useState({ title: "", content: "", priority: "normal" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/mahallu").then(res => res.json()).then(data => {
      if (data?.length > 0) setMahalluId(data[0].id)
    })
  }, [])

  const fetchAnnouncements = () => {
    if (!mahalluId) return
    setLoading(true)
    fetch(`/api/announcements?mahalluId=${mahalluId}`)
      .then(res => res.json())
      .then(data => { setAnnouncements(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { if (mahalluId) fetchAnnouncements() }, [mahalluId])

  const createAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mahalluId }),
      })
      if (res.ok) { setShowModal(false); setForm({ title: "", content: "", priority: "normal" }); fetchAnnouncements() }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const priorityConfig: Record<string, { color: string; bg: string; icon: any }> = {
    low: { color: "#94a3b8", bg: "rgba(100,116,139,0.1)", icon: Info },
    normal: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: Info },
    high: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: AlertTriangle },
    urgent: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: AlertCircle },
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">Announcements</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>{announcements.length} announcements</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> New Announcement</button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "120px" }} />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
          <Megaphone size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No announcements yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {announcements.map(a => {
            const pc = priorityConfig[a.priority] || priorityConfig.normal
            const Icon = pc.icon
            return (
              <div key={a.id} className="glass-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: pc.bg, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Icon size={20} style={{ color: pc.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{a.title}</h3>
                      <span style={{
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                        background: pc.bg, color: pc.color, textTransform: "capitalize"
                      }}>
                        {a.priority}
                      </span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>{a.content}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "12px" }}>
                      {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: "550px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700 }} className="gradient-text">New Announcement</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={24} /></button>
            </div>
            <form onSubmit={createAnnouncement}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Title *</label>
                  <input className="input-field" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Announcement title" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Priority</label>
                  <select className="input-field" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Content *</label>
                  <textarea className="input-field" rows={5} required value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Announcement content" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Megaphone size={18} />}
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
