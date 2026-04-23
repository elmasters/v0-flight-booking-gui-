"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { RegisterScreen } from "@/components/register-screen"
import { SearchFlightsScreen } from "@/components/search-flights-screen"
import { ReservationScreen } from "@/components/reservation-screen"
import { ConfirmationScreen } from "@/components/confirmation-screen"
import { AdminScreen } from "@/components/admin-screen"
import { UserDashboard } from "@/components/user-dashboard"
import { mockFlights, mockUsers, agentUser, type User, type Flight, type Reservation } from "@/lib/store"

type Screen = "login" | "register" | "search" | "reservation" | "confirmation" | "admin" | "dashboard"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [flights, setFlights] = useState<Flight[]>(mockFlights)
  const [reservations, setReservations] = useState<Reservation[]>([])

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
  const handleRegister = (userData: Omit<User, "id" | "millas">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      millas: userData.tipoCliente === "corporativo" ? 1000 : 0,
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
    setCurrentScreen("dashboard")
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
  ) => {
    if (selectedFlight && currentUser) {
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

      setCurrentScreen("confirmation")
    }
  }

  // Admin flight update handler
  const handleUpdateFlight = (updatedFlight: Flight) => {
    setFlights(flights.map((f) => (f.id === updatedFlight.id ? updatedFlight : f)))
  }

  // Admin add flight handler
  const handleAddFlight = (flightData: Omit<Flight, "id">) => {
    const newFlight: Flight = {
      ...flightData,
      id: `flight-${Date.now()}`,
    }
    setFlights([...flights, newFlight])
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
    }
  }

  // Render current screen
  switch (currentScreen) {
    case "login":
      return (
        <LoginScreen
          onLogin={handleLogin}
          onRegisterClick={() => setCurrentScreen("register")}
        />
      )

    case "register":
      return (
        <RegisterScreen
          onRegister={handleRegister}
          onBackClick={() => setCurrentScreen("login")}
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
          onCancelReservation={(id) => handleCancelReservation(id, "agente")}
          onBack={() => setCurrentScreen("search")}
        />
      )

    default:
      return null
  }
}
