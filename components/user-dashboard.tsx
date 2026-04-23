"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plane, Search, LogOut, Ticket, User as UserIcon, Award, XCircle, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { User, Flight, Reservation } from "@/lib/store"

interface UserDashboardProps {
  currentUser: User
  reservations: Reservation[]
  flights: Flight[]
  onSearchFlights: () => void
  onLogout: () => void
  onCancelReservation: (reservationId: string) => void
}

export function UserDashboard({
  currentUser,
  reservations,
  flights,
  onSearchFlights,
  onLogout,
  onCancelReservation,
}: UserDashboardProps) {
  const userReservations = reservations.filter(
    (r) => r.usuarioId === currentUser.id
  )

  const getFlightDetails = (vueloId: string) => {
    return flights.find((f) => f.id === vueloId)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Check if the reservation can be cancelled (within 1 hour of booking)
  const canCancelReservation = (reservation: Reservation) => {
    if (reservation.estado === "cancelado") return false
    const reservationTime = new Date(reservation.fecha).getTime()
    const now = Date.now()
    const oneHourInMs = 60 * 60 * 1000
    return now - reservationTime <= oneHourInMs
  }

  const getTimeRemaining = (reservation: Reservation) => {
    const reservationTime = new Date(reservation.fecha).getTime()
    const now = Date.now()
    const oneHourInMs = 60 * 60 * 1000
    const timeRemaining = oneHourInMs - (now - reservationTime)
    if (timeRemaining <= 0) return null
    const minutes = Math.floor(timeRemaining / 60000)
    return `${minutes} min restantes para cancelar`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Sistema de Vuelos</h1>
              <p className="text-sm text-muted-foreground">Mi Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onSearchFlights}>
              <Search className="w-4 h-4 mr-2" />
              Buscar Vuelos
            </Button>
            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* User Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bienvenido</p>
                  <p className="font-semibold">{currentUser.nombre}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Millas Acumuladas</p>
                  <p className="font-semibold text-xl">{currentUser.millas.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reservaciones</p>
                  <p className="font-semibold text-xl">{userReservations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Mis Vuelos Reservados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userReservations.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plane className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  No tienes vuelos reservados aún.
                </p>
                <Button onClick={onSearchFlights}>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Vuelos
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vuelo</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Asiento</TableHead>
                    <TableHead>Fecha Reserva</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userReservations.map((reservation) => {
                    const flight = getFlightDetails(reservation.vueloId)
                    const canCancel = canCancelReservation(reservation)
                    const timeRemaining = getTimeRemaining(reservation)
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">
                          {flight?.numero || "N/A"}
                        </TableCell>
                        <TableCell>{flight?.destino || "N/A"}</TableCell>
                        <TableCell>{flight?.hora || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{reservation.asiento}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(reservation.fecha)}</TableCell>
                        <TableCell>
                          <span className="font-medium">
                            ${reservation.precioFinal}
                          </span>
                          {reservation.descuentoAplicado && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Descuento
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {reservation.estado === "cancelado" ? (
                            <div>
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                Cancelado
                              </Badge>
                              {reservation.canceladoPor === "agente" && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Por agente
                                </p>
                              )}
                            </div>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Confirmado
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {reservation.estado === "confirmado" && (
                            canCancel ? (
                              <div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Cancelar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar cancelación</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        ¿Está seguro que desea cancelar esta reservación? 
                                        Esta acción no se puede deshacer.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>No, mantener</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => onCancelReservation(reservation.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Sí, cancelar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                {timeRemaining && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {timeRemaining}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No cancelable
                              </span>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
