"use client"
import { useState, useEffect } from "react"
import { PiDownloadSimple, PiBank, PiWallet, PiArrowUpRight, PiArrowDownRight, PiUsers } from "react-icons/pi"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

export default function FinanceReportsPage() {
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await fetch("/api/finance/reports")
      if (res.ok) {
        setReportData(await res.json())
      }
    } catch (error) {
      console.error("Failed to fetch reports", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const exportAnnualStatement = () => {
    if (!reportData) return
    const doc = new jsPDF()
    
    // Page Border
    doc.setDrawColor(16, 185, 129) // Emerald 500
    doc.setLineWidth(0.5)
    doc.rect(5, 5, 200, 287)
    
    // Header
    doc.setTextColor(6, 78, 59) // Emerald 900
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("Muneerul Islam Mahallu", 105, 22, { align: "center" })
    
    doc.setTextColor(100, 116, 139) // Slate 500
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text("Annual Financial Statement", 105, 30, { align: "center" })
    
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: "center" })

    doc.setDrawColor(226, 232, 240)
    doc.line(20, 45, 190, 45)

    // Fund Balances Table
    autoTable(doc, {
      startY: 55,
      head: [['Fund Name', 'Type', 'Current Balance (INR)']],
      body: reportData.funds.map((f: any) => [
        f.name,
        f.type.toUpperCase(),
        `Rs. ${f.balance.toLocaleString()}`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: 255 }, // Emerald 500
      styles: { fontSize: 11, cellPadding: 6 }
    })

    // Summary Section
    const finalY = (doc as any).lastAutoTable.finalY || 55
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Total General Balance: Rs. ${reportData.tổngBalances.general.toLocaleString()}`, 14, finalY + 15)
    doc.text(`Total Special Balance: Rs. ${reportData.tổngBalances.special.toLocaleString()}`, 14, finalY + 23)
    
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(16, 185, 129)
    doc.text(`Overall Net Balance: Rs. ${reportData.tổngBalances.total.toLocaleString()}`, 14, finalY + 35)
    
    // Footer
    doc.setTextColor(148, 163, 184)
    doc.setFontSize(9)
    doc.setFont("helvetica", "italic")
    doc.text("This is an automatically generated document.", 105, 280, { align: "center" })

    doc.save(`Financial_Statement_${new Date().getFullYear()}.pdf`)
  }

  if (loading) return <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
  if (!reportData) return <div className="p-12 text-center text-text-muted">Failed to load reports.</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Finance Reports</h1>
          <p className="text-sm text-text-muted mt-1">Analytics and financial statement generation</p>
        </div>
        <button onClick={exportAnnualStatement} className="btn bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2">
          <PiDownloadSimple size={18} />
          <span>Export PDF Statement</span>
        </button>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-text-muted">
             <PiBank size={20} className="text-emerald-500" />
             <h3 className="text-sm font-medium">Net General Balance</h3>
           </div>
           <p className="text-2xl font-bold text-text-primary">₹ {reportData.tổngBalances.general.toLocaleString()}</p>
         </div>
         
         <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-text-muted">
             <PiWallet size={20} className="text-purple-500" />
             <h3 className="text-sm font-medium">Net Special Balance</h3>
           </div>
           <p className="text-2xl font-bold text-text-primary">₹ {reportData.tổngBalances.special.toLocaleString()}</p>
         </div>

         <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-text-muted">
             <PiArrowUpRight size={20} className="text-blue-500" />
             <h3 className="text-sm font-medium">Pending Dues</h3>
           </div>
           <p className="text-2xl font-bold text-amber-500">₹ {reportData.pendingDues.toLocaleString()}</p>
         </div>

         <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm">
           <div className="flex items-center gap-3 mb-2 text-text-muted">
             <PiUsers size={20} className="text-orange-500" />
             <h3 className="text-sm font-medium">Active Payers</h3>
           </div>
           <p className="text-2xl font-bold text-text-primary">{reportData.demographics.activeFamilies}</p>
         </div>
      </div>

      {/* Mid Section: Current Month Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-border-color rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-4">Current Month Flow</h2>
           <div className="flex gap-6 items-center justify-between">
              <div>
                 <p className="text-sm text-text-muted mb-1 flex items-center gap-1"><PiArrowDownRight className="text-emerald-500"/> Total Income</p>
                 <p className="text-3xl font-bold text-emerald-500">₹ {reportData.currentMonth.income.toLocaleString()}</p>
              </div>
              <div className="h-12 w-px bg-border-color"></div>
              <div className="text-right">
                 <p className="text-sm text-text-muted mb-1 flex justify-end items-center gap-1"><PiArrowUpRight className="text-red-400"/> Total Expenses</p>
                 <p className="text-3xl font-bold text-red-400">₹ {reportData.currentMonth.expense.toLocaleString()}</p>
              </div>
           </div>
        </div>
        
        <div className="bg-bg-card border border-border-color rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
          <h2 className="text-lg font-bold text-text-primary mb-4">Funds Breakdown</h2>
          <div className="flex-1 w-full min-h-0 relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                 <Pie
                   data={reportData.funds}
                   dataKey="balance"
                   nameKey="name"
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                 >
                   {reportData.funds.map((entry: any, index: number) => (
                     <Cell key={`cell-${index}`} fill={entry.type === 'general' ? '#10b981' : '#f59e0b'} />
                   ))}
                 </Pie>
                 <Tooltip 
                    formatter={(value: any) => `₹ ${Number(value).toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#1a2332', borderColor: '#2a3a4a', borderRadius: '12px', color: '#f1f5f9' }} 
                 />
               </PieChart>
             </ResponsiveContainer>
             {/* Overlay Total */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-text-muted font-medium">Net Total</span>
                <span className="text-lg font-bold text-text-primary">₹ {reportData.tổngBalances.total.toLocaleString()}</span>
             </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {reportData.funds.map((f: any) => (
              <div key={f.id} className="flex justify-between items-center bg-bg-secondary/50 p-2 rounded-lg border border-border-color">
                <div className="flex items-center gap-2 truncate">
                  <div className={`w-2 h-2 shrink-0 rounded-full ${f.type === 'general' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <span className="text-xs text-text-secondary truncate" title={f.name}>{f.name}</span>
                </div>
                <span className="text-xs font-bold text-text-primary ml-2">₹{f.balance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
