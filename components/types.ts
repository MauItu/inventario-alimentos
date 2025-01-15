export type ProductUnit = 'unidades' | 'kilos' | 'libras';

export interface Product {
  id?: string;
  foodName: string;
  category: string;
  typeFood: string;
  quantity: number;
  typeMeasure: ProductUnit;
  dateEntry: string;
  expirationDate?: string;
}