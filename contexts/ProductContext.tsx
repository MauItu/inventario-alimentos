'use client'
import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { Product } from '@/models/types'
import { useAuth } from './AuthContext'

type ProductContextType = {
  products: Product[]
  loading: boolean
  fetchProducts: (email: string) => Promise<void>
  addProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
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

  // Obtener productos de un usuario
  const fetchProducts = async (email: string) => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/products?email=${email}`)
      const fetchedProducts = response.data.map((product: any) => ({
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
      
      // Actualizar datos en localStorage
      if (user) {
        const updatedUser = { ...user, products: fetchedProducts }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Agregar un nuevo producto
  const addProduct = async (product: Product) => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await axios.post('/api/products', {
        ...product,
        email: user.email
      })
      
      if (response.status === 200) {
        const newProduct = response.data
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
        
        // Actualizar datos en localStorage
        const updatedUser = { ...user, products: updatedProducts }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error adding product:', error)
    } finally {
      setLoading(false)
    }
  }

  // Eliminar un producto
  const deleteProduct = async (id: string) => {
    if (!user) return
    
    try {
      const response = await axios.delete(`/api/products?id=${id}`, {
        data: { email: user.email }
      })
      
      if (response.status === 200) {
        const updatedProducts = products.filter(product => product.id !== id)
        setProducts(updatedProducts)
        
        // Actualizar datos en localStorage
        const updatedUser = { ...user, products: updatedProducts }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  )
}