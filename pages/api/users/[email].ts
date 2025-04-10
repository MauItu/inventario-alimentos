import prisma from '@/prisma/db'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { email } = req.query
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email as string
        }
      })
      if (!user) {
        throw new Error('User not found')
      }
      return res.status(200).json(user)
    } catch (error) {
      return res.status(404).json(error)
    }

  } else {
    res.status(405).end()
  }
}