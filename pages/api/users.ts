import prisma from '@/prisma/db'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    try {
      const newUser = await prisma.user.create({
        data: {
          email,
        },
      })
      return res.status(200).json(newUser)
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong '+ JSON.stringify(error) })
    }

  } else if (req.method === 'GET') {
    try {
      const listUsers = await prisma.user.findMany()
      return res.status(200).json(listUsers)
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong '+ JSON.stringify(error) })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}