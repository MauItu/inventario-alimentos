'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { useProducts } from '@/contexts/ProductContext'
import { Product } from '@/models/types'

type AddProductModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { addProduct } = useProducts()
  const [foodName, setFoodName] = useState('')
  const [category, setCategory] = useState('')
  const [typeFood, setTypeFood] = useState('perecedero')
  const [quantity, setQuantity] = useState('')
  const [typeMeasure, setTypeMeasure] = useState('')
  const [dateEntry, setDateEntry] = useState('')
  const [expirationDate, setExpirationDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const product: Product = {
      id: '', // Se asignará automáticamente en el backend
      foodName,
      category,
      typeFood,
      quantity: Number(quantity),
      typeMeasure,
      dateEntry: new Date(dateEntry),
      expirationDate: expirationDate ? new Date(expirationDate) : null
    }
    
    await addProduct(product)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setFoodName('')
    setCategory('')
    setTypeFood('perecedero')
    setQuantity('')
    setTypeMeasure('')
    setDateEntry('')
    setExpirationDate('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="foodName">Nombre del Alimento</Label>
            <Input 
              id="foodName" 
              value={foodName} 
              onChange={(e) => setFoodName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lacteos">Lácteos</SelectItem>
                <SelectItem value="proteina">Proteína</SelectItem>
                <SelectItem value="verduras">Verduras</SelectItem>
                <SelectItem value="frutas">Frutas</SelectItem>
                <SelectItem value="granos">Granos</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Tipo de Alimento</Label>
            <RadioGroup value={typeFood} onValueChange={setTypeFood} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perecedero" id="perecedero" />
                <Label htmlFor="perecedero">Perecedero</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-perecedero" id="no-perecedero" />
                <Label htmlFor="no-perecedero">No Perecedero</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="typeMeasure">Unidad de Medida</Label>
              <Select value={typeMeasure} onValueChange={setTypeMeasure} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidades">Unidades</SelectItem>
                  <SelectItem value="kg">Kilogramos</SelectItem>
                  <SelectItem value="g">Gramos</SelectItem>
                  <SelectItem value="l">Litros</SelectItem>
                  <SelectItem value="ml">Mililitros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateEntry">Fecha de Ingreso</Label>
            <Input 
              id="dateEntry" 
              type="date" 
              value={dateEntry} 
              onChange={(e) => setDateEntry(e.target.value)} 
              required 
            />
          </div>
          
          {typeFood === 'perecedero' && (
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Fecha de Caducidad</Label>
              <Input 
                id="expirationDate" 
                type="date" 
                value={expirationDate} 
                onChange={(e) => setExpirationDate(e.target.value)} 
                required={typeFood === 'perecedero'} 
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}