export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

// fetch que lanza ApiError si la respuesta no es 2xx
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? `HTTP ${response.status}`)
  }

  return data as T
}

export function jsonBody(body: unknown): RequestInit {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}
