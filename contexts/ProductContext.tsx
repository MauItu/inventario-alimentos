'use client'
import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { Product } from '@/models/types'
import { useAuth } from './AuthContext'
import { useToast } from "@/hooks/use-toast"

type ProductContextType = {
  products: Product[]
  loading: boolean
  fetchProducts: (email: string) => Promise<void>
  addProduct: (product: Product) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Obtener productos de un usuario
  const fetchProducts = async (email: string) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/products?email=${email}`)
      
      if (response.data && response.data.success) {
        const fetchedProducts = response.data.data.map((product: any) => ({
          id: product.id,
          foodName: product.foodName,
          category: product.category,
          typeFood: product.typeFood,
          quantity: product.quantity,
          typeMeasure: product.typeMeasure,
          dateEntry: new Date(product.dateEntry),
          expirationDate: product.expirationDate ? new Date(product.expirationDate) : null
        }))
        setProducts(fetchedProducts)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Agregar un nuevo producto
  const addProduct = async (product: Product): Promise<boolean> => {
    if (!user) return false
    
    setLoading(true)
    try {
      const response = await axios.post('/api/products', {
        ...product,
        email: user.email
      })
      
      if (response.data && response.data.success) {
        const newProduct = response.data.data
        const updatedProducts = [
          ...products,
          {
            id: newProduct.id,
            foodName: newProduct.foodName,
            category: newProduct.category,
            typeFood: newProduct.typeFood,
            quantity: newProduct.quantity,
            typeMeasure: newProduct.typeMeasure,
            dateEntry: new Date(newProduct.dateEntry),
            expirationDate: newProduct.expirationDate ? new Date(newProduct.expirationDate) : null
          }
        ]
        
        setProducts(updatedProducts)
        toast({
          title: "Éxito",
          description: "Producto agregado correctamente",
        })
        return true
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Error al agregar producto",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Eliminar un producto
  const deleteProduct = async (id: string): Promise<boolean> => {
    if (!user) return false
    
    try {
      const response = await axios.delete(`/api/products?id=${id}&email=${user.email}`)
      
      if (response.data && response.data.success) {
        const updatedProducts = products.filter(product => product.id !== id)
        setProducts(updatedProducts)
        toast({
          title: "Éxito",
          description: "Producto eliminado correctamente",
        })
        return true
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Error al eliminar producto",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  )
}