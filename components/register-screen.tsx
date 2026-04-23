"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus } from "lucide-react"
import type { User } from "@/lib/store"

interface RegisterScreenProps {
  onRegister: (user: Omit<User, "id" | "millas">) => { success: boolean; error?: string }
  onBackClick: () => void
}

export function RegisterScreen({ onRegister, onBackClick }: RegisterScreenProps) {
  const [nombre, setNombre] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [tipoCliente, setTipoCliente] = useState<"minorista" | "corporativo">("minorista")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!nombre || !direccion || !telefono || !correo || !password) {
      setError("Por favor complete todos los campos")
      return
    }

    const result = onRegister({
      nombre,
      direccion,
      telefono,
      correo,
      tipoCliente,
      password,
    })

    if (!result.success && result.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="w-fit -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              REGISTRO DE USUARIO
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Nombre</FieldLabel>
                <Input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="h-11"
                />
              </Field>
              <Field>
                <FieldLabel>Dirección</FieldLabel>
                <Input
                  type="text"
                  placeholder="Tu dirección"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="h-11"
                />
              </Field>
              <Field>
                <FieldLabel>Teléfono</FieldLabel>
                <Input
                  type="tel"
                  placeholder="555-1234"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="h-11"
                />
              </Field>
              <Field>
                <FieldLabel>Correo</FieldLabel>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="h-11"
                />
              </Field>
              <Field>
                <FieldLabel>Contraseña</FieldLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </Field>
              <Field>
                <FieldLabel>Tipo de Cliente</FieldLabel>
                <RadioGroup
                  value={tipoCliente}
                  onValueChange={(value) => setTipoCliente(value as "minorista" | "corporativo")}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minorista" id="minorista" />
                    <Label htmlFor="minorista" className="cursor-pointer">Minorista</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corporativo" id="corporativo" />
                    <Label htmlFor="corporativo" className="cursor-pointer">Corporativo</Label>
                  </div>
                </RadioGroup>
              </Field>
            </FieldGroup>

            {error && (
              <p className="text-destructive text-sm mt-4 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full mt-6 h-12 text-base font-medium">
              Registrarse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
