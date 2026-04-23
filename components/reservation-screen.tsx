"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plane, MapPin, Clock, CreditCard, Award } from "lucide-react"
import type { Flight, User } from "@/lib/store"

interface ReservationScreenProps {
  flight: Flight
  currentUser: User
  onConfirm: (asiento: string, precioFinal: number, descuentoAplicado: boolean) => void
  onBack: () => void
}

export function ReservationScreen({
  flight,
  currentUser,
  onConfirm,
  onBack,
}: ReservationScreenProps) {
  const [asiento, setAsiento] = useState("")
  const [descuentoAplicado, setDescuentoAplicado] = useState(false)
  const [error, setError] = useState("")

  const isCorporativo = currentUser.tipoCliente === "corporativo"
  const descuentoPorMillas = isCorporativo && currentUser.millas >= 1000 ? 50 : 0
  const precioFinal = descuentoAplicado ? flight.precio - descuentoPorMillas : flight.precio

  const handleAplicarDescuento = () => {
    if (currentUser.millas >= 1000) {
      setDescuentoAplicado(true)
    }
  }

  const handleConfirm = () => {
    setError("")

    if (!asiento) {
      setError("Por favor seleccione un asiento")
      return
    }

    onConfirm(asiento, precioFinal, descuentoAplicado)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SISTEMA DE VUELOS</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                RESERVAR VUELO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flight Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vuelo seleccionado</span>
                  <span className="font-bold text-lg">#{flight.numero}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{flight.destino}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{flight.hora}</span>
                </div>
              </div>

              {/* Seat Selection */}
              <Field>
                <FieldLabel>Seleccionar Asiento</FieldLabel>
                <Select value={asiento} onValueChange={setAsiento}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccione un asiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {flight.asientosDisponibles.map((seat) => (
                      <SelectItem key={seat} value={seat}>
                        Asiento {seat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Corporate Discount */}
              {isCorporativo && (
                <div className="bg-accent/10 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    <span className="font-medium">Cliente Corporativo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Millas disponibles:
                    </span>
                    <span className="font-bold">{currentUser.millas}</span>
                  </div>
                  {currentUser.millas >= 1000 && !descuentoAplicado && (
                    <Button
                      variant="outline"
                      onClick={handleAplicarDescuento}
                      className="w-full"
                    >
                      Aplicar descuento (-${descuentoPorMillas})
                    </Button>
                  )}
                  {descuentoAplicado && (
                    <p className="text-sm text-green-600 font-medium">
                      ¡Descuento de ${descuentoPorMillas} aplicado!
                    </p>
                  )}
                  {currentUser.millas < 1000 && (
                    <p className="text-sm text-muted-foreground">
                      Necesita al menos 1000 millas para obtener descuento
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="w-5 h-5" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Precio base</span>
                  <span>${flight.precio}</span>
                </div>
                {descuentoAplicado && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento millas</span>
                    <span>-${descuentoPorMillas}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Precio final</span>
                  <span className="text-xl">${precioFinal}</span>
                </div>
              </div>

              <Button onClick={handleConfirm} className="w-full h-12 text-base">
                Confirmar Reservación
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
