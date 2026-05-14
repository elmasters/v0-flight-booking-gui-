"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { RegisterScreen } from "@/components/register-screen"
import { SearchFlightsScreen } from "@/components/search-flights-screen"
import { ReservationScreen } from "@/components/reservation-screen"
import { ConfirmationScreen } from "@/components/confirmation-screen"
import { AdminScreen } from "@/components/admin-screen"
import { UserDashboard } from "@/components/user-dashboard"
import { PublicFlightsBoard } from "@/components/public-flights-board"
import { CorreorScreen } from "@/components/correor-screen"
import { RecuperarScreen } from "@/components/recuperar-screen"
import { mockFlights, mockUsers, agentUser, type User, type Flight, type Reservation } from "@/lib/store"

type Screen = "login" | "register" | "search" | "reservation" | "confirmation" | "admin" | "dashboard" | "public-flights" | "recuperar" | "correor"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [flights, setFlights] = useState<Flight[]>(mockFlights)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [recoveryEmail, setRecoveryEmail] = useState<string>("")

  // Login handler
  const handleLogin = (correo: string, password: string): boolean => {
    // Check for agent login
    if (correo === agentUser.correo && password === agentUser.password) {
      setCurrentUser(agentUser)
      setCurrentScreen("admin")
      return true
    }

    // Check for regular user login
    const user = users.find((u) => u.correo === correo && u.password === password)
    if (user) {
      setCurrentUser(user)
      setCurrentScreen("dashboard")
      return true
    }

    return false
  }

  // Register handler
  const handleRegister = (userData: Omit<User, "id" | "millas">): { success: boolean; error?: string } => {
    // CU 2 Alternativo: Validar correo duplicado
    const existingUser = users.find((u) => u.correo === userData.correo)
    if (existingUser) {
      return { success: false, error: "Correo ya registrado" }
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      millas: userData.tipoCliente === "corporativo" ? 1000 : 0,
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)

    // Simular envio de correo de confirmacion
    console.log(`[Sistema] Correo de confirmacion enviado a: ${userData.correo}`)

    setCurrentScreen("dashboard")
    return { success: true }
  }

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null)
    setSelectedFlight(null)
    setCurrentScreen("login")
  }

  // Flight selection handler
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    setCurrentScreen("reservation")
  }

  // Reservation confirmation handler
  const handleConfirmReservation = (
    asiento: string,
    precioFinal: number,
    descuentoAplicado: boolean
  ): { success: boolean; error?: string } => {
    if (!selectedFlight || !currentUser) {
      return { success: false, error: "Error en el sistema" }
    }

    // CU 5 Alternativo: Verificar disponibilidad del asiento
    const currentFlight = flights.find((f) => f.id === selectedFlight.id)
    if (!currentFlight || !currentFlight.asientosDisponibles.includes(asiento)) {
      return { success: false, error: "Asiento no disponible" }
    }

    // CU 5 Alternativo: Validar millas insuficientes si intenta aplicar descuento
    if (descuentoAplicado && currentUser.millas < 1000) {
      return { success: false, error: "Millas insuficientes" }
    }

    // Create new reservation
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      usuarioId: currentUser.id,
      vueloId: selectedFlight.id,
      asiento,
      precioFinal,
      descuentoAplicado,
      fecha: new Date(),
      estado: "confirmado",
    }
    setReservations([...reservations, newReservation])

    // Update flight's available seats
    const updatedFlights = flights.map((f) => {
      if (f.id === selectedFlight.id) {
        return {
          ...f,
          asientosDisponibles: f.asientosDisponibles.filter((s) => s !== asiento),
        }
      }
      return f
    })
    setFlights(updatedFlights)

    // Update user's miles if discount was applied
    if (descuentoAplicado && currentUser.tipoCliente === "corporativo") {
      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return { ...u, millas: u.millas - 1000 }
        }
        return u
      })
      setUsers(updatedUsers)
      setCurrentUser({ ...currentUser, millas: currentUser.millas - 1000 })
    }

    // Simular envio de correo de confirmacion
    console.log(`[Sistema] Correo de confirmacion de reserva enviado a: ${currentUser.correo}`)

    setCurrentScreen("confirmation")
    return { success: true }
  }

  // Admin flight update handler
  const handleUpdateFlight = (updatedFlight: Flight): { success: boolean; error?: string } => {
    // CU 7 Alternativo: Validar conflicto de horario
    const existingFlight = flights.find((f) => f.id !== updatedFlight.id && f.hora === updatedFlight.hora)
    if (existingFlight) {
      return { success: false, error: "Ya existe un vuelo programado a esa hora" }
    }

    setFlights(flights.map((f) => (f.id === updatedFlight.id ? updatedFlight : f)))
    return { success: true }
  }

  // Admin add flight handler
  const handleAddFlight = (flightData: Omit<Flight, "id">): { success: boolean; error?: string } => {
    // CU 7 Alternativo: Validar conflicto de horario
    const existingFlight = flights.find((f) => f.hora === flightData.hora)
    if (existingFlight) {
      return { success: false, error: "Ya existe un vuelo programado a esa hora" }
    }

    const newFlight: Flight = {
      ...flightData,
      id: `flight-${Date.now()}`,
    }
    setFlights([...flights, newFlight])
    return { success: true }
  }

  // Admin delete flight handler
  const handleDeleteFlight = (flightId: string): { success: boolean; error?: string } => {
    // CU 7 Alternativo: No permitir eliminar vuelo con reservas activas
    const hasActiveReservations = reservations.some((r) => r.vueloId === flightId && r.estado === "confirmado")
    if (hasActiveReservations) {
      return { success: false, error: "No se puede eliminar el vuelo porque tiene reservaciones activas" }
    }

    setFlights(flights.filter((f) => f.id !== flightId))
    return { success: true }
  }

  // Admin cancel reservation handler
  const handleCancelReservation = (reservationId: string, canceladoPor: "usuario" | "agente") => {
    const reservation = reservations.find((r) => r.id === reservationId)
    if (reservation) {
      // Return the seat to the flight
      const updatedFlights = flights.map((f) => {
        if (f.id === reservation.vueloId) {
          return {
            ...f,
            asientosDisponibles: [...f.asientosDisponibles, reservation.asiento],
          }
        }
        return f
      })
      setFlights(updatedFlights)

      // Mark the reservation as cancelled instead of removing it
      setReservations(reservations.map((r) =>
        r.id === reservationId
          ? { ...r, estado: "cancelado" as const, canceladoPor }
          : r
      ))

      // Simular envio de correo de cancelacion
      const user = users.find((u) => u.id === reservation.usuarioId)
      if (user) {
        console.log(`[Sistema] Correo de cancelacion enviado a: ${user.correo}`)
      }
    }
  }

  // Render current screen
  switch (currentScreen) {
    case "login":
      return (
        <LoginScreen
          onLogin={handleLogin}
          onRegisterClick={() => setCurrentScreen("register")}
          onViewFlightsClick={() => setCurrentScreen("public-flights")}
          onRecuperarrClick={() => setCurrentScreen("recuperar")}
        />
      )

    case "register":
      return (
        <RegisterScreen
          onRegister={handleRegister}
          onBackClick={() => setCurrentScreen("login")}
        />
      )

    case "public-flights":
      return (
        <PublicFlightsBoard
          flights={flights}
          onBack={() => setCurrentScreen("login")}
        />
      )

    case "search":
      return (
        <SearchFlightsScreen
          flights={flights}
          currentUser={currentUser!}
          onSelectFlight={handleSelectFlight}
          onLogout={handleLogout}
          onAdminClick={
            currentUser?.id === "agent"
              ? () => setCurrentScreen("admin")
              : undefined
          }
          onBack={
            currentUser?.id !== "agent"
              ? () => setCurrentScreen("dashboard")
              : undefined
          }
        />
      )

    case "reservation":
      return (
        <ReservationScreen
          flight={selectedFlight!}
          currentUser={currentUser!}
          onConfirm={handleConfirmReservation}
          onBack={() => setCurrentScreen("search")}
        />
      )

    case "confirmation":
      return (
        <ConfirmationScreen
          onAccept={() => {
            setSelectedFlight(null)
            setCurrentScreen("dashboard")
          }}
        />
      )

    case "dashboard":
      return (
        <UserDashboard
          currentUser={currentUser!}
          reservations={reservations}
          flights={flights}
          onSearchFlights={() => setCurrentScreen("search")}
          onLogout={handleLogout}
          onCancelReservation={(id) => handleCancelReservation(id, "usuario")}
        />
      )

    case "admin":
      return (
        <AdminScreen
          flights={flights}
          reservations={reservations}
          users={users}
          onUpdateFlight={handleUpdateFlight}
          onAddFlight={handleAddFlight}
          onDeleteFlight={handleDeleteFlight}
          onCancelReservation={(id) => handleCancelReservation(id, "agente")}
          onBack={() => setCurrentScreen("search")}
        />
      )

    default:
      return null
  }
}
