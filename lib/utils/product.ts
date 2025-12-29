import type { Product } from "@/lib/stores/product-store"

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function getProductBySlug(slug: string, products: Product[]): Product | undefined {
  return products.find((product) => createSlug(product.name) === slug)
}

export function getProductSlug(product: Product): string {
  return createSlug(product.name)
}

