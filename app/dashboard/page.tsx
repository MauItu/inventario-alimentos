'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddProductModal } from '@/components/AddProductModal'
import { ProductList } from '@/components/ProductList'
import { useRouter } from 'next/navigation'
import { Product } from '@/components/types'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

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
            user && user.products && user.products.length > 0 ?
              <ProductList products={user.products} /> : null
          }
        </CardContent>
      </Card>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}