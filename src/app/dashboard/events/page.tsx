"use client"
import { useEffect, useState } from "react"
import { Calendar, Plus, MapPin, Clock, X, Loader2, Trash2 } from "lucide-react"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [mahalluId, setMahalluId] = useState("")
  const [form, setForm] = useState({ title: "", description: "", date: "", endDate: "", venue: "", type: "Meeting" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/mahallu").then(res => res.json()).then(data => {
      if (data?.length > 0) setMahalluId(data[0].id)
    })
  }, [])

  const fetchEvents = () => {
    if (!mahalluId) return
    setLoading(true)
    fetch(`/api/events?mahalluId=${mahalluId}`)
      .then(res => res.json())
      .then(data => { setEvents(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { if (mahalluId) fetchEvents() }, [mahalluId])

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mahalluId }),
      })
      if (res.ok) { setShowModal(false); setForm({ title: "", description: "", date: "", endDate: "", venue: "", type: "Meeting" }); fetchEvents() }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    upcoming: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.2)" },
    ongoing: { bg: "rgba(16,185,129,0.1)", color: "#34d399", border: "rgba(16,185,129,0.2)" },
    completed: { bg: "rgba(100,116,139,0.1)", color: "#94a3b8", border: "rgba(100,116,139,0.2)" },
    cancelled: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.2)" },
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">Events & Programs</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>{events.length} events</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> New Event</button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "180px" }} />)}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px", textAlign: "center" }}>
          <Calendar size={48} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No events yet</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {events.map(event => {
            const sc = statusColors[event.status] || statusColors.upcoming
            return (
              <div key={event.id} className="glass-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {event.status}
                  </span>
                  <span className="badge badge-blue" style={{ fontSize: "11px" }}>{event.type}</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{event.title}</h3>
                {event.description && <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>{event.description}</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={14} style={{ color: "var(--emerald-400)" }} />
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {event.venue && (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={14} style={{ color: "var(--gold)" }} />
                      {event.venue}
                    </span>
                  )}
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
              <h2 style={{ fontSize: "20px", fontWeight: 700 }} className="gradient-text">New Event</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={24} /></button>
            </div>
            <form onSubmit={createEvent}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Event Title *</label>
                  <input className="input-field" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Event title" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Date *</label>
                    <input className="input-field" type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Type</label>
                    <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      <option value="Meeting">Meeting</option>
                      <option value="Class">Class</option>
                      <option value="Charity">Charity</option>
                      <option value="Festival">Festival</option>
                      <option value="Sports">Sports</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Venue</label>
                  <input className="input-field" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} placeholder="Event venue" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Description</label>
                  <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Event description" />
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
    </div>
  )
}
