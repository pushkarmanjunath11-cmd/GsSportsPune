'use client'

import { useCartStore } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center space-y-6">
          <ShoppingBag size={60} strokeWidth={1} className="text-white/10 mx-auto" />
          <h1 className="font-display font-900 text-4xl uppercase text-white">Cart is Empty</h1>
          <p className="text-white/30 text-sm">Add some kits to get started.</p>
          <Link href="/shop" className="inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 font-display font-700 text-sm tracking-widest uppercase hover:bg-red-600 transition-all">
            Shop Kits <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-[#080808]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <h1 className="font-display font-900 text-5xl uppercase text-white mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-5 pb-6 border-b border-white/5">
                <Link href={`/products/${item.product.id}`} className="w-24 h-24 bg-[#111] relative flex-shrink-0 overflow-hidden">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover opacity-80" />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-700 text-white text-lg uppercase">{item.product.name}</h3>
                      {item.selectedSize && <p className="text-xs text-white/30 mt-1">Size: {item.selectedSize}</p>}
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-white/20 hover:text-red-400 transition-colors"><X size={16} /></button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-white/10">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 text-white/40 hover:text-white"><Minus size={13} /></button>
                      <span className="px-4 text-white text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 text-white/40 hover:text-white"><Plus size={13} /></button>
                    </div>
                    <span className="text-white font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside>
            <div className="bg-[#111] border border-white/5 p-6 sticky top-24">
              <h2 className="font-display font-800 text-xl uppercase text-white mb-6">Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between"><span className="text-white/40">Subtotal</span><span className="text-white">₹{cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Shipping</span><span className="text-green-400">TBD</span></div>
                <div className="border-t border-white/5 pt-3 flex justify-between font-semibold text-base">
                  <span className="text-white">Total</span><span className="text-white">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full text-center bg-red-500 text-white py-4 text-xs tracking-widest uppercase font-display font-700 hover:bg-red-600 transition-all mb-3">
                Checkout
              </Link>
              <Link href="/shop" className="block w-full text-center border border-white/10 text-white/40 py-3.5 text-xs tracking-widest uppercase hover:border-white/30 transition-all">
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}