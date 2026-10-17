import { NextResponse, type NextRequest } from 'next/server'
import { jsonError } from '@/lib/http'
import { emailSchema, findUserByEmail } from '@/lib/services/users'

interface RouteContext {
  params: Promise<{ email: string }>
}

export async function GET(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const email = emailSchema.safeParse((await params).email)

  if (!email.success) {
    return jsonError('Email is required', 400)
  }

  try {
    const user = await findUserByEmail(email.data)
    if (!user) {
      return jsonError('User not found', 404)
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return jsonError('Could not fetch user', 500)
  }
}
