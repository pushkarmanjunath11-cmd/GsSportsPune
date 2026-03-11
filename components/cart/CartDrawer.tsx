'use client'

import { useCartStore } from '@/lib/store'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={closeCart} />}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] z-50 flex flex-col border-l border-white/5 transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true" aria-labelledby="cart-heading">

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 id="cart-heading" className="font-display font-800 text-2xl uppercase text-white">Your Cart
            {items.length > 0 && <span className="text-red-500 ml-2">({items.length})</span>}
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={44} strokeWidth={1} className="text-white/15" />
              <p className="text-white/30 text-sm font-display uppercase tracking-widest">Cart is empty</p>
              <button onClick={closeCart} className="text-xs tracking-widest uppercase border border-red-500/30 text-red-400 px-6 py-3 hover:bg-red-500/10 transition-all">
                Shop Now
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4">
                  <div className="w-20 h-20 bg-[#1a1a1a] relative flex-shrink-0 overflow-hidden">
                    <Image src={item.product.images?.[0] || '/images/placeholder.png'} alt={item.product.name} fill className="object-cover opacity-80" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-display font-700 text-white text-sm uppercase leading-snug">{item.product.name}</p>
                      <button onClick={() => removeItem(item.product.id, item.selectedSize)} aria-label={`Remove ${item.product.name}`} className="text-white/25 hover:text-red-400 transition-colors"><X size={14} /></button>
                    </div>
                    {item.selectedSize && <p className="text-xs text-white/30 mt-1">Size: {item.selectedSize}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/10">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)} aria-label="Decrease quantity" className="p-1.5 text-white/40 hover:text-white"><Minus size={12} /></button>
                        <span className="px-3 text-sm text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)} aria-label="Increase quantity" className="p-1.5 text-white/40 hover:text-white"><Plus size={12} /></button>
                      </div>
                      <p className="text-white font-semibold text-sm">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-white/5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className="text-white font-semibold">₹{cartTotal.toLocaleString()}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}
              className="block w-full text-center bg-red-500 text-white py-4 text-xs tracking-widest uppercase font-display font-700 hover:bg-red-600 transition-all">
              Checkout
            </Link>
            <button onClick={closeCart}
              className="block w-full text-center border border-white/10 text-white/40 py-3.5 text-xs tracking-widest uppercase hover:border-white/30 transition-all">
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}