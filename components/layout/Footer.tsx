import Link from 'next/link'
import { Instagram, Phone, MapPin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 pt-16 pb-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-red-500 flex items-center justify-center font-display font-900 text-white text-xl">GS</div>
              <div>
                <p className="font-display font-800 text-white text-xl uppercase tracking-wide">GS Sports</p>
                <p className="text-[10px] text-red-500 tracking-[0.25em] uppercase">Pune</p>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              Pune's premier custom sports kit manufacturer. Sublimation printing, name & number customization, bulk orders for clubs and academies.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/gssports_punee" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-red-500 hover:text-red-500 transition-all">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-widest uppercase text-white/30 mb-5 font-semibold">Quick Links</p>
            <ul className="space-y-3 text-sm">
              {['Shop All', 'Custom Kits', 'Full Kits', 'Jerseys', 'Tracksuits'].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-white/50 hover:text-red-500 transition-colors font-display uppercase tracking-wide text-xs font-600">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] tracking-widest uppercase text-white/30 mb-5 font-semibold">Contact</p>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex gap-3">
                <Phone size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex gap-3">
                <Mail size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@gssportspune.com" className="hover:text-white transition-colors">info@gssportspune.com</a>
              </li>
              <li className="flex gap-3">
                <MapPin size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span>Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">© 2025 GS Sports Pune. All rights reserved.</p>
          <p className="text-white/20 text-xs">Custom Sports Kits · Sublimation Printing · Bulk Orders Welcome</p>
        </div>
      </div>
    </footer>
  )
}