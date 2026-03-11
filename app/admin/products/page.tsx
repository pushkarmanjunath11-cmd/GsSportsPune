'use client'

import { useState } from 'react'
import { products as initial } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Plus, Pencil, Trash2, Check } from 'lucide-react'

const catColors: Record<string, string> = {
  jerseys: '#e8162a',
  shoes: '#f97316',
  customization: '#facc15',
  balls: '#22c55e',
}

export default function ProductsPage() {
  const [items, setItems] = useState(initial)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const del = (id: string) => { setItems(p => p.filter(x => x.id !== id)); setDeleteId(null) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5' }}>Products</h1>
          <p style={{ color: 'rgba(245,245,245,0.3)', fontSize: 13, marginTop: 4 }}>{items.length} products in store</p>
        </div>
        <Link href="/admin/add-product" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: '#e8162a', color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(232,22,42,0.35)', cursor: 'pointer' }}>
            <Plus size={15} /> Add Product
          </div>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Jerseys & Kits', count: items.filter(p => p.category === 'jerseys').length, color: '#e8162a' },
          { label: 'Boots', count: items.filter(p => p.category === 'shoes').length, color: '#f97316' },
          { label: 'Customization', count: items.filter(p => p.category === 'customization').length, color: '#facc15' },
          { label: 'Balls', count: items.filter(p => p.category === 'balls').length, color: '#22c55e' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: '16px 20px', borderTop: `3px solid ${color}` }}>
            <p className="font-display" style={{ fontSize: 28, fontWeight: 900, color: '#f5f5f5' }}>{count}</p>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.3)', marginTop: 4 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} color="rgba(245,245,245,0.2)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.07)', padding: '13px 16px 13px 42px', fontSize: 13, color: '#f5f5f5', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Products list */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center' }}>
          {['Product', 'Category', 'Price', 'MOQ', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.2)' }}>{h}</span>
          ))}
        </div>

        {filtered.map((p, i) => {
          const color = catColors[p.category] || '#e8162a'
          return (
            <div key={p.id}>
              <div style={{ padding: '14px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'center' }}>
                {/* Product */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, background: '#1a1a1a', position: 'relative', flexShrink: 0, overflow: 'hidden', borderLeft: `3px solid ${color}` }}>
                    <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover', opacity: 0.75 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#f5f5f5' }}>{p.name}</p>
                    <p style={{ fontSize: 10, color: 'rgba(245,245,245,0.25)', marginTop: 2 }}>{p.customizable ? '✦ Customizable' : ''}{p.isNew ? ' · New' : ''}</p>
                  </div>
                </div>

                {/* Category */}
                <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color, fontWeight: 700, background: `${color}15`, padding: '4px 8px', display: 'inline-block' }}>{p.category}</span>

                {/* Price */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#f5f5f5' }}>₹{p.price.toLocaleString()}</p>
                  {p.originalPrice && <p style={{ fontSize: 11, color: 'rgba(245,245,245,0.25)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString()}</p>}
                </div>

                {/* MOQ */}
                <p style={{ fontSize: 12, color: 'rgba(245,245,245,0.35)' }}>{p.moq ?? '—'} pcs</p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link href="/admin/add-product">
                    <div style={{ padding: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', display: 'flex' }}>
                      <Pencil size={13} color="rgba(245,245,245,0.4)" />
                    </div>
                  </Link>
                  <button onClick={() => setDeleteId(p.id === deleteId ? null : p.id)}
                    style={{ padding: 7, background: deleteId === p.id ? 'rgba(232,22,42,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${deleteId === p.id ? 'rgba(232,22,42,0.3)' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={13} color={deleteId === p.id ? '#f87171' : 'rgba(245,245,245,0.4)'} />
                  </button>
                </div>
              </div>

              {/* Delete confirm */}
              {deleteId === p.id && (
                <div style={{ padding: '12px 24px', background: 'rgba(232,22,42,0.06)', borderBottom: '1px solid rgba(232,22,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 13, color: '#f87171' }}>Delete <strong>{p.name}</strong>?</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setDeleteId(null)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,245,245,0.4)', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                    <button onClick={() => del(p.id)} style={{ padding: '6px 14px', background: '#e8162a', color: '#fff', border: 'none', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}