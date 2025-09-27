export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  views: number
  sales: number
  rating: number
  image_hover?: string
  weight?: number
  power?: number
  brand?: string
  short_description?: string
}
