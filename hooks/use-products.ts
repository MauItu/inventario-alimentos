'use client'

import { useEffect, useState } from 'react'
import type { NewProduct, Product } from '@/components/types'
import { fetchJson, jsonBody } from '@/lib/api-client'

type ProductJson = Omit<Product, 'dateEntry' | 'expirationDate'> & {
  dateEntry: string
  expirationDate: string | null
}

interface UseProducts {
  products: Product[]
  loading: boolean
  error: boolean
  addProduct: (product: NewProduct) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

function toProduct(json: ProductJson): Product {
  return {
    id: json.id,
    foodName: json.foodName,
    category: json.category,
    typeFood: json.typeFood,
    quantity: json.quantity,
    typeMeasure: json.typeMeasure,
    dateEntry: new Date(json.dateEntry),
    expirationDate: json.expirationDate ? new Date(json.expirationDate) : null,
  }
}

export function useProducts(email: string | null): UseProducts {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!email) {
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)

    fetchJson<ProductJson[]>(`/api/products?${new URLSearchParams({ email })}`)
      .then((data) => {
        if (!cancelled) setProducts(data.map(toProduct))
      })
      .catch((error: unknown) => {
        console.error('Error al cargar productos:', error)
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [email])

  const addProduct = async (product: NewProduct): Promise<void> => {
    if (!email) return
    const created = await fetchJson<ProductJson>('/api/products', {
      method: 'POST',
      ...jsonBody({ ...product, email }),
    })
    setProducts((current) => [...current, toProduct(created)])
  }

  const deleteProduct = async (id: string): Promise<void> => {
    if (!email) return
    await fetchJson(`/api/products?${new URLSearchParams({ id })}`, {
      method: 'DELETE',
      ...jsonBody({ email }),
    })
    setProducts((current) => current.filter((product) => product.id !== id))
  }

  return { products, loading, error, addProduct, deleteProduct }
}
