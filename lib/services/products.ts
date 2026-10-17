import 'server-only'
import { Category, FoodType, MeasureUnit, Prisma } from '@prisma/client'
import type { Food } from '@prisma/client'
import { z } from 'zod'
import prisma from '@/lib/db'
import { emailSchema } from '@/lib/services/users'

export const newProductSchema = z.object({
  foodName: z.string().trim().min(1).max(100),
  category: z.nativeEnum(Category),
  typeFood: z.nativeEnum(FoodType),
  quantity: z.number().positive(),
  typeMeasure: z.nativeEnum(MeasureUnit),
  dateEntry: z.coerce.date(),
  expirationDate: z.coerce.date().nullish(),
  email: emailSchema,
})

export type NewProductInput = z.infer<typeof newProductSchema>

// Devuelve null si el usuario no existe
export async function createProduct(input: NewProductInput): Promise<Food | null> {
  try {
    return await prisma.food.create({
      data: {
        foodName: input.foodName,
        category: input.category,
        typeFood: input.typeFood,
        quantity: input.quantity,
        typeMeasure: input.typeMeasure,
        dateEntry: input.dateEntry,
        expirationDate: input.expirationDate ?? null,
        user: { connect: { email: input.email } },
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null
    }
    throw error
  }
}

export async function getProductsByUser(email: string): Promise<Food[]> {
  return prisma.food.findMany({
    where: { user: { email } },
  })
}

// Devuelve false si el producto no existe o no pertenece al usuario
export async function deleteProductById(id: string, email: string): Promise<boolean> {
  const deleted = await prisma.food.deleteMany({
    where: { id, user: { email } },
  })
  return deleted.count > 0
}
