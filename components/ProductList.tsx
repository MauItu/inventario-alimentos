import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Product } from './types'

export function ProductList({ products }: { products: Product[] }) {
  const { deleteProduct } = useAuth()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg mb-2">{product.foodName}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteProduct(product.id)}//el error de borrar producto no es aqui
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-1">Categoría: {product.category}</p>
            <p className="text-sm text-gray-600 mb-1">Tipo: {product.typeFood}</p>
            <p className="text-sm text-gray-600 mb-1">Cantidad: {product.quantity} {product.typeMeasure}</p>
            <p className="text-sm text-gray-600 mb-1">Fecha de ingreso: {new Date(product.dateEntry).toLocaleDateString()} </p>
            {product.expirationDate && (
              <p className="text-sm text-gray-600">Fecha de caducidad: {new Date(product.expirationDate).toLocaleDateString()}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}