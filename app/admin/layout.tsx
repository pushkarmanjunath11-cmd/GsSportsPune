'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, PlusSquare, ShoppingCart, Package, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/add-product', label: 'Add Product', icon: PlusSquare },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') { setAuthed(true); return }
    const ok = localStorage.getItem('gs_admin')
    if (!ok) { router.push('/admin/login'); return }
    setAuthed(true)
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>
  if (!authed) return <div style={{ background: '#080808', minHeight: '100vh' }} />

  const logout = () => {
    localStorage.removeItem('gs_admin')
    router.push('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 220, background: '#111', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>

        {/* Logo → clicks to store */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(232,22,42,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: '#e8162a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(232,22,42,0.4)' }}>
                <span className="font-display" style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>GS</span>
              </div>
              <div>
                <p className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f5f5f5', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>GS Sports</p>
                <p style={{ fontSize: 9, color: 'rgba(232,22,42,0.7)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 2 }}>Admin</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                  background: active ? '#e8162a' : 'transparent',
                  color: active ? '#fff' : 'rgba(245,245,245,0.4)',
                  borderRadius: 8,
                  fontSize: 13, fontWeight: 700,
                  transition: 'all 0.2s',
                  boxShadow: active ? '0 4px 20px rgba(232,22,42,0.3)' : 'none',
                }}>
                  <Icon size={16} strokeWidth={2} />
                  {label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', color: 'rgba(245,245,245,0.3)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderRadius: 8, textAlign: 'left' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <p className="font-display" style={{ fontSize: 14, fontWeight: 700, color: 'rgba(245,245,245,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {navItems.find(n => n.href === pathname)?.label ?? 'Admin'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(245,245,245,0.25)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Live
            </span>
            <div style={{ width: 32, height: 32, background: '#e8162a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', fontFamily: 'Barlow Condensed, sans-serif' }}>GS</div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px' }}>{children}</main>
      </div>
    </div>
  )
}