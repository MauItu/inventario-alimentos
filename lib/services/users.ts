import type { User } from '@prisma/client'
import { Prisma } from '@prisma/client'
import prisma from '@/prisma/db'

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
