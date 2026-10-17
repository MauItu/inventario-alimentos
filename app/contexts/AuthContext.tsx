'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ApiError, fetchJson, jsonBody } from '@/lib/api-client'

const STORAGE_KEY = 'user'

export type LoginResult = 'ok' | 'not_found' | 'error'
export type CreateAccountResult = 'ok' | 'exists' | 'error'

type AuthContextType = {
  email: string | null
  // false hasta leer localStorage: antes de eso no se sabe si hay sesión
  ready: boolean
  login: (email: string) => Promise<LoginResult>
  createAccount: (email: string) => Promise<CreateAccountResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Las sesiones guardadas por versiones anteriores también traen products; se ignoran
function readStoredEmail(): string | null {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (stored && typeof stored === 'object' && 'email' in stored && typeof stored.email === 'string') {
      return stored.email
    }
    return null
  } catch {
    return null
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setEmail(readStoredEmail())
    setReady(true)
  }, [])

  const saveEmail = (value: string): void => {
    setEmail(value)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: value }))
  }

  const login = async (value: string): Promise<LoginResult> => {
    try {
      const user = await fetchJson<{ email: string }>(`/api/users/${encodeURIComponent(value)}`)
      saveEmail(user.email)
      return 'ok'
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return 'not_found'
      }
      console.error('Error al iniciar sesión:', error)
      return 'error'
    }
  }

  const createAccount = async (value: string): Promise<CreateAccountResult> => {
    try {
      const user = await fetchJson<{ email: string }>('/api/users', {
        method: 'POST',
        ...jsonBody({ email: value }),
      })
      saveEmail(user.email)
      return 'ok'
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        return 'exists'
      }
      console.error('Error al crear la cuenta:', error)
      return 'error'
    }
  }

  const logout = (): void => {
    setEmail(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ email, ready, login, createAccount, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
