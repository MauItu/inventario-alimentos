import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import type { Category, FoodType, MeasureUnit } from '@prisma/client';
import { CATEGORY_LABELS, FOOD_TYPE_LABELS, MEASURE_UNIT_LABELS } from '@/lib/product-labels';
import type { NewProduct } from './types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: NewProduct) => Promise<void>;
}

export function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps): React.JSX.Element {
  const [submitting, setSubmitting] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [typeFood, setTypeFood] = useState<FoodType>('perecedero');
  const [quantity, setQuantity] = useState('');
  const [typeMeasure, setTypeMeasure] = useState<MeasureUnit>('unidades');
  const [dateEntry, setDateEntry] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const handleAddProduct = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!category) {
      toast({
        title: "Falta la categoría",
        description: "Selecciona una categoría para el producto.",
        variant: "destructive",
      });
      return;
    }
    const newProduct: NewProduct = {
      foodName,
      category,
      typeFood,
      quantity: parseFloat(quantity),
      typeMeasure,
      dateEntry: new Date(dateEntry),
      expirationDate: typeFood === 'perecedero' ? new Date(expirationDate) : undefined,
    };
    setSubmitting(true);
    try {
      await onAdd(newProduct);
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = (): void => {
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
            <Select value={category} onValueChange={(value: Category) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo de alimento</Label>
            <RadioGroup value={typeFood} onValueChange={(value: FoodType) => setTypeFood(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perecedero" id="perecedero" />
                <Label htmlFor="perecedero">{FOOD_TYPE_LABELS.perecedero}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no_perecedero" id="no-perecedero" />
                <Label htmlFor="no-perecedero">{FOOD_TYPE_LABELS.no_perecedero}</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <div className="flex space-x-2">
              <Input
                id="quantity"
                type="number"
                step="any"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <Select value={typeMeasure} onValueChange={(value: MeasureUnit) => setTypeMeasure(value)}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Unidad" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MEASURE_UNIT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
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
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Agregando...' : 'Agregar Producto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}