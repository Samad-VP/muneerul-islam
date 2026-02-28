"use client"
import { useState, useEffect } from "react"
import { PiDownloadSimple, PiHouse, PiUsers, PiCheckCircle, PiClock, PiReceipt } from "react-icons/pi"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function PortalPage() {
  const [family, setFamily] = useState<any>(null)
  const [donations, setDonations] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [famRes, donRes] = await Promise.all([
        fetch("/api/portal/family"),
        fetch("/api/portal/donations")
      ])
      if (famRes.ok) setFamily(await famRes.json())
      if (donRes.ok) setDonations(await donRes.json())
    } catch (error) {
      console.error("Failed to fetch portal data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const exportAnnualStatement = () => {
    if (!family || !donations) return
    const doc = new jsPDF()
    
    // Page Border
    doc.setDrawColor(16, 185, 129) // Emerald 500
    doc.setLineWidth(0.5)
    doc.rect(5, 5, 200, 287)

    // Header
    doc.setTextColor(6, 78, 59)
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("Muneerul Islam Mahallu", 105, 22, { align: "center" })
    
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text("Annual Contribution Statement", 105, 30, { align: "center" })
    
    doc.setFontSize(11)
    doc.text(`Family No: ${family.familyNumber} | ${family.houseName}`, 105, 38, { align: "center" })

    doc.setDrawColor(226, 232, 240)
    doc.line(20, 45, 190, 45)

    // Contributions Table
    autoTable(doc, {
      startY: 55,
      head: [['Date', 'Receipt No', 'Details', 'Fund', 'Amount (INR)', 'Status']],
      body: [...donations.monthlyDues, ...donations.specialContributions].map((d: any) => [
        new Date(d.createdAt).toLocaleDateString(),
        d.receiptNo,
        d.isMonthlyDue ? `Monthly Due (${d.month}/${d.year})` : 'Special Donation',
        d.fund?.name || '-',
        d.amount,
        d.status
      ]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 5 }
    })

    const finalY = (doc as any).lastAutoTable.finalY || 55
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(12)
    doc.text(`Total Paid: Rs. ${donations.totalPaid.toLocaleString()}`, 14, finalY + 15)
    doc.text(`Pending Dues: Rs. ${donations.totalPending.toLocaleString()}`, 14, finalY + 23)
    
    // Footer
    doc.setTextColor(148, 163, 184)
    doc.setFontSize(9)
    doc.setFont("helvetica", "italic")
    doc.text("This is an automatically generated document.", 105, 280, { align: "center" })

    doc.save(`Family_${family.familyNumber}_Statement.pdf`)
  }

  const exportReceipt = (donation: any) => {
    const doc = new jsPDF("p", "mm", [100, 150]) // small receipt
    
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.rect(3, 3, 94, 144)
    
    doc.setTextColor(6, 78, 59)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Muneerul Islam Mahallu", 50, 15, { align: "center" })
    
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Donation Receipt", 50, 22, { align: "center" })
    
    doc.setDrawColor(226, 232, 240)
    doc.line(10, 28, 90, 28)

    doc.setTextColor(30, 41, 59)
    doc.setFontSize(9)
    doc.text(`Receipt No: ${donation.receiptNo}`, 10, 40)
    doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString()}`, 10, 47)
    doc.text(`Family: ${family.familyNumber} - ${family.houseName}`, 10, 54)
    doc.text(`Fund: ${donation.fund?.name || '-'}`, 10, 61)
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(16, 185, 129)
    doc.text(`Amount: Rs. ${donation.amount}`, 10, 75)
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(30, 41, 59)
    doc.text(`Status: ${donation.status}`, 10, 83)

    doc.setTextColor(148, 163, 184)
    doc.setFontSize(10)
    doc.setFont("helvetica", "italic")
    doc.text("Thank you for your contribution!", 50, 135, { align: "center" })

    doc.save(`Receipt_${donation.receiptNo}.pdf`)
  }

  if (loading) return <div className="flex justify-center p-24"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
  if (!family) return <div className="p-24 text-center text-text-muted">Failed to load family data. Ensure you are logged in as a Family Head.</div>

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Profile */}
      <div className="bg-bg-card border border-border-color rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
         <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border-4 border-emerald-500/20 shadow-md">
            <PiHouse size={40} />
         </div>
         <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{family.houseName}</h1>
            <p className="text-text-muted font-medium mt-1">Family No: {family.familyNumber} • {family.ward}</p>
         </div>
         <div>
            <button onClick={exportAnnualStatement} className="btn bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2">
              <PiDownloadSimple size={18} />
              <span className="hidden sm:inline">Annual Statement</span>
            </button>
         </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-card p-6 rounded-2xl border border-border-color shadow-sm flex flex-col justify-center">
           <div className="text-text-muted flex items-center gap-2 mb-2"><PiUsers size={20}/> Family Members</div>
           <div className="text-4xl font-bold text-text-primary">{family.members?.length || 0}</div>
        </div>
        <div className="bg-bg-card p-6 rounded-2xl border border-emerald-500/30 shadow-sm flex flex-col justify-center bg-gradient-to-br from-emerald-500/5 to-transparent">
           <div className="text-emerald-500 flex items-center gap-2 mb-2"><PiCheckCircle size={20}/> Total Paid</div>
           <div className="text-4xl font-bold text-emerald-500">₹ {donations?.totalPaid?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-bg-card p-6 rounded-2xl border border-amber-500/30 shadow-sm flex flex-col justify-center bg-gradient-to-br from-amber-500/5 to-transparent">
           <div className="text-amber-500 flex items-center gap-2 mb-2"><PiClock size={20}/> Pending Dues</div>
           <div className="text-4xl font-bold text-amber-500">₹ {donations?.totalPending?.toLocaleString() || 0}</div>
        </div>
      </div>

      {/* Donations Table Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-bg-card border border-border-color rounded-2xl overflow-hidden shadow-sm">
             <div className="p-5 border-b border-border-color">
               <h2 className="text-lg font-bold text-text-primary">Contribution History</h2>
             </div>
             <div className="divide-y divide-border-color">
                {(!donations || (donations.monthlyDues.length === 0 && donations.specialContributions.length === 0)) ? (
                  <div className="p-8 text-center text-text-muted">No contributions found.</div>
                ) : (
                  [...donations.monthlyDues, ...donations.specialContributions]
                    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((d: any) => (
                      <div key={d.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-bg-secondary/30 transition-colors">
                        <div className="flex gap-4">
                          <div className={`mt-1 p-2.5 rounded-xl h-fit ${d.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {d.status === 'PAID' ? <PiCheckCircle size={24} /> : <PiClock size={24} />}
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">{d.isMonthlyDue ? `Monthly Due (${d.month}/${d.year})` : 'Special Donation'}</p>
                            <p className="text-sm text-text-muted mt-0.5">{d.fund?.name || '-'} • {new Date(d.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs font-mono text-text-muted mt-1">Receipt: {d.receiptNo}</p>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                           <span className="text-lg font-bold text-text-primary">₹ {d.amount}</span>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${d.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                             {d.status}
                           </span>
                           {d.status === 'PAID' && (
                             <button onClick={() => exportReceipt(d)} className="text-emerald-500 hover:text-emerald-400 mt-1 flex items-center gap-1 text-xs font-medium">
                               <PiReceipt /> Download
                             </button>
                           )}
                        </div>
                      </div>
                  ))
                )}
             </div>
           </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
           <div className="bg-bg-card border border-border-color rounded-2xl overflow-hidden shadow-sm">
             <div className="p-5 border-b border-border-color bg-bg-secondary/30">
               <h2 className="text-base font-bold text-text-primary">Family Members</h2>
             </div>
             <div className="p-5 space-y-4">
                {family.members?.map((m: any) => (
                  <div key={m.id} className="flex justify-between items-center bg-bg-secondary/50 p-3 rounded-xl border border-border-color">
                     <div>
                       <p className="font-bold text-sm text-text-primary">{m.name}</p>
                       <p className="text-xs text-text-muted mt-0.5">{m.relationToHead}</p>
                     </div>
                     <div className="text-xs font-medium px-2 py-1 rounded bg-bg-card text-text-secondary border border-border-color">
                       {m.gender}
                     </div>
                  </div>
                ))}
             </div>
           </div>
        </div>

      </div>
    </div>
  )
}
