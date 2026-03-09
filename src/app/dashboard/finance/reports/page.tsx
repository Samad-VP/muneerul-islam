"use client"
import { useState, useEffect } from "react"
import { PiDownloadSimple, PiBank, PiWallet, PiArrowUpRight, PiArrowDownRight, PiUsers, PiSpinner, PiChartPieSliceDuotone, PiCalendarDuotone } from "react-icons/pi"
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
    } catch (_err) {
      console.error("Failed to fetch reports", _err)
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 bg-bg-primary rounded-[2.5rem]">
        <PiSpinner size={48} className="animate-spin text-emerald-500 mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary/30">Compiling financial data...</p>
      </div>
    )
  }
  
  if (!reportData) return <div className="p-12 text-center text-text-muted">Failed to load reports.</div>

  return (
    <div className="animate-fade-in w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 w-full">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tighter uppercase">
            Finance <span className="gradient-text">Intelligence</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Analytics
            </span>
          </div>
        </div>
        <button onClick={exportAnnualStatement} className="btn-primary w-full sm:w-auto justify-center py-4 px-10 rounded-2xl glow-effect text-sm shrink-0 uppercase tracking-widest font-black shadow-premium">
          <PiDownloadSimple size={22} /> Export Statement
        </button>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <div className="glass-card p-8 rounded-[2rem] border-none shadow-premium group relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <PiBank size={64} className="text-emerald-500" />
           </div>
           <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <PiBank size={20} />
             </div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">General Fund</h3>
           </div>
           <p className="text-3xl font-black text-text-primary tracking-tighter">₹{reportData.tổngBalances.general.toLocaleString()}</p>
           <p className="text-[10px] font-bold text-emerald-500 uppercase mt-2">Available Balance</p>
         </div>
         
         <div className="glass-card p-8 rounded-[2rem] border-none shadow-premium group relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <PiWallet size={64} className="text-purple-500" />
           </div>
           <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <PiWallet size={20} />
             </div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Special Fund</h3>
           </div>
           <p className="text-3xl font-black text-text-primary tracking-tighter">₹{reportData.tổngBalances.special.toLocaleString()}</p>
           <p className="text-[10px] font-bold text-purple-500 uppercase mt-2">Reserve Balance</p>
         </div>

         <div className="glass-card p-8 rounded-[2rem] border-none shadow-premium group relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <PiArrowUpRight size={64} className="text-rose-500" />
           </div>
           <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 text-rose-400">
                <PiArrowUpRight size={20} />
             </div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Receivables</h3>
           </div>
           <p className="text-3xl font-black text-rose-500 tracking-tighter">₹{reportData.pendingDues.toLocaleString()}</p>
           <p className="text-[10px] font-bold text-rose-400 uppercase mt-2">Pending Dues</p>
         </div>

         <div className="glass-card p-8 rounded-[2rem] border-none shadow-premium group relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <PiUsers size={64} className="text-blue-500" />
           </div>
           <div className="flex items-center gap-4 mb-6">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <PiUsers size={20} />
             </div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary/40">Contribution</h3>
           </div>
           <p className="text-3xl font-black text-text-primary tracking-tighter">{reportData.demographics.activeFamilies}</p>
           <p className="text-[10px] font-bold text-blue-500 uppercase mt-2">Active Payers</p>
         </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Monthly Insight */}
          <div className="glass-card p-10 rounded-[2.5rem] border-none shadow-premium flex flex-col justify-between min-h-[300px] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full" />
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-primary">
                  <PiCalendarDuotone size={24} />
                </div>
                <h2 className="text-xl font-black text-text-primary tracking-tight uppercase">Monthly Velocity</h2>
              </div>
              <div className="grid grid-cols-1 gap-8">
                 <div className="group">
                    <p className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <PiArrowDownRight className="text-emerald-500" size={16}/> Total Income
                    </p>
                    <div className="flex items-end gap-3">
                      <p className="text-5xl font-black text-emerald-500 tracking-tighter">₹{reportData.currentMonth.income.toLocaleString()}</p>
                    </div>
                 </div>
                 
                 <div className="group pt-8 border-t border-border-color/10">
                    <p className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                       <PiArrowUpRight className="text-rose-500 text-rose-400" size={16}/> Operating Expenses
                    </p>
                    <div className="flex items-end gap-3">
                      <p className="text-5xl font-black text-rose-500 tracking-tighter">₹{reportData.currentMonth.expense.toLocaleString()}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Funds Viz */}
        <div className="xl:col-span-3 glass-card p-10 rounded-[2.5rem] border-none shadow-premium flex flex-col min-h-[500px]">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-text-primary">
                <PiChartPieSliceDuotone size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-text-primary tracking-tight uppercase">Capital allocation</h2>
                <p className="text-[10px] font-black text-text-primary/40 uppercase tracking-widest mt-1">Portfolio breakdown by fund type</p>
              </div>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
               Total Worth: ₹{reportData.tổngBalances.total.toLocaleString()}
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col lg:flex-row gap-10">
            <div className="flex-1 relative min-h-[250px] lg:min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={reportData.funds}
                     dataKey="balance"
                     nameKey="name"
                     cx="50%"
                     cy="50%"
                     innerRadius={80}
                     outerRadius={110}
                     paddingAngle={8}
                     strokeWidth={0}
                   >
                     {reportData.funds.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={entry.type === 'general' ? '#10b981' : '#f59e0b'} />
                     ))}
                   </Pie>
                   <Tooltip 
                      formatter={(value: any) => [`₹ ${Number(value).toLocaleString()}`, 'Balance']}
                      contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', padding: '1.5rem' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary/20">Aggregate</span>
                  <span className="text-2xl font-black text-text-primary tracking-tighter">₹{reportData.tổngBalances.total.toLocaleString()}</span>
               </div>
            </div>

            <div className="w-full lg:w-[250px] flex flex-col gap-4 overflow-y-auto custom-scrollbar max-h-[350px] pr-2">
              {reportData.funds.map((f: any) => (
                <div key={f.id} className="group p-5 rounded-2xl bg-bg-secondary/30 border border-border-color/10 hover:border-emerald-500/20 transition-all flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${f.type === 'general' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
                      <span className="text-[10px] font-black text-text-primary/60 uppercase tracking-widest truncate max-w-[120px]" title={f.name}>{f.name}</span>
                    </div>
                    <span className="text-[9px] font-black text-text-primary/20 uppercase tracking-[0.2em]">{f.type}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-black text-text-primary tracking-tighter">₹{f.balance.toLocaleString()}</span>
                    <span className="text-[9px] font-bold text-emerald-500/50">{( (f.balance / reportData.tổngBalances.total) * 100).toFixed(1)}%</span>
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
