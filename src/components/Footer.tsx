import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-secondary border-t border-border-color pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full border border-emerald-500/20 flex items-center justify-center overflow-hidden bg-white shrink-0">
                <Image src="/logo.png" alt="Muneerul Islam Logo" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold gradient-text leading-tight">Muneerul Islam</span>
                <span className="arabic-text text-xs text-emerald-400 opacity-80">منیر الاسلام</span>
              </div>
            </Link>
            <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
              Muneerul Islam Mahallu Committee is dedicated to serving our community 
              through faith, education, and social welfare programs.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8 w-full max-w-sm mx-auto md:max-w-none md:mx-0 text-left">
            <div className="flex flex-col items-start px-2">
              <h4 className="text-text-primary font-semibold mb-6 whitespace-nowrap">Quick Links</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href="/" className="text-text-secondary text-sm hover:text-emerald-400 transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-text-secondary text-sm hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="/committee" className="text-text-secondary text-sm hover:text-emerald-400 transition-colors">Committee</Link></li>
                <li><Link href="/gallery" className="text-text-secondary text-sm hover:text-emerald-400 transition-colors">Gallery</Link></li>
                <li><Link href="/contact" className="text-text-secondary text-sm hover:text-emerald-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="flex flex-col items-start px-2">
              <h4 className="text-text-primary font-semibold mb-6 whitespace-nowrap">Contact Info</h4>
              <ul className="flex flex-col gap-4">
                <li className="text-text-secondary text-sm">Near Juma Masjid, Main Road</li>
                <li className="text-text-secondary text-sm break-all">info@muneerulislam.org</li>
                <li className="text-text-secondary text-sm">+91 123 456 7890</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border-color/30 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-text-muted text-xs">
            © {currentYear} Muneerul Islam Mahallu Committee. All rights reserved.
          </p>
          <div className="flex gap-6 justify-center">
            <Link href="/privacy" className="text-text-muted text-xs hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-text-muted text-xs hover:text-emerald-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
