import { getById, products } from '@/lib/data'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { ProductCard } from '@/components/product/ProductCard'
import { Star, Package, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getById(params.id)
  if (!product) notFound()
  
  // Guard against missing images
  const productImage = product.images?.[0] || '/images/placeholder.png'
  
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="pt-20 min-h-screen bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="relative aspect-square bg-[#111] border border-white/5 overflow-hidden">
            <Image src={productImage} alt={product.name} fill className="object-cover opacity-80" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
            {product.isNew && (
              <div className="absolute top-5 left-5 bg-red-500 text-white text-xs tracking-widest uppercase px-3 py-1.5 font-bold">New</div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">{product.category}</p>
              <h1 className="font-display font-900 text-5xl lg:text-6xl uppercase text-white leading-tight mb-4">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < Math.round(product.rating) ? 'fill-red-500 text-red-500' : 'text-white/20'} />
                  ))}
                </div>
                <span className="text-white/40 text-xs">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display font-800 text-4xl text-white">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-white/30 text-xl line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs px-2 py-1 tracking-widest uppercase">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-white/50 leading-relaxed">{product.longDescription}</p>

            {product.moq && (
              <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 px-4 py-3">
                <Package size={15} className="text-red-500" />
                <p className="text-sm text-white/70">Minimum order: <span className="text-white font-semibold">{product.moq} pieces</span></p>
              </div>
            )}

            <AddToCartButton product={product} />

            {product.customizable && (
              <Link href="/customize"
                className="flex items-center justify-center gap-3 border border-red-500/30 text-red-400 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-red-500/10 transition-all">
                <Zap size={13} /> Customize This Kit <ArrowRight size={13} />
              </Link>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span key={tag} className="text-[9px] tracking-widest uppercase bg-white/5 text-white/30 px-3 py-1.5">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-white/5 pt-16">
            <h2 className="font-display font-900 text-3xl uppercase text-white mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}