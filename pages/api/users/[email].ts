import type { NextApiRequest, NextApiResponse } from 'next'
import { findUserByEmail } from '@/lib/services/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'GET') {
    const { email } = req.query

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' })
    }

    try {
      const user = await findUserByEmail(email)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      return res.status(200).json(user)
    } catch (error) {
      console.error('Error fetching user:', error)
      return res.status(500).json({ error: 'Could not fetch user' })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
