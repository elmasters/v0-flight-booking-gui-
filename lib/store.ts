// Types for the flight booking system
export interface User {
  id: string
  nombre: string
  direccion: string
  telefono: string
  correo: string
  tipoCliente: "minorista" | "corporativo"
  millas: number
  password: string
}

export interface Flight {
  id: string
  numero: string
  destino: string
  hora: string
  precio: number
  asientosDisponibles: string[]
}

export interface Reservation {
  id: string
  usuarioId: string
  vueloId: string
  asiento: string
  precioFinal: number
  descuentoAplicado: boolean
  fecha: Date
  estado: "confirmado" | "cancelado"
  canceladoPor?: "usuario" | "agente"
}

// Mock data
export const mockFlights: Flight[] = [
  {
    id: "1",
    numero: "101",
    destino: "Nueva York",
    hora: "08:00",
    precio: 300,
    asientosDisponibles: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"],
  },
  {
    id: "2",
    numero: "202",
    destino: "Miami",
    hora: "10:00",
    precio: 200,
    asientosDisponibles: ["1A", "1B", "2A", "2B", "3A", "3B"],
  },
  {
    id: "3",
    numero: "303",
    destino: "Los Angeles",
    hora: "12:00",
    precio: 350,
    asientosDisponibles: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B"],
  },
  {
    id: "4",
    numero: "404",
    destino: "Chicago",
    hora: "14:00",
    precio: 250,
    asientosDisponibles: ["1A", "1B", "2A", "2B"],
  },
  {
    id: "5",
    numero: "505",
    destino: "Boston",
    hora: "16:00",
    precio: 280,
    asientosDisponibles: ["1A", "1B", "2A", "2B", "3A", "3B"],
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    direccion: "Calle Principal 123",
    telefono: "555-1234",
    correo: "juan@email.com",
    tipoCliente: "corporativo",
    millas: 5000,
    password: "123456",
  },
  {
    id: "2",
    nombre: "María García",
    direccion: "Avenida Central 456",
    telefono: "555-5678",
    correo: "maria@email.com",
    tipoCliente: "minorista",
    millas: 0,
    password: "123456",
  },
]

// Agent user for flight management
export const agentUser: User = {
  id: "agent",
  nombre: "Agente de Vuelos",
  direccion: "Oficina Central",
  telefono: "555-0000",
  correo: "agente@vuelos.com",
  tipoCliente: "corporativo",
  millas: 0,
  password: "admin123",
}
