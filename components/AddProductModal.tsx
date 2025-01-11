'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/app/hooks/use-toast'

type ProductUnit = 'unidades' | 'kilos' | 'libras'

type Product = {
  id: string
  name: string
  category: string
  type: 'perecedero' | 'no perecedero'
  quantity: number
  unit: ProductUnit
  entryDate: string
  expirationDate?: string
}

export function AddProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addProduct } = useAuth()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<'perecedero' | 'no perecedero'>('perecedero')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState<ProductUnit>('unidades')
  const [entryDate, setEntryDate] = useState('')
  const [expirationDate, setExpirationDate] = useState('')

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      category,
      type,
      quantity: parseFloat(quantity),
      unit,
      entryDate,
      expirationDate: type === 'perecedero' ? expirationDate : undefined,
    }
    await addProduct(newProduct)
    toast({
      title: "Producto agregado",
      description: "El producto ha sido agregado exitosamente.",
    })
    handleAddAnother()
  }

  const handleAddAnother = () => {
    setName('')
    setCategory('')
    setType('perecedero')
    setQuantity('')
    setUnit('unidades')
    setEntryDate('')
    setExpirationDate('')
    // Mantener la categoría, tipo y unidad para facilitar la entrada de productos similares
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6">
        <DialogHeader>
          <DialogTitle>Agregar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del producto</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lacteos">Lácteos</SelectItem>
                <SelectItem value="frutas">Frutas</SelectItem>
                <SelectItem value="vegetales">Vegetales</SelectItem>
                <SelectItem value="carnes">Carnes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo de alimento</Label>
            <RadioGroup value={type} onValueChange={(value: 'perecedero' | 'no perecedero') => setType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perecedero" id="perecedero" />
                <Label htmlFor="perecedero">Perecedero</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no perecedero" id="no-perecedero" />
                <Label htmlFor="no-perecedero">No perecedero</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <div className="flex space-x-2">
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <Select value={unit} onValueChange={(value: ProductUnit) => setUnit(value)}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidades">Unidades</SelectItem>
                  <SelectItem value="kilos">Kilos</SelectItem>
                  <SelectItem value="libras">Libras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="entryDate">Fecha de ingreso</Label>
            <Input
              id="entryDate"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              required
            />
          </div>
          {type === 'perecedero' && (
            <div>
              <Label htmlFor="expirationDate">Fecha de caducidad</Label>
              <Input
                id="expirationDate"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
              />
            </div>
          )}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Agregar Producto</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
