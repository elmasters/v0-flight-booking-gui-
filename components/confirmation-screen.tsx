"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Mail, Plane } from "lucide-react"

interface ConfirmationScreenProps {
  onAccept: () => void
}

export function ConfirmationScreen({ onAccept }: ConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8 space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              RESERVACIÓN EXITOSA
            </h1>
            <p className="text-muted-foreground">
              Su vuelo ha sido reservado correctamente.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-left">
              Se ha enviado un correo de confirmación con los detalles de su reservación.
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
