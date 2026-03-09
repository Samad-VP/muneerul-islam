"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { PiHouseDuotone, PiPlusBold, PiMagnifyingGlass, PiEyeDuotone, PiTrashDuotone, PiSpinner, PiXBold, PiUsersDuotone, PiFunnelDuotone } from "react-icons/pi"

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
  const [error, setError] = useState("")

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setError("")
    if (!mahalluId) {
      setError("Please create a Mahallu first before registering families.")
      setSubmitting(false)
      return
    }
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
      } else {
        const data = await res.json()
        setError(data?.error || "Failed to register family. Please check all required fields.")
      }
    } catch (e) {
      console.error(e)
      setError("An unexpected error occurred.")
    }
    setSubmitting(false)
  }

  const deleteFamily = async (id: string) => {
    if (!confirm("Are you sure you want to delete this family?")) return
    await fetch(`/api/families/${id}`, { method: "DELETE" })
    fetchFamilies()
  }

  return (
    <>
      <div className="animate-fade-in w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 w-full">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tighter">
            Family <span className="gradient-text">Management</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/10">
              {total} Total Records
            </span>
          </div>
        </div>
        <button className="btn-primary w-full sm:w-auto justify-center py-4 px-8 rounded-2xl glow-effect text-base shrink-0" onClick={() => setShowModal(true)}>
          <PiPlusBold size={20} /> Register Family
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <PiMagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30 group-focus-within:text-emerald-500 transition-colors" />
          <input
            className="input-field !pl-12 w-full py-4 bg-white dark:bg-bg-primary/50 border-emerald-500/10 focus:border-emerald-500/40 rounded-2xl font-bold shadow-sm"
            placeholder="Search by house name, family number..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <button className="btn-secondary py-4 px-6 rounded-2xl border-emerald-500/10 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest">
          <PiFunnelDuotone size={20} />
          Filters
        </button>
      </div>

      {/* Families Content */}
      <div className="w-full">
        {loading ? (
          <div className="glass-card p-24 text-center rounded-[2.5rem] border-none shadow-premium">
            <PiSpinner size={48} className="animate-spin text-emerald-500 mx-auto" />
            <p className="mt-4 text-text-primary/40 font-black uppercase tracking-widest text-sm">Syncing Records...</p>
          </div>
        ) : families.length === 0 ? (
          <div className="glass-card p-24 text-center rounded-[2.5rem] border-none shadow-premium">
            <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center text-text-primary/10 mx-auto mb-8 border border-border-color/30">
              <PiHouseDuotone size={48} />
            </div>
            <p className="text-text-primary/40 font-black uppercase tracking-widest text-sm mb-8">No families found matching your criteria</p>
            <button className="btn-primary mx-auto py-4 px-10 rounded-2xl" onClick={() => setShowModal(true)}>
              <PiPlusBold size={20} /> Register First Family
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-6 w-full md:hidden">
              {families.map(family => (
                <div key={`mobile-${family.id}`} className="glass-card p-6 flex flex-col gap-6 group hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent -z-10" />
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-4">
                      <h3 className="font-black text-xl text-text-primary leading-tight tracking-tight truncate group-hover:text-emerald-600 transition-colors uppercase">{family.houseName}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-primary/30 py-1 px-3 rounded-full bg-bg-secondary border border-border-color/50">
                          {family.familyNumber}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full ${family.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                          {family.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-bg-secondary/30 border border-border-color/20">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-text-primary/30 font-black block mb-1">Ward</span>
                      <span className="font-black text-sm text-text-primary">{family.ward || "—"}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-bg-secondary/30 border border-border-color/20">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-text-primary/30 font-black block mb-1">Members</span>
                      <span className="font-black text-sm text-emerald-500 flex items-center gap-2">
                        <PiUsersDuotone size={18} />
                        {family._count?.members || family.members?.length || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-border-color/20">
                    <Link href={`/dashboard/families/${family.id}`} className="btn-secondary flex-1 justify-center py-4 rounded-xl text-xs uppercase tracking-widest font-black">
                      <PiEyeDuotone size={18} /> View
                    </Link>
                    <button onClick={() => deleteFamily(family.id)} className="btn-action danger flex-1 justify-center py-4 rounded-xl text-xs uppercase tracking-widest font-black bg-rose-500/5 hover:bg-rose-500">
                      <PiTrashDuotone size={18} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block glass-card rounded-[2.5rem] border-none shadow-premium overflow-hidden">
              <div className="overflow-x-auto w-full custom-scrollbar">
                <table className="data-table w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-border-color/30">
                      <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Family ID</th>
                      <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">House / Head</th>
                      <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Ward / Area</th>
                      <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Phone Numbers</th>
                      <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Data</th>
                      <th className="py-6 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Status</th>
                      <th className="py-6 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {families.map(family => (
                      <tr key={family.id} className="group border-b border-border-color/10 hover:bg-emerald-500/5 transition-all duration-300">
                        <td className="py-6 px-8">
                          <span className="font-black text-xs text-text-primary/30 uppercase bg-bg-secondary py-1.5 px-3 rounded-full border border-border-color/30 group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
                            {family.familyNumber}
                          </span>
                        </td>
                        <td className="py-6 px-8">
                          <p className="font-black text-text-primary group-hover:text-emerald-600 transition-colors tracking-tight uppercase">{family.houseName}</p>
                          <p className="text-[10px] text-text-primary/30 font-bold tracking-widest uppercase mt-1">Primary Residence</p>
                        </td>
                        <td className="py-6 px-8 text-sm font-bold text-text-primary/60">{family.ward || "—"}</td>
                        <td className="py-6 px-8 text-sm font-bold text-text-primary/60">{family.phone || "—"}</td>
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-2 font-black text-emerald-500">
                            <PiUsersDuotone size={18} />
                            {family._count?.members || family.members?.length || 0}
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <span className={`text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full inline-block ${family.isActive ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                            {family.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-6 px-8 text-right">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 group-hover:duration-500">
                            <Link
                              href={`/dashboard/families/${family.id}`}
                              className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center text-text-primary/50 hover:bg-emerald-500 hover:text-white shadow-sm transition-all"
                              title="View Family"
                            >
                              <PiEyeDuotone size={18} />
                            </Link>
                            <button
                              onClick={() => deleteFamily(family.id)}
                              className="w-10 h-10 rounded-xl bg-bg-secondary flex items-center justify-center text-rose-500/50 hover:bg-rose-500 hover:text-white shadow-sm transition-all"
                              title="Delete Record"
                            >
                              <PiTrashDuotone size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      </div>

      {/* Add Family Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-10" onClick={() => setShowModal(false)}>
          <div className="bg-bg-card border-t sm:border border-border-color/40 rounded-t-[3rem] sm:rounded-[3rem] shadow-premium w-full max-w-5xl max-h-[calc(100vh-1rem)] sm:max-h-full animate-slide-up sm:animate-fade-in flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-gold to-blue-500" />
            
            <div className="shrink-0 flex justify-between items-center p-8 sm:p-12 border-b border-border-color/20">
              <div>
                <h2 className="text-3xl font-black tracking-tighter">Register <span className="gradient-text">New Family</span></h2>
                <p className="text-[10px] font-black text-text-primary/30 uppercase tracking-[0.3em] mt-2 leading-relaxed">System Record #MUI-{new Date().getTime().toString().slice(-4)}</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="text-text-primary/40 hover:text-rose-500 w-12 h-12 bg-bg-secondary/50 hover:bg-rose-500/10 flex items-center justify-center rounded-2xl transition-all duration-300">
                <PiXBold size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-8 sm:p-12 custom-scrollbar">
              <form onSubmit={handleSubmit} className="flex flex-col">
              {error && (
                <div className="mb-10 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-sm font-black flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">!</div>
                  {error}
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <PiHouseDuotone size={20} />
                </div>
                <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Residence Information</h3>
                <div className="flex-1 h-px bg-border-color/30" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest ml-1">Family Number *</label>
                  <input className="input-field w-full py-4 bg-bg-secondary/30 border-emerald-500/10 focus:border-emerald-500/40 rounded-2xl font-bold" required value={form.familyNumber} onChange={e => setForm({...form, familyNumber: e.target.value})} placeholder="MUI-004" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest ml-1">House Name *</label>
                  <input className="input-field w-full py-4 bg-bg-secondary/30 border-emerald-500/10 focus:border-emerald-500/40 rounded-2xl font-bold" required value={form.houseName} onChange={e => setForm({...form, houseName: e.target.value})} placeholder="Enter house name" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest ml-1">House Number</label>
                  <input className="input-field w-full py-4 bg-bg-secondary/30 border-emerald-500/10 focus:border-emerald-500/40 rounded-2xl font-bold" value={form.houseNumber} onChange={e => setForm({...form, houseNumber: e.target.value})} placeholder="12/456" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest ml-1">Ward</label>
                  <input className="input-field w-full py-4 bg-bg-secondary/30 border-emerald-500/10 focus:border-emerald-500/40 rounded-2xl font-bold" value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} placeholder="Ward 1" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest ml-1">Phone</label>
                  <input className="input-field w-full py-4 bg-bg-secondary/30 border-emerald-500/10 focus:border-emerald-500/40 rounded-2xl font-bold" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="9876543210" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest ml-1">Address</label>
                  <input className="input-field w-full py-4 bg-bg-secondary/30 border-emerald-500/10 focus:border-emerald-500/40 rounded-2xl font-bold" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Address" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <PiUsersDuotone size={20} />
                  </div>
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">Family Composition ({members.length})</h3>
                  <div className="flex-1 h-px bg-border-color/30" />
                </div>
                <button type="button" className="btn-secondary py-3 px-6 rounded-xl border-blue-500/10 text-[10px] font-black tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-all shadow-sm" onClick={addMember}>
                  <PiPlusBold size={14} /> Add Member
                </button>
              </div>

              <div className="space-y-10">
                {members.map((member, idx) => (
                  <div key={idx} className="glass-card p-8 sm:p-10 rounded-[2.5rem] bg-bg-secondary/30 border-none relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500/10 group-hover:bg-blue-500 transition-colors" />
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-blue-500/20">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-black text-text-primary uppercase tracking-widest">Entry Detail</span>
                      </div>
                      {members.length > 1 && (
                        <button type="button" onClick={() => removeMember(idx)} className="text-rose-500 w-10 h-10 bg-rose-500/5 hover:bg-rose-500 hover:text-white rounded-xl transition-all flex items-center justify-center border border-rose-500/10 shadow-sm">
                          <PiTrashDuotone size={18} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-primary/30 uppercase tracking-widest ml-1">Name *</label>
                        <input className="input-field w-full py-4 bg-white dark:bg-bg-primary/50 border-blue-500/10 focus:border-blue-500/40 rounded-2xl font-bold" required value={member.name} onChange={e => updateMember(idx, "name", e.target.value)} placeholder="Full name" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-primary/30 uppercase tracking-widest ml-1">Relation *</label>
                        <select className="input-field w-full py-4 bg-white dark:bg-bg-primary/50 border-blue-500/10 focus:border-blue-500/40 rounded-2xl font-bold" value={member.relationToHead} onChange={e => updateMember(idx, "relationToHead", e.target.value)}>
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
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-primary/30 uppercase tracking-widest ml-1">Gender *</label>
                        <select className="input-field w-full py-4 bg-white dark:bg-bg-primary/50 border-blue-500/10 focus:border-blue-500/40 rounded-2xl font-bold" value={member.gender} onChange={e => updateMember(idx, "gender", e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-primary/30 uppercase tracking-widest ml-1">Birth Date</label>
                        <input className="input-field w-full py-4 bg-white dark:bg-bg-primary/50 border-blue-500/10 focus:border-blue-500/40 rounded-2xl font-bold" type="date" value={member.dob} onChange={e => updateMember(idx, "dob", e.target.value)} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-primary/30 uppercase tracking-widest ml-1">Education</label>
                        <select className="input-field w-full py-4 bg-white dark:bg-bg-primary/50 border-blue-500/10 focus:border-blue-500/40 rounded-2xl font-bold" value={member.education} onChange={e => updateMember(idx, "education", e.target.value)}>
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
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-primary/30 uppercase tracking-widest ml-1">Occupation</label>
                        <input className="input-field w-full py-4 bg-white dark:bg-bg-primary/50 border-blue-500/10 focus:border-blue-500/40 rounded-2xl font-bold" value={member.occupation} onChange={e => updateMember(idx, "occupation", e.target.value)} placeholder="Occupation" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-primary/30 uppercase tracking-widest ml-1">Blood Group</label>
                        <select className="input-field w-full py-4 bg-white dark:bg-bg-primary/50 border-blue-500/10 focus:border-blue-500/40 rounded-2xl font-bold" value={member.bloodGroup} onChange={e => updateMember(idx, "bloodGroup", e.target.value)}>
                          <option value="">Select</option>
                          <option value="A+">A+</option><option value="A-">A-</option>
                          <option value="B+">B+</option><option value="B-">B-</option>
                          <option value="O+">O+</option><option value="O-">O-</option>
                          <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-primary/30 uppercase tracking-widest ml-1">Phone</label>
                        <input className="input-field w-full py-4 bg-white dark:bg-bg-primary/50 border-blue-500/10 focus:border-blue-500/40 rounded-2xl font-bold" value={member.phone} onChange={e => updateMember(idx, "phone", e.target.value)} placeholder="Phone" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-end mt-16 pt-10 border-t border-border-color/30">
                <button type="button" className="btn-secondary py-5 px-10 rounded-2xl border-none bg-bg-secondary font-black uppercase tracking-[0.2em] text-[10px] w-full sm:w-auto hover:bg-rose-500/10 hover:text-rose-500 transition-all" onClick={() => setShowModal(false)}>Cancel Record</button>
                <button type="submit" className="btn-primary py-5 px-12 rounded-2xl glow-effect font-black uppercase tracking-[0.2em] text-[10px] w-full sm:w-auto shadow-premium" disabled={submitting}>
                  {submitting ? <PiSpinner size={24} className="animate-spin" /> : <PiPlusBold size={24} />}
                  {submitting ? "Processing..." : "Submit Records"}
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
