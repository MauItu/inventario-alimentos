'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { Product } from '@/components/types'

type User = {
  email: string
  products: Product[]
}

type AuthContextType = {
  user: User | null
  login: (email: string) => Promise<boolean>
  logout: () => void
  addProduct: (product: Product) => void
  createAccount: (email: string) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string) => {
    try {
      const response = await axios.get(`/api/users/${email}`)
      const user = {
        email: response.data.email,
        products: []
      }
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const createAccount = async (email: string) => {
    const response = await axios.post('/api/users', { email })
    return response.status === 200
  }

  const addProduct = async (product: Product) => {
    if (user) {
      setLoading(true)
      try {
        const response = await axios.post('/api/products', {
          ...product,
          email: user.email
        });
        if (response.status === 200) {
          const newProduct = response.data;
          setUser({
            ...user,
            products: [
              ...user.products,
              {
                id: newProduct.id,
                foodName: newProduct.foodName,
                category: newProduct.category,
                typeFood: newProduct.typeFood,
                quantity: newProduct.quantity,
                typeMeasure: newProduct.typeMeasure,
                dateEntry: newProduct.dateEntry,
                expirationDate: newProduct.expirationDate
              }
            ]
          });
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('error papi adding product:', error);
      } finally {
        setLoading(false);
      }
    }
  }
  return (
    <AuthContext.Provider value={{ user, login, logout, addProduct, createAccount, loading }}>
      {children}
    </AuthContext.Provider>
  )
}