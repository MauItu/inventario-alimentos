import { NextResponse, type NextRequest } from 'next/server'
import { jsonError, readJsonBody } from '@/lib/http'
import { createUser, newUserSchema } from '@/lib/services/users'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = newUserSchema.safeParse(await readJsonBody(request))

  if (!body.success) {
    return jsonError('A valid email is required', 400)
  }

  try {
    const user = await createUser(body.data.email)
    if (!user) {
      return jsonError('Email already registered', 409)
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return jsonError('Could not create user', 500)
  }
}
