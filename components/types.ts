export type ProductUnit = 'unidades' | 'kilos' | 'libras';

export interface Product {
  id: string; //quite lo de que puede estar vacio
  foodName: string;
  category: string;
  typeFood: string;
  quantity: number;
  typeMeasure: ProductUnit | string;
  dateEntry: Date;
  expirationDate?: Date  | null;
}