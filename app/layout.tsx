import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

