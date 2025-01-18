import prisma from '@/prisma/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { foodName, category, typeFood, quantity, typeMeasure, dateEntry, expirationDate, email } = req.body

        if (!foodName || !category || !typeFood || !quantity || !typeMeasure || !dateEntry || !email) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        try {
            const newProduct = await prisma.food.create({
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
            return res.status(200).json(newProduct)
        } catch (error) {
            return res.status(400).json({ error: 'Something went wrong ' + JSON.stringify(error) })
        }

    } else if (req.method === 'GET') {
        const { email } = req.query

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Email is required' })
        }

        try {
            const listProducts = await prisma.food.findMany({
                where: { email }
            })
            return res.status(200).json(listProducts)
        } catch (error) {
            return res.status(500).json({ error: 'Something went wrong ' + JSON.stringify(error) })
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' })
    }
}

export async function getProductsByUser(email: string) {
    try {
        const products = await prisma.food.findMany({
            where: { email }
        })
        return products
    } catch (error) {
        //console.error('Error fetching products:', error)
        throw new Error('Error fetching products: ' + JSON.stringify(error))
    }
}