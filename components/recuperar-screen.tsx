"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send, KeyRound } from "lucide-react"

interface RecuperarScreenProps {
  onSendEmail: (email: string) => { success: boolean; error?: string }
  onBack: () => void
  onSuccess: () => void
}

export function RecuperarScreen({ onSendEmail, onBack, onSuccess }: RecuperarScreenProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500))

    const result = onSendEmail(email)

    if (result.success) {
      onSuccess()
    } else {
      setError(result.error || "Error al enviar el correo")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Recuperar Contraseña
            </h1>
            <p className="text-muted-foreground text-sm">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 h-11"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="flex-1 h-11"
              >
                {isLoading ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}