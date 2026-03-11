'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { getFeatured, testimonials, categories } from '@/lib/data'
import { ProductCard } from '@/components/product/ProductCard'
import { ArrowRight, Zap, Shield, Clock, Star, ChevronRight, Phone } from 'lucide-react'

const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((mod) => mod.HeroScene),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
)

const marqueeItems = ['CUSTOM KITS', 'SUBLIMATION PRINT', 'BULK ORDERS', 'NAME & NUMBER', 'FAST DELIVERY', "PUNE'S #1 SPORTS BRAND", 'FOOTBALL BOOTS', 'MATCH BALLS']

const catConfig = [
  { id: 'jerseys', label: 'Jerseys & Kits', icon: '👕', bg: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', overlay: 'overlay-red', accent: '#e8162a' },
  { id: 'shoes', label: 'Football Boots', icon: '👟', bg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', overlay: 'overlay-orange', accent: '#f97316' },
  { id: 'customization', label: 'Customization', icon: '✨', bg: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800', overlay: 'overlay-red', accent: '#facc15' },
  { id: 'balls', label: 'Footballs', icon: '⚽', bg: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', overlay: 'overlay-orange', accent: '#22c55e' },
]

export default function HomePage() {
  const featured = getFeatured()

  return (
    <div style={{ background: '#080808' }}>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 3D bg */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* Multi-layer overlays */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.8) 55%, rgba(8,8,8,0.3) 100%)' }} />
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(8,8,8,1) 0%, transparent 40%)' }} />

        {/* Red diagonal stripe */}
        <div className="absolute top-0 right-0 h-full z-10" style={{ width: '35%', background: 'linear-gradient(135deg, transparent 0%, rgba(232,22,42,0.08) 50%, rgba(232,22,42,0.15) 100%)' }} />

        {/* Vertical red line accent */}
        <div className="absolute left-[52%] top-0 bottom-0 z-10 hidden lg:block" style={{ width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(232,22,42,0.6), transparent)' }} />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16 w-full">
          <div className="max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 animate-fade-in" style={{ background: 'rgba(232,22,42,0.12)', border: '1px solid rgba(232,22,42,0.4)', padding: '8px 18px' }}>
              <span style={{ color: '#e8162a', fontSize: 10 }}>●</span>
              <span style={{ color: '#f87171', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>Pune's #1 Custom Kit Maker</span>
            </div>

            {/* Headline */}
            <h1 className="font-display uppercase animate-fade-up" style={{ lineHeight: 0.85, marginBottom: 24 }}>
              <span className="block" style={{ fontSize: 'clamp(72px, 12vw, 130px)', color: '#f5f5f5', fontWeight: 900 }}>PLAY</span>
              <span className="block" style={{ fontSize: 'clamp(72px, 12vw, 130px)', color: '#e8162a', fontWeight: 900, textShadow: '0 0 80px rgba(232,22,42,0.5)' }}>IN YOUR</span>
              <span className="block animate-fade-up delay-200" style={{ fontSize: 'clamp(72px, 12vw, 130px)', fontWeight: 900 }}>
                <span style={{ color: '#f5f5f5' }}>OWN </span>
                <span style={{ WebkitTextStroke: '3px rgba(232,22,42,0.7)', color: 'transparent' }}>KIT</span>
              </span>
            </h1>

            <p className="animate-fade-up delay-300" style={{ color: 'rgba(245,245,245,0.5)', fontSize: 17, lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
              Custom football kits with sublimation printing. Your name, your number, your colors. Minimum 10 jerseys. Delivered fast across Pune & Maharashtra.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up delay-400">
              <Link href="/customize" className="glow-red inline-flex items-center gap-3 font-display font-800 uppercase tracking-widest"
                style={{ background: '#e8162a', color: '#fff', padding: '16px 36px', fontSize: 13, letterSpacing: '0.15em', textDecoration: 'none' }}>
                Customize Your Kit <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="inline-flex items-center gap-3 font-display font-800 uppercase tracking-widest"
                style={{ border: '2px solid rgba(245,245,245,0.25)', color: '#f5f5f5', padding: '16px 36px', fontSize: 13, letterSpacing: '0.15em', textDecoration: 'none' }}>
                Browse Shop
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 animate-fade-up delay-500" style={{ marginTop: 56 }}>
              {[['500+', 'Teams Kitted'], ['10K+', 'Jerseys Made'], ['5★', 'Rating']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display" style={{ fontSize: 36, fontWeight: 900, color: '#e8162a', lineHeight: 1 }}>{num}</p>
                  <p style={{ fontSize: 10, color: 'rgba(245,245,245,0.35)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 z-20 flex flex-col items-center gap-2 animate-float" style={{ transform: 'translateX(-50%)' }}>
          <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, #e8162a, transparent)' }} />
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div style={{ background: '#e8162a', borderTop: '1px solid #c8101f', borderBottom: '1px solid #c8101f', padding: '14px 0', overflow: 'hidden' }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-display" style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', margin: '0 28px' }}>
              {item} <span style={{ color: 'rgba(255,255,255,0.5)', margin: '0 8px' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ CATEGORY SHOWCASE ═══ */}
      <section style={{ padding: '80px 0', background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: '#e8162a', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>What We Sell</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 70px)', fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5', lineHeight: 0.9 }}>
              Shop By<br /><span style={{ color: '#e8162a' }}>Category</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {catConfig.map((cat, i) => (
              <Link href={`/shop?category=${cat.id}`} key={cat.id}
                className="group relative overflow-hidden block"
                style={{ aspectRatio: '3/4', textDecoration: 'none' }}>
                {/* Background image */}
                <Image src={cat.bg} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />

                {/* Colored overlay */}
                <div className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${cat.accent}CC 0%, ${cat.accent}44 100%)`, opacity: 0.7 }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.3) 60%, transparent 100%)' }} />

                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${cat.accent}EE 0%, ${cat.accent}88 100%)` }} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span style={{ fontSize: 40, marginBottom: 8 }}>{cat.icon}</span>
                  <h3 className="font-display" style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 1.1 }}>{cat.label}</h3>
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span style={{ fontSize: 11, color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Shop Now</span>
                    <ArrowRight size={12} color="#fff" />
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4" style={{ width: 32, height: 32, border: `2px solid ${cat.accent}`, opacity: 0.7 }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUSTOMIZATION HERO SECTION ═══ */}
      <section className="relative overflow-hidden" style={{ minHeight: 600 }}>
        <Image
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600"
          alt="Custom Kit" fill className="object-cover" style={{ opacity: 0.35 }}
        />
        {/* Bold red overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(8,8,8,0.98) 0%, rgba(8,8,8,0.85) 45%, rgba(232,22,42,0.25) 100%)' }} />

        {/* Diagonal red block */}
        <div className="absolute top-0 right-0 h-full clip-diagonal-r hidden lg:block" style={{ width: '45%', background: 'linear-gradient(135deg, rgba(232,22,42,0.15) 0%, rgba(232,22,42,0.05) 100%)', borderLeft: '3px solid rgba(232,22,42,0.4)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6" style={{ background: 'rgba(232,22,42,0.15)', border: '1px solid rgba(232,22,42,0.4)', padding: '6px 16px' }}>
              <Zap size={12} color="#e8162a" fill="#e8162a" />
              <span style={{ color: '#f87171', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>Signature Feature</span>
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(44px, 7vw, 88px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.88, marginBottom: 24 }}>
              <span style={{ color: '#f5f5f5' }}>YOUR NAME.<br /></span>
              <span style={{ color: '#e8162a', textShadow: '0 0 60px rgba(232,22,42,0.5)' }}>YOUR NUMBER.<br /></span>
              <span style={{ color: '#f5f5f5' }}>YOUR GAME.</span>
            </h2>
            <p style={{ color: 'rgba(245,245,245,0.5)', lineHeight: 1.8, maxWidth: 440, marginBottom: 32 }}>
              Every kit we make is 100% custom. Choose your colors, add player names and numbers, upload your club badge — precision sublimation printing that lasts years.
            </p>
            <ul style={{ marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Full sublimation — colors never fade or peel', 'Player name & number on every jersey', 'Club badge & sponsor logo placement', 'Any color combination — zero limits', 'Bulk orders from just 10 pieces'].map((item) => (
                <li key={item} className="flex items-center gap-3" style={{ fontSize: 14, color: 'rgba(245,245,245,0.7)' }}>
                  <span style={{ width: 6, height: 6, background: '#e8162a', transform: 'rotate(45deg)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/customize" className="glow-red inline-flex items-center gap-3 font-display font-800 uppercase"
              style={{ background: '#e8162a', color: '#fff', padding: '16px 36px', fontSize: 13, letterSpacing: '0.15em', textDecoration: 'none', fontWeight: 800 }}>
              Start Customizing <ArrowRight size={16} />
            </Link>
          </div>

          {/* Preview card */}
          <div className="relative hidden lg:block">
            <div style={{ background: 'rgba(17,17,17,0.9)', border: '1px solid rgba(232,22,42,0.3)', padding: 32, backdropFilter: 'blur(10px)' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-display" style={{ fontSize: 20, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5' }}>Kit Preview</p>
                <span style={{ background: '#e8162a', color: '#fff', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 700 }}>LIVE</span>
              </div>
              <div className="grid grid-cols-3 gap-4" style={{ marginBottom: 24 }}>
                {[['#10', 'Number', '#e8162a'], ['RAJU', 'Name', '#f97316'], ['⚽', 'Sport', '#22c55e']].map(([val, label, color]) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.04)', padding: '16px 8px', textAlign: 'center' }}>
                    <p className="font-display" style={{ fontSize: 24, fontWeight: 900, color }}>{val}</p>
                    <p style={{ fontSize: 9, color: 'rgba(245,245,245,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>{label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['Primary', '#e8162a'], ['Secondary', '#111']].map(([label, color]) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, background: color, border: '2px solid rgba(255,255,255,0.2)' }} />
                    <p style={{ fontSize: 10, color: 'rgba(245,245,245,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: -12, right: -12, width: 48, height: 48, borderTop: '3px solid #e8162a', borderRight: '3px solid #e8162a' }} />
            <div style={{ position: 'absolute', bottom: -12, left: -12, width: 48, height: 48, borderBottom: '3px solid #e8162a', borderLeft: '3px solid #e8162a' }} />
          </div>
        </div>
      </section>

      {/* ═══ WHY US — colorful cards ═══ */}
      <section style={{ padding: '80px 0', background: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: '#e8162a', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Why Choose Us</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px,6vw,70px)', fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5', lineHeight: 0.9 }}>
              Built <span style={{ color: '#e8162a' }}>Different</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Fast Turnaround', desc: '7–10 day delivery on custom orders. Rush delivery available for tournament emergencies.', color: '#e8162a', bg: 'rgba(232,22,42,0.08)' },
              { icon: Shield, title: 'Premium Quality', desc: 'Grade-A sublimation fabric. Stitching tested to 100+ wash cycles without any fading.', color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
              { icon: Clock, title: 'Bulk Friendly', desc: 'Special pricing for clubs and academies. Minimum order from just 10 pieces.', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="group relative overflow-hidden"
                style={{ background: bg, border: `1px solid ${color}22`, padding: 36, transition: 'all 0.3s' }}>
                {/* Top colored bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
                <div style={{ width: 52, height: 52, background: `${color}18`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 className="font-display" style={{ fontSize: 24, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', marginBottom: 12 }}>{title}</h3>
                <p style={{ color: 'rgba(245,245,245,0.45)', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section style={{ padding: '80px 0', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between" style={{ marginBottom: 48 }}>
            <div>
              <p style={{ color: '#e8162a', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Bestsellers</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(36px,6vw,70px)', fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5', lineHeight: 0.9 }}>
                Top <span style={{ color: '#e8162a' }}>Kits</span>
              </h2>
            </div>
            <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.4)', textDecoration: 'none', fontWeight: 700 }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══ FULL WIDTH CTA BANNER ═══ */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <Image src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1600" alt="Football" fill className="object-cover" style={{ opacity: 0.2 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(232,22,42,0.9) 0%, rgba(100,0,10,0.95) 100%)' }} />

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 80px)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Ready to Order?</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(40px,7vw,80px)', fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 0.9 }}>
              Get Your Team<br />Kitted Out
            </h2>
          </div>
          <div className="flex flex-col gap-4 min-w-fit">
            <a href="https://wa.me/919876543210"
              className="inline-flex items-center gap-3 font-display font-800 uppercase"
              style={{ background: '#fff', color: '#e8162a', padding: '18px 40px', fontSize: 14, letterSpacing: '0.15em', textDecoration: 'none', fontWeight: 900 }}>
              WhatsApp Us <ChevronRight size={18} />
            </a>
            <a href="tel:+919876543210"
              className="inline-flex items-center gap-3 font-display font-800 uppercase"
              style={{ border: '2px solid rgba(255,255,255,0.4)', color: '#fff', padding: '18px 40px', fontSize: 14, letterSpacing: '0.15em', textDecoration: 'none', fontWeight: 800 }}>
              <Phone size={16} /> Call Now
            </a>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: '80px 0', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: '#e8162a', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Club Reviews</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px,6vw,70px)', fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5', lineHeight: 0.9 }}>
              What Teams <span style={{ color: '#e8162a' }}>Say</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => {
              const colors = ['#e8162a', '#f97316', '#facc15', '#22c55e']
              const c = colors[i % colors.length]
              return (
                <div key={t.name} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: 28, borderTop: `3px solid ${c}`, position: 'relative' }}>
                  <div style={{ fontSize: 40, color: c, opacity: 0.2, fontFamily: 'Georgia', lineHeight: 1, marginBottom: 8 }}>"</div>
                  <div className="flex gap-1" style={{ marginBottom: 12 }}>
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={12} fill={c} color={c} />)}
                  </div>
                  <p style={{ color: 'rgba(245,245,245,0.6)', fontSize: 13, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                    <p style={{ color: '#f5f5f5', fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                    <p style={{ color: c, fontSize: 11, letterSpacing: '0.1em', marginTop: 2 }}>{t.club}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}