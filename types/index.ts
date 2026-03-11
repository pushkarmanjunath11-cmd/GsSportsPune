export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  longDescription: string
  images: string[]
  category: string
  sport: string
  tags: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  sizes: string[]
  colors: string[]
  customizable: boolean
  moq?: number // minimum order quantity
  featured?: boolean
  isNew?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
  customName?: string
  customNumber?: string
}

export interface CustomizationOptions {
  name: string
  number: string
  teamName: string
  primaryColor: string
  secondaryColor: string
}