import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  date: string
  status: "pending" | "completed" | "cancelled"
  shippingAddress?: {
    name: string
    email: string
    address: string
    city: string
    zipCode: string
    country: string
  }
}

interface CartState {
  items: CartItem[]
  orders: Order[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  checkout: (shippingAddress: Order["shippingAddress"]) => Order | null
  getOrder: (orderId: string) => Order | undefined
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        orders: [],
        addItem: (item) =>
          set(
            (state) => {
              const existingItem = state.items.find((i) => i.id === item.id)
              if (existingItem) {
                return {
                  items: state.items.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                  ),
                }
              }
              return { items: [...state.items, { ...item, quantity: 1 }] }
            },
            false,
            "addItem"
          ),
        removeItem: (id) =>
          set(
            (state) => ({ items: state.items.filter((i) => i.id !== id) }),
            false,
            "removeItem"
          ),
        updateQuantity: (id, quantity) =>
          set(
            (state) => ({
              items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
            }),
            false,
            "updateQuantity"
          ),
        clearCart: () => set({ items: [] }, false, "clearCart"),
        getTotal: () => {
          const state = get()
          return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
        },
        getItemCount: () => {
          const state = get()
          return state.items.reduce((total, item) => total + item.quantity, 0)
        },
        checkout: (shippingAddress) => {
          const state = get()
          if (state.items.length === 0) {
            return null
          }

          const order: Order = {
            id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            items: [...state.items],
            total: state.getTotal(),
            date: new Date().toISOString(),
            status: "completed",
            shippingAddress,
          }

          set(
            (prevState) => ({
              orders: [order, ...prevState.orders],
              items: [],
            }),
            false,
            "checkout"
          )

          return order
        },
        getOrder: (orderId) => {
          const state = get()
          return state.orders.find((order) => order.id === orderId)
        },
      }),
      {
        name: "cart-storage",
        version: 2,
        migrate: (persistedState: any, version: number) => {
          if (version === 0 || version === 1) {
            // Migrate from version 1 (only items) to version 2 (items + orders)
            return {
              ...persistedState,
              orders: [],
            }
          }
          return persistedState
        },
      }
    ),
    { name: "CartStore" }
  )
)

