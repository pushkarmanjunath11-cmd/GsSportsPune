'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (form.email === 'admin@gssports.com' && form.password === 'gssports2025') {
        localStorage.setItem('gs_admin', 'true')
        router.push('/admin')
      } else {
        setError('Invalid email or password.')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#080808' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(232,22,42,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(135deg, transparent 0%, rgba(232,22,42,0.04) 100%)', borderLeft: '1px solid rgba(232,22,42,0.1)' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, background: '#e8162a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 40px rgba(232,22,42,0.5)' }}>
            <span className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>GS</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em' }}>GS Sports</h1>
          <p style={{ fontSize: 11, color: 'rgba(245,245,245,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 4 }}>Admin Portal</p>
        </div>

        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', padding: 36, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#e8162a' }} />
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', marginBottom: 28 }}>Sign In</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)', marginBottom: 8, fontWeight: 700 }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="admin@gssports.com"
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 16px', fontSize: 14, color: '#f5f5f5', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)', marginBottom: 8, fontWeight: 700 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="••••••••"
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 48px 14px 16px', fontSize: 14, color: '#f5f5f5', outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,245,0.3)' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(232,22,42,0.1)', border: '1px solid rgba(232,22,42,0.3)', padding: '10px 14px', fontSize: 13, color: '#f87171' }}>{error}</div>
            )}

            <button onClick={submit} disabled={loading}
              style={{ width: '100%', background: loading ? '#444' : '#e8162a', color: '#fff', padding: '15px 24px', fontSize: 13, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Barlow Condensed, sans-serif', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 0 30px rgba(232,22,42,0.4)' }}>
              {loading ? 'Signing in...' : <><Zap size={14} fill="white" /> Sign In</>}
            </button>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(245,245,245,0.2)', textAlign: 'center', marginTop: 24 }}>Restricted to GS Sports admin staff only.</p>
        </div>
        {process.env.NODE_ENV !== 'production' && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(245,245,245,0.15)' }}>Hint: admin@gssports.com / gssports2025</p>
        )}
      </div>
    </div>
  )
}