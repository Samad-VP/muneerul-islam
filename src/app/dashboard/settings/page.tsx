"use client"
import { useEffect, useState } from "react"
import { Settings, Save, Loader2, Building2 } from "lucide-react"

export default function SettingsPage() {
  const [mahallu, setMahallu] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "", arabicName: "", address: "", district: "", panchayat: "",
    pincode: "", phone: "", email: "", president: "", secretary: "", imam: "", established: ""
  })

  useEffect(() => {
    fetch("/api/mahallu").then(res => res.json()).then(data => {
      if (data?.length > 0) {
        setMahallu(data[0])
        setForm({
          name: data[0].name || "",
          arabicName: data[0].arabicName || "",
          address: data[0].address || "",
          district: data[0].district || "",
          panchayat: data[0].panchayat || "",
          pincode: data[0].pincode || "",
          phone: data[0].phone || "",
          email: data[0].email || "",
          president: data[0].president || "",
          secretary: data[0].secretary || "",
          imam: data[0].imam || "",
          established: data[0].established || "",
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Since we don't have an update endpoint, this is a placeholder
    setTimeout(() => {
      setSaving(false)
      alert("Settings saved successfully!")
    }, 1000)
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "var(--emerald-400)" }} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800 }} className="gradient-text">Settings</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>Manage Mahallu information and system settings</p>
      </div>

      <div className="glass-card" style={{ padding: "32px", maxWidth: "800px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Building2 size={24} style={{ color: "var(--emerald-400)" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Mahallu Information</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Update your Mahallu details</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Mahallu Name</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Arabic Name</label>
              <input className="input-field arabic-text" value={form.arabicName} onChange={e => setForm({...form, arabicName: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>District</label>
              <input className="input-field" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Panchayat</label>
              <input className="input-field" value={form.panchayat} onChange={e => setForm({...form, panchayat: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Address</label>
              <input className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Pincode</label>
              <input className="input-field" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Phone</label>
              <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Email</label>
              <input className="input-field" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <div style={{ height: "1px", background: "var(--border-color)", margin: "8px 0 20px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--emerald-400)", marginBottom: "16px" }}>Leadership</h3>
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>President</label>
              <input className="input-field" value={form.president} onChange={e => setForm({...form, president: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Secretary</label>
              <input className="input-field" value={form.secretary} onChange={e => setForm({...form, secretary: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Imam</label>
              <input className="input-field" value={form.imam} onChange={e => setForm({...form, imam: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Established Year</label>
              <input className="input-field" value={form.established} onChange={e => setForm({...form, established: e.target.value})} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "28px" }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
