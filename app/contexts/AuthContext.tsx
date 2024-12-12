'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Product = {
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
  login: (email: string) => boolean
  logout: () => void
  addProduct: (product: Product) => void
  removeProduct: (index: number) => void
  createAccount: (email: string) => boolean
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

  const login = (email: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const existingUser = storedUsers.find((u: User) => u.email === email)
    if (existingUser) {
      setUser(existingUser)
      localStorage.setItem('user', JSON.stringify(existingUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const addProduct = (product: Product) => {
    if (user) {
      const updatedUser = { ...user, products: [...user.products, product] }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Update the user in the users array
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = storedUsers.map((u: User) => u.email === user.email ? updatedUser : u)
      localStorage.setItem('users', JSON.stringify(updatedUsers))
    }
  }

  const removeProduct = (index: number) => {
    if (user) {
      const updatedProducts = [...user.products]
      updatedProducts.splice(index, 1)
      const updatedUser = { ...user, products: updatedProducts }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Update the user in the users array
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = storedUsers.map((u: User) => u.email === user.email ? updatedUser : u)
      localStorage.setItem('users', JSON.stringify(updatedUsers))
    }
  }

  const createAccount = (email: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    if (storedUsers.some((u: User) => u.email === email)) {
      return false
    }
    const newUser = { email, products: [] }
    storedUsers.push(newUser)
    localStorage.setItem('users', JSON.stringify(storedUsers))
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return true
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, addProduct, removeProduct, createAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

