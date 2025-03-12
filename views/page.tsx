'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProducts } from '@/contexts/ProductContext'
import { Button } from '@/views/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/views/components/ui/card'
import { AddProductModal } from '@/views/components/AddProductModal'
import { ProductList } from '@/views/components/ProductList'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { products, fetchProducts } = useProducts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user?.email) {
      fetchProducts(user.email)
    }
  }, [user?.email])

  if (!user) {
    return <div>No autorizado</div>
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

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