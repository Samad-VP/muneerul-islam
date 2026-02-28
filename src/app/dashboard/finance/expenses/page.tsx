"use client"
import { useState, useEffect } from "react"
import { PiCheckCircle, PiWarningCircle, PiPlus, PiXCircle, PiPaperPlaneRight } from "react-icons/pi"
import { useSession } from "next-auth/react"

export default function ExpensesPage() {
  const { data: session } = useSession()
  const [expenses, setExpenses] = useState<any[]>([])
  const [funds, setFunds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  
  // Form State
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [fundId, setFundId] = useState("")
  const [description, setDescription] = useState("")

  const fetchData = async () => {
    try {
      const [expRes, fundsRes] = await Promise.all([
        fetch("/api/finance/expenses"),
        fetch("/api/finance/funds")
      ])
      if (expRes.ok) setExpenses(await expRes.json())
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

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/finance/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount, fundId, description })
      })
      if (res.ok) {
        setIsRequestModalOpen(false)
        fetchData()
        setTitle("")
        setAmount("")
        setDescription("")
      }
    } catch (error) {
      console.error("Failed to request expense")
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this expense as ${newStatus}?`)) return
    try {
      const res = await fetch(`/api/finance/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchData()
      } else {
        const err = await res.json()
        alert(err.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Failed to update status")
    }
  }

  // Permission Logic
  const canApprove = (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "super_admin" || (session?.user as any)?.role === "treasurer" || (session?.user as any)?.role === "president"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Expenses & Approvals</h1>
          <p className="text-sm text-text-muted mt-1">Request and manage fund expenditures</p>
        </div>
        <button onClick={() => setIsRequestModalOpen(true)} className="btn btn-primary flex items-center gap-2">
          <PiPlus size={18} />
          <span>Request Expense</span>
        </button>
      </div>

      <div className="bg-bg-card border border-border-color rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="bg-bg-secondary/50 text-text-primary text-xs uppercase tracking-wider border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-semibold">Voucher No</th>
                <th className="px-6 py-4 font-semibold">Details</th>
                <th className="px-6 py-4 font-semibold">Fund</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                {canApprove && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {loading ? (
                <tr><td colSpan={canApprove ? 6 : 5} className="text-center py-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={canApprove ? 6 : 5} className="text-center py-12 text-text-muted">No expenses recorded yet.</td></tr>
              ) : expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{exp.voucherNo}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text-primary mb-1">{exp.title}</div>
                    <div className="text-xs text-text-muted flex gap-2">
                      <span>Req by: {exp.requestedBy?.name}</span>
                      {exp.approvedBy && <span>• Appr by: {exp.approvedBy.name}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">{exp.fund?.name || '-'}</td>
                  <td className="px-6 py-4 text-right font-bold text-red-400">₹ {exp.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      exp.status === 'APPROVED' || exp.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' :
                      exp.status === 'PENDING_APPROVAL' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {exp.status === 'APPROVED' || exp.status === 'PAID' ? <PiCheckCircle size={14} /> : 
                       exp.status === 'PENDING_APPROVAL' ? <PiWarningCircle size={14} /> : <PiXCircle size={14} />}
                      {exp.status.replace("_", " ")}
                    </span>
                  </td>
                  {canApprove && (
                    <td className="px-6 py-4 text-right">
                      {exp.status === 'PENDING_APPROVAL' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleStatusUpdate(exp.id, 'APPROVED')} className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-md font-medium transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleStatusUpdate(exp.id, 'REJECTED')} className="text-xs px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md font-medium transition-colors">
                            Reject
                          </button>
                        </div>
                      )}
                      {exp.status === 'APPROVED' && (
                        <button onClick={() => handleStatusUpdate(exp.id, 'PAID')} className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md font-medium transition-colors">
                          Mark Paid
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-bg-card border border-border-color rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border-color flex justify-between items-center bg-bg-secondary/50">
              <h2 className="text-lg font-bold text-text-primary">Request Expense</h2>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <form id="requestForm" onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Expense Title <span className="text-red-500">*</span></label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full input" placeholder="e.g., Electricity Bill" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Target Fund <span className="text-red-500">*</span></label>
                  <select required value={fundId} onChange={e => setFundId(e.target.value)} className="w-full input">
                    {funds.map(f => <option key={f.id} value={f.id}>{f.name} (Bal: ₹{f.balance})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                  <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full input" placeholder="e.g., 500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description / Justification</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full input" rows={3}></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-border-color flex justify-end gap-3 bg-bg-secondary/50">
              <button onClick={() => setIsRequestModalOpen(false)} className="btn bg-bg-secondary border border-border-color text-text-primary hover:bg-bg-tertiary">Cancel</button>
              <button type="submit" form="requestForm" className="btn btn-primary flex items-center gap-2">
                <PiPaperPlaneRight size={18} />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
