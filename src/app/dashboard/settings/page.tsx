"use client"
import { useEffect, useState } from "react"
import { PiGearDuotone, PiFloppyDiskBold, PiSpinner, PiBuildingsDuotone } from "react-icons/pi"

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
    try {
      const res = await fetch("/api/mahallu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error("Failed to save settings")
      alert("Settings saved successfully!")
    } catch (error) {
      console.error(error)
      alert("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <PiSpinner size={40} className="animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Settings</h1>
        <p className="text-text-secondary text-sm mt-1 sm:mt-2">Manage Mahallu information and system settings</p>
      </div>

      <div className="glass-card p-5 sm:p-8 w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <PiBuildingsDuotone size={24} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">Mahallu Information</h2>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">Update your Mahallu details</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Mahallu Name</label>
              <input className="input-field w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Arabic Name</label>
              <input className="input-field arabic-text w-full text-right" dir="rtl" value={form.arabicName} onChange={e => setForm({...form, arabicName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">District</label>
              <input className="input-field w-full" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Panchayat</label>
              <input className="input-field w-full" value={form.panchayat} onChange={e => setForm({...form, panchayat: e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Address</label>
              <input className="input-field w-full" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Pincode</label>
              <input className="input-field w-full" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Phone</label>
              <input className="input-field w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
              <input className="input-field w-full" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <div className="h-px bg-border-color my-4 sm:my-6" />
              <h3 className="text-sm font-bold text-emerald-400 mb-4 sm:mb-5 uppercase tracking-wider">Leadership</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">President</label>
              <input className="input-field w-full" value={form.president} onChange={e => setForm({...form, president: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Secretary</label>
              <input className="input-field w-full" value={form.secretary} onChange={e => setForm({...form, secretary: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Imam</label>
              <input className="input-field w-full" value={form.imam} onChange={e => setForm({...form, imam: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Established Year</label>
              <input className="input-field w-full" value={form.established} onChange={e => setForm({...form, established: e.target.value})} />
            </div>
          </div>

          <div className="flex justify-center sm:justify-end mt-8">
            <button type="submit" className="btn-primary w-full sm:w-auto justify-center px-8" disabled={saving}>
              {saving ? <PiSpinner size={18} className="animate-spin" /> : <PiFloppyDiskBold size={18} />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
