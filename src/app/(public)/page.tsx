"use client"
import Link from "next/link"
import Image from "next/image"
import { PiArrowRightBold, PiUsersDuotone, PiCalendarDuotone, PiSpeakerHighDuotone, PiFileTextDuotone } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"
import { useSession } from "next-auth/react"

export default function HomePage() {
  const { t } = useLanguage()
  const { data: _session, status } = useSession()

  return (
    <div className="relative overflow-hidden w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 md:pt-48 md:pb-64 w-full text-center overflow-hidden">
        {/* Immersive Backgrounds */}
        <div className="absolute inset-0 mesh-gradient opacity-40 dark:opacity-20" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full animate-orb blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full animate-orb blur-[120px] animation-delay-3000" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="staggered-entrance flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-border-color shadow-sm text-emerald-600 dark:text-emerald-400 text-xs-label sm:text-small font-black mb-10 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t("hero.welcome")}
            </div>
            
            <h1 className="text-h1 sm:text-h1 md:text-display font-black mb-10 leading-[0.95] tracking-tightest">
              {t("hero.title").split("<br />").map((line: string, i: number) => (
                <span key={i} className="block group">
                  {i === 1 ? (
                    <span className="gradient-text inline-block transform hover:scale-105 transition-transform duration-700 select-none">
                      {line}
                    </span>
                  ) : line}
                </span>
              ))}
            </h1>
            
            <p className="arabic-text gradient-text text-h2 sm:text-h1 md:text-h1 mb-12 text-emerald-500/60 dark:text-emerald-500/40 select-none">
              منیر الاسلام
            </p>
            
            <p className="text-text-primary/60 text-body-lg sm:text-h4 max-w-2xl mx-auto mb-16 leading-relaxed font-bold italic">
              — {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              {status === "authenticated" ? (
                <Link href="/dashboard" className="btn-primary h-[64px] px-12 text-body-lg rounded-2xl glow-effect group overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    {t("dashboard.nav.dashboard")}
                    <PiArrowRightBold size={20} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
              ) : (
                <>
                  <Link href="/about" className="btn-primary h-[64px] px-12 text-body-lg rounded-2xl glow-effect group overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                       {t("hero.learnMore")} 
                       <PiArrowRightBold size={20} className="group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                  <Link href="/contact" className="btn-secondary h-[64px] px-12 text-body-lg rounded-2xl group transition-all duration-500">
                    {t("hero.contactUs")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <div className="w-6 h-10 rounded-full border-2 border-text-primary flex justify-center pt-2">
            <div className="w-1 h-2 bg-text-primary rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="py-24 sm:py-32 relative w-full -mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { label: t("stats.families"), val: "500+", icon: PiUsersDuotone, color: "emerald", delay: 1 },
              { label: t("stats.events"), val: "12+", icon: PiCalendarDuotone, color: "blue", delay: 2 },
              { label: t("stats.announcements"), val: "24/7", icon: PiSpeakerHighDuotone, color: "gold", delay: 3 },
              { label: t("stats.reports"), val: "100%", icon: PiFileTextDuotone, color: "purple", delay: 4 },
            ].map((stat, i) => {
              const Icon = stat.icon
              const colorClass = stat.color === 'emerald' ? 'text-emerald-500' :
                                 stat.color === 'blue' ? 'text-blue-500' :
                                 stat.color === 'gold' ? 'text-gold' : 'text-purple-500'
              
              return (
                <div key={i} className="glass-card p-6 sm:p-10 flex flex-col items-center group relative overflow-hidden text-center transform hover:scale-105 transition-all duration-700">
                  <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-${stat.color}-500/10 flex items-center justify-center ${colorClass} mb-4 sm:mb-8 group-hover:bg-${stat.color}-500 group-hover:text-white transition-all duration-700 shadow-inner`}>
                    <Icon size={24} className="sm:hidden group-hover:scale-110 transition-transform duration-700" />
                    <Icon size={36} className="hidden sm:block group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="text-body-lg sm:text-h2 font-black text-text-primary mb-1 sm:mb-3 tracking-tighter group-hover:scale-110 transition-transform duration-700">{stat.val}</h3>
                  <p className="text-text-primary/40 text-[10px] sm:text-tiny font-black tracking-[0.1em] sm:tracking-[0.3em] uppercase">{stat.label}</p>
                  
                  <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden w-full bg-bg-primary">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[1000px] sm:h-[1000px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-center relative z-10">
          <div className="text-center lg:text-left animate-fade-in">
            <span className="text-emerald-600 dark:text-emerald-500 font-black text-xs-label sm:text-small mb-4 block tracking-[0.2em] uppercase">{t("vision.tag")}</span>
            <h2 className="text-h3 sm:text-h2 md:text-h1 font-black mb-8 leading-[1.15] text-text-primary tracking-tight">
              {t("vision.title").split("Modern Technology")[0]}<span className="gradient-text">Modern Technology</span>
            </h2>
            <p className="text-text-primary/70 text-body-lg sm:text-body-lg mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              {t("vision.description")}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left max-w-md mx-auto lg:mx-0">
              {t("vision.features").map((item: string, i: number) => (
                <div key={item} className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card border-none bg-emerald-500/5 animate-fade-in stagger-${i+1}`}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                  <span className="text-text-primary font-bold text-tiny sm:text-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0 px-4 sm:px-0 group">
            <div className="glass-card overflow-hidden aspect-square sm:aspect-video relative group w-full rounded-[2rem] sm:rounded-[3rem] border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-700 bg-white dark:bg-bg-card p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-gold/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 flex items-center justify-center p-12 sm:p-20 group-hover:scale-105 transition-transform duration-700">
                <Image src="/logo.png" alt="Muneerul Islam Logo" fill className="object-contain" />
              </div>
            </div>
            
            {/* Float badge */}
            <div className="absolute -bottom-6 -right-6 glass-card p-6 sm:p-8 border-emerald-500/30 animate-pulse-glow hidden sm:block shadow-hover scale-110">
              <p className="text-tiny sm:text-xs-label text-text-muted mb-1.5 uppercase font-black tracking-widest">Global Reach</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-card bg-emerald-100 flex items-center justify-center text-tiny font-bold text-emerald-600">
                      U{i}
                    </div>
                  ))}
                </div>
                <p className="text-small sm:text-body font-black text-emerald-600 dark:text-emerald-400">98% Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
