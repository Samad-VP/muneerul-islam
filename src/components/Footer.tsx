import Link from "next/link"
import Image from "next/image"
import { PiEnvelopeSimpleDuotone, PiMapPinDuotone, PiPhoneDuotone, PiFacebookLogoDuotone, PiYoutubeLogoDuotone, PiInstagramLogoDuotone } from "react-icons/pi"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-primary border-t border-border-color/50 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-emerald-500/5 blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-12 h-12 rounded-full border border-emerald-400/30 flex items-center justify-center overflow-hidden bg-white shadow-premium group-hover:scale-110 transition-transform duration-500 p-1">
                <Image src="/logo.png" alt="Muneerul Islam Logo" width={48} height={48} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black gradient-text leading-tight tracking-tighter">Muneerul Islam</span>
                <span className="arabic-text text-sm text-emerald-500/80 font-bold leading-none">منیر الاسلام</span>
              </div>
            </Link>
            <p className="text-text-primary/60 text-lg max-w-md mb-8 leading-relaxed font-medium">
              Muneerul Islam Mahallu Committee is dedicated to serving our community 
              through faith, education, and social welfare programs. Building a stronger future together.
            </p>
            <div className="flex gap-4">
              {[PiFacebookLogoDuotone, PiYoutubeLogoDuotone, PiInstagramLogoDuotone].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-sm">
                  <Icon size={22} />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 flex flex-row justify-between items-start gap-4 sm:grid sm:grid-cols-3 sm:gap-12">
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-text-primary font-black uppercase tracking-widest text-[10px] sm:text-xs mb-6 sm:mb-8">Navigation</h4>
              <ul className="flex flex-col gap-4">
                {["Home", "About Us", "Committee", "Gallery", "Contact"].map((link) => (
                  <li key={link} className="flex justify-center sm:justify-start">
                    <Link href={link === "Home" ? "/" : `/${link.toLowerCase().split(" ")[0]}`} className="text-text-primary/70 text-[12px] sm:text-sm font-bold hover:text-emerald-500 transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center sm:items-start sm:col-span-2">
              <h4 className="text-text-primary font-black uppercase tracking-widest text-[10px] sm:text-xs mb-6 sm:mb-8">Contact Info</h4>
              <ul className="flex flex-col gap-6">
                <li className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <PiMapPinDuotone size={16} className="sm:size-[20px]" />
                  </div>
                  <span className="text-text-primary/70 text-[12px] sm:text-sm font-bold leading-relaxed sm:pt-1 select-all text-center sm:text-left">
                    Kolathur North Juma Masjid,<br className="hidden sm:block" /> Kozhikode, Kerala 673612
                  </span>
                </li>
                <li className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    <PiEnvelopeSimpleDuotone size={16} className="sm:size-[20px]" />
                  </div>
                  <span className="text-text-primary/70 text-[11px] sm:text-sm font-bold select-all text-center sm:text-left truncate max-w-[120px] sm:max-w-none">info@muneerulislam.org</span>
                </li>
                <li className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0 group-hover:bg-gold group-hover:text-white transition-all duration-300">
                    <PiPhoneDuotone size={16} className="sm:size-[20px]" />
                  </div>
                  <span className="text-text-primary/70 text-[11px] sm:text-sm font-bold select-all text-center sm:text-left">+91 123 456 7890</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-border-color/30 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
          <p className="text-text-primary/50 text-[10px] uppercase tracking-widest font-black">
            © {currentYear} Muneerul Islam Mahallu Committee. All rights reserved.
          </p>
          <div className="flex gap-8 justify-center">
            <Link href="/privacy" className="text-text-primary/50 text-[10px] uppercase tracking-widest font-black hover:text-emerald-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-text-primary/50 text-[10px] uppercase tracking-widest font-black hover:text-emerald-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
