"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  PiArrowLeftBold, PiUsersDuotone, PiPhoneCallDuotone, PiMapPinDuotone, PiHashBold, PiPlusBold, PiXBold, PiSpinner,
  PiUserDuotone, PiCalendarDuotone, PiDropDuotone, PiGraduationCapDuotone, PiBriefcaseDuotone, PiGlobeDuotone, PiPencilSimpleLineDuotone
} from "react-icons/pi"

export default function FamilyDetailPage() {
  const params = useParams()
  const [family, setFamily] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [memberForm, setMemberForm] = useState({
    name: "", relationToHead: "", gender: "Male", dob: "", maritalStatus: "Single",
    phone: "", bloodGroup: "", education: "", occupation: "", abroad: false, abroadCountry: "",
    healthIssues: "", remarks: "",
  })

  // Edit Family state
  const [showEditFamily, setShowEditFamily] = useState(false)
  const [familyForm, setFamilyForm] = useState({
    houseName: "", houseNumber: "", address: "", ward: "", phone: "", rationCardNo: "", annualIncome: "", notes: "", isActive: true,
  })

  // Edit Member state
  const [showEditMember, setShowEditMember] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)

  const fetchFamily = () => {
    setLoading(true)
    fetch(`/api/families/${params.id}`)
      .then(res => res.json())
      .then(data => { setFamily(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchFamily() }, [params.id])

  const openEditFamily = () => {
    if (family) {
      setFamilyForm({
        houseName: family.houseName || "",
        houseNumber: family.houseNumber || "",
        address: family.address || "",
        ward: family.ward || "",
        phone: family.phone || "",
        rationCardNo: family.rationCardNo || "",
        annualIncome: family.annualIncome || "",
        notes: family.notes || "",
        isActive: family.isActive ?? true,
      })
      setShowEditFamily(true)
    }
  }

  const openEditMember = (member: any) => {
    setEditingMemberId(member.id)
    setMemberForm({
      name: member.name || "",
      relationToHead: member.relationToHead || "",
      gender: member.gender || "Male",
      dob: member.dob ? new Date(member.dob).toISOString().split('T')[0] : "",
      maritalStatus: member.maritalStatus || "Single",
      phone: member.phone || "",
      bloodGroup: member.bloodGroup || "",
      education: member.education || "",
      occupation: member.occupation || "",
      abroad: member.abroad || false,
      abroadCountry: member.abroadCountry || "",
      healthIssues: member.healthIssues || "",
      remarks: member.remarks || "",
    })
    setShowEditMember(true)
  }

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...memberForm, familyId: params.id }),
      })
      if (res.ok) {
        setShowAddMember(false)
        setMemberForm({ name: "", relationToHead: "", gender: "Male", dob: "", maritalStatus: "Single", phone: "", bloodGroup: "", education: "", occupation: "", abroad: false, abroadCountry: "", healthIssues: "", remarks: "" })
        fetchFamily()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const editFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/families/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(familyForm),
      })
      if (res.ok) {
        setShowEditFamily(false)
        fetchFamily()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const editMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/members/${editingMemberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberForm),
      })
      if (res.ok) {
        setShowEditMember(false)
        setEditingMemberId(null)
        setMemberForm({ name: "", relationToHead: "", gender: "Male", dob: "", maritalStatus: "Single", phone: "", bloodGroup: "", education: "", occupation: "", abroad: false, abroadCountry: "", healthIssues: "", remarks: "" })
        fetchFamily()
      }
    } catch (e) { console.error(e) }
    setSubmitting(false)
  }

  const deleteMember = async (memberId: string) => {
    if (!confirm("Delete this member?")) return
    await fetch(`/api/members/${memberId}`, { method: "DELETE" })
    fetchFamily()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <PiSpinner size={40} className="animate-spin text-emerald-400" />
      </div>
    )
  }

  if (!family) return <div className="text-center p-16 text-text-muted font-bold text-lg">Family not found</div>

  return (
    <>
      <div className="animate-fade-in pb-10 w-full">
      {/* Header */}
      <Link href="/dashboard/families" className="inline-flex items-center gap-2 text-text-secondary hover:text-emerald-400 transition-colors text-sm font-bold mb-6 sm:mb-8">
        <PiArrowLeftBold size={16} /> Back to Families
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 sm:gap-4 mb-8 sm:mb-10 w-full">
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text mb-2 sm:mb-3">{family.houseName}</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-2">
            <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider bg-bg-secondary px-2.5 py-1 rounded-md border border-border-color">
              <PiHashBold size={14} className="text-emerald-500" /> {family.familyNumber}
            </span>
            {family.ward && <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider bg-bg-secondary px-2.5 py-1 rounded-md border border-border-color">
              <PiMapPinDuotone size={14} className="text-blue-500" /> {family.ward}
            </span>}
            {family.phone && <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider bg-bg-secondary px-2.5 py-1 rounded-md border border-border-color">
              <PiPhoneCallDuotone size={14} className="text-gold" /> {family.phone}
            </span>}
            <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider bg-bg-secondary px-2.5 py-1 rounded-md border border-border-color">
              <PiUsersDuotone size={14} className="text-purple-500" /> {family.members?.length} members
            </span>
          </div>
        </div>
        <button className="btn-secondary w-full sm:w-auto justify-center" onClick={openEditFamily}>
          <PiPencilSimpleLineDuotone size={18} /> Edit Family
        </button>
        <button className="btn-primary w-full sm:w-auto justify-center" onClick={() => setShowAddMember(true)}>
          <PiPlusBold size={18} /> Add Member
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
        {family.members?.map((member: any, idx: number) => (
          <div key={member.id} className="glass-card p-5 sm:p-6 hover:shadow-lg transition-all border border-border-color hover:border-emerald-500/30 group w-full">
            <div className="flex justify-between items-start mb-5 w-full">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-extrabold group-hover:scale-110 transition-transform shadow-inner ${
                  member.gender === "Male" 
                    ? "bg-blue-500/10 border border-blue-500/30 text-blue-400" 
                    : "bg-pink-500/10 border border-pink-500/30 text-pink-400"
                }`}>
                  {member.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-text-primary mb-1">{member.name}</h3>
                  <span className={`badge ${member.relationToHead === "Head" ? "badge-gold" : "badge-blue"} text-[10px] sm:text-xs`}>
                    {member.relationToHead}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditMember(member)}
                  className="text-text-muted hover:text-emerald-400 transition-colors p-2 hover:bg-emerald-500/10 rounded-lg"
                  title="Edit Member"
                >
                  <PiPencilSimpleLineDuotone size={16} />
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="text-text-muted hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                  title="Delete Member"
                >
                  <PiXBold size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm pt-4 border-t border-border-color w-full">
              {member.dob && (
                <div className="flex items-center gap-2 text-text-secondary font-medium truncate">
                  <PiCalendarDuotone size={16} className="text-blue-400 shrink-0" />
                  <span className="truncate">{new Date(member.dob).toLocaleDateString("en-IN")}</span>
                </div>
              )}
              {member.bloodGroup && (
                <div className="flex items-center gap-2 text-text-secondary font-medium truncate">
                  <PiDropDuotone size={16} className="text-red-400 shrink-0" />
                  <span className="truncate">{member.bloodGroup}</span>
                </div>
              )}
              {member.education && (
                <div className="flex items-center gap-2 text-text-secondary font-medium truncate">
                  <PiGraduationCapDuotone size={16} className="text-gold shrink-0" />
                  <span className="truncate">{member.education}</span>
             </div>
              )}
              {member.occupation && (
                <div className="flex items-center gap-2 text-text-secondary font-medium truncate">
                  <PiBriefcaseDuotone size={16} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{member.occupation}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-2 text-text-secondary font-medium truncate">
                  <PiPhoneCallDuotone size={16} className="text-purple-400 shrink-0" />
                  <span className="truncate">{member.phone}</span>
                </div>
              )}
              {member.abroad && (
                <div className="flex items-center gap-2 text-text-secondary font-medium truncate">
                  <PiGlobeDuotone size={16} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{member.abroadCountry || "Abroad"}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6 w-full h-full" onClick={() => setShowAddMember(false)}>
          <div className="glass-card w-full max-w-2xl bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl w-full">
              <h2 className="text-lg sm:text-xl font-extrabold gradient-text">Add Family Member</h2>
              <button type="button" onClick={() => setShowAddMember(false)} className="text-text-muted hover:text-text-primary transition-colors p-1.5 hover:bg-bg-card-hover rounded-lg"><PiXBold size={20} /></button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6 w-full">
              <form onSubmit={addMember} className="flex flex-col w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
                <div className="w-full">
                  <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Name *</label>
                  <input className="input-field w-full" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} />
                </div>
                <div className="w-full">
                  <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Relation to Head *</label>
                  <select className="input-field w-full" required value={memberForm.relationToHead} onChange={e => setMemberForm({...memberForm, relationToHead: e.target.value})}>
                    <option value="">Select</option>
                    <option value="Head">Head</option><option value="Spouse">Spouse</option>
                    <option value="Son">Son</option><option value="Daughter">Daughter</option>
                    <option value="Father">Father</option><option value="Mother">Mother</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="w-full">
                  <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Gender *</label>
                  <select className="input-field w-full" value={memberForm.gender} onChange={e => setMemberForm({...memberForm, gender: e.target.value})}>
                    <option value="Male">Male</option><option value="Female">Female</option>
                  </select>
                </div>
                <div className="w-full">
                  <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Date of Birth</label>
                  <input className="input-field w-full" type="date" value={memberForm.dob} onChange={e => setMemberForm({...memberForm, dob: e.target.value})} />
                </div>
                <div className="w-full">
                  <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Education</label>
                  <select className="input-field w-full" value={memberForm.education} onChange={e => setMemberForm({...memberForm, education: e.target.value})}>
                    <option value="">Select</option>
                    <option value="Primary">Primary</option><option value="SSLC">SSLC</option>
                    <option value="Plus Two">Plus Two</option><option value="Graduation">Graduation</option>
                    <option value="Post Graduation">Post Graduation</option>
                  </select>
                </div>
                <div className="w-full">
                  <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Occupation</label>
                  <input className="input-field w-full" value={memberForm.occupation} onChange={e => setMemberForm({...memberForm, occupation: e.target.value})} />
                </div>
                <div className="w-full">
                  <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Blood Group</label>
                  <select className="input-field w-full" value={memberForm.bloodGroup} onChange={e => setMemberForm({...memberForm, bloodGroup: e.target.value})}>
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="w-full">
                  <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Phone</label>
                  <input className="input-field w-full" value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-6 sm:mt-8 pt-5 border-t border-border-color w-full">
                <button type="button" className="btn-secondary w-full sm:w-auto justify-center" onClick={() => setShowAddMember(false)}>Cancel</button>
                <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={submitting}>
                  {submitting ? <PiSpinner size={18} className="animate-spin" /> : <PiPlusBold size={18} />}
                  {submitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
      {/* Edit Family Modal */}
      {showEditFamily && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6 w-full h-full" onClick={() => setShowEditFamily(false)}>
          <div className="glass-card w-full max-w-2xl bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl w-full">
              <h2 className="text-lg sm:text-xl font-extrabold gradient-text">Edit Family Details</h2>
              <button type="button" onClick={() => setShowEditFamily(false)} className="text-text-muted hover:text-text-primary transition-colors p-1.5 hover:bg-bg-card-hover rounded-lg"><PiXBold size={20} /></button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6 w-full">
              <form onSubmit={editFamily} className="flex flex-col w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">House Name *</label>
                    <input className="input-field w-full" required value={familyForm.houseName} onChange={e => setFamilyForm({...familyForm, houseName: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">House Number</label>
                    <input className="input-field w-full" value={familyForm.houseNumber} onChange={e => setFamilyForm({...familyForm, houseNumber: e.target.value})} />
                  </div>
                  <div className="w-full sm:col-span-2">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Address</label>
                    <textarea className="input-field w-full" rows={2} value={familyForm.address} onChange={e => setFamilyForm({...familyForm, address: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Ward</label>
                    <input className="input-field w-full" value={familyForm.ward} onChange={e => setFamilyForm({...familyForm, ward: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Phone</label>
                    <input className="input-field w-full" value={familyForm.phone} onChange={e => setFamilyForm({...familyForm, phone: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Ration Card No</label>
                    <input className="input-field w-full" value={familyForm.rationCardNo} onChange={e => setFamilyForm({...familyForm, rationCardNo: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Annual Income</label>
                    <input className="input-field w-full" type="number" value={familyForm.annualIncome} onChange={e => setFamilyForm({...familyForm, annualIncome: e.target.value})} />
                  </div>
                  <div className="w-full sm:col-span-2">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Notes</label>
                    <textarea className="input-field w-full" rows={2} value={familyForm.notes} onChange={e => setFamilyForm({...familyForm, notes: e.target.value})} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-6 sm:mt-8 pt-5 border-t border-border-color w-full">
                  <button type="button" className="btn-secondary w-full sm:w-auto justify-center" onClick={() => setShowEditFamily(false)}>Cancel</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={submitting}>
                    {submitting ? <PiSpinner size={18} className="animate-spin" /> : <PiPencilSimpleLineDuotone size={18} />}
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col justify-end sm:justify-center items-center sm:p-6 w-full h-full" onClick={() => setShowEditMember(false)}>
          <div className="glass-card w-full max-w-2xl bg-bg-card border-t sm:border border-border-color rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-4rem)] animate-slide-up sm:animate-fade-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="shrink-0 flex justify-between items-center p-5 sm:p-6 border-b border-border-color rounded-t-2xl sm:rounded-2xl w-full">
              <h2 className="text-lg sm:text-xl font-extrabold gradient-text">Edit Family Member</h2>
              <button type="button" onClick={() => setShowEditMember(false)} className="text-text-muted hover:text-text-primary transition-colors p-1.5 hover:bg-bg-card-hover rounded-lg"><PiXBold size={20} /></button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 p-5 sm:p-6 w-full">
              <form onSubmit={editMember} className="flex flex-col w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Name *</label>
                    <input className="input-field w-full" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Relation to Head *</label>
                    <select className="input-field w-full" required value={memberForm.relationToHead} onChange={e => setMemberForm({...memberForm, relationToHead: e.target.value})}>
                      <option value="">Select</option>
                      <option value="Head">Head</option><option value="Spouse">Spouse</option>
                      <option value="Son">Son</option><option value="Daughter">Daughter</option>
                      <option value="Father">Father</option><option value="Mother">Mother</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Gender *</label>
                    <select className="input-field w-full" value={memberForm.gender} onChange={e => setMemberForm({...memberForm, gender: e.target.value})}>
                      <option value="Male">Male</option><option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Date of Birth</label>
                    <input className="input-field w-full" type="date" value={memberForm.dob} onChange={e => setMemberForm({...memberForm, dob: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Education</label>
                    <select className="input-field w-full" value={memberForm.education} onChange={e => setMemberForm({...memberForm, education: e.target.value})}>
                      <option value="">Select</option>
                      <option value="Primary">Primary</option><option value="SSLC">SSLC</option>
                      <option value="Plus Two">Plus Two</option><option value="Graduation">Graduation</option>
                      <option value="Post Graduation">Post Graduation</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Occupation</label>
                    <input className="input-field w-full" value={memberForm.occupation} onChange={e => setMemberForm({...memberForm, occupation: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Blood Group</label>
                    <select className="input-field w-full" value={memberForm.bloodGroup} onChange={e => setMemberForm({...memberForm, bloodGroup: e.target.value})}>
                      <option value="">Select</option>
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1.5 sm:mb-2 w-full">Phone</label>
                    <input className="input-field w-full" value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-6 sm:mt-8 pt-5 border-t border-border-color w-full">
                  <button type="button" className="btn-secondary w-full sm:w-auto justify-center" onClick={() => setShowEditMember(false)}>Cancel</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto justify-center" disabled={submitting}>
                    {submitting ? <PiSpinner size={18} className="animate-spin" /> : <PiPencilSimpleLineDuotone size={18} />}
                    {submitting ? "Saving..." : "Save Changes"}
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
