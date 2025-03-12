import prisma from './db'
import { Product } from '../models/types'

// Obtener productos de un usuario
export async function getProductsByUser(email: string) {
  try {
    const products = await prisma.food.findMany({
      where: { email }
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}

// Crear un nuevo producto
export async function createProduct(productData: Product & { email: string }) {
  const { foodName, category, typeFood, quantity, typeMeasure, dateEntry, expirationDate, email } = productData
  
  if (!foodName || !category || !typeFood || !quantity || !typeMeasure || !dateEntry || !email) {
    throw new Error('All fields are required')
  }

  try {
    return await prisma.food.create({
      data: {
        foodName,
        category,
        typeFood,
        quantity,
        typeMeasure,
        dateEntry: new Date(dateEntry),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        email,
      },
    })
  } catch (error) {
    console.error('Error creating product:', error)
    throw new Error('Failed to create product')
  }
}

// Eliminar un producto
export async function deleteProductById(id: string, email: string) {
  if (!id || !email) {
    throw new Error('ID and email are required')
  }

  try {
    const deletedProduct = await prisma.food.deleteMany({
      where: {
        id,
        email
      }
    })
    
    if (deletedProduct.count === 0) {
      throw new Error('Product not found')
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('Failed to delete product')
  }
}