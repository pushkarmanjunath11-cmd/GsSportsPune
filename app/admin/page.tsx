'use client'

import { useEffect, useState } from 'react'
import { subscribeOrders, Order } from '@/lib/orderService'
import { products } from '@/lib/data'
import { TrendingUp, ShoppingBag, Package, Users, ArrowUpRight, Loader2 } from 'lucide-react'

const statusStyle: Record<string, { bg: string; color: string }> = {
  pending:    { bg: 'rgba(234,179,8,0.12)',  color: '#eab308' },
  processing: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  shipped:    { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
  delivered:  { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80' },
  cancelled:  { bg: 'rgba(232,22,42,0.12)',  color: '#f87171' },
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeOrders((orders, error) => {
      if (error) {
        console.error('Failed to load orders:', error)
        setLoading(false)
        return
      }
      if (orders) {
        setOrders(orders)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // Compute live stats from real orders
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const totalOrders = orders.length
  const teamsKitted = orders.filter(o => o.status === 'delivered').length
  const recentOrders = orders.slice(0, 8)

  const stats = [
    { label: 'Revenue', value: revenue >= 100000 ? `₹${(revenue / 100000).toFixed(1)}L` : `₹${revenue.toLocaleString()}`, icon: TrendingUp, color: '#e8162a' },
    { label: 'Orders', value: String(totalOrders), icon: ShoppingBag, color: '#f97316' },
    { label: 'Products', value: String(products.length), icon: Package, color: '#facc15' },
    { label: 'Teams Kitted', value: String(teamsKitted), icon: Users, color: '#22c55e' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5' }}>Dashboard</h1>
          <p style={{ color: 'rgba(245,245,245,0.3)', fontSize: 13, marginTop: 4 }}>GS Sports Pune — Live Admin Overview</p>
        </div>
        {loading && <Loader2 size={18} color="#e8162a" style={{ animation: 'spin 1s linear infinite' }} />}
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#4ade80', fontWeight: 700 }}>
                <ArrowUpRight size={10} /> LIVE
              </span>
            </div>
            <p className="font-display" style={{ fontSize: 30, fontWeight: 900, color: '#f5f5f5', lineHeight: 1 }}>
              {loading ? '—' : value}
            </p>
            <p style={{ fontSize: 10, color: 'rgba(245,245,245,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Orders breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {['pending','processing','shipped','delivered','cancelled'].map(s => {
          const count = orders.filter(o => o.status === s).length
          const st = statusStyle[s]
          return (
            <div key={s} style={{ background: st.bg, border: `1px solid ${st.color}33`, padding: '14px 16px' }}>
              <p className="font-display" style={{ fontSize: 24, fontWeight: 900, color: st.color }}>{count}</p>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: st.color, opacity: 0.7, marginTop: 4 }}>{s}</p>
            </div>
          )
        })}
      </div>

      {/* Recent orders table */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em' }}>
            Recent Orders
            <span style={{ marginLeft: 10, fontSize: 12, color: '#e8162a', fontWeight: 400 }}>● live</span>
          </h2>
          <a href="/admin/orders" style={{ fontSize: 11, color: '#e8162a', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>View all →</a>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(245,245,245,0.3)', fontSize: 13 }}>Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(245,245,245,0.3)', fontSize: 13 }}>No orders yet. Orders from the store will appear here in real-time.</div>
        ) : (
          <div>
            {recentOrders.map((o, i) => {
              const s = statusStyle[o.status] ?? { bg: 'rgba(255,255,255,0.05)', color: 'rgba(245,245,245,0.4)' }
              return (
                <div key={o.id} style={{ padding: '14px 24px', borderBottom: i < recentOrders.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#f5f5f5' }}>{o.customer}</p>
                    <p style={{ fontSize: 11, color: 'rgba(245,245,245,0.25)', marginTop: 2, fontFamily: 'monospace' }}>{o.id.slice(0, 16)} · {o.date} · {o.itemCount} pcs</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ background: s.bg, color: s.color, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 700, border: `1px solid ${s.color}33` }}>{o.status}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#f5f5f5' }}>₹{o.total.toLocaleString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}