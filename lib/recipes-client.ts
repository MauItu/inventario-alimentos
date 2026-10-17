import { Recipe } from '@/components/types'
import { fetchJson, jsonBody } from '@/lib/api-client'

interface RecipesResponse {
  recetas: Recipe[]
  pdf: string
}

// Pide las recetas al servidor y descarga el PDF generado
export async function requestRecipes(email: string): Promise<Recipe[]> {
  const data = await fetchJson<RecipesResponse>('/api/recipes', {
    method: 'POST',
    ...jsonBody({ email }),
  })

  const link = document.createElement('a')
  link.href = data.pdf
  link.download = 'recetas_de_la_semana.pdf'
  link.click()

  return data.recetas
}
