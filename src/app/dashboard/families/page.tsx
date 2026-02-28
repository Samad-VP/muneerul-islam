"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { PiHouseDuotone, PiPlusBold, PiMagnifyingGlass, PiEyeDuotone, PiTrashDuotone, PiSpinner, PiXBold, PiUsersDuotone } from "react-icons/pi"

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
      <div className="animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Families</h1>
          <p className="text-text-secondary text-sm mt-1">
            {total} families registered
          </p>
        </div>
        <button className="btn-primary w-full sm:w-auto justify-center" onClick={() => setShowModal(true)}>
          <PiPlusBold size={18} /> Register Family
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-[400px] mb-6">
        <PiMagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="input-field !pl-10 w-full"
          placeholder="Search by house name, family number..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      {/* Families Table */}
      <div className="glass-card shadow-sm border border-border-color overflow-hidden w-full">
        {loading ? (
          <div className="p-16 text-center">
            <PiSpinner size={32} className="animate-spin text-emerald-400 mx-auto" />
          </div>
        ) : families.length === 0 ? (
          <div className="p-16 text-center">
            <PiHouseDuotone size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-base">No families found</p>
            <button className="btn-primary mx-auto mt-4" onClick={() => setShowModal(true)}>
              <PiPlusBold size={18} /> Register First Family
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="data-table w-full min-w-[800px]">
              <thead>
                <tr>
                  <th>Family No.</th>
                  <th>House Name</th>
                  <th>Ward</th>
                  <th>Phone</th>
                  <th>Members</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {families.map(family => (
                  <tr key={family.id} className="hover:bg-bg-secondary/50 transition-colors">
                    <td><span className="badge badge-emerald">{family.familyNumber}</span></td>
                    <td className="font-semibold text-text-primary">{family.houseName}</td>
                    <td className="text-text-secondary">{family.ward || "—"}</td>
                    <td className="text-text-secondary">{family.phone || "—"}</td>
                    <td>
                      <span className="flex items-center gap-1.5 font-medium">
                        <PiUsersDuotone size={16} className="text-emerald-400" />
                        {family._count?.members || family.members?.length || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${family.isActive ? "badge-emerald" : "badge-red"}`}>
                        {family.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/families/${family.id}`}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-semibold"
                        >
                          <PiEyeDuotone size={16} /> View
                        </Link>
                        <button
                          onClick={() => deleteFamily(family.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors text-xs font-semibold"
                        >
                          <PiTrashDuotone size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>

      {/* Add Family Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6" onClick={() => setShowModal(false)}>
          <div className="bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl">
              <h2 className="text-xl font-bold gradient-text">Register New Family</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary p-1.5 bg-bg-secondary hover:bg-bg-card-hover rounded-lg transition-colors">
                <PiXBold size={20} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="flex flex-col">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}
              {/* Family Details */}
              <h3 className="text-sm font-bold text-emerald-400 mb-4 uppercase tracking-wider">
                Family Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Family Number *</label>
                  <input className="input-field w-full" required value={form.familyNumber} onChange={e => setForm({...form, familyNumber: e.target.value})} placeholder="MUI-004" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">House Name *</label>
                  <input className="input-field w-full" required value={form.houseName} onChange={e => setForm({...form, houseName: e.target.value})} placeholder="Enter house name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">House Number</label>
                  <input className="input-field w-full" value={form.houseNumber} onChange={e => setForm({...form, houseNumber: e.target.value})} placeholder="12/456" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Ward</label>
                  <input className="input-field w-full" value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} placeholder="Ward 1" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Phone</label>
                  <input className="input-field w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="9876543210" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Address</label>
                  <input className="input-field w-full" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Address" />
                </div>
              </div>

              {/* Members */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Family Members ({members.length})
                </h3>
                <button type="button" className="btn-secondary text-xs py-1.5 px-3 w-full sm:w-auto justify-center" onClick={addMember}>
                  <PiPlusBold size={14} /> Add Member
                </button>
              </div>

              <div className="space-y-4">
                {members.map((member, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-xl bg-bg-primary border border-border-color">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-text-secondary">Member {idx + 1}</span>
                      {members.length > 1 && (
                        <button type="button" onClick={() => removeMember(idx)} className="text-red-400 border border-red-400/20 bg-red-400/10 p-1.5 rounded-md hover:bg-red-400/20 transition-colors">
                          <PiXBold size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Name *</label>
                        <input className="input-field w-full" required value={member.name} onChange={e => updateMember(idx, "name", e.target.value)} placeholder="Full name" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Relation *</label>
                        <select className="input-field w-full" value={member.relationToHead} onChange={e => updateMember(idx, "relationToHead", e.target.value)}>
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
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Gender *</label>
                        <select className="input-field w-full" value={member.gender} onChange={e => updateMember(idx, "gender", e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Date of Birth</label>
                        <input className="input-field w-full" type="date" value={member.dob} onChange={e => updateMember(idx, "dob", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Education</label>
                        <select className="input-field w-full" value={member.education} onChange={e => updateMember(idx, "education", e.target.value)}>
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
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Occupation</label>
                        <input className="input-field w-full" value={member.occupation} onChange={e => updateMember(idx, "occupation", e.target.value)} placeholder="Occupation" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Blood Group</label>
                        <select className="input-field w-full" value={member.bloodGroup} onChange={e => updateMember(idx, "bloodGroup", e.target.value)}>
                          <option value="">Select</option>
                          <option value="A+">A+</option><option value="A-">A-</option>
                          <option value="B+">B+</option><option value="B-">B-</option>
                          <option value="O+">O+</option><option value="O-">O-</option>
                          <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1.5">Phone</label>
                        <input className="input-field w-full" value={member.phone} onChange={e => updateMember(idx, "phone", e.target.value)} placeholder="Phone" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8 pt-6 border-t border-border-color">
                <button type="button" className="btn-secondary w-full sm:w-auto justify-center" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={submitting}>
                  {submitting ? <PiSpinner size={18} className="animate-spin" /> : <PiPlusBold size={18} />}
                  {submitting ? "Registering..." : "Register Family"}
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
