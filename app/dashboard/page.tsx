'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddProductModal } from '@/components/AddProductModal'
import { ProductList } from '@/components/ProductList'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, logout, mostrarproductos, generarRecetas } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        try {
          await mostrarproductos(user.email)
        } catch (error) {
          console.error('Error fetching products:', error)
        }
      }
    }

    fetchProducts()
  }, [user?.email])

  if (!user) {
    return <div>No autorizado</div>
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }
  const gptiar = async () => {
    try {
      console.log('Iniciando proceso de GPTiar...');
      
      // Mostrar mensaje de carga
      alert('Generando recetas con tus ingredientes. Por favor espera...');
      
      await generarRecetas();
    } catch (error) {
      console.error('Error al generar recetas:', error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bienvenido, {user.email}</h1>
        <div>
          <Button onClick={gptiar} className="mr-2">GePeTiar 🤙🏻</Button>
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
            user.products.length > 0 ?
              <ProductList products={user.products} /> : <p>No hay productos disponibles.</p>
          }
        </CardContent>
      </Card>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}