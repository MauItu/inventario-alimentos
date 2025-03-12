import prisma from './db'

// Obtener un usuario por su email
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { food: true }
    })
    
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Failed to fetch user')
  }
}

// Crear un nuevo usuario
export async function createUser(email: string) {
  if (!email) {
    throw new Error('Email is required')
  }
  
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return existingUser
    }
    
    // Crear un nuevo usuario
    return await prisma.user.create({
      data: { email }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}