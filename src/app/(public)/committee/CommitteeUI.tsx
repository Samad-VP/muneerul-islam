"use client"
import { PiUserDuotone, PiPhoneCallDuotone, PiShieldCheckBold } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"
import Image from "next/image"

type CommitteeMemberData = {
  name: string
  role: string
  phone: string
  email: string
  image: string | null
}

export function CommitteeUI({ members }: { members: CommitteeMemberData[] }) {
  const { t } = useLanguage()

  // Ensure we display at least some placeholder if no members exist at all (neither from DB nor from Settings)
  const displayMembers = members.length > 0 ? members : [
    { name: "Ahmed Abdullah", role: "President", phone: "+91 98765 43210", email: "president@muneerulislam.org", image: "/images/committee/president.jpg" },
    { name: "Mohammed Zakariya", role: "Secretary", phone: "+91 98765 43211", email: "secretary@muneerulislam.org", image: "/images/committee/secretary.jpg" },
    { name: "Ibrahim Khalid", role: "Treasurer", phone: "+91 98765 43212", email: "treasurer@muneerulislam.org", image: "/images/committee/treasurer.jpg" },
  ]

  return (
    <div className="w-full bg-bg-primary overflow-hidden pb-40">
      {/* Page Header */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-48 w-full overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30 dark:opacity-10" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full animate-orb blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center staggered-entrance">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-border-color shadow-sm text-emerald-600 dark:text-emerald-500 text-xs-label font-black mb-10 backdrop-blur-xl uppercase tracking-widest">
            <PiShieldCheckBold size={20} className="text-emerald-500" />
            {t("committee.tag")}
          </div>
          <h1 className="text-h1 sm:text-h1 md:text-display font-black mb-12 leading-[0.9] tracking-tightest capitalize">
            Mahallu <span className="gradient-text">{t("committee.title").split("Mahallu ")[1] || "Committee"}</span>
          </h1>
          <p className="text-text-primary/60 text-body-lg sm:text-h4 max-w-3xl mx-auto leading-relaxed font-bold italic">
            — {t("committee.subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 w-full py-24 relative z-10">
        {/* Featured Top Leadership */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-32">
          {displayMembers.slice(0, 3).map((member, idx) => (
            <div 
              key={member.name + idx} 
              className="glass-card relative overflow-hidden p-12 staggered-entrance-item flex flex-col items-center text-center group shadow-hover border-white/20 dark:border-white/5 bg-white/40 dark:bg-bg-card/40 transition-all duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-[3.5rem] bg-white shadow-2xl mb-12 group-hover:rotate-3 group-hover:scale-105 transition-all duration-1000 overflow-hidden relative z-10 p-1 border border-emerald-500/20">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover object-top group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full bg-emerald-50 dark:bg-bg-primary flex items-center justify-center text-emerald-500">
                    <PiUserDuotone size={80} className="opacity-40" />
                  </div>
                )}
              </div>
              
              <h3 className="text-h3 font-black text-text-primary mb-3 tracking-tight group-hover:scale-105 transition-transform duration-700">{member.name}</h3>
              <p className="inline-block px-6 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-xs-label font-black mb-12 uppercase tracking-widest">{member.role}</p>
              
              <div className="pt-10 border-t border-emerald-500/10 w-full relative z-10">
                <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-5 text-text-primary/60 hover:text-emerald-600 transition-colors font-bold group/link">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 group-hover/link:bg-emerald-500 group-hover/link:text-white transition-all duration-500">
                    <PiPhoneCallDuotone size={22} />
                  </div>
                  <span className="text-small tracking-tight">{member.phone || "Secret Restricted"}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Executive Members Grid */}
        {displayMembers.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full relative z-10">
            {displayMembers.slice(3).map((member, idx) => (
              <div 
                key={member.name + idx} 
                className={`glass-card p-8 animate-slide-up stagger-${(idx % 3) + 1} flex flex-col items-center sm:items-start text-center sm:text-left hover:-translate-y-2 group shadow-premium border-border-color/50`}
              >
                <div className="w-20 h-20 rounded-2xl bg-white shadow-premium flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-all duration-500 overflow-hidden relative group-hover:rotate-3 p-1 border border-emerald-500/20">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                      <PiUserDuotone size={36} className="text-emerald-500/70" />
                    </div>
                  )}
                </div>
                <h3 className="text-body-lg font-black text-text-primary mb-2 tracking-tight">{member.name}</h3>
                <p className="text-emerald-600 dark:text-emerald-400 text-tiny font-black uppercase tracking-widest mb-8">{member.role}</p>
                
                <div className="pt-6 mt-auto border-t border-border-color/40 w-full">
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-text-primary/70 font-bold group-hover:text-emerald-600 transition-colors">
                    <PiPhoneCallDuotone size={18} className="text-emerald-500" />
                    <span className="text-xs-label">{member.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-32 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-gold/20 to-emerald-500/20 blur-[100px] -z-10 group-hover:opacity-100 transition-opacity" />
          <div className="glass-card bg-emerald-500/5 border-emerald-500/20 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden backdrop-blur-xl">
            <h2 className="text-h3 sm:text-h2 font-black mb-8 leading-tight tracking-tight text-text-primary">{t("committee.electionTitle")}</h2>
            <p className="text-text-primary/70 text-body-lg sm:text-body-lg max-w-4xl mx-auto leading-relaxed font-medium">
                {t("committee.electionDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
