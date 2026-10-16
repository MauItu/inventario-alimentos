import type { Food } from '@prisma/client'
import prisma from '@/prisma/db'

export interface NewProductInput {
  foodName: string
  category: string
  typeFood: string
  quantity: number
  typeMeasure: string
  dateEntry: string
  expirationDate?: string | null
  email: string
}

export async function createProduct(input: NewProductInput): Promise<Food> {
  return prisma.food.create({
    data: {
      foodName: input.foodName,
      category: input.category,
      typeFood: input.typeFood,
      quantity: input.quantity,
      typeMeasure: input.typeMeasure,
      dateEntry: new Date(input.dateEntry),
      expirationDate: input.expirationDate ? new Date(input.expirationDate) : null,
      email: input.email,
    },
  })
}

export async function getProductsByUser(email: string): Promise<Food[]> {
  return prisma.food.findMany({
    where: { email },
  })
}

// Devuelve false si el producto no existe o no pertenece al usuario
export async function deleteProductById(id: string, email: string): Promise<boolean> {
  const deleted = await prisma.food.deleteMany({
    where: { id, email },
  })
  return deleted.count > 0
}
