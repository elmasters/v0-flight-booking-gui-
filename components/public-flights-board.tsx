"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plane, Clock, ArrowLeft, MapPin } from "lucide-react"
import type { Flight } from "@/lib/store"

interface PublicFlightsBoardProps {
  flights: Flight[]
  onBack: () => void
}

export function PublicFlightsBoard({ flights, onBack }: PublicFlightsBoardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Sort flights by time
  const sortedFlights = [...flights].sort((a, b) => {
    const timeA = a.hora.split(":").map(Number)
    const timeB = b.hora.split(":").map(Number)
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide text-foreground">VUELOS DISPONIBLES</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Tablero de Salidas</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatTime(currentTime)}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{formatDate(currentTime)}</p>
          </div>
        </div>
      </header>

      {/* Flights Board */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              PROXIMAS SALIDAS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {sortedFlights.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay vuelos disponibles
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Vuelo</TableHead>
                      <TableHead className="font-semibold">Destino</TableHead>
                      <TableHead className="font-semibold">Hora</TableHead>
                      <TableHead className="font-semibold">Puerta</TableHead>
                      <TableHead className="font-semibold">Asientos</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedFlights.map((flight) => {
                      const seatsAvailable = flight.asientosDisponibles.length
                      const isLowSeats = seatsAvailable <= 5
                      const isSoldOut = seatsAvailable === 0

                      return (
                        <TableRow 
                          key={flight.id}
                          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                          {/* Flight Number */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Plane className="w-4 h-4 text-muted-foreground" />
                              <span className="font-mono font-bold">{flight.numero}</span>
                            </div>
                          </TableCell>

                          {/* Destination */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{flight.destino}</span>
                            </div>
                          </TableCell>

                          {/* Time */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-mono font-bold text-lg">{flight.hora}</span>
                            </div>
                          </TableCell>

                          {/* Gate */}
                          <TableCell>
                            <Badge variant="secondary" className="font-mono">
                              {String.fromCharCode(65 + (parseInt(flight.numero.slice(-2)) % 10))}
                              {(parseInt(flight.numero.slice(-2)) % 20) + 1}
                            </Badge>
                          </TableCell>

                          {/* Seats Available */}
                          <TableCell>
                            {isSoldOut ? (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                Agotado
                              </Badge>
                            ) : isLowSeats ? (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                {seatsAvailable} disponibles
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                {seatsAvailable} disponibles
                              </Badge>
                            )}
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                              A tiempo
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Mostrando {sortedFlights.length} vuelos disponibles
              </p>
              <Button onClick={onBack}>
                Registrarse para reservar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Quieres reservar un vuelo?</h3>
              <p className="text-muted-foreground text-sm">
                Registrate o inicia sesion para acceder a todas las funciones de reserva y acumular millas.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
