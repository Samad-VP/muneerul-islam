"use client"
import { useState, useEffect } from "react"
import { PiCheckCircle, PiClock, PiPlus, PiArrowsClockwise, PiReceipt } from "react-icons/pi"

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<any[]>([])
  const [funds, setFunds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  
  // Form State
  const [amount, setAmount] = useState("")
  const [fundId, setFundId] = useState("")
  const [notes, setNotes] = useState("")

  const fetchData = async () => {
    try {
      const [incRes, fundsRes] = await Promise.all([
        fetch("/api/finance/incomes"),
        fetch("/api/finance/funds")
      ])
      if (incRes.ok) setIncomes(await incRes.json())
      if (fundsRes.ok) {
        const fData = await fundsRes.json()
        setFunds(fData)
        if (fData.length > 0) setFundId(fData[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/finance/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, fundId, notes, status: "PAID", isMonthlyDue: false })
      })
      if (res.ok) {
        setIsRecordModalOpen(false)
        fetchData()
        setAmount("")
        setNotes("")
      }
    } catch (error) {
      console.error("Failed to record income")
    }
  }

  const handleGenerateDues = async () => {
    if (!confirm("Are you sure you want to generate pending monthly dues for all active families?")) return
    try {
      const d = new Date()
      const res = await fetch("/api/finance/incomes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: d.getMonth() + 1, year: d.getFullYear(), fundId: funds.find(f => f.isDefault)?.id || funds[0]?.id })
      })
      if (res.ok) {
        const data = await res.json()
        alert(data.message)
        fetchData()
      }
    } catch (error) {
      console.error("Failed to generate dues")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Incomes & Dues</h1>
          <p className="text-sm text-text-muted mt-1">Manage family dues and special donations</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleGenerateDues} className="btn bg-bg-secondary border border-border-color text-text-primary hover:bg-bg-tertiary flex items-center gap-2">
            <PiArrowsClockwise size={18} />
            <span>Generate Dues</span>
          </button>
          <button onClick={() => setIsRecordModalOpen(true)} className="btn btn-primary flex items-center gap-2">
            <PiPlus size={18} />
            <span>Record Income</span>
          </button>
        </div>
      </div>

      <div className="bg-bg-card border border-border-color rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="bg-bg-secondary/50 text-text-primary text-xs uppercase tracking-wider border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-semibold">Receipt No</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Details</th>
                <th className="px-6 py-4 font-semibold">Fund</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : incomes.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-text-muted">No incomes recorded yet.</td></tr>
              ) : incomes.map((inc) => (
                <tr key={inc.id} className="hover:bg-bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{inc.receiptNo}</td>
                  <td className="px-6 py-4">{new Date(inc.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary">
                      {inc.isMonthlyDue ? `Monthly Due (${inc.month}/${inc.year})` : 'Special Donation'}
                    </div>
                    {inc.family?.familyNumber && <div className="text-xs text-text-muted">Family: {inc.family.familyNumber}</div>}
                  </td>
                  <td className="px-6 py-4">{inc.fund?.name || '-'}</td>
                  <td className="px-6 py-4 text-right font-bold text-text-primary">₹ {inc.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      inc.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' :
                      inc.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {inc.status === 'PAID' ? <PiCheckCircle size={14} /> : <PiClock size={14} />}
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isRecordModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-bg-card border border-border-color rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border-color flex justify-between items-center bg-bg-secondary/50">
              <h2 className="text-lg font-bold text-text-primary">Record Income</h2>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <form id="recordForm" onSubmit={handleRecordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Fund <span className="text-red-500">*</span></label>
                  <select required value={fundId} onChange={e => setFundId(e.target.value)} className="w-full input">
                    {funds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                  <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full input" placeholder="e.g., 1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Notes / Description</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full input" rows={3} placeholder="Optional details..."></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-border-color flex justify-end gap-3 bg-bg-secondary/50">
              <button onClick={() => setIsRecordModalOpen(false)} className="btn bg-bg-secondary border border-border-color text-text-primary hover:bg-bg-tertiary">Cancel</button>
              <button type="submit" form="recordForm" className="btn btn-primary flex items-center gap-2">
                <PiReceipt size={18} />
                Save Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
