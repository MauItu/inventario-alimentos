import 'server-only'
import type { User } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import prisma from '@/lib/db'

// Para buscar usuarios: no exige formato de correo para no dejar fuera cuentas ya creadas
export const emailSchema = z.string().trim().min(1).max(254)

export const newUserSchema = z.object({
  email: z.string().trim().email().max(254),
})

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  })
}

// Devuelve null si el correo ya está registrado
export async function createUser(email: string): Promise<User | null> {
  try {
    return await prisma.user.create({
      data: { email },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return null
    }
    throw error
  }
}
