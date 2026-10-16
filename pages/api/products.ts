import type { NextApiRequest, NextApiResponse } from 'next'
import { createProduct, deleteProductById, getProductsByUser, newProductSchema } from '@/lib/services/products'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    const parsed = newProductSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid product data' })
    }

    try {
      const newProduct = await createProduct(parsed.data)
      return res.status(200).json(newProduct)
    } catch (error) {
      console.error('Error creating product:', error)
      return res.status(500).json({ error: 'Could not create product' })
    }

  } else if (req.method === 'GET') {
    const { email } = req.query

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' })
    }

    try {
      const listProducts = await getProductsByUser(email)
      return res.status(200).json(listProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      return res.status(500).json({ error: 'Could not fetch products' })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    const { email } = req.body

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID is required' })
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' })
    }

    try {
      const deleted = await deleteProductById(id, email)
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' })
      }
      return res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      console.error('Error deleting product:', error)
      return res.status(500).json({ error: 'Could not delete product' })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
