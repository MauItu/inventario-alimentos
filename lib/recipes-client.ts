import { Recipe } from '@/components/types'

interface RecipesResponse {
  recetas: Recipe[]
  pdf: string
}

// Pide las recetas al servidor y descarga el PDF generado
export async function requestRecipes(email: string): Promise<Recipe[]> {
  const response = await fetch('/api/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Error generating recipes')
  }

  const data: RecipesResponse = await response.json()

  const link = document.createElement('a')
  link.href = data.pdf
  link.download = 'recetas_de_la_semana.pdf'
  link.click()

  return data.recetas
}
