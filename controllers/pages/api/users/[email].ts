import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserByEmail } from '@/controllers/userController'
import { ApiResponse, User } from '@/models/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<User>>) {
  try {
    if (req.method === 'GET') {
      const { email } = req.query
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Email is required' })
      }
      
      const user = await getUserByEmail(email)
      
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' })
      }
      
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