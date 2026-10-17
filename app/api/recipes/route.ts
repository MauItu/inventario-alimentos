import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { jsonError, readJsonBody } from '@/lib/http'
import { getProductsByUser } from '@/lib/services/products'
import { buildRecipesPdf, generateWeeklyRecipes, RecipesServiceError } from '@/lib/services/recipes'
import { emailSchema } from '@/lib/services/users'

// Generar 7 recetas puede tardar más que el límite por defecto de Vercel
export const maxDuration = 60

const recipesBodySchema = z.object({
  email: emailSchema,
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = recipesBodySchema.safeParse(await readJsonBody(request))

  if (!body.success) {
    return jsonError('Email is required', 400)
  }

  try {
    const userProducts = await getProductsByUser(body.data.email)

    if (userProducts.length === 0) {
      return jsonError('No products found for this user', 404)
    }

    const recetas = await generateWeeklyRecipes(userProducts)
    const pdf = buildRecipesPdf(recetas)

    return NextResponse.json({ recetas, pdf })
  } catch (error) {
    console.error('Error generating recipes:', error)
    const message = error instanceof RecipesServiceError
      ? error.message
      : 'Ha ocurrido un error procesando su solicitud'
    return jsonError(message, 500)
  }
}
