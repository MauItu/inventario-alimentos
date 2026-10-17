import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { CATEGORY_LABELS, FOOD_TYPE_LABELS } from '@/lib/product-labels'
import { Product } from './types'

interface ProductListProps {
  products: Product[]
  onDelete: (id: string) => void
}

// Las fechas se guardan como medianoche UTC; en otra zona horaria se verían un día antes
function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { timeZone: 'UTC' })
}

export function ProductList({ products, onDelete }: ProductListProps): React.JSX.Element {
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
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-1">Categoría: {CATEGORY_LABELS[product.category]}</p>
            <p className="text-sm text-gray-600 mb-1">Tipo: {FOOD_TYPE_LABELS[product.typeFood]}</p>
            <p className="text-sm text-gray-600 mb-1">Cantidad: {product.quantity} {product.typeMeasure}</p>
            <p className="text-sm text-gray-600 mb-1">Fecha de ingreso: {formatDate(product.dateEntry)}</p>
            {product.expirationDate && (
              <p className="text-sm text-gray-600">Fecha de caducidad: {formatDate(product.expirationDate)}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}