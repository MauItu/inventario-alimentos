// Definición de tipos para el modelo de datos

export type User = {
  id?: string
  email: string
  products?: Product[]
}

export type Product = {
  id: string
  foodName: string
  category: string  // lacteos, proteina, verduras, frutas
  typeFood: string  // si es perecedero o no
  quantity: number
  typeMeasure: string
  dateEntry: Date
  expirationDate?: Date | null
}

// Tipo para respuestas de API
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}