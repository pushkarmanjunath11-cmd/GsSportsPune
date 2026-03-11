'use client'

import { products, categories } from '@/lib/data'
import { ProductCard } from '@/components/product/ProductCard'
import Link from 'next/link'
import { useState } from 'react'

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('')

  let filtered = [...products]
  if (activeCategory !== 'all') filtered = filtered.filter((p) => p.category === activeCategory)
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price)

  const categoryColors: Record<string, string> = {
    jerseys: 'border-red-500 bg-red-500',
    shoes: 'border-orange-500 bg-orange-500',
    customization: 'border-yellow-400 bg-yellow-400',
    balls: 'border-green-500 bg-green-500',
  }

  const categoryAccent: Record<string, string> = {
    jerseys: 'text-red-400 border-red-500/40 bg-red-500/10',
    shoes: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    customization: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
    balls: 'text-green-400 border-green-500/40 bg-green-500/10',
  }

  return (
    <div className="pt-20 min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="px-6 lg:px-8 py-14 bg-[#0a0a0a] border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">Everything You Need</p>
          <h1 className="font-display font-900 text-5xl lg:text-7xl uppercase text-white">Shop All</h1>
        </div>
      </div>

      {/* Category cards */}
      <div className="px-6 lg:px-8 py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* All */}
          <button onClick={() => setActiveCategory('all')}
            className={`p-5 border-2 transition-all text-left ${activeCategory === 'all' ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30'}`}>
            <span className="text-3xl block mb-3">🏆</span>
            <p className="font-display font-800 text-white uppercase text-lg">All Products</p>
            <p className="text-white/40 text-xs mt-1">{products.length} items</p>
          </button>

          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`p-5 border-2 transition-all text-left ${activeCategory === cat.id ? `${categoryColors[cat.id]} text-white border-transparent` : 'border-white/10 hover:border-white/30'}`}>
              <span className="text-3xl block mb-3">{cat.icon}</span>
              <p className={`font-display font-800 uppercase text-lg ${activeCategory === cat.id ? 'text-white' : 'text-white'}`}>{cat.name}</p>
              <p className={`text-xs mt-1 ${activeCategory === cat.id ? 'text-white/70' : 'text-white/40'}`}>
                {products.filter(p => p.category === cat.id).length} items
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Sort + count bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {activeCategory !== 'all' && (
              <span className={`text-xs tracking-widest uppercase px-3 py-1.5 border font-semibold ${categoryAccent[activeCategory]}`}>
                {categories.find(c => c.id === activeCategory)?.name}
              </span>
            )}
            <p className="text-white/30 text-sm">{filtered.length} products</p>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-[#111] border border-white/10 text-white/50 text-xs tracking-widest uppercase px-4 py-2 focus:outline-none focus:border-red-500/50">
            <option value="">Sort: Default</option>
            <option value="price-asc">Price: Low–High</option>
            <option value="price-desc">Price: High–Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  )
}