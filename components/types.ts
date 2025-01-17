export type ProductUnit = 'unidades' | 'kilos' | 'libras';

export interface Product {
  id?: string;
  foodName: string;
  category: string;
  typeFood: string;
  quantity: number;
  typeMeasure: ProductUnit | string;
  dateEntry: Date;
  expirationDate?: Date  | null;
}