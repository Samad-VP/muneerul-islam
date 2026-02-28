"use client"
import { useEffect, useState } from "react"
import { PiCalendarDuotone, PiPlusBold, PiMapPinDuotone, PiClockDuotone, PiXBold, PiSpinner, PiTrashDuotone } from "react-icons/pi"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [mahalluId, setMahalluId] = useState("")
  const [form, setForm] = useState({ title: "", description: "", date: "", endDate: "", venue: "", type: "Meeting" })
  const [submitting, setSubmitting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

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

  const openEditEvent = (event: any) => {
    setEditingEventId(event.id)
    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : "",
      venue: event.venue || "",
      type: event.type || "Meeting"
    })
    setShowEditModal(true)
  }

  const editEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/events/${editingEventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowEditModal(false)
        setEditingEventId(null)
        setForm({ title: "", description: "", date: "", endDate: "", venue: "", type: "Meeting" })
        fetchEvents()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    await fetch(`/api/events/${id}`, { method: "DELETE" })
    fetchEvents()
  }

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    upcoming: { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.2)" },
    ongoing: { bg: "rgba(16,185,129,0.1)", color: "#34d399", border: "rgba(16,185,129,0.2)" },
    completed: { bg: "rgba(100,116,139,0.1)", color: "#94a3b8", border: "rgba(100,116,139,0.2)" },
    cancelled: { bg: "rgba(239,68,68,0.1)", color: "#f87171", border: "rgba(239,68,68,0.2)" },
  }

  return (
    <>
      <div className="animate-fade-in w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Events & Programs</h1>
          <p className="text-text-secondary text-sm mt-1">{events.length} events</p>
        </div>
        <button className="btn-primary w-full sm:w-auto justify-center" onClick={() => setShowModal(true)}>
          <PiPlusBold size={18} /> New Event
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {[1,2,3].map(i => <div key={i} className="skeleton h-[180px] rounded-2xl" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card p-16 text-center w-full">
          <PiCalendarDuotone size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-muted text-base">No events yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {events.map(event => {
            const sc = statusColors[event.status] || statusColors.upcoming
            return (
              <div key={event.id} className="glass-card p-5 sm:p-6 flex flex-col h-full border border-border-color hover:border-emerald-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {event.status}
                    </span>
                    <span className="badge badge-blue text-[11px]">{event.type}</span>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditEvent(event)} className="text-text-muted hover:text-blue-500 p-1 rounded-md" title="Edit Event">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l12.69-12.69L204.69,96Z"></path></svg>
                    </button>
                    <button onClick={() => deleteEvent(event.id)} className="text-text-muted hover:text-red-500 p-1 rounded-md" title="Delete Event">
                      <PiTrashDuotone size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-text-primary mb-2 line-clamp-2">{event.title}</h3>
                {event.description && <p className="text-text-secondary text-sm mb-4 line-clamp-3">{event.description}</p>}
                <div className="mt-auto flex flex-col gap-2 shadow-sm bg-bg-primary/50 p-3 rounded-xl border border-border-color">
                  <span className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                    <PiClockDuotone size={16} className="text-emerald-400 shrink-0" />
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {event.venue && (
                    <span className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                      <PiMapPinDuotone size={16} className="text-gold shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6" onClick={() => setShowModal(false)}>
          <div className="bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl">
              <h2 className="text-xl font-bold gradient-text">New Event</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary p-1.5 bg-bg-secondary hover:bg-bg-card-hover rounded-lg transition-colors"><PiXBold size={20} /></button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6">
              <form onSubmit={createEvent} className="flex flex-col">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Event Title *</label>
                    <input className="input-field w-full" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Event title" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Date *</label>
                      <input className="input-field w-full" type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Type</label>
                      <select className="input-field w-full" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
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
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Venue</label>
                    <input className="input-field w-full" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} placeholder="Event venue" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                    <textarea className="input-field w-full" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Event description" />
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

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6" onClick={() => setShowEditModal(false)}>
          <div className="bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl">
              <h2 className="text-xl font-bold gradient-text">Edit Event</h2>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-text-muted hover:text-text-primary p-1.5 bg-bg-secondary hover:bg-bg-card-hover rounded-lg transition-colors"><PiXBold size={20} /></button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6">
              <form onSubmit={editEvent} className="flex flex-col">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Event Title *</label>
                    <input className="input-field w-full" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Event title" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Date *</label>
                      <input className="input-field w-full" type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Type</label>
                      <select className="input-field w-full" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
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
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Venue</label>
                    <input className="input-field w-full" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} placeholder="Event venue" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                    <textarea className="input-field w-full" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Event description" />
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
