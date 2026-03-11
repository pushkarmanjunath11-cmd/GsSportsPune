'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { Star, Package } from 'lucide-react'

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0] || '/images/placeholder.png'
  
  return (
    <Link href={`/products/${product.id}`} className="group block bg-[#111] border border-white/5 hover:border-red-500/30 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/80 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-red-500 text-white text-[9px] tracking-widest uppercase px-2 py-1 font-bold">New</span>
          )}
          {product.customizable && (
            <span className="bg-white/10 backdrop-blur text-white/80 text-[9px] tracking-widest uppercase px-2 py-1">Custom</span>
          )}
        </div>

        {product.moq && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#080808]/80 backdrop-blur px-2.5 py-1.5">
            <Package size={10} className="text-red-500" />
            <span className="text-[9px] text-white/60 tracking-widest uppercase">MOQ {product.moq}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[9px] text-red-500 tracking-widest uppercase font-semibold mb-1">{product.category}</p>
        <h3 className="font-display font-bold text-white uppercase text-lg leading-tight group-hover:text-red-400 transition-colors mb-2">
          {product.name}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-semibold text-lg">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-white/30 text-sm line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-red-500 text-red-500" />
            <span className="text-white/40 text-xs">{product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}