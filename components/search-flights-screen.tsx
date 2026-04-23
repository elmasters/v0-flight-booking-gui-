"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plane, Clock, MapPin, LogOut, Settings, ArrowLeft } from "lucide-react"
import type { Flight, User } from "@/lib/store"

interface SearchFlightsScreenProps {
  flights: Flight[]
  currentUser: User
  onSelectFlight: (flight: Flight) => void
  onLogout: () => void
  onAdminClick?: () => void
  onBack?: () => void
}

export function SearchFlightsScreen({
  flights,
  currentUser,
  onSelectFlight,
  onLogout,
  onAdminClick,
  onBack,
}: SearchFlightsScreenProps) {
  const [destino, setDestino] = useState("")
  const [hora, setHora] = useState("")
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)

    let results = [...flights]

    if (destino) {
      results = results.filter((f) =>
        f.destino.toLowerCase().includes(destino.toLowerCase())
      )
    }

    if (hora) {
      results = results.filter((f) => f.hora.includes(hora))
    }

    setFilteredFlights(results)
    setSelectedFlight(null)
  }

  const handleSelectRow = (flight: Flight) => {
    setSelectedFlight(flight)
  }

  const handleConfirmSelection = () => {
    if (selectedFlight) {
      onSelectFlight(selectedFlight)
    }
  }

  const isAgent = currentUser.id === "agent"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SISTEMA DE VUELOS D3</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hola, <span className="font-medium text-foreground">{currentUser.nombre}</span>
            </span>
            {!isAgent && onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Mi Panel
              </Button>
            )}
            {isAgent && onAdminClick && (
              <Button variant="outline" size="sm" onClick={onAdminClick}>
                <Settings className="w-4 h-4 mr-2" />
                Gestión
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              BUSCAR VUELOS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Destino
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Ej: Nueva York, Miami..."
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="h-11"
                  />
                </Field>
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora de salida
                  </FieldLabel>
                  <Input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="h-11"
                  />
                </Field>
                <div className="flex items-end">
                  <Button type="submit" className="w-full h-11">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">RESULTADOS</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFlights.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron vuelos con los criterios especificados
                </div>
              ) : (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Vuelo</TableHead>
                          <TableHead className="font-semibold">Destino</TableHead>
                          <TableHead className="font-semibold">Hora</TableHead>
                          <TableHead className="font-semibold">Precio</TableHead>
                          <TableHead className="font-semibold">Asientos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFlights.map((flight) => (
                          <TableRow
                            key={flight.id}
                            className={`transition-colors ${!isAgent ? "cursor-pointer" : ""
                              } ${selectedFlight?.id === flight.id
                                ? "bg-primary/10"
                                : "hover:bg-muted/50"
                              }`}
                            onClick={() => !isAgent && handleSelectRow(flight)}
                          >
                            <TableCell className="font-medium">{flight.numero}</TableCell>
                            <TableCell>{flight.destino}</TableCell>
                            <TableCell>{flight.hora}</TableCell>
                            <TableCell className="font-semibold">${flight.precio}</TableCell>
                            <TableCell>{flight.asientosDisponibles.length} disponibles</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {!isAgent && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleConfirmSelection}
                        disabled={!selectedFlight}
                        className="px-8"
                      >
                        Seleccionar
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
