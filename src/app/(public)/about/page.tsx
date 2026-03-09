"use client"
import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"
import { PiCheckCircleBold } from "react-icons/pi"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-48 w-full overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30 dark:opacity-10" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full animate-orb blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center staggered-entrance">
          <span className="text-emerald-600 dark:text-emerald-500 font-black text-xs-label uppercase tracking-[0.4em] mb-8 block">{t("about.title")}</span>
          <h1 className="text-h1 sm:text-h1 md:text-display font-black mb-12 leading-[0.9] tracking-tightest">
            Muneerul <span className="gradient-text">Islam</span>
          </h1>
          <p className="text-text-primary/60 text-body-lg sm:text-h4 max-w-3xl mx-auto leading-relaxed font-bold italic">
            — {t("about.subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 w-full py-32 pb-64">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-48">
          <div className="staggered-entrance">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-xs-label font-black mb-8 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Our Purpose
            </div>
            <h2 className="text-h2 sm:text-h1 font-black mb-12 leading-[1.1] tracking-tight text-text-primary">{t("about.missionTitle")}</h2>
            <p className="text-text-primary/60 text-body-lg mb-16 leading-relaxed font-bold">
              {t("about.missionDesc")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {t("about.missionList").map((item: string, i: number) => (
                <div key={item} className="flex items-start gap-5 p-8 rounded-3xl glass-card border-none bg-emerald-500/5 group hover:bg-emerald-500/10 transition-colors duration-700">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                    <PiCheckCircleBold size={24} />
                  </div>
                  <span className="text-text-primary font-black text-small sm:text-body leading-tight pt-2">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative group">
            <div className="glass-card aspect-square flex items-center justify-center p-16 sm:p-24 relative overflow-hidden rounded-[4rem] shadow-hover border-white/20 dark:border-white/5 bg-gradient-to-br from-white/10 to-transparent">
               <div className="absolute inset-0 islamic-pattern opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
               <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-1000 ease-out">
                 <Image src="/logo.png" alt="Muneerul Islam Logo" fill className="object-contain drop-shadow-2xl" />
               </div>
               
               {/* Visual decorative ring */}
               <div className="absolute inset-10 rounded-full border border-emerald-500/20 animate-spin-slow" />
               <div className="absolute inset-20 rounded-full border border-gold/10 animate-spin-slow-reverse" />
            </div>
            {/* Visual accent blurs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -z-10 animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gold/10 blur-[80px] rounded-full -z-10 animation-delay-2000" />
          </div>
        </div>

        <div className="relative staggered-entrance">
          <div className="glass-card bg-emerald-500/5 border-emerald-500/10 rounded-[4rem] p-12 sm:p-20 md:p-32 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] -z-10 group-hover:bg-emerald-500/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10" />
            
            <h2 className="text-h2 sm:text-h1 font-black mb-12 leading-tight tracking-tight text-text-primary capitalize">{t("about.historyTitle")}</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mx-auto mb-16" />
            
            <p className="text-text-primary/60 text-body-lg sm:text-h4 max-w-4xl mx-auto leading-relaxed font-bold italic">
              {t("about.historyDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
