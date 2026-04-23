# Sistema de Reservación de Vuelos

Un sistema completo de reservación de vuelos construido con Next.js 16, React 19 y Tailwind CSS. Permite a los usuarios buscar vuelos, realizar reservaciones y gestionar sus viajes, mientras que los agentes pueden administrar vuelos y reservaciones.

![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?style=flat-square&logo=tailwind-css)

## Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Casos de Uso](#casos-de-uso)
- [Base de Datos](#base-de-datos)
- [Usuarios de Prueba](#usuarios-de-prueba)
- [Scripts Disponibles](#scripts-disponibles)

## Características

### Para Usuarios
- **Registro de cuenta**: Creación de cuenta con validación de correo duplicado
- **Inicio de sesión**: Autenticación segura para usuarios registrados
- **Tablero público de vuelos**: Visualización de vuelos disponibles sin necesidad de cuenta
- **Dashboard personalizado**: Vista de reservaciones activas y canceladas
- **Búsqueda de vuelos**: Filtrado por destino, horario y precio
- **Reservación de asientos**: Selección de asientos disponibles con confirmación
- **Sistema de millas**: Acumulación y canje de millas para clientes corporativos
- **Cancelación de reservas**: Posibilidad de cancelar reservaciones activas

### Para Agentes
- **Panel de administración**: Gestión completa del sistema
- **CRUD de vuelos**: Crear, editar y eliminar vuelos
- **Gestión de reservaciones**: Visualización y cancelación de reservas
- **Validación de conflictos**: Prevención de vuelos con horarios duplicados
- **Protección de datos**: No se pueden eliminar vuelos con reservaciones activas

## Arquitectura

El sistema sigue una arquitectura basada en componentes con gestión de estado centralizada:

```
┌─────────────────────────────────────────────────────────────┐
│                         App (page.tsx)                       │
│                    Estado Global & Routing                   │
├─────────────────────────────────────────────────────────────┤
│  LoginScreen  │  RegisterScreen  │  PublicFlightsBoard      │
├───────────────┴──────────────────┴──────────────────────────┤
│  UserDashboard  │  SearchFlightsScreen  │  AdminScreen      │
├─────────────────┴───────────────────────┴───────────────────┤
│  ReservationScreen  │  ConfirmationScreen                   │
├─────────────────────┴───────────────────────────────────────┤
│                    Componentes UI (shadcn/ui)                │
└─────────────────────────────────────────────────────────────┘
```

## Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16.2.0 |
| **Lenguaje** | TypeScript 5.7 |
| **UI Library** | React 19 |
| **Estilos** | Tailwind CSS 4.2 |
| **Componentes** | shadcn/ui + Radix UI |
| **Formularios** | React Hook Form + Zod |
| **Iconos** | Lucide React |
| **Fechas** | date-fns |
| **Gráficos** | Recharts |
| **Notificaciones** | Sonner |
| **Analytics** | Vercel Analytics |

## Instalación

### Prerrequisitos

- Node.js 18.0 o superior
- pnpm (recomendado) o npm

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ELMASTERS/v0-flight-booking-gui-.git
   cd v0-flight-booking-gui-
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   pnpm dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## Uso

### Flujo de Usuario

1. **Acceso inicial**: El usuario llega a la pantalla de login
2. **Registro** (opcional): Crear una nueva cuenta con datos personales
3. **Inicio de sesión**: Acceder con correo y contraseña
4. **Dashboard**: Ver reservaciones existentes y opciones disponibles
5. **Búsqueda de vuelos**: Explorar vuelos disponibles
6. **Reservación**: Seleccionar vuelo y asiento
7. **Confirmación**: Recibir confirmación de la reserva

### Flujo de Agente

1. **Login como agente**: Usar credenciales de agente
2. **Panel de administración**: Acceder al panel de control
3. **Gestión de vuelos**: Crear, editar o eliminar vuelos
4. **Gestión de reservaciones**: Ver y cancelar reservas si es necesario

## Estructura del Proyecto

```
v0-flight-booking-gui/
├── app/
│   ├── globals.css          # Estilos globales y tokens de diseño
│   ├── layout.tsx           # Layout principal con metadata
│   └── page.tsx             # Página principal con gestión de estado
├── components/
│   ├── ui/                  # Componentes de shadcn/ui
│   ├── admin-screen.tsx     # Panel de administración
│   ├── confirmation-screen.tsx
│   ├── login-screen.tsx
│   ├── public-flights-board.tsx
│   ├── register-screen.tsx
│   ├── reservation-screen.tsx
│   ├── search-flights-screen.tsx
│   ├── theme-provider.tsx
│   └── user-dashboard.tsx
├── lib/
│   ├── store.ts             # Tipos y datos mock
│   └── utils.ts             # Utilidades
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── scripts/
│   ├── 001-create-tables.sql  # Esquema de base de datos
│   └── 002-seed-data.sql      # Datos iniciales
├── public/                   # Assets estáticos
└── styles/
    └── globals.css
```

## Casos de Uso

### CU 1: Iniciar Sesión
- **Actor**: Usuario registrado
- **Flujo principal**: Ingresar credenciales y acceder al sistema
- **Flujo alternativo**: Credenciales inválidas - mostrar error

### CU 2: Registrar Usuario
- **Actor**: Usuario nuevo
- **Flujo principal**: Completar formulario y crear cuenta
- **Flujo alternativo**: Correo duplicado - mostrar error

### CU 3: Ver Vuelos Disponibles
- **Actor**: Usuario/Público
- **Flujo principal**: Visualizar lista de vuelos con detalles

### CU 4: Buscar Vuelos
- **Actor**: Usuario autenticado
- **Flujo principal**: Filtrar vuelos por criterios

### CU 5: Reservar Vuelo
- **Actor**: Usuario autenticado
- **Flujo principal**: Seleccionar vuelo, elegir asiento, confirmar
- **Flujo alternativo**: Asiento no disponible / Millas insuficientes

### CU 6: Cancelar Reservación
- **Actor**: Usuario / Agente
- **Flujo principal**: Cancelar reserva y liberar asiento

### CU 7: Gestionar Vuelos (Agente)
- **Actor**: Agente
- **Flujo principal**: CRUD de vuelos
- **Flujo alternativo**: Conflicto de horario / Vuelo con reservaciones activas

## Base de Datos

### Esquema

#### Tabla `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| nombre | VARCHAR(255) | Nombre completo |
| direccion | VARCHAR(500) | Dirección |
| telefono | VARCHAR(50) | Teléfono |
| correo | VARCHAR(255) | Email (único) |
| tipo_cliente | VARCHAR(20) | 'minorista' o 'corporativo' |
| millas | INTEGER | Millas acumuladas |
| password | VARCHAR(255) | Contraseña |
| is_agent | BOOLEAN | Es agente |

#### Tabla `flights`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| numero | VARCHAR(50) | Número de vuelo |
| destino | VARCHAR(255) | Ciudad destino |
| hora | TIME | Hora de salida |
| precio | DECIMAL(10,2) | Precio base |
| asientos_disponibles | TEXT[] | Array de asientos |

#### Tabla `reservations`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| usuario_id | UUID | FK a users |
| vuelo_id | UUID | FK a flights |
| asiento | VARCHAR(10) | Asiento reservado |
| precio_final | DECIMAL(10,2) | Precio pagado |
| descuento_aplicado | BOOLEAN | Se usaron millas |
| estado | VARCHAR(20) | 'confirmado' o 'cancelado' |
| cancelado_por | VARCHAR(20) | 'usuario' o 'agente' |

## Usuarios de Prueba

### Usuario Regular
```
Correo: juan@email.com
Contraseña: 123456
Tipo: Corporativo (5000 millas)
```

### Usuario Regular 2
```
Correo: maria@email.com
Contraseña: 123456
Tipo: Minorista
```

### Agente de Vuelos
```
Correo: agente@vuelos.com
Contraseña: admin123
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Compila la aplicación para producción |
| `pnpm start` | Inicia el servidor de producción |
| `pnpm lint` | Ejecuta el linter |

## Licencia

Este proyecto es privado y está destinado para uso educativo.

---

Desarrollado con [v0](https://v0.dev) por Vercel
