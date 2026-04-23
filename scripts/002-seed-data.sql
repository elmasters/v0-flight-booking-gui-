-- Seed data for the flight booking system

-- Insert agent user
INSERT INTO users (id, nombre, correo, password, telefono, tipo_cliente, millas, is_agent)
VALUES ('00000000-0000-0000-0000-000000000001', 'Agente de Vuelos', 'agente@vuelos.com', 'admin123', '0000000000', 'minorista', 0, true)
ON CONFLICT (id) DO NOTHING;

-- Insert test users
INSERT INTO users (id, nombre, correo, password, telefono, tipo_cliente, millas, is_agent)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'Juan Pérez', 'juan@email.com', '123456', '5551234567', 'corporativo', 5000, false),
  ('00000000-0000-0000-0000-000000000003', 'María García', 'maria@email.com', '123456', '5559876543', 'minorista', 0, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample flights
INSERT INTO flights (id, numero, destino, hora, precio, asientos_disponibles)
VALUES 
  ('00000000-0000-0000-0000-000000000101', 'VL101', 'Ciudad de México', '10:00', 2500.00, ARRAY['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B']),
  ('00000000-0000-0000-0000-000000000102', 'VL102', 'Guadalajara', '12:30', 1800.00, ARRAY['1A', '1B', '2A', '2B', '3A', '3B']),
  ('00000000-0000-0000-0000-000000000103', 'VL103', 'Monterrey', '14:00', 2200.00, ARRAY['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B']),
  ('00000000-0000-0000-0000-000000000104', 'VL104', 'Cancún', '16:30', 3500.00, ARRAY['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B']),
  ('00000000-0000-0000-0000-000000000105', 'VL105', 'Tijuana', '18:00', 2800.00, ARRAY['1A', '1B', '2A', '2B', '3A', '3B'])
ON CONFLICT (id) DO NOTHING;
