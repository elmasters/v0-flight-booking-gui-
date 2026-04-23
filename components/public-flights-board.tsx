"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Header */}
      <header className="bg-[#0d1e36] border-b border-[#1e3a5f] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-[#0a1628]" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">AEROPUERTO INTERNACIONAL</h1>
                <p className="text-xs text-white/60 uppercase tracking-widest">Tablero de Salidas</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-amber-400">
              {formatTime(currentTime)}
            </div>
            <p className="text-xs text-white/60 capitalize">{formatDate(currentTime)}</p>
          </div>
        </div>
      </header>

      {/* Flights Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-[#0d1e36] rounded-xl border border-[#1e3a5f] overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-[#162d4d] border-b border-[#1e3a5f] text-xs font-bold uppercase tracking-wider text-amber-400">
            <div>Vuelo</div>
            <div>Destino</div>
            <div>Hora</div>
            <div>Puerta</div>
            <div>Asientos</div>
            <div>Estado</div>
          </div>

          {/* Flight Rows */}
          <div className="divide-y divide-[#1e3a5f]">
            {sortedFlights.map((flight, index) => {
              const seatsAvailable = flight.asientosDisponibles.length
              const isLowSeats = seatsAvailable <= 5
              const isSoldOut = seatsAvailable === 0

              return (
                <div
                  key={flight.id}
                  className="grid grid-cols-6 gap-4 px-6 py-5 hover:bg-[#162d4d]/50 transition-colors"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  {/* Flight Number */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded flex items-center justify-center">
                      <Plane className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="font-mono font-bold text-lg">{flight.numero}</span>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/40" />
                    <span className="font-semibold">{flight.destino}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="font-mono text-xl font-bold text-amber-400">{flight.hora}</span>
                  </div>

                  {/* Gate */}
                  <div>
                    <span className="inline-flex items-center justify-center w-12 h-8 bg-[#1e3a5f] rounded font-mono font-bold">
                      {String.fromCharCode(65 + (parseInt(flight.numero.slice(-2)) % 10))}
                      {(parseInt(flight.numero.slice(-2)) % 20) + 1}
                    </span>
                  </div>

                  {/* Seats Available */}
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        isSoldOut
                          ? "bg-red-500/20 text-red-400"
                          : isLowSeats
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {isSoldOut ? "Agotado" : `${seatsAvailable} disponibles`}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      A tiempo
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#162d4d] border-t border-[#1e3a5f] flex items-center justify-between">
            <p className="text-white/60 text-sm">
              Mostrando {sortedFlights.length} vuelos disponibles
            </p>
            <Button
              onClick={onBack}
              className="bg-amber-500 hover:bg-amber-600 text-[#0a1628] font-semibold"
            >
              Registrarse para reservar
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl px-6 py-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
            <Plane className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-400">¿Quieres reservar un vuelo?</h3>
            <p className="text-white/70 text-sm">
              Regístrate o inicia sesión para acceder a todas las funciones de reserva y acumular millas.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
