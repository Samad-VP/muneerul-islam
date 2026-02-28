"use client"
import { useEffect, useState } from "react"
import { PiSpeakerHighDuotone, PiPlusBold, PiXBold, PiSpinner, PiWarningDuotone, PiInfoDuotone, PiWarningCircleDuotone } from "react-icons/pi"

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [mahalluId, setMahalluId] = useState("")
  const [form, setForm] = useState({ title: "", content: "", priority: "normal" })
  const [submitting, setSubmitting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null)

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

  const openEditAnnouncement = (announcement: any) => {
    setEditingAnnouncementId(announcement.id)
    setForm({
      title: announcement.title || "",
      content: announcement.content || "",
      priority: announcement.priority || "normal"
    })
    setShowEditModal(true)
  }

  const editAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/announcements/${editingAnnouncementId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowEditModal(false)
        setEditingAnnouncementId(null)
        setForm({ title: "", content: "", priority: "normal" })
        fetchAnnouncements()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return
    await fetch(`/api/announcements/${id}`, { method: "DELETE" })
    fetchAnnouncements()
  }

  const priorityConfig: Record<string, { color: string; bg: string; icon: any }> = {
    low: { color: "#94a3b8", bg: "rgba(100,116,139,0.1)", icon: PiInfoDuotone },
    normal: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: PiInfoDuotone },
    high: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: PiWarningDuotone },
    urgent: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: PiWarningCircleDuotone },
  }

  return (
    <>
      <div className="animate-fade-in w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Announcements</h1>
          <p className="text-text-secondary text-sm mt-1">{announcements.length} announcements</p>
        </div>
        <button className="btn-primary w-full sm:w-auto justify-center" onClick={() => setShowModal(true)}>
          <PiPlusBold size={18} /> New Announcement
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 w-full">
          {[1,2,3].map(i => <div key={i} className="skeleton h-[120px] rounded-2xl" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="glass-card p-16 text-center w-full">
          <PiSpeakerHighDuotone size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-muted text-base">No announcements yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {announcements.map(a => {
            const pc = priorityConfig[a.priority] || priorityConfig.normal
            const Icon = pc.icon
            return (
              <div key={a.id} className="glass-card p-5 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: pc.bg }}>
                    <Icon size={24} style={{ color: pc.color }} />
                  </div>
                  <div className="flex-1 w-full group relative">
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5 bg-bg-card p-1 rounded-bl-lg">
                      <button onClick={() => openEditAnnouncement(a)} className="text-text-muted hover:text-blue-500 p-1 rounded-md transition-colors" title="Edit Announcement">
                         <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l12.69-12.69L204.69,96Z"></path></svg>
                      </button>
                      <button onClick={() => deleteAnnouncement(a.id)} className="text-text-muted hover:text-red-500 p-1 rounded-md transition-colors" title="Delete Announcement">
                        <PiXBold size={16} />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2 sm:mb-3 pr-16">
                      <h3 className="text-base sm:text-lg font-bold text-text-primary leading-tight">{a.title}</h3>
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0" style={{ background: pc.bg, color: pc.color }}>
                        {a.priority}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4">{a.content}</p>
                    <p className="text-xs font-medium text-text-muted">
                      {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
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
              <h2 className="text-xl font-bold gradient-text">New Announcement</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary p-1.5 bg-bg-secondary hover:bg-bg-card-hover rounded-lg transition-colors"><PiXBold size={20} /></button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6">
              <form onSubmit={createAnnouncement} className="flex flex-col">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Title *</label>
                    <input className="input-field w-full" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Announcement title" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Priority</label>
                    <select className="input-field w-full" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Content *</label>
                    <textarea className="input-field w-full" rows={5} required value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Announcement content" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 pt-6 border-t border-border-color">
                  <button type="button" className="btn-secondary w-full sm:w-auto justify-center" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={submitting}>
                    {submitting ? <PiSpinner size={18} className="animate-spin" /> : <PiSpeakerHighDuotone size={18} />}
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6" onClick={() => setShowEditModal(false)}>
          <div className="bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl">
              <h2 className="text-xl font-bold gradient-text">Edit Announcement</h2>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-text-muted hover:text-text-primary p-1.5 bg-bg-secondary hover:bg-bg-card-hover rounded-lg transition-colors"><PiXBold size={20} /></button>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6">
              <form onSubmit={editAnnouncement} className="flex flex-col">
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Title *</label>
                    <input className="input-field w-full" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Announcement title" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Priority</label>
                    <select className="input-field w-full" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Content *</label>
                    <textarea className="input-field w-full" rows={5} required value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Announcement content" />
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
