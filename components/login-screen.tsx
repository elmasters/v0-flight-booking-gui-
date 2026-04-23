"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Plane } from "lucide-react"

interface LoginScreenProps {
  onLogin: (correo: string, password: string) => boolean
  onRegisterClick: () => void
}

export function LoginScreen({ onLogin, onRegisterClick }: LoginScreenProps) {
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!correo || !password) {
      setError("Por favor complete todos los campos")
      return
    }

    const success = onLogin(correo, password)
    if (!success) {
      setError("Credenciales inválidas")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Plane className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            SISTEMA DE VUELOS D3
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Usuario (Correo)</FieldLabel>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="h-12"
                />
              </Field>
              <Field>
                <FieldLabel>Contraseña</FieldLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </Field>
            </FieldGroup>

            {error && (
              <p className="text-destructive text-sm mt-4 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full mt-6 h-12 text-base font-medium">
              Iniciar Sesión
            </Button>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                ¿No tienes cuenta?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={onRegisterClick}
                className="mt-2 w-full h-12"
              >
                Registrarse
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
