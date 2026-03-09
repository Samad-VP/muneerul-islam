"use client"
import { PiEnvelopeDuotone, PiPhoneCallDuotone, PiMapPinDuotone, PiPaperPlaneRightBold, PiChatCircleDotsDuotone } from "react-icons/pi"
import { useLanguage } from "@/context/LanguageContext"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-48 w-full overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30 dark:opacity-10" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full animate-orb blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center staggered-entrance">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white dark:bg-white/5 border border-border-color shadow-sm text-emerald-600 dark:text-emerald-500 text-xs-label font-black mb-10 backdrop-blur-xl uppercase tracking-widest">
            <PiChatCircleDotsDuotone size={20} className="text-emerald-500" />
            Connect With Us
          </div>
          <h1 className="text-h1 sm:text-h1 md:text-display font-black mb-12 leading-[0.9] tracking-tightest capitalize">
            {t("contact.title").split(" Touch")[0]} <span className="gradient-text">{t("contact.title").split("Get in ")[1] || "Touch"}</span>
          </h1>
          <p className="text-text-primary/60 text-body-lg sm:text-h4 max-w-3xl mx-auto leading-relaxed font-bold italic">
            — {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 w-full py-32 pb-64">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 w-full items-start">
          {/* Contact Info */}
          <div className="staggered-entrance">
            <h2 className="text-h2 sm:text-h1 font-black mb-12 leading-[1.1] tracking-tight text-text-primary">{t("contact.infoTitle")}</h2>
            <p className="text-text-primary/60 mb-16 text-body-lg font-bold leading-relaxed max-w-xl">
              {t("contact.infoDesc")}
            </p>

            <div className="space-y-8">
              <div className="glass-card p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 group hover:bg-white dark:hover:bg-bg-card transition-all duration-700 border-emerald-500/10">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-700 shadow-sm relative overflow-hidden group-hover:rotate-6">
                  <PiMapPinDuotone size={36} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-black text-h4 mb-4 tracking-tight">{t("contact.locationTitle")}</h4>
                  <p className="text-text-primary/60 leading-relaxed font-bold">
                    Kolathur North Juma Masjid (കൊളത്തൂർ നോർത്ത് ജുമാ മസ്ജിദ്)<br />
                    CQ9M+JPV, Kozhikode, Kerala 673612, India
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/4GfjYPqMnnEe6fFP9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary h-12 px-6 rounded-2xl inline-flex items-center gap-2 mt-8 text-xs-label font-black uppercase tracking-widest group/link transition-all"
                  >
                    View Coordinates
                    <PiPaperPlaneRightBold size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              <div className="glass-card p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 group hover:bg-white dark:hover:bg-bg-card transition-all duration-700 border-blue-500/10">
                <div className="w-20 h-20 rounded-3xl bg-blue-500/5 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all duration-700 shadow-sm group-hover:-rotate-6">
                  <PiEnvelopeDuotone size={36} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-black text-h4 mb-4 tracking-tight">{t("contact.emailTitle")}</h4>
                  <p className="text-text-primary/60 font-bold select-all leading-relaxed">
                    info@muneerulislam.org<br />
                    committee@muneerulislam.org
                  </p>
                </div>
              </div>

              <div className="glass-card p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 group hover:bg-white dark:hover:bg-bg-card transition-all duration-700 border-gold/10">
                <div className="w-20 h-20 rounded-3xl bg-gold/5 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-sm group-hover:scale-110">
                  <PiPhoneCallDuotone size={36} />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-black text-h4 mb-4 tracking-tight">{t("contact.phoneTitle")}</h4>
                  <p className="text-text-primary/60 font-bold select-all leading-relaxed">
                    +91 123 456 7890<br />
                    +91 987 654 3210
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="staggered-entrance relative">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] -z-10 animate-pulse" />
            <div className="glass-card p-12 sm:p-20 w-full border-none shadow-premium rounded-[4rem] group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               
              <h3 className="text-h3 sm:text-h2 font-black mb-12 tracking-tight text-center sm:text-left">{t("contact.formTitle")}</h3>
              <form className="space-y-10 group/form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.3em] ml-2 leading-none">{t("contact.fullName")}</label>
                    <input type="text" className="input-field h-[64px] px-8 w-full bg-bg-secondary/30 focus:bg-white dark:focus:bg-bg-primary transition-all duration-500 rounded-2xl font-bold border-border-color" placeholder="Abdullah Ahmad" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.3em] ml-2 leading-none">{t("contact.emailLabel")}</label>
                    <input type="email" className="input-field h-[64px] px-8 w-full bg-bg-secondary/30 focus:bg-white dark:focus:bg-bg-primary transition-all duration-500 rounded-2xl font-bold border-border-color" placeholder="connect@islamband.org" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.3em] ml-2 leading-none">{t("contact.subject")}</label>
                  <input type="text" className="input-field h-[64px] px-8 w-full bg-bg-secondary/30 focus:bg-white dark:focus:bg-bg-primary transition-all duration-500 rounded-2xl font-bold border-border-color" placeholder="Community Collaboration" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-primary/40 uppercase tracking-[0.3em] ml-2 leading-none">{t("contact.message")}</label>
                  <textarea className="input-field p-8 min-h-[180px] sm:min-h-[220px] resize-none w-full bg-bg-secondary/30 focus:bg-white dark:focus:bg-bg-primary transition-all duration-500 rounded-3xl font-bold border-border-color" placeholder="Your vision or inquiry here..."></textarea>
                </div>
                <button type="button" className="btn-primary w-full h-[72px] justify-center text-body-lg sm:text-h4 mt-8 rounded-2xl group/btn transform hover:scale-[1.02] transition-all duration-500 shadow-xl shadow-emerald-500/20 overflow-hidden relative">
                   <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                   <span className="relative z-10 flex items-center gap-4">
                     {t("contact.send")} 
                     <PiPaperPlaneRightBold size={24} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" />
                   </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
