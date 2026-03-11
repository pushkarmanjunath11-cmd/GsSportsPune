'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import { Product } from '@/types'
import { Check, ShoppingBag } from 'lucide-react'

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  const [size, setSize] = useState<string | null>(product.sizes?.length ? product.sizes[0] : null)
  const [qty, setQty] = useState(product.moq ?? 1)
  const [added, setAdded] = useState(false)

  const handle = () => {
    if (!size) return
    addItem(product, qty, size)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product.sizes?.length) {
    return (
      <div className="space-y-5">
        <p className="text-xs text-white/40">No sizes available</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Sizes */}
      <div>
        <p className="text-xs tracking-widest uppercase text-white/40 mb-3 font-semibold">
          Size — <span className="text-white">{size}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button key={s} onClick={() => setSize(s)}
              className={`min-w-[44px] text-xs px-3 py-2.5 font-semibold tracking-widest uppercase transition-all ${size === s ? 'bg-red-500 text-white border border-red-500' : 'border border-white/15 text-white/50 hover:border-white/40'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <p className="text-xs tracking-widest uppercase text-white/40 mb-3 font-semibold">Quantity</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setQty(Math.max(product.moq ?? 1, qty - 1))}
            className="w-10 h-10 border border-white/15 text-white/60 hover:border-red-500 hover:text-red-500 transition-all text-lg">
            −
          </button>
          <span className="text-white font-semibold w-8 text-center">{qty}</span>
          <button onClick={() => setQty(qty + 1)}
            className="w-10 h-10 border border-white/15 text-white/60 hover:border-red-500 hover:text-red-500 transition-all text-lg">
            +
          </button>
          {product.moq && <span className="text-white/25 text-xs">Min. {product.moq} pcs</span>}
        </div>
      </div>

      {/* Button */}
      <button onClick={handle} disabled={!product.inStock || !size}
        className={`w-full py-4 text-sm tracking-widest uppercase font-display font-bold flex items-center justify-center gap-3 transition-all ${
          !product.inStock ? 'bg-white/10 text-white/30 cursor-not-allowed'
          : added ? 'bg-green-600 text-white'
          : 'bg-red-500 text-white hover:bg-red-600 glow-red'
        }`}>
        {!product.inStock ? 'Out of Stock' : added ? <><Check size={15} /> Added to Cart</> : <><ShoppingBag size={15} /> Add to Cart</>}
      </button>
    </div>
  )
}