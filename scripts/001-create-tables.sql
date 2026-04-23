-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(500) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  tipo_cliente VARCHAR(20) NOT NULL CHECK (tipo_cliente IN ('minorista', 'corporativo')),
  millas INTEGER DEFAULT 0,
  password VARCHAR(255) NOT NULL,
  is_agent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flights table
CREATE TABLE IF NOT EXISTS flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE NOT NULL,
  destino VARCHAR(255) NOT NULL,
  hora TIME NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  asientos_disponibles TEXT[] NOT NULL DEFAULT ARRAY['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vuelo_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
  asiento VARCHAR(10) NOT NULL,
  precio_final DECIMAL(10, 2) NOT NULL,
  descuento_aplicado BOOLEAN DEFAULT FALSE,
  estado VARCHAR(20) NOT NULL DEFAULT 'confirmado' CHECK (estado IN ('confirmado', 'cancelado')),
  cancelado_por VARCHAR(20) CHECK (cancelado_por IN ('usuario', 'agente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vuelo_id, asiento, estado)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_correo ON users(correo);
CREATE INDEX IF NOT EXISTS idx_reservations_usuario_id ON reservations(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reservations_vuelo_id ON reservations(vuelo_id);
CREATE INDEX IF NOT EXISTS idx_flights_numero ON flights(numero);
