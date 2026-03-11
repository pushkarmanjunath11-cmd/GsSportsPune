'use client'

import { useEffect, useState } from 'react'
import { subscribeOrders, updateOrderStatus, deleteOrder, Order, OrderStatus } from '@/lib/orderService'
import { Search, ChevronDown, Eye, Trash2, Loader2 } from 'lucide-react'

const statusStyle: Record<OrderStatus, { bg: string; color: string }> = {
  pending:    { bg: 'rgba(234,179,8,0.12)',  color: '#eab308' },
  processing: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  shipped:    { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
  delivered:  { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80' },
  cancelled:  { bg: 'rgba(232,22,42,0.12)',  color: '#f87171' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeOrders((data, err) => {
      if (err) {
        setError(err.message)
        console.error('Failed to load orders:', err)
      } else if (data) {
        setOrders(data)
        setError(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        <p className="font-semibold">Failed to load orders</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    )
  }

  const filtered = orders.filter(o => {
    const match = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
    return match && (filter === 'all' || o.status === filter)
  })

  const handleStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id)
    try {
      await updateOrderStatus(id, status)
    } catch (e: any) {
      console.error('Failed to update order status:', e)
      alert(`Error updating status: ${e?.message || 'Unknown error'}`)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this order?')) {
      try {
        await deleteOrder(id)
      } catch (e: any) {
        console.error('Failed to delete order:', e)
        alert(`Error deleting order: ${e?.message || 'Unknown error'}`)
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5' }}>Orders</h1>
          <p style={{ color: 'rgba(245,245,245,0.3)', fontSize: 13, marginTop: 4 }}>
            {loading ? 'Loading...' : `${orders.length} total · ₹${orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+o.total,0).toLocaleString()} revenue`}
            <span style={{ color: '#e8162a', marginLeft: 8 }}>● live</span>
          </p>
        </div>
        {loading && <Loader2 size={18} color="#e8162a" />}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {['all','pending','processing','shipped','delivered','cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: filter === s ? '#e8162a' : 'rgba(255,255,255,0.05)', color: filter === s ? '#fff' : 'rgba(245,245,245,0.4)', border: 'none', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', boxShadow: filter === s ? '0 0 16px rgba(232,22,42,0.3)' : 'none' }}>
            {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} color="rgba(245,245,245,0.2)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer name or order ID..." aria-label="Search orders by customer name or order ID"
          style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.07)', padding: '13px 16px 13px 42px', fontSize: 13, color: '#f5f5f5', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Table */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1.8fr', gap: 12 }}>
          {['Club / Customer','Order ID','Date','Status','Total','Actions'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.2)' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'rgba(245,245,245,0.3)', fontSize: 13 }}>Connecting to Firebase...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: 'rgba(245,245,245,0.3)', fontSize: 14, marginBottom: 8 }}>No orders found</p>
            <p style={{ color: 'rgba(245,245,245,0.15)', fontSize: 12 }}>Orders placed from the store will appear here instantly</p>
          </div>
        ) : filtered.map((o, i) => {
          const s = statusStyle[o.status]
          return (
            <div key={o.id}>
              <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1.8fr', gap: 12, alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f5f5f5' }}>{o.customer}</p>
                  <p style={{ fontSize: 11, color: 'rgba(245,245,245,0.25)', marginTop: 2 }}>{o.phone} · {o.city}</p>
                </div>
                <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(245,245,245,0.35)' }}>{o.id.slice(0,14)}…</p>
                <p style={{ fontSize: 12, color: 'rgba(245,245,245,0.4)' }}>{o.date}</p>
                <span style={{ background: s.bg, color: s.color, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 700, display: 'inline-block', border: `1px solid ${s.color}33` }}>{o.status}</span>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#f5f5f5' }}>₹{o.total.toLocaleString()}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* Status dropdown */}
                  <div style={{ position: 'relative' }}>
                    <select value={o.status} onChange={e => handleStatus(o.id, e.target.value as OrderStatus)} aria-label={`Order status for order ${o.id}`}
                      disabled={updating === o.id}
                      style={{ appearance: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(245,245,245,0.6)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 28px 7px 10px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', outline: 'none', fontFamily: 'Barlow Condensed, sans-serif', opacity: updating === o.id ? 0.5 : 1 }}>
                      {['pending','processing','shipped','delivered','cancelled'].map(st => (
                        <option key={st} value={st} style={{ background: '#111' }}>{st}</option>
                      ))}
                    </select>
                    <ChevronDown size={10} color="rgba(245,245,245,0.3)" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                  {/* Expand */}
                  <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} aria-label={`${expanded === o.id ? 'Collapse' : 'View'} order ${o.id}`}
                    style={{ padding: 7, background: expanded === o.id ? 'rgba(232,22,42,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${expanded === o.id ? 'rgba(232,22,42,0.3)' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', display: 'flex' }}>
                    <Eye size={13} color={expanded === o.id ? '#e8162a' : 'rgba(245,245,245,0.4)'} />
                  </button>
                  {/* Delete */}
                  <button onClick={() => handleDelete(o.id)} aria-label={`Delete order ${o.id}`}
                    style={{ padding: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} color="rgba(245,245,245,0.3)" />
                  </button>
                </div>
              </div>

              {expanded === o.id && (
                <div style={{ padding: '16px 24px 20px', background: 'rgba(232,22,42,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: o.items?.length ? 16 : 0 }}>
                    {[['Customer', o.customer], ['Phone', o.phone], ['Email', o.email], ['Address', o.address]].map(([k, v]) => (
                      <div key={k}>
                        <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.2)', marginBottom: 4 }}>{k}</p>
                        <p style={{ fontSize: 12, color: '#f5f5f5' }}>{v || '—'}</p>
                      </div>
                    ))}
                  </div>
                  {o.items?.length > 0 && (
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.2)', marginBottom: 8 }}>Items ({o.itemCount})</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {o.items.map((item, idx) => (
                          <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 12px', fontSize: 12, color: 'rgba(245,245,245,0.6)' }}>
                            {item.productName} × {item.quantity} {item.selectedSize ? `(${item.selectedSize})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}