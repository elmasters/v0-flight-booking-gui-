"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Mail, Plane } from "lucide-react"

interface ConfirmationScreenProps {
  email?: string // Opcional: para mostrar el correo al que se envió
  onAccept: () => void
}

export function ConfirmationScreen({ email, onAccept }: ConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8 space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              ¡RECUPERACIÓN EXITOSA!
            </h1>
            <p className="text-muted-foreground">
              Se ha enviado un correo de recuperación a tu dirección
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-left">
              {email ? (
                <>Hemos enviado las instrucciones a <strong>{email}</strong></>
              ) : (
                "Hemos enviado las instrucciones a tu correo electrónico"
              )}
              <br />
              <span className="text-xs text-muted-foreground">
                Revisa tu bandeja de entrada y sigue los pasos para recuperar tu contraseña.
              </span>
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={onAccept} className="w-full h-12 text-base">
              <Plane className="w-4 h-4 mr-2" />
              Aceptar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}