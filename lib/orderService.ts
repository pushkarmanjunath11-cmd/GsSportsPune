import { db } from './firebase'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp, Timestamp
} from 'firebase/firestore'
import { CartItem } from '@/types'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface SerializedItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  selectedSize: string
  selectedColor: string
  customName: string
  customNumber: string
}

export interface Order {
  id: string
  customer: string
  email: string
  phone: string
  city: string
  address: string
  date: string
  status: OrderStatus
  items: SerializedItem[]
  total: number
  itemCount: number
  createdAt?: Timestamp
}

// Remove ALL undefined values — Firestore rejects them
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) return obj.map(removeUndefined)
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    )
  }
  return obj
}

function serializeItems(items: CartItem[]): SerializedItem[] {
  return items.map(i => ({
    productId: i.product.id ?? '',
    productName: i.product.name ?? '',
    productImage: i.product.images?.[0] ?? '',
    price: i.product.price ?? 0,
    quantity: i.quantity ?? 1,
    selectedSize: i.selectedSize ?? '',
    selectedColor: i.selectedColor ?? '',
    customName: i.customName ?? '',
    customNumber: i.customNumber ?? '',
  }))
}

const COL = 'orders'

export async function placeOrder(data: {
  customer: string
  email: string
  phone: string
  city: string
  address: string
  items: CartItem[]
  total: number
  itemCount: number
}): Promise<string> {
  const payload = removeUndefined({
    customer: data.customer ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    city: data.city ?? '',
    address: data.address ?? '',
    items: serializeItems(data.items),
    total: data.total ?? 0,
    itemCount: data.itemCount ?? 0,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp(),
  })

  console.log('📤 Sending to Firestore:', JSON.stringify(payload, null, 2))
  const ref = await addDoc(collection(db, COL), payload)
  return ref.id
}

export function subscribeOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const orders: Order[] = snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        customer: data.customer ?? 'Unknown',
        email: data.email ?? '',
        phone: data.phone ?? '',
        city: data.city ?? '',
        address: data.address ?? '',
        date: data.date ?? '',
        status: data.status ?? 'pending',
        items: data.items ?? [],
        total: data.total ?? 0,
        itemCount: data.itemCount ?? 0,
        createdAt: data.createdAt,
      } as Order
    })
    callback(orders)
  }, (error) => {
    console.error('Firestore error:', error)
    callback([])
  })
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(db, COL, id), { status })
}

export async function deleteOrder(id: string) {
  await deleteDoc(doc(db, COL, id))
}