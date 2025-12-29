export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life",
    price: 199.99,
    image: "🎧",
    category: "Electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor and GPS",
    price: 299.99,
    image: "⌚",
    category: "Electronics",
    inStock: true,
  },
  {
    id: 3,
    name: "Laptop Stand",
    description: "Ergonomic aluminum laptop stand for better posture",
    price: 49.99,
    image: "💻",
    category: "Accessories",
    inStock: true,
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with Cherry MX switches",
    price: 129.99,
    image: "⌨️",
    category: "Accessories",
    inStock: true,
  },
  {
    id: 5,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 39.99,
    image: "🖱️",
    category: "Accessories",
    inStock: true,
  },
  {
    id: 6,
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
    price: 59.99,
    image: "🔌",
    category: "Accessories",
    inStock: true,
  },
  {
    id: 7,
    name: "Monitor 27\"",
    description: "4K UHD monitor with HDR and 144Hz refresh rate",
    price: 399.99,
    image: "🖥️",
    category: "Electronics",
    inStock: true,
  },
  {
    id: 8,
    name: "Webcam HD",
    description: "1080p webcam with auto-focus and built-in microphone",
    price: 79.99,
    image: "📹",
    category: "Electronics",
    inStock: false,
  },
  {
    id: 9,
    name: "Desk Mat",
    description: "Large desk mat with wrist support and smooth surface",
    price: 29.99,
    image: "🖼️",
    category: "Accessories",
    inStock: true,
  },
  {
    id: 10,
    name: "Cable Organizer",
    description: "Cable management system to keep your desk tidy",
    price: 19.99,
    image: "📦",
    category: "Accessories",
    inStock: true,
  },
]

export const categories = ["All", "Electronics", "Accessories"] as const

export type Category = (typeof categories)[number]

