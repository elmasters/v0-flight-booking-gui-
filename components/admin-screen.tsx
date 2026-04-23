"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plane, Edit, RefreshCw, Plus, XCircle, Users, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Flight, Reservation, User } from "@/lib/store"

interface AdminScreenProps {
  flights: Flight[]
  reservations: Reservation[]
  users: User[]
  onUpdateFlight: (flight: Flight) => { success: boolean; error?: string }
  onAddFlight: (flight: Omit<Flight, "id">) => { success: boolean; error?: string }
  onDeleteFlight: (flightId: string) => { success: boolean; error?: string }
  onCancelReservation: (reservationId: string) => void
  onBack: () => void
}

export function AdminScreen({ flights, reservations, users, onUpdateFlight, onAddFlight, onDeleteFlight, onCancelReservation, onBack }: AdminScreenProps) {
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Add flight form state
  const [newNumero, setNewNumero] = useState("")
  const [newDestino, setNewDestino] = useState("")
  const [newHora, setNewHora] = useState("")
  const [newPrecio, setNewPrecio] = useState("")
  const [newAsientos, setNewAsientos] = useState("")

  // Edit flight form state
  const [editDestino, setEditDestino] = useState("")
  const [editHora, setEditHora] = useState("")
  const [editPrecio, setEditPrecio] = useState("")

  // Error states
  const [addError, setAddError] = useState("")
  const [editError, setEditError] = useState("")

  const handleEditClick = (flight: Flight) => {
    setEditingFlight(flight)
    setEditDestino(flight.destino)
    setEditHora(flight.hora)
    setEditPrecio(flight.precio.toString())
    setEditError("")
    setIsEditDialogOpen(true)
  }

  const handleUpdateFlight = () => {
    if (editingFlight) {
      setEditError("")
      const result = onUpdateFlight({
        ...editingFlight,
        destino: editDestino,
        hora: editHora,
        precio: Number(editPrecio),
      })
      if (result.success) {
        setIsEditDialogOpen(false)
        setEditingFlight(null)
      } else if (result.error) {
        setEditError(result.error)
      }
    }
  }

  const handleAddFlight = () => {
    setAddError("")
    if (newNumero && newDestino && newHora && newPrecio) {
      const asientosArray = newAsientos
        ? newAsientos.split(",").map((s) => s.trim())
        : ["1A", "1B", "2A", "2B"]

      const result = onAddFlight({
        numero: newNumero,
        destino: newDestino,
        hora: newHora,
        precio: Number(newPrecio),
        asientosDisponibles: asientosArray,
      })

      if (result.success) {
        // Reset form
        setNewNumero("")
        setNewDestino("")
        setNewHora("")
        setNewPrecio("")
        setNewAsientos("")
        setIsAddDialogOpen(false)
      } else if (result.error) {
        setAddError(result.error)
      }
    }
  }

  const handleDeleteFlight = (flightId: string) => {
    const result = onDeleteFlight(flightId)
    if (!result.success && result.error) {
      alert(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SISTEMA DE VUELOS D3</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="flights" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="flights">Vuelos</TabsTrigger>
            <TabsTrigger value="reservations">Reservaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="flights">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  GESTIÓN DE VUELOS
                </CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Vuelo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Vuelo</DialogTitle>
                      <DialogDescription>Complete los campos para agregar un nuevo vuelo al sistema.</DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Número de Vuelo</FieldLabel>
                        <Input
                          value={newNumero}
                          onChange={(e) => setNewNumero(e.target.value)}
                          placeholder="Ej: 606"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Destino</FieldLabel>
                        <Input
                          value={newDestino}
                          onChange={(e) => setNewDestino(e.target.value)}
                          placeholder="Ej: San Francisco"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Hora</FieldLabel>
                        <div className="flex gap-2">
                          <Select
                            value={newHora.split(":")[0] || ""}
                            onValueChange={(val) => {
                              const mins = newHora.split(":")[1] || "00"
                              setNewHora(`${val}:${mins}`)
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Hora" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((h) => (
                                <SelectItem key={h} value={h}>{h}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={newHora.split(":")[1] || ""}
                            onValueChange={(val) => {
                              const hrs = newHora.split(":")[0] || "00"
                              setNewHora(`${hrs}:${val}`)
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Min" />
                            </SelectTrigger>
                            <SelectContent>
                              {["00", "15", "30", "45"].map((m) => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </Field>
                      <Field>
                        <FieldLabel>Precio ($)</FieldLabel>
                        <Input
                          type="number"
                          value={newPrecio}
                          onChange={(e) => setNewPrecio(e.target.value)}
                          placeholder="Ej: 350"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Asientos (separados por coma)</FieldLabel>
                        <Input
                          value={newAsientos}
                          onChange={(e) => setNewAsientos(e.target.value)}
                          placeholder="Ej: 1A, 1B, 2A, 2B"
                        />
                      </Field>
                    </FieldGroup>
                    {addError && (
                      <p className="text-destructive text-sm mt-2 text-center">{addError}</p>
                    )}
                    <Button onClick={handleAddFlight} className="w-full mt-4">
                      Agregar Vuelo
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Vuelo</TableHead>
                        <TableHead className="font-semibold">Destino</TableHead>
                        <TableHead className="font-semibold">Hora</TableHead>
                        <TableHead className="font-semibold">Precio</TableHead>
                        <TableHead className="font-semibold">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flights.map((flight) => (
                        <TableRow key={flight.id}>
                          <TableCell className="font-medium">{flight.numero}</TableCell>
                          <TableCell>{flight.destino}</TableCell>
                          <TableCell>{flight.hora}</TableCell>
                          <TableCell className="font-semibold">${flight.precio}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(flight)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Editar
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Eliminar
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Eliminar Vuelo</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      ¿Está seguro que desea eliminar el vuelo #{flight.numero}?
                                      Esta acción no se puede deshacer.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteFlight(flight.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Sí, eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Vuelo #{editingFlight?.numero}</DialogTitle>
                  <DialogDescription>Modifique los campos del vuelo y guarde los cambios.</DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Destino</FieldLabel>
                    <Input
                      value={editDestino}
                      onChange={(e) => setEditDestino(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Hora</FieldLabel>
                    <div className="flex gap-2">
                      <Select
                        value={editHora.split(":")[0] || ""}
                        onValueChange={(val) => {
                          const mins = editHora.split(":")[1] || "00"
                          setEditHora(`${val}:${mins}`)
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={editHora.split(":")[1] || ""}
                        onValueChange={(val) => {
                          const hrs = editHora.split(":")[0] || "00"
                          setEditHora(`${hrs}:${val}`)
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {["00", "15", "30", "45"].map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Precio ($)</FieldLabel>
                    <Input
                      type="number"
                      value={editPrecio}
                      onChange={(e) => setEditPrecio(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
                {editError && (
                  <p className="text-destructive text-sm mt-2 text-center">{editError}</p>
                )}
                <Button onClick={handleUpdateFlight} className="w-full mt-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  RESERVACIONES DE USUARIOS
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reservations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay reservaciones registradas
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Usuario</TableHead>
                          <TableHead className="font-semibold">Correo</TableHead>
                          <TableHead className="font-semibold">Vuelo</TableHead>
                          <TableHead className="font-semibold">Destino</TableHead>
                          <TableHead className="font-semibold">Asiento</TableHead>
                          <TableHead className="font-semibold">Precio</TableHead>
                          <TableHead className="font-semibold">Fecha</TableHead>
                          <TableHead className="font-semibold">Estado</TableHead>
                          <TableHead className="font-semibold">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.map((reservation) => {
                          const user = users.find((u) => u.id === reservation.usuarioId)
                          const flight = flights.find((f) => f.id === reservation.vueloId)
                          return (
                            <TableRow key={reservation.id}>
                              <TableCell className="font-medium">{user?.nombre || "N/A"}</TableCell>
                              <TableCell>{user?.correo || "N/A"}</TableCell>
                              <TableCell>{flight?.numero || "N/A"}</TableCell>
                              <TableCell>{flight?.destino || "N/A"}</TableCell>
                              <TableCell>{reservation.asiento}</TableCell>
                              <TableCell className="font-semibold">${reservation.precioFinal}</TableCell>
                              <TableCell>{new Date(reservation.fecha).toLocaleDateString()}</TableCell>
                              <TableCell>
                                {reservation.estado === "cancelado" ? (
                                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                    Cancelado
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    Confirmado
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {reservation.estado === "cancelado" ? (
                                  <span className="text-sm text-muted-foreground">Cancelado</span>
                                ) : (
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
                                          ¿Está seguro que desea cancelar la reservación de {user?.nombre || "este usuario"}?
                                          El asiento será devuelto al vuelo y el usuario será notificado.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>No, mantener</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => onCancelReservation(reservation.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Sí, cancelar reservación
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
