'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/app/hooks/use-toast'




export default function LoginPage() {
  const [email, setEmail] = useState('')
  const { login, createAccount } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isLoggedIn = await login(email)
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      toast({
        title: "Usuario no registrado",
        description: "¿Deseas crear una nueva cuenta?",
        action: (
          <Button onClick={() => handleCreateAccount()}>
            Crear cuenta
          </Button>
        ),
      })
    }
  }

  const handleCreateAccount = async () => {
    if (await createAccount(email)) {
      toast({
        title: "Cuenta creada",
        description: "Se ha creado una nueva cuenta con éxito.",
      })
      router.push('/dashboard')
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta. El correo ya está en uso.",
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

