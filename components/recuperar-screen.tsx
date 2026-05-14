"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Mail, Plane, ArrowLeft, Send } from "lucide-react"

interface RequestEmailProps {
  onBack: () => void
  onEmailSent: (email: string) => void
}

export function RequestEmailScreen({ onBack, onEmailSent }: RequestEmailProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular envío de correo
    setTimeout(() => {
      setIsLoading(false)
      onEmailSent(email)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Recuperar Contraseña
            </h1>
            <p className="text-muted-foreground text-sm">
              Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu contraseña
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

// Pantalla de confirmación mejorada
interface ConfirmationScreenProps {
  email: string
  onAccept: () => void
  onBack: () => void
}

export function ConfirmationScreen({ email, onAccept, onBack }: ConfirmationScreenProps) {
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
              <Plane className="w-4 h-4 mr-2" />
              Entendido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente padre que maneja los estados
export function RecoveryFlow() {
  const [step, setStep] = useState<"request" | "confirmation">("request")
  const [userEmail, setUserEmail] = useState("")

  const handleEmailSent = (email: string) => {
    setUserEmail(email)
    setStep("confirmation")
  }

  const handleAccept = () => {
    // Aquí puedes redirigir al login o a donde necesites
    console.log("Usuario confirmó, email:", userEmail)
    // Ejemplo: router.push("/login")
  }

  const handleBack = () => {
    setStep("request")
  }

  if (step === "request") {
    return (
      <RequestEmailScreen
        onBack={() => console.log("Volver atrás")}
        onEmailSent={handleEmailSent}
      />
    )
  }

  return (
    <ConfirmationScreen
      email={userEmail}
      onAccept={handleAccept}
      onBack={handleBack}
    />
  )
}