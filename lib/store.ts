import { create } from 'zustand'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, qty?: number, size?: string, color?: string, name?: string, number?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product, qty = 1, size, color, name, number) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id && i.selectedSize === size)
      if (existing) {
        return { items: state.items.map((i) => i.product.id === product.id && i.selectedSize === size ? { ...i, quantity: i.quantity + qty } : i) }
      }
      return { items: [...state.items, { product, quantity: qty, selectedSize: size, selectedColor: color, customName: name, customNumber: number }] }
    })
  },
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.product.id !== id) })),
  updateQuantity: (id, qty) => {
    if (qty <= 0) { get().removeItem(id); return }
    set((state) => ({ items: state.items.map((i) => i.product.id === id ? { ...i, quantity: qty } : i) }))
  },
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  total: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
  itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
}))