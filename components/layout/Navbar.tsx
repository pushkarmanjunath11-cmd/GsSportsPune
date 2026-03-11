'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, Phone } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useState, useEffect } from 'react'

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/customize', label: 'Customize' },
  { href: '/shop?category=kits', label: 'Full Kits' },
  { href: '/shop?category=jerseys', label: 'Jerseys' },
]

export function Navbar() {
  const { toggleCart, itemCount } = useCartStore()
  const count = itemCount()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-[#080808]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-16 lg:h-20">

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-red-500 flex items-center justify-center font-display font-900 text-white text-lg tracking-tight">
              GS
            </div>
            <div>
              <p className="font-display font-800 text-white text-lg leading-none tracking-wide uppercase">GS Sports</p>
              <p className="text-[9px] text-red-500 tracking-[0.25em] uppercase font-semibold leading-none">Pune</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="font-display font-600 text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors hover-underline-red">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="hidden lg:flex items-center gap-2 text-xs text-white/40 hover:text-red-500 transition-colors">
              <Phone size={13} />
              +91 98765 43210
            </a>

            <button onClick={toggleCart} className="relative text-white/70 hover:text-white transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button className="lg:hidden text-white/70" onClick={() => setMobileOpen(true)}>
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808] flex flex-col p-8">
          <div className="flex justify-between items-center mb-12">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
              <div className="w-9 h-9 bg-red-500 flex items-center justify-center font-display font-900 text-white text-lg">GS</div>
              <p className="font-display font-800 text-white text-xl tracking-wide uppercase">GS Sports</p>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-white/50"><X size={24} /></button>
          </div>
          <nav className="flex flex-col gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="font-display text-5xl font-800 uppercase text-white hover:text-red-500 transition-colors"
                onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-white/40 text-sm">
              <Phone size={14} /> +91 98765 43210
            </a>
          </div>
        </div>
      )}
    </>
  )
}