'use client'

import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProductProvider } from '@/contexts/ProductContext'
import { Toaster } from '@/views/components/ui/toaster'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ProductProvider>
            {children}
            <Toaster />
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  )
}