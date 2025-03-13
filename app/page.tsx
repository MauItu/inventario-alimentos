'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProducts } from '@/contexts/ProductContext'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { AddProductModal } from '@/app/components/AddProductModal'
import { ProductList } from '@/app/components/ProductList'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { user, login, createAccount, logout } = useAuth()
  const { products, fetchProducts } = useProducts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    if (user?.email) {
      fetchProducts(user.email)
    }
  }, [user?.email, fetchProducts])

  const handleAuth = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      let success = false
      if (authMode === 'login') {
        success = await login(email)
        if (success) {
          toast({
            title: "Éxito",
            description: "Has iniciado sesión correctamente",
          })
        } else {
          toast({
            title: "Error",
            description: "Email no encontrado. Intenta registrarte primero.",
            variant: "destructive",
          })
        }
      } else {
        success = await createAccount(email)
        if (success) {
          await login(email)
          toast({
            title: "Éxito",
            description: "Cuenta creada correctamente",
          })
        } else {
          toast({
            title: "Error",
            description: "No se pudo crear la cuenta. El email podría estar en uso.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('Error de autenticación:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error durante la autenticación",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
  }

  // Pantalla de login/registro
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="tu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : (authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
              </Button>
              <div className="text-center mt-4">
                {authMode === 'login' ? (
                  <p className="text-sm">
                    ¿No tienes cuenta?{' '}
                    <button
                      onClick={() => setAuthMode('register')}
                      className="text-blue-600 hover:underline"
                    >
                      Registrarse
                    </button>
                  </p>
                ) : (
                  <p className="text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      className="text-blue-600 hover:underline"
                    >
                      Iniciar Sesión
                    </button>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard (cuando el usuario está autenticado)
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bienvenido, {user.email}</h1>
        <div>
          <Button onClick={() => setIsModalOpen(true)} className="mr-2">Agregar Producto</Button>
          <Button onClick={handleLogout} variant="outline">Cerrar sesión</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {
            products.length > 0 ?
              <ProductList products={products} /> : <p>No hay productos disponibles.</p>
          }
        </CardContent>
      </Card>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}