'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import prisma from '@/prisma/db'

type Product = {
  id: string
  name: string
  category: string
  type: 'perecedero' | 'no perecedero'
  quantity: number
  unit: 'unidades' | 'kilos' | 'libras'
  entryDate: string
  expirationDate?: string
}

type User = {
  email: string
  products: Product[]
}

type AuthContextType = {
  user: User | null
  login: (email: string) => Promise<boolean>
  logout: () => void
  addProduct: (product: Product) => void
  removeProduct: (id: string) => void
  createAccount: (email: string) => Promise<boolean>
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      const userProducts = await prisma.food.findMany({ where: { email } })
      const products = userProducts.map(product => ({
        id: product.id,
        name: product.foodName,
        category: product.category,
        type: product.typeFood as 'perecedero' | 'no perecedero',
        quantity: product.quantity,
        unit: product.typeMeasure as 'unidades' | 'kilos' | 'libras',
        entryDate: product.dateEntry.toISOString(),
        expirationDate: product.expirationDate ? product.expirationDate.toISOString() : undefined
      }))
      const userWithProducts = { ...existingUser, products }
      setUser(userWithProducts)
      localStorage.setItem('user', JSON.stringify(userWithProducts))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const addProduct = async (product: Product) => {
    if (user) {
      const newProduct = await prisma.food.create({
        data: {
          foodName: product.name,
          category: product.category,
          typeFood: product.type,
          quantity: product.quantity,
          typeMeasure: product.unit,
          dateEntry: new Date(product.entryDate),
          expirationDate: product.expirationDate ? new Date(product.expirationDate) : null,
          email: user.email
        }
      })
      setUser({
        ...user,
        products: [
          ...user.products,
          {
            id: newProduct.id,
            name: newProduct.foodName,
            category: newProduct.category,
            type: newProduct.typeFood as 'perecedero' | 'no perecedero',
            quantity: newProduct.quantity,
            unit: newProduct.typeMeasure as 'unidades' | 'kilos' | 'libras',
            entryDate: newProduct.dateEntry.toISOString(),
            expirationDate: newProduct.expirationDate ? newProduct.expirationDate.toISOString() : undefined
          }
        ]
      })
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  const removeProduct = async (id: string) => {
    if (user) {
      await prisma.food.delete({ where: { id } })
      const updatedProducts = user.products.filter((product) => product.id !== id)
      setUser({
        ...user,
        products: updatedProducts
      })
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  const createAccount = async (email: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return false
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        food: {
          create: []
        }
      }
    })
    setUser({ ...newUser, products: [] })
    localStorage.setItem('user', JSON.stringify(newUser))
    return true
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, addProduct, removeProduct, createAccount }}>
      {children}
    </AuthContext.Provider>
  )
}
