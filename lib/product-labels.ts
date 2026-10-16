import type { Category, FoodType, MeasureUnit } from '@prisma/client'

// Solo tipos de Prisma: este archivo también se usa en el navegador
export const CATEGORY_LABELS: Record<Category, string> = {
  lacteos: 'Lácteos',
  frutas: 'Frutas',
  vegetales: 'Vegetales',
  carnes: 'Carnes',
}

export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  perecedero: 'Perecedero',
  no_perecedero: 'No perecedero',
}

export const MEASURE_UNIT_LABELS: Record<MeasureUnit, string> = {
  unidades: 'Unidades',
  kilos: 'Kilos',
  libras: 'Libras',
}
