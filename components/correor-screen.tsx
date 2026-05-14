"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowLeft, LogIn } from "lucide-react"

interface CorreorScreenProps {
  email: string
  onAccept: () => void
  onBack: () => void
}

export function CorreorScreen({ email, onAccept, onBack }: CorreorScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8 space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              ¡CORREO ENVIADO!
            </h1>
            <p className="text-muted-foreground">
              Revisa tu bandeja de entrada
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-left font-medium">
                Se envió un correo de recuperación a:
              </p>
            </div>
            <p className="text-sm font-mono bg-background p-2 rounded-md break-all">
              {email}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Haz clic en el enlace que te enviamos para restablecer tu contraseña.
              <br />
              Revisa también la carpeta de spam.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1 h-12">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Button onClick={onAccept} className="flex-1 h-12 text-base">
              <LogIn className="w-4 h-4 mr-2" />
              Entendido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}