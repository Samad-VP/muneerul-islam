"use client"
import { useState, useEffect } from "react"
import { PiBank, PiPlus, PiWallet } from "react-icons/pi"

type Fund = {
  id: string
  name: string
  type: string
  description: string | null
  balance: number
}

export default function FundsPage() {
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [name, setName] = useState("")
  const [type, setType] = useState("special")
  const [description, setDescription] = useState("")

  const fetchFunds = async () => {
    try {
      const res = await fetch("/api/finance/funds")
      const data = await res.json()
      if (res.ok) setFunds(data)
    } catch (error) {
      console.error("Failed to fetch funds", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFunds()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/finance/funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, description })
      })
      if (res.ok) {
        setIsModalOpen(false)
        fetchFunds()
        setName("")
        setDescription("")
      }
    } catch (error) {
      console.error("Failed to create fund")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Funds</h1>
          <p className="text-sm text-text-muted mt-1">Manage general and special funds</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <PiPlus size={18} />
          <span>New Fund</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funds.map(fund => (
            <div key={fund.id} className="bg-bg-card border border-border-color rounded-xl p-6 shadow-sm hover:border-emerald-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  {fund.type === 'general' ? <PiBank size={24} /> : <PiWallet size={24} />}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${fund.type === 'general' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                  {fund.type.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-1">{fund.name}</h3>
              <p className="text-sm text-text-muted mb-4 line-clamp-2 min-h-[40px]">{fund.description || "No description provided."}</p>
              
              <div className="pt-4 border-t border-border-color">
                <p className="text-sm text-text-muted mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-emerald-500">₹ {fund.balance.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Fund Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-bg-card border border-border-color rounded-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border-color flex justify-between items-center bg-bg-secondary/50">
              <h2 className="text-lg font-bold text-text-primary">Create New Fund</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <form id="fundForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Fund Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full input" placeholder="e.g., Ramadan Relief Fund" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full input">
                    <option value="special">Special</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full input" rows={3}></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-border-color flex justify-end gap-3 bg-bg-secondary/50">
              <button onClick={() => setIsModalOpen(false)} className="btn bg-bg-secondary border border-border-color text-text-primary hover:bg-bg-tertiary">Cancel</button>
              <button type="submit" form="fundForm" className="btn btn-primary">Create Fund</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
