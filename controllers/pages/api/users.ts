import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '@/controllers/userController'
import { ApiResponse, User } from '@/models/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<User>>) {
  try {
    if (req.method === 'POST') {
      // Crear un nuevo usuario
      const { email } = req.body
      
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' })
      }
      
      const user = await createUser(email)
      return res.status(200).json({ success: true, data: user })
      
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