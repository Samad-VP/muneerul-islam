"use client"
import { PiUserDuotone, PiPhoneCallDuotone, PiEnvelopeDuotone, PiShieldCheckBold } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"
import Image from "next/image"

const committeeMembers = [
  { name: "Ahmed Abdullah", role: "President", phone: "+91 98765 43210", email: "president@muneerulislam.org", image: "/images/committee/president.jpg" },
  { name: "Mohammed Zakariya", role: "Secretary", phone: "+91 98765 43211", email: "secretary@muneerulislam.org", image: "/images/committee/secretary.jpg" },
  { name: "Ibrahim Khalid", role: "Treasurer", phone: "+91 98765 43212", email: "treasurer@muneerulislam.org", image: "/images/committee/treasurer.jpg" },
  { name: "Yousuf Hasan", role: "Vice President", phone: "+91 98765 43213", email: "vp@muneerulislam.org" },
  { name: "Zaid Ali", role: "Joint Secretary", phone: "+91 98765 43214", email: "js@muneerulislam.org" },
  { name: "Omar Farooq", role: "Executive Member", phone: "+91 98765 43215", email: "member1@muneerulislam.org" },
]

export default function CommitteePage() {
  const { t } = useLanguage()

  return (
    <div className="relative py-16 sm:py-24 md:py-32 w-full overflow-hidden bg-bg-primary">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-30 dark:opacity-10 pointer-events-none"></div>
      
      {/* Floating Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-gold/5 dark:bg-gold/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full z-10">
        <div className="text-center mb-16 sm:mb-24 animate-fade-in w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold mb-6 uppercase tracking-[0.2em] shadow-sm backdrop-blur-md">
            <PiShieldCheckBold size={16} />
            {t("committee.tag")}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Mahallu <span className="gradient-text">{t("committee.title").split("Mahallu ")[1] || "Committee"}</span>
          </h1>
          <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto px-4 sm:px-0 font-medium">
            {t("committee.subtitle")}
          </p>
        </div>

        {/* Featured Top Leadership (President, Secretary, Treasurer) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 w-full mb-12 sm:mb-16">
          {committeeMembers.slice(0, 3).map((member, idx) => (
            <div 
              key={member.name} 
              className={`glass-card relative overflow-hidden p-8 sm:p-10 animate-slide-up stagger-${idx + 1} flex flex-col items-center text-center group cursor-default`}
            >
              {/* Subtle animated border top */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full ring-4 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-500 mb-6 group-hover:ring-emerald-400 transition-all duration-500 overflow-hidden shadow-xl relative z-10 group-hover:scale-105">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover object-top" />
                ) : (
                  <PiUserDuotone size={48} className="text-emerald-500 opacity-80" />
                )}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-text-primary mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{member.name}</h3>
              <p className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold mb-6 uppercase tracking-widest">{member.role}</p>
              
              <div className="space-y-4 pt-6 mt-auto border-t border-border-color/50 w-full opacity-80 group-hover:opacity-100 transition-all duration-300">
                <div className="flex items-center justify-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                    <PiPhoneCallDuotone size={16} />
                  </div>
                  <span className="text-[13px] sm:text-sm font-medium">{member.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                    <PiEnvelopeDuotone size={16} />
                  </div>
                  <span className="text-[13px] sm:text-sm font-medium truncate max-w-full">{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Executive Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full relative z-10">
          {committeeMembers.slice(3).map((member, idx) => (
            <div 
              key={member.name} 
              className={`glass-card p-6 sm:p-8 animate-slide-up stagger-${(idx % 3) + 1} flex flex-col items-center sm:items-start text-center sm:text-left hover:-translate-y-1 transition-transform border border-border-color group`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/5 ring-2 ring-emerald-500/10 flex items-center justify-center text-emerald-500 mb-5 sm:mb-6 group-hover:ring-emerald-300 transition-all overflow-hidden relative group-hover:rotate-3">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover object-top" />
                ) : (
                  <PiUserDuotone size={32} className="text-emerald-500/70 group-hover:text-emerald-500 transition-colors" />
                )}
              </div>
              <h3 className="text-lg sm:text-lg font-extrabold text-text-primary mb-1">{member.name}</h3>
              <p className="text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs font-bold mb-4 sm:mb-5 uppercase tracking-[0.15em]">{member.role}</p>
              
              <div className="space-y-2.5 pt-4 sm:pt-5 mt-auto border-t border-border-color/40 w-full group-hover:border-border-color transition-colors">
                <div className="flex items-center justify-center sm:justify-start gap-3 text-text-secondary/80 group-hover:text-text-secondary transition-colors">
                  <PiPhoneCallDuotone size={15} className="text-emerald-500/70 group-hover:text-emerald-500" />
                  <span className="text-[11px] sm:text-xs font-medium">{member.phone}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-text-secondary/80 group-hover:text-text-secondary transition-colors">
                  <PiEnvelopeDuotone size={15} className="text-emerald-500/70 group-hover:text-emerald-500" />
                  <span className="text-[11px] sm:text-xs font-medium truncate max-w-[200px]">{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 sm:mt-24 relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-emerald-500/30 via-gold/30 to-emerald-500/30 group">
          <div className="glass-card absolute inset-0 !border-none !rounded-3xl opacity-90 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative p-10 sm:p-14 text-center w-full z-10 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">{t("committee.electionTitle")}</h2>
            <p className="text-text-secondary/90 text-sm sm:text-base max-w-3xl mx-auto font-medium leading-relaxed">
                {t("committee.electionDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
