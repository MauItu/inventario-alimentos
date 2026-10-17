import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { jsonError, readJsonBody } from '@/lib/http'
import { createProduct, deleteProductById, getProductsByUser, newProductSchema } from '@/lib/services/products'
import { emailSchema } from '@/lib/services/users'

const productIdSchema = z.string().min(1)

const deleteBodySchema = z.object({
  email: emailSchema,
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  const email = emailSchema.safeParse(request.nextUrl.searchParams.get('email'))

  if (!email.success) {
    return jsonError('Email is required', 400)
  }

  try {
    const products = await getProductsByUser(email.data)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return jsonError('Could not fetch products', 500)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const parsed = newProductSchema.safeParse(await readJsonBody(request))

  if (!parsed.success) {
    return jsonError('Invalid product data', 400)
  }

  try {
    const product = await createProduct(parsed.data)
    if (!product) {
      return jsonError('User not found', 404)
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return jsonError('Could not create product', 500)
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const id = productIdSchema.safeParse(request.nextUrl.searchParams.get('id'))

  if (!id.success) {
    return jsonError('ID is required', 400)
  }

  const body = deleteBodySchema.safeParse(await readJsonBody(request))

  if (!body.success) {
    return jsonError('Email is required', 400)
  }

  try {
    const deleted = await deleteProductById(id.data, body.data.email)
    if (!deleted) {
      return jsonError('Product not found', 404)
    }
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return jsonError('Could not delete product', 500)
  }
}
