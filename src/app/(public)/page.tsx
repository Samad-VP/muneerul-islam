"use client"
import Link from "next/link"
import { PiArrowRightBold, PiUsersDuotone, PiCalendarDuotone, PiSpeakerHighDuotone, PiFileTextDuotone } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="relative overflow-hidden w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 islamic-pattern w-full text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-gold/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 animate-fade-in mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t("hero.welcome")}
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-5 sm:mb-6 leading-tight animate-fade-in stagger-1">
            {t("hero.title").split("<br />").map((line: string, i: number) => (
              <span key={i}>
                {i === 1 ? <><br className="hidden sm:block" /><span className="gradient-text">{line}</span></> : line}
              </span>
            ))}
          </h1>
          
          <p className="arabic-text text-xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 text-emerald-400 opacity-90 animate-fade-in stagger-2">
            وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى
          </p>
          
          <p className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 animate-fade-in stagger-2 px-4">
            {t("hero.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in stagger-3 px-4 w-full sm:w-auto">
            <Link href="/about" className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 text-base w-full sm:w-auto justify-center">
              {t("hero.learnMore")} <PiArrowRightBold size={18} />
            </Link>
            <Link href="/contact" className="btn-secondary px-6 sm:px-8 py-3.5 sm:py-4 text-base w-full sm:w-auto justify-center">
              {t("hero.contactUs")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="py-16 sm:py-24 bg-bg-secondary relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="glass-card p-6 sm:p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-5 sm:mb-6">
                <PiUsersDuotone size={28} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1 sm:mb-2 text-emerald-400">500+</h3>
              <p className="text-text-secondary text-xs sm:text-sm font-medium">{t("stats.families")}</p>
            </div>
            
            <div className="glass-card p-6 sm:p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-5 sm:mb-6">
                <PiCalendarDuotone size={28} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1 sm:mb-2 text-blue-400">12+</h3>
              <p className="text-text-secondary text-xs sm:text-sm font-medium">{t("stats.events")}</p>
            </div>
            
            <div className="glass-card p-6 sm:p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-5 sm:mb-6">
                <PiSpeakerHighDuotone size={28} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1 sm:mb-2 text-gold">24/7</h3>
              <p className="text-text-secondary text-xs sm:text-sm font-medium">{t("stats.announcements")}</p>
            </div>
            
            <div className="glass-card p-6 sm:p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-5 sm:mb-6">
                <PiFileTextDuotone size={28} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1 sm:mb-2 text-purple-400">100%</h3>
              <p className="text-text-secondary text-xs sm:text-sm font-medium">{t("stats.reports")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-emerald-500/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center relative z-10">
          <div className="text-center lg:text-left">
            <span className="text-emerald-500 font-bold text-xs sm:text-sm mb-3 sm:mb-4 block tracking-wider uppercase">{t("vision.tag")}</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-6 sm:mb-8 leading-tight text-text-primary">
              {t("vision.title").split("Modern Technology")[0]}<span className="gradient-text">Modern Technology</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed px-4 lg:px-0">
              {t("vision.description")}
            </p>
            <ul className="space-y-3 sm:space-y-4 inline-block text-left">
              {t("vision.features").map((item: string) => (
                <li key={item} className="flex items-center gap-3 text-text-primary font-medium text-sm sm:text-base">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mt-8 lg:mt-0 px-4 sm:px-0">
            <div className="glass-card overflow-hidden aspect-video relative group w-full rounded-2xl sm:rounded-3xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
              <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl sm:text-7xl drop-shadow-lg">🕌</span>
              </div>
            </div>
            <div className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-6 glass-card p-4 sm:p-6 border-emerald-500/30 animate-pulse-glow hidden sm:block">
              <p className="text-[10px] sm:text-xs text-text-muted mb-0.5 sm:mb-1 uppercase font-bold tracking-wider">Live Updates</p>
              <p className="text-xs sm:text-sm font-extrabold text-emerald-400">98% Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
