import type { NextApiRequest, NextApiResponse } from 'next'
import { createProduct, getProductsByUser, deleteProductById } from '@/controllers/productController'
import { ApiResponse, Product } from '@/models/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<any>>) {
  try {
    if (req.method === 'POST') {
      // Crear un nuevo producto
      const productData = req.body
      const newProduct = await createProduct(productData)
      return res.status(200).json({ success: true, data: newProduct })
      
    } else if (req.method === 'GET') {
      // Obtener productos por email
      const { email } = req.query
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Email is required' })
      }
      
      const products = await getProductsByUser(email)
      return res.status(200).json({ success: true, data: products })
      
    } else if (req.method === 'DELETE') {
      // Eliminar producto por ID
      const { id, email } = req.query
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'ID is required' })
      }
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Email is required' })
      }
      
      await deleteProductById(id, email)
      return res.status(200).json({ success: true, data: { message: 'Product deleted successfully' } })
      
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