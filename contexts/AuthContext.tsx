'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { User, Product } from '@/models/types'

type AuthContextType = {
  user: User | null
  login: (email: string) => Promise<boolean>
  logout: () => void
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
  
  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Iniciar sesión
  const login = async (email: string) => {
    try {
      const response = await axios.get(`/api/users/${email}`)
      if (response.data.success) {
        const userData = response.data.data
        const user: User = {
          email: userData.email,
          products: []
        }
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      console.error('Error login:', error)
      return false
    }
  }

  // Cerrar sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  // Crear cuenta
  const createAccount = async (email: string) => {
    try {
      const response = await axios.post('/api/users', { email })
      return response.data.success
    } catch (error) {
      console.error('Error creating account:', error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, createAccount, loading }}>
      {children}
    </AuthContext.Provider>
  )
}