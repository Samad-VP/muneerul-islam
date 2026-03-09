"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-primary dark:bg-[#020617] transition-colors duration-700">
      {/* Immersive Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full animate-orb blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-gold/10 rounded-full animate-orb blur-[100px] animation-delay-2000" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-500/10 rounded-full animate-orb blur-[80px] animation-delay-4000" />
      
      <div className="relative z-10 w-full max-w-[440px] px-6 py-12">
        <div className="staggered-entrance flex flex-col items-center">
          {/* Brand Identity */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-white shadow-2xl p-4 mb-6 premium-hover transform -rotate-3 hover:rotate-0 transition-all duration-500 border border-border-color">
              <Image src="/logo.png" alt="Muneerul Islam Logo" width={80} height={80} className="w-full h-full object-contain" />
            </div>
            <h1 className="text-h2 font-black gradient-text tracking-tightest mb-1">Muneerul Islam</h1>
            <p className="arabic-text gradient-text text-body-lg mb-2 text-emerald-500/80">منیر الاسلام</p>
            <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-gold rounded-full mb-3" />
            <p className="text-tiny sm:text-xs-label font-bold text-text-muted uppercase tracking-[0.3em] text-center">
              Mahallu Committee Management
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-card w-full p-10 border-white/20 dark:border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <h2 className="text-h4 font-black text-text-primary mb-8 tracking-tight">
              {isRegister ? "Create Account" : "Secure Sign In"}
            </h2>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs-label font-bold animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && (
                <div className="space-y-2">
                  <label className="text-tiny font-black text-text-muted uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field bg-bg-secondary/30 focus:bg-white dark:focus:bg-bg-primary transition-all duration-300 rounded-2xl border-border-color/50"
                    placeholder="Abdullah Ahmad"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-tiny font-black text-text-muted uppercase tracking-widest pl-1">Email Connection</label>
                <div className="relative">
                  <PiEnvelopeDuotone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-emerald-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field !pl-12 bg-bg-secondary/30 focus:bg-white dark:focus:bg-bg-primary transition-all duration-300 rounded-2xl border-border-color/50"
                    placeholder="admin@muneerulislam.org"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-tiny font-black text-text-muted uppercase tracking-widest">Secret Key</label>
                  {!isRegister && <button type="button" className="text-tiny font-black text-emerald-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">Forgot?</button>}
                </div>
                <div className="relative">
                  <PiLockKeyDuotone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-emerald-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field !pl-12 !pr-12 bg-bg-secondary/30 focus:bg-white dark:focus:bg-bg-primary transition-all duration-300 rounded-2xl border-border-color/50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-emerald-500 transition-colors"
                  >
                    {showPassword ? <PiEyeClosedDuotone size={18} /> : <PiEyeDuotone size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full h-[56px] rounded-2xl text-small font-black tracking-tight mt-4 shadow-xl shadow-emerald-500/20 group relative overflow-hidden" disabled={loading}>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="flex items-center justify-center gap-3 relative z-10">
                  {loading ? <PiSpinner size={22} className="animate-spin" /> : null}
                  {loading ? "AUTHENTICATING..." : (isRegister ? "JOIN COMMUNITY" : "INITIALIZE SESSION")}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => { setIsRegister(!isRegister); setError("") }}
                className="text-xs-label font-black text-text-muted hover:text-emerald-500 transition-all duration-300 uppercase tracking-widest group"
              >
                {isRegister ? "Already member?" : "New to Mahallu?"} 
                <span className="text-emerald-500 ml-1 group-hover:underline">{isRegister ? "SIGN IN" : "CREATE ACCOUNT"}</span>
              </button>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2 p-3 px-5 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md opacity-60">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-tiny font-black text-text-muted uppercase tracking-widest leading-none">
               Demo: admin@muneerulislam.org / admin123
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
