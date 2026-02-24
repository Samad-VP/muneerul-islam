"use client"
import Link from "next/link"
import { ArrowRight, Users, Calendar, Megaphone, FileText } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 islamic-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-gold/5" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t("hero.welcome")}
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in stagger-1">
            {t("hero.title").split("<br />").map((line: string, i: number) => (
              <span key={i}>
                {i === 1 ? <><br /><span className="gradient-text">{line}</span></> : line}
              </span>
            ))}
          </h1>
          
          <p className="arabic-text text-2xl md:text-4xl mb-8 text-emerald-400 opacity-90 animate-fade-in stagger-2">
            وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى
          </p>
          
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fade-in stagger-2">
            {t("hero.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
            <Link href="/about" className="btn-primary px-8 py-4 text-base w-full sm:w-auto">
              {t("hero.learnMore")} <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn-secondary px-8 py-4 text-base w-full sm:w-auto">
              {t("hero.contactUs")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="py-24 bg-bg-secondary relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass-card p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-2">500+</h3>
              <p className="text-text-secondary text-sm">{t("stats.families")}</p>
            </div>
            
            <div className="glass-card p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                <Calendar size={24} />
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-2">12+</h3>
              <p className="text-text-secondary text-sm">{t("stats.events")}</p>
            </div>
            
            <div className="glass-card p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                <Megaphone size={24} />
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-2">24/7</h3>
              <p className="text-text-secondary text-sm">{t("stats.announcements")}</p>
            </div>
            
            <div className="glass-card p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-2">100%</h3>
              <p className="text-text-secondary text-sm">{t("stats.reports")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="text-emerald-500 font-semibold mb-4 block">{t("vision.tag")}</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              {t("vision.title").split("Modern Technology")[0]}<span className="gradient-text">Modern Technology</span>
            </h2>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              {t("vision.description")}
            </p>
            <ul className="space-y-4">
              {t("vision.features").map((item: string) => (
                <li key={item} className="flex items-center gap-3 text-text-primary">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="glass-card overflow-hidden aspect-video relative group">
              <div className="absolute inset-0 bg-emerald-500/20 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">🕌</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card p-6 border-emerald-500/30 animate-pulse-glow hidden md:block">
              <p className="text-xs text-text-muted mb-1">Live Updates</p>
              <p className="text-sm font-bold text-emerald-400">98% Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
