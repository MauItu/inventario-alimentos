import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/app/hooks/use-toast';
import { Product, ProductUnit } from './types';

export function AddProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addProduct, loading} = useAuth();
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [typeFood, setTypeFood] = useState<'perecedero' | 'no perecedero'>('perecedero');
  const [quantity, setQuantity] = useState('');
  const [typeMeasure, setTypeMeasure] = useState<ProductUnit>('unidades');
  const [dateEntry, setDateEntry] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      //el ID lo genera la BD
      id: '',
      foodName,
      category,
      typeFood,
      quantity: parseFloat(quantity),
      typeMeasure,
      dateEntry: new Date(dateEntry),
      expirationDate: typeFood === 'perecedero' ? new Date(expirationDate) : undefined,
    };
    try {
      await addProduct(newProduct);
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado exitosamente.",
      });
      handleAddAnother();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Hubo un error al agregar el producto.",
        variant: "destructive",
      });
    }
  };

  const handleAddAnother = () => {
    setFoodName('');
    setCategory('');
    setTypeFood('perecedero');
    setQuantity('');
    setTypeMeasure('unidades');
    setDateEntry('');
    setExpirationDate('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6">
        <DialogHeader>
          <DialogTitle>Agregar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <Label htmlFor="foodName">Nombre del producto</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
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
            <RadioGroup value={typeFood} onValueChange={(value: 'perecedero' | 'no perecedero') => setTypeFood(value)}>
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
              <Select value={typeMeasure} onValueChange={(value: ProductUnit) => setTypeMeasure(value)}>
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
            <Label htmlFor="dateEntry">Fecha de ingreso</Label>
            <Input
              id="dateEntry"
              type="date"
              value={dateEntry}
              onChange={(e) => setDateEntry(e.target.value)}
              required
            />
          </div>
          {typeFood === 'perecedero' && (
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
            <Button type="submit" disabled={loading}>{
              loading ? 'Agregando...' : 'Agregar Producto'
              }</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}