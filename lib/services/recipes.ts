import OpenAI from 'openai'
import { jsPDF } from 'jspdf'
import { z } from 'zod'
import type { Recipe } from '@/components/types'

// Gemini expone un endpoint compatible con el SDK de OpenAI
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/'
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'

const recipeSchema = z.object({
  dia: z.string(),
  titulo: z.string(),
  ingredientes: z.array(z.string()),
  preparacion: z.array(z.string()),
})

const recipesResponseSchema = z.object({
  recetas: z.array(recipeSchema).min(1),
})

export interface PantryItem {
  foodName: string
  quantity: number
  typeMeasure: string
}

export class RecipesServiceError extends Error {}

function buildPrompt(items: PantryItem[]): string {
  const productsList = items
    .map((item) => `${item.foodName} (${item.quantity} ${item.typeMeasure})`)
    .join(', ')

  return `Usando únicamente los siguientes ingredientes: ${productsList},
    crea 7 recetas para almuerzo (una para cada día de la semana).
    Cada receta debe tener un título, lista de ingredientes con cantidades apropiadas y pasos detallados para su preparación.
    Si faltan ingredientes básicos (como sal, aceite), puedes sugerirlos.
    Responde SOLO con JSON válido (sin formato markdown) con esta estructura:
    {
      "recetas": [
        {
          "dia": "Lunes",
          "titulo": "Nombre de la receta",
          "ingredientes": ["1 taza de arroz", "200g de pollo"],
          "preparacion": ["Lavar el arroz...", "Cocinar el pollo..."]
        }
      ]
    }`
}

// Acepta JSON puro o envuelto en un bloque ```json
export function parseRecipes(content: string): Recipe[] {
  const cleaned = content.replace(/```(?:json)?/g, '').trim()

  let data: unknown
  try {
    data = JSON.parse(cleaned)
  } catch {
    throw new RecipesServiceError('La respuesta del modelo no es JSON válido')
  }

  const parsed = recipesResponseSchema.safeParse(data)
  if (!parsed.success) {
    throw new RecipesServiceError('La respuesta del modelo no tiene el formato esperado')
  }
  return parsed.data.recetas
}

export async function generateWeeklyRecipes(items: PantryItem[]): Promise<Recipe[]> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new RecipesServiceError('GEMINI_API_KEY no está configurada')
  }

  const client = new OpenAI({ apiKey, baseURL: GEMINI_BASE_URL })

  const completion = await client.chat.completions.create({
    model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
    messages: [
      {
        role: 'system',
        content: 'Eres un chef profesional experto en crear recetas con ingredientes limitados. Responde únicamente con JSON válido sin formato markdown.',
      },
      { role: 'user', content: buildPrompt(items) },
    ],
    // En los modelos con razonamiento, los tokens de "thinking" cuentan dentro de este límite
    max_tokens: 8192,
    reasoning_effort: 'low',
    response_format: { type: 'json_object' },
  })

  const choice = completion.choices[0]
  if (!choice?.message.content) {
    throw new RecipesServiceError('El modelo no devolvió contenido')
  }
  if (choice.finish_reason === 'length') {
    throw new RecipesServiceError('La respuesta del modelo quedó incompleta')
  }

  return parseRecipes(choice.message.content)
}

// Devuelve el PDF como data URI para descargarlo desde el navegador
export function buildRecipesPdf(recipes: Recipe[]): string {
  const pdf = new jsPDF()
  const pageBottom = 280
  const textWidth = 180
  let yPos = 15

  const writeLines = (text: string, x: number, fontSize: number, lineHeight: number): void => {
    pdf.setFontSize(fontSize)
    const lines: string[] = pdf.splitTextToSize(text, textWidth - (x - 10))
    for (const line of lines) {
      if (yPos > pageBottom) {
        pdf.addPage()
        yPos = 15
      }
      pdf.text(line, x, yPos)
      yPos += lineHeight
    }
  }

  pdf.setFontSize(20)
  pdf.text('Recetas de la Semana', 105, yPos, { align: 'center' })
  yPos += 15

  recipes.forEach((receta) => {
    // Evita que el título quede solo al final de una página
    if (yPos > pageBottom - 30) {
      pdf.addPage()
      yPos = 15
    }

    writeLines(`${receta.dia}: ${receta.titulo}`, 10, 16, 8)
    yPos += 2

    writeLines('Ingredientes:', 10, 12, 6)
    receta.ingredientes.forEach((ingrediente) => {
      writeLines(`• ${ingrediente}`, 15, 10, 5)
    })
    yPos += 5

    writeLines('Preparación:', 10, 12, 6)
    receta.preparacion.forEach((paso, i) => {
      writeLines(`${i + 1}. ${paso}`, 15, 10, 5)
    })

    yPos += 10
  })

  return pdf.output('datauristring')
}
