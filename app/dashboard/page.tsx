'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { useProducts } from '@/hooks/use-products'
import { toast } from '@/hooks/use-toast'
import { requestRecipes } from '@/lib/recipes-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddProductModal } from '@/components/AddProductModal'
import { ProductList } from '@/components/ProductList'

export default function DashboardPage(): React.JSX.Element | null {
  const { email, ready, logout } = useAuth()
  const { products, loading, error, addProduct, deleteProduct } = useProducts(email)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (ready && !email) {
      router.replace('/')
    }
  }, [ready, email, router])

  if (!ready || !email) {
    return null
  }

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteProduct(id)
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto.',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateRecipes = async (): Promise<void> => {
    if (products.length === 0) {
      toast({
        title: 'Sin productos',
        description: 'Agrega productos antes de generar recetas.',
        variant: 'destructive',
      })
      return
    }

    setGenerating(true)
    toast({
      title: 'Generando recetas',
      description: 'Esto puede tardar hasta un minuto. Por favor espera...',
      duration: Infinity,
    })

    try {
      await requestRecipes(email)
      toast({
        title: 'Recetas listas',
        description: 'Se descargó el PDF con las recetas de la semana.',
      })
    } catch (error) {
      console.error('Error al generar recetas:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron generar las recetas. Inténtalo de nuevo en unos minutos.',
        variant: 'destructive',
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bienvenido, {email}</h1>
        <div>
          <Button onClick={handleGenerateRecipes} disabled={generating} className="mr-2">
            {generating ? 'Generando...' : 'GePeTiar 🤙🏻'}
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="mr-2">Agregar Producto</Button>
          <Button onClick={logout} variant="outline">Cerrar sesión</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p>No se pudieron cargar los productos. Recarga la página para intentarlo de nuevo.</p>
          ) : products.length > 0 ? (
            <ProductList products={products} onDelete={handleDelete} />
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </CardContent>
      </Card>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addProduct} />
    </div>
  )
}
