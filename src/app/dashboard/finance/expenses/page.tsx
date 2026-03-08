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
    } catch (_err) {
      console.error("Failed to fetch data", _err)
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
    } catch {
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
    } catch {
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
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 w-full md:hidden p-4">
              {expenses.map(exp => (
                <div key={`mobile-${exp.id}`} className="flex flex-col p-4 bg-bg-primary border border-border-color rounded-xl gap-3 shadow-sm hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-text-primary text-base leading-tight">{exp.title}</h3>
                      <p className="text-xs text-text-muted mt-1">Req by: <span className="font-medium text-text-secondary">{exp.requestedBy?.name}</span></p>
                      {exp.approvedBy && (
                        <p className="text-[10px] text-text-muted mt-0.5">Appr by: {exp.approvedBy.name}</p>
                      )}
                    </div>
                    <span className={`badge shrink-0 text-[10px] ${
                      exp.status === 'APPROVED' || exp.status === 'PAID' ? 'badge-emerald' :
                      exp.status === 'PENDING_APPROVAL' ? 'badge-gold' : 'badge-red'
                    }`}>
                      {exp.status === 'APPROVED' || exp.status === 'PAID' ? <PiCheckCircle size={12} /> : 
                       exp.status === 'PENDING_APPROVAL' ? <PiWarningCircle size={12} /> : <PiXCircle size={12} />}
                      {exp.status.replace("_", " ")}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1 pt-3 border-t border-border-color">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Amount</span>
                      <span className="font-bold text-red-500 text-lg">₹ {exp.amount}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Voucher No</span>
                      <span className="font-mono text-xs font-medium text-text-secondary mt-1">{exp.voucherNo}</span>
                    </div>
                  </div>

                  {canApprove && (exp.status === 'PENDING_APPROVAL' || exp.status === 'APPROVED') && (
                    <div className="flex gap-2 pt-3 border-t border-border-color mt-1">
                      {exp.status === 'PENDING_APPROVAL' && (
                        <>
                          <button onClick={() => handleStatusUpdate(exp.id, 'APPROVED')} className="btn-action flex-1 justify-center py-2 h-auto text-sm">
                            Approve
                          </button>
                          <button onClick={() => handleStatusUpdate(exp.id, 'REJECTED')} className="btn-action danger flex-1 justify-center py-2 h-auto text-sm">
                            Reject
                          </button>
                        </>
                      )}
                      {exp.status === 'APPROVED' && (
                        <button onClick={() => handleStatusUpdate(exp.id, 'PAID')} className="btn-action flex-1 justify-center py-2 h-auto text-sm">
                          Mark Paid
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar pb-2">
              <table className="w-full min-w-[900px] text-left text-sm text-text-secondary">
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
                      <td className="px-6 py-4 text-right font-bold text-red-500">₹ {exp.amount}</td>
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
                              <button onClick={() => handleStatusUpdate(exp.id, 'APPROVED')} className="btn-action">
                                Approve
                              </button>
                              <button onClick={() => handleStatusUpdate(exp.id, 'REJECTED')} className="btn-action danger">
                                Reject
                              </button>
                            </div>
                          )}
                          {exp.status === 'APPROVED' && (
                            <button onClick={() => handleStatusUpdate(exp.id, 'PAID')} className="btn-action">
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
          </>
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
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="input-field w-full" placeholder="e.g., Electricity Bill" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Target Fund <span className="text-red-500">*</span></label>
                  <select required value={fundId} onChange={e => setFundId(e.target.value)} className="input-field w-full">
                    {funds.map(f => <option key={f.id} value={f.id}>{f.name} (Bal: ₹{f.balance})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                  <input type="number" required min="1" value={amount} onChange={e => setAmount(e.target.value)} className="input-field w-full" placeholder="e.g., 500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description / Justification</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field w-full" rows={3}></textarea>
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
