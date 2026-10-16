import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '@/lib/services/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    const { email } = req.body

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' })
    }

    try {
      const newUser = await createUser(email)
      if (!newUser) {
        return res.status(409).json({ error: 'Email already registered' })
      }
      return res.status(200).json(newUser)
    } catch (error) {
      console.error('Error creating user:', error)
      return res.status(500).json({ error: 'Could not create user' })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
