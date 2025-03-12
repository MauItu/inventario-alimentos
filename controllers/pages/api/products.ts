import type { NextApiRequest, NextApiResponse } from 'next'
import { createProduct, getProductsByUser, deleteProductById } from '@/controllers/productController'
import { ApiResponse } from '@/models/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      // Crear un nuevo producto
      const productData = req.body
      const newProduct = await createProduct(productData)
      return res.status(200).json(newProduct)
      
    } else if (req.method === 'GET') {
      // Obtener productos por email
      const { email } = req.query
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Email is required' })
      }
      
      const products = await getProductsByUser(email)
      return res.status(200).json(products)
      
    } else if (req.method === 'DELETE') {
      // Eliminar producto por ID
      const { id } = req.query
      const { email } = req.body
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'ID is required' })
      }
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Email is required' })
      }
      
      await deleteProductById(id, email)
      return res.status(200).json({ success: true, message: 'Product deleted successfully' })
      
    } else {
      return res.status(405).json({ success: false, error: 'Method not allowed' })
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Something went wrong'
    })
  }
}