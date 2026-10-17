import type { Category, FoodType, MeasureUnit } from '@prisma/client';

export interface Product {
  id: string;
  foodName: string;
  category: Category;
  typeFood: FoodType;
  quantity: number;
  typeMeasure: MeasureUnit;
  dateEntry: Date;
  expirationDate?: Date | null;
}

export type NewProduct = Omit<Product, 'id'>;

export interface Recipe {
  dia: string;
  titulo: string;
  ingredientes: string[];
  preparacion: string[];
}
