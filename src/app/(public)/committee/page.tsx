"use client"
import { PiUserDuotone, PiPhoneCallDuotone, PiEnvelopeDuotone, PiShieldCheckBold } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"

const committeeMembers = [
  { name: "Ahmed Abdullah", role: "President", phone: "+91 98765 43210", email: "president@muneerulislam.org" },
  { name: "Mohammed Zakariya", role: "Secretary", phone: "+91 98765 43211", email: "secretary@muneerulislam.org" },
  { name: "Ibrahim Khalid", role: "Treasurer", phone: "+91 98765 43212", email: "treasurer@muneerulislam.org" },
  { name: "Yousuf Hasan", role: "Vice President", phone: "+91 98765 43213", email: "vp@muneerulislam.org" },
  { name: "Zaid Ali", role: "Joint Secretary", phone: "+91 98765 43214", email: "js@muneerulislam.org" },
  { name: "Omar Farooq", role: "Executive Member", phone: "+91 98765 43215", email: "member1@muneerulislam.org" },
]

export default function CommitteePage() {
  const { t } = useLanguage()

  return (
    <div className="py-16 sm:py-24 md:py-32 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-16 sm:mb-20 animate-fade-in w-full">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold mb-4 sm:mb-6 uppercase tracking-wider">
            <PiShieldCheckBold size={14} />
            {t("committee.tag")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6">
            Mahallu <span className="gradient-text">{t("committee.title").split("Mahallu ")[1] || "Committee"}</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            {t("committee.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          {committeeMembers.map((member, idx) => (
            <div 
              key={member.name} 
              className={`glass-card p-6 sm:p-8 animate-fade-in stagger-${(idx % 3) + 1} flex flex-col items-center sm:items-start text-center sm:text-left hover:shadow-lg transition-all border border-border-color hover:border-emerald-500/30 group`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
                <PiUserDuotone size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-text-primary mb-1">{member.name}</h3>
              <p className="text-emerald-500 text-xs sm:text-sm font-bold mb-5 sm:mb-6 uppercase tracking-wider">{member.role}</p>
              
              <div className="space-y-3 pt-5 sm:pt-6 border-t border-border-color w-full">
                <div className="flex items-center justify-center sm:justify-start gap-3 text-text-secondary">
                  <PiPhoneCallDuotone size={16} className="text-emerald-400" />
                  <span className="text-[11px] sm:text-xs font-medium">{member.phone}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-text-secondary">
                  <PiEnvelopeDuotone size={16} className="text-emerald-400" />
                  <span className="text-[11px] sm:text-xs font-medium">{member.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 glass-card p-8 sm:p-12 text-center w-full">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-3 sm:mb-4">{t("committee.electionTitle")}</h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-3xl mx-auto">
                {t("committee.electionDesc")}
            </p>
        </div>
      </div>
    </div>
  )
}
