import type { NextApiRequest, NextApiResponse } from 'next'
import { getProductsByUser } from '@/lib/services/products'
import { buildRecipesPdf, generateWeeklyRecipes, RecipesServiceError } from '@/lib/services/recipes'

// Generar 7 recetas puede tardar más que el límite por defecto de Vercel
export const config = {
  maxDuration: 60,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const userProducts = await getProductsByUser(email)

    if (userProducts.length === 0) {
      return res.status(404).json({ error: 'No products found for this user' })
    }

    const recetas = await generateWeeklyRecipes(userProducts)
    const pdf = buildRecipesPdf(recetas)

    return res.status(200).json({ recetas, pdf })
  } catch (error) {
    console.error('Error generating recipes:', error)
    const message = error instanceof RecipesServiceError
      ? error.message
      : 'Ha ocurrido un error procesando su solicitud'
    return res.status(500).json({ error: message })
  }
}
