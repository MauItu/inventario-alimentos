'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export default function LoginPage(): React.JSX.Element {
  const [email, setEmail] = useState('')
  const { login, createAccount } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const result = await login(email)
    if (result === 'ok') {
      router.push('/dashboard')
    } else if (result === 'not_found') {
      toast({
        title: "Usuario no registrado",
        description: "¿Deseas crear una nueva cuenta?",
        action: (
          <Button onClick={() => handleCreateAccount()}>
            Crear cuenta
          </Button>
        ),
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión. Inténtalo de nuevo en unos minutos.",
        variant: "destructive",
      })
    }
  }

  const handleCreateAccount = async (): Promise<void> => {
    const result = await createAccount(email)
    if (result === 'ok') {
      toast({
        title: "Cuenta creada",
        description: "Se ha creado una nueva cuenta con éxito.",
      })
      router.push('/dashboard')
    } else {
      toast({
        title: "Error",
        description: result === 'exists'
          ? "No se pudo crear la cuenta. El correo ya está en uso."
          : "No se pudo crear la cuenta. Inténtalo de nuevo en unos minutos.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Ingresar</Button>
        </form>
      </div>
    </div>
  )
}
