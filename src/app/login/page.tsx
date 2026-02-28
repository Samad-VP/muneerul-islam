"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PiEyeDuotone, PiEyeClosedDuotone, PiLockKeyDuotone, PiEnvelopeDuotone, PiSpinner } from "react-icons/pi"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setIsRegister(false)
        setError("")
        alert("Registration successful! Please login.")
      } else {
        const { signIn } = await import("next-auth/react")
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })
        if (result?.error) {
          setError("Invalid email or password")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center islamic-pattern relative w-full pt-10 sm:pt-0" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1b2a 50%, #0a0f1a 100%)' }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)'
      }} />
      
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 animate-fade-in mx-auto">
        {/* Logo and Title */}
        <div className="text-center mb-8 sm:mb-10 w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-4 sm:mb-6" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)'
          }}>
            <span className="text-2xl sm:text-3xl">🕌</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1 sm:mb-2">Muneerul Islam</h1>
          <p className="arabic-text text-base sm:text-lg mb-1 sm:mb-2" style={{ color: 'var(--emerald-400)', opacity: 0.8 }}>منیر الاسلام</p>
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs sm:text-sm">Mahallu Committee Management System</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-6 sm:p-8 w-full border border-border-color">
          <h2 className="text-lg sm:text-xl font-extrabold mb-5 sm:mb-6" style={{ color: 'var(--text-primary)' }}>
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#f87171',
              marginBottom: '20px'
            }} className="text-xs sm:text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            {isRegister && (
              <div style={{ marginBottom: '16px' }} className="w-full">
                <label style={{ display: 'block', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }} className="text-[11px] sm:text-xs uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field py-3.5 sm:py-4 w-full"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div style={{ marginBottom: '16px' }} className="w-full">
              <label style={{ display: 'block', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }} className="text-[11px] sm:text-xs uppercase tracking-wider">
                Email Address
              </label>
              <div style={{ position: 'relative' }} className="w-full">
                <PiEnvelopeDuotone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field py-3.5 sm:py-4 w-full"
                  style={{ paddingLeft: '44px' }}
                  placeholder="admin@muneerulislam.org"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }} className="w-full">
              <label style={{ display: 'block', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }} className="text-[11px] sm:text-xs uppercase tracking-wider">
                Password
              </label>
              <div style={{ position: 'relative' }} className="w-full">
                <PiLockKeyDuotone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field py-3.5 sm:py-4 w-full"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  {showPassword ? <PiEyeClosedDuotone size={18} /> : <PiEyeDuotone size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3.5 sm:py-4 text-sm sm:text-base" disabled={loading}>
              {loading ? <PiSpinner size={20} className="animate-spin" /> : null}
              {loading ? "Please wait..." : (isRegister ? "Create Account" : "Sign In")}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => { setIsRegister(!isRegister); setError("") }}
              style={{ background: 'none', border: 'none', color: 'var(--emerald-400)', cursor: 'pointer' }}
              className="text-xs sm:text-sm font-semibold hover:text-emerald-300 transition-colors"
            >
              {isRegister ? "Already have an account? Sign In" : "Need an account? Register"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }} className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
          Default: admin@muneerulislam.org / admin123
        </p>
      </div>
    </div>
  )
}
