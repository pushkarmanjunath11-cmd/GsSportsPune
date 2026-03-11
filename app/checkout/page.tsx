'use client'

import { useCartStore } from '@/lib/store'
import { placeOrder } from '@/lib/orderService'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Check, ChevronRight, ShoppingBag } from 'lucide-react'

type Step = 'contact' | 'shipping' | 'done'

const inp = { width: '100%', background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 16px', fontSize: 14, color: '#f5f5f5', outline: 'none', boxSizing: 'border-box' as const }
const lbl = { display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.35)', marginBottom: 8, fontWeight: 700 }

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>('contact')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: 'Pune', state: 'Maharashtra', zip: '' })
  const cartTotal = total()
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submitOrder = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      console.log('📦 Placing order with items:', items.length)
      const id = await placeOrder({
        customer: form.name,
        email: form.email || '',
        phone: form.phone,
        city: form.city,
        address: `${form.address}, ${form.city}, ${form.state} - ${form.zip}`,
        items,
        total: cartTotal,
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
      })
      console.log('✅ Order placed successfully:', id)
      setOrderId(id)
      clearCart()
      setStep('done')
    } catch (e: any) {
      console.error('❌ Order failed:', e)
      setErrorMsg(e?.message || String(e))
    }
    setLoading(false)
  }

  if (items.length === 0 && step !== 'done') {
    return (
      <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <div style={{ textAlign: 'center' }}>
          <ShoppingBag size={60} strokeWidth={1} color="rgba(245,245,245,0.1)" style={{ margin: '0 auto 20px' }} />
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5', marginBottom: 16 }}>Cart is Empty</h1>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e8162a', color: '#fff', padding: '14px 28px', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Shop Kits <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ width: 72, height: 72, background: '#e8162a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(232,22,42,0.5)' }}>
            <Check size={32} color="#fff" strokeWidth={3} />
          </div>
          <h1 className="font-display" style={{ fontSize: 52, fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5', lineHeight: 0.9, marginBottom: 16 }}>Order<br />Placed!</h1>
          <p style={{ color: 'rgba(245,245,245,0.4)', marginBottom: 8, fontSize: 13 }}>
            Order ID: <strong style={{ color: '#e8162a', fontFamily: 'monospace' }}>{orderId.slice(0, 16)}</strong>
          </p>
          <p style={{ color: 'rgba(245,245,245,0.5)', lineHeight: 1.8, marginBottom: 32, fontSize: 14 }}>
            We'll call <strong style={{ color: '#f5f5f5' }}>{form.phone}</strong> within 2 hours to confirm your order and arrange delivery.
          </p>
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', padding: 20, marginBottom: 28, textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#e8162a' }} />
            {[['Customer', form.name], ['Phone', form.phone], ['City', form.city], ['Total', `₹${cartTotal.toLocaleString()}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                <span style={{ color: 'rgba(245,245,245,0.35)' }}>{k}</span>
                <span style={{ color: '#f5f5f5', fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e8162a', color: '#fff', padding: '14px 32px', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 0 24px rgba(232,22,42,0.35)' }}>
            Back to Home <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#080808', minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em' }}>
              GS <span style={{ color: '#e8162a' }}>Sports</span>
            </span>
          </Link>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          {(['contact', 'shipping'] as Step[]).map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 24, height: 24, background: step === s ? '#e8162a' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: step === s ? '#fff' : 'rgba(245,245,245,0.3)' }}>{i + 1}</span>
                <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: step === s ? '#f5f5f5' : 'rgba(245,245,245,0.3)' }}>{s}</span>
              </div>
              {i < 1 && <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.08)' }} />}
            </div>
          ))}
        </div>

        {/* Error message — shows actual Firebase error instead of alert */}
        {errorMsg && (
          <div style={{ background: 'rgba(232,22,42,0.1)', border: '1px solid rgba(232,22,42,0.3)', padding: '12px 16px', marginBottom: 24, borderRadius: 2 }}>
            <p style={{ fontSize: 12, color: '#f87171', fontWeight: 700, marginBottom: 4 }}>❌ Order Failed</p>
            <p style={{ fontSize: 11, color: 'rgba(248,113,113,0.7)', fontFamily: 'monospace' }}>{errorMsg}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
          {/* Form */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', padding: 28, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#e8162a' }} />

            {step === 'contact' && (
              <>
                <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', marginBottom: 24 }}>Contact Info</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><label style={lbl}>Full Name *</label><input name="name" value={form.name} onChange={handle} placeholder="Your name" style={inp} /></div>
                  <div><label style={lbl}>Phone Number *</label><input name="phone" value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX" style={inp} /></div>
                  <div><label style={lbl}>Email</label><input name="email" value={form.email} onChange={handle} placeholder="email@example.com" style={inp} /></div>
                </div>
                <button onClick={() => form.name && form.phone && setStep('shipping')}
                  style={{ marginTop: 24, width: '100%', padding: '14px', background: '#e8162a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', opacity: form.name && form.phone ? 1 : 0.5, boxShadow: '0 0 20px rgba(232,22,42,0.3)' }}>
                  Continue →
                </button>
              </>
            )}

            {step === 'shipping' && (
              <>
                <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', marginBottom: 24 }}>Delivery Address</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><label style={lbl}>Street Address *</label><input name="address" value={form.address} onChange={handle} placeholder="Flat / Building / Area" style={inp} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={lbl}>City</label><input name="city" value={form.city} onChange={handle} style={inp} /></div>
                    <div><label style={lbl}>PIN Code</label><input name="zip" value={form.zip} onChange={handle} placeholder="411001" style={inp} /></div>
                  </div>
                  <div><label style={lbl}>State</label><input name="state" value={form.state} onChange={handle} style={inp} /></div>
                </div>

                {/* Payment note */}
                <div style={{ marginTop: 20, background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', padding: '14px 16px', display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>💳</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#facc15', marginBottom: 4 }}>Payment on Delivery / UPI</p>
                    <p style={{ fontSize: 11, color: 'rgba(245,245,245,0.4)', lineHeight: 1.5 }}>We'll collect payment via UPI / cash when we confirm your order. No online payment needed now.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={() => setStep('contact')}
                    style={{ padding: '14px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,245,245,0.4)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    ← Back
                  </button>
                  <button onClick={submitOrder} disabled={loading || !form.address}
                    style={{ flex: 1, padding: '14px', background: loading ? '#333' : '#e8162a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Barlow Condensed, sans-serif', boxShadow: loading ? 'none' : '0 0 20px rgba(232,22,42,0.3)', opacity: !form.address ? 0.5 : 1 }}>
                    {loading ? 'Placing Order...' : '⚡ Place Order'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Order summary */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#f97316' }} />
            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em', marginBottom: 20 }}>Your Order</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, background: '#1a1a1a', position: 'relative', flexShrink: 0 }}>
                    <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover', opacity: 0.8 }} />
                    <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#e8162a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#f5f5f5', lineHeight: 1.3 }}>{item.product.name}</p>
                    {item.selectedSize && <p style={{ fontSize: 10, color: 'rgba(245,245,245,0.3)', marginTop: 2 }}>Size: {item.selectedSize}</p>}
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#f5f5f5', flexShrink: 0 }}>₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'rgba(245,245,245,0.4)' }}>Subtotal</span>
                <span style={{ color: '#f5f5f5' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13 }}>
                <span style={{ color: 'rgba(245,245,245,0.4)' }}>Shipping</span>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>Confirm on call</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}>
                <span style={{ color: '#f5f5f5' }}>Total</span>
                <span style={{ color: '#e8162a' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}