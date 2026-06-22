-- ============================================================
-- ROLES
-- ============================================================
INSERT INTO role (id, name, description)
VALUES
  (1, 'ADMIN', 'Administrador'),
  (2, 'FARMER', 'Agricultor'),
  (3, 'TECHNICIAN', 'Tecnico')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================
-- PERMISSIONS
-- ============================================================
INSERT INTO permission (id, name, description)
VALUES
  (1,  'VIEW_DASHBOARD',    'Ver el panel principal de métricas'),
  (2,  'VIEW_SENSORS',      'Ver listado y estado de sensores'),
  (3,  'CREATE_SENSOR',     'Registrar un nuevo sensor en el sistema'),
  (4,  'DELETE_SENSOR',     'Eliminar un sensor del sistema'),
  (5,  'VIEW_ALERTS',       'Ver alertas generadas por el sistema'),
  (6,  'MANAGE_ALERTS',     'Crear, editar y eliminar alertas'),
  (7,  'VIEW_PROPERTIES',   'Ver propiedades y predios registrados'),
  (8,  'MANAGE_PROPERTIES', 'Crear, editar y eliminar propiedades'),
  (9,  'VIEW_CROPS',        'Ver cultivos registrados'),
  (10, 'MANAGE_CROPS',      'Crear, editar y eliminar cultivos'),
  (11, 'VIEW_USERS',        'Ver listado de usuarios'),
  (12, 'MANAGE_USERS',      'Crear, editar y eliminar usuarios'),
  (13, 'VIEW_REPORTS',      'Ver reportes históricos de mediciones'),
  (14, 'SEND_NOTIFICATIONS','Enviar notificaciones a usuarios'),
  (15, 'MANAGE_PLOTS',      'Crear, editar y eliminar lotes de cultivo')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================
-- ROLE_PERMISSION
-- ============================================================
INSERT INTO role_permission (role_id, permission_id)
VALUES
  (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),
  (1,7),(1,8),(1,9),(1,10),(1,11),(1,12),
  (1,13),(1,14),(1,15),
  (2,1),(2,5),(2,7),(2,8),(2,9),(2,10),
  (2,13),(2,15),
  (3,1),(3,2),(3,3),(3,5),(3,9),(3,13)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO app_user 
(id, name, email, password_hash, phone, status, role_id)
VALUES
  (1, 'Adriana Murillo', 'adriana@agrisense.com', '$2b$12$G4eLCzclmkPPV.FKILvaL.n3IO8D/G5n5fdiajSUq6AJ1LUC5BGf6', '3001234567', 'activo', 1),
  (2, 'Carlos Rodríguez', 'carlos@agrisense.com', '$2b$12$wXpxpdGBwiD402q6oX3eFuMfrwBESIwSUn6ejwrmuCPjgsT9owtIy', '3109876543', 'activo', 2),
  (3, 'Laura Martínez', 'laura@agrisense.com', '$2b$12$mWB.KJCst7sYOezWsjy9T.aqUwU8XJU9o2CN2nn6zBISsQRSr4aBK', '3205551234', 'activo', 2),
  (4, 'Juan Técnico', 'juan.tec@agrisense.com', '$2b$12$0GIn/NczagawbVFcHk..W.pBQ2UhJplwp.bpDrk3uX6mZYwj5m4Le', '3154449876', 'activo', 3),
  (5, 'María González', 'maria@agrisense.com', '$2b$12$PzxDAK3opNLA5lPOXSMaGOGPkas8hcSUoj326wfmWLSD/Do2.L.6G', '3006667890', 'inactivo', 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status,
  role_id = EXCLUDED.role_id;

-- ============================================================
-- LOCATION
-- ============================================================
INSERT INTO location (id, latitude, longitude, description)
VALUES
  (1, 3.4516, -76.5320, 'Cali — Centro de Investigación Agrícola Palmira'),
  (2, 3.5394, -76.3025, 'Palmira — Zona plana arrocera'),
  (3, 3.8654, -76.4972, 'Tuluá — Zona cafetera cordillera central'),
  (4, 4.1532, -76.5227, 'Cartago — Cultivos de maíz y sorgo'),
  (5, 3.2167, -76.6333, 'Jamundí — Producción de caña de azúcar'),
  (6, 3.6083, -76.9558, 'Buenaventura — Cultivos tropicales de la costa pacífica')
ON CONFLICT (id) DO UPDATE SET
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  description = EXCLUDED.description;

-- ============================================================
-- PROPERTY_TYPE
-- ============================================================
INSERT INTO property_type (id, name, description, is_active)
VALUES
  (1, 'Finca', 'Propiedad rural de uso agrícola general', true),
  (2, 'Invernadero', 'Estructura cerrada para cultivos controlados', true),
  (3, 'Parcela', 'Pequeña extensión de tierra para cultivo familiar', true),
  (4, 'Hacienda', 'Gran propiedad rural con múltiples lotes de cultivo', true),
  (5, 'Vivero', 'Establecimiento para producción de plantas', true),
  (6, 'Experimental', 'Predio destinado a investigación agrícola', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;

-- ============================================================
-- PROPERTY
-- ============================================================
INSERT INTO property (id, name, owner_id, property_type_id, area_hectares, location_id)
VALUES
  (1, 'Finca AgriSense Principal', 2, 1, 20.0, 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  owner_id = EXCLUDED.owner_id,
  property_type_id = EXCLUDED.property_type_id,
  area_hectares = EXCLUDED.area_hectares,
  location_id = EXCLUDED.location_id;

-- ============================================================
-- CROPS
-- ============================================================
INSERT INTO crop (id, name, scientific_name, description, is_central_node, location_id)
VALUES
  (1, 'Maíz', 'Zea mays', 'Cultivo de grano básico ampliamente cultivado en Colombia', false, 1),
  (2, 'Café', 'Coffea arabica', 'Cultivo emblema de la región cafetera colombiana', false, 3),
  (3, 'Caña', 'Saccharum officinarum', 'Caña de azúcar cultivada en el Valle del Cauca', true, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  scientific_name = EXCLUDED.scientific_name,
  description = EXCLUDED.description,
  is_central_node = EXCLUDED.is_central_node,
  location_id = EXCLUDED.location_id;

-- ============================================================
-- PLOTS
-- ============================================================
INSERT INTO plot (id, name, area, property_id, crop_id, has_master, master_id)
VALUES
  (1, 'Lote Norte A',     5.8, 1, 1, false, NULL),
  (2, 'Lote Sur B',       4.2, 1, 1, false, NULL),
  (3, 'Lote Café 1',      3.0, 1, 2, false, NULL),
  (4, 'Lote Caña Central', 6.5, 1, 3, false, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  area = EXCLUDED.area,
  property_id = EXCLUDED.property_id,
  crop_id = EXCLUDED.crop_id,
  has_master = EXCLUDED.has_master,
  master_id = EXCLUDED.master_id;

-- ============================================================
-- PHENOLOGICAL_STAGE
-- ============================================================
INSERT INTO phenological_stage (id, name, description)
VALUES
  (1, 'Germinación', 'Fase inicial'),
  (2, 'Emergencia', 'La plántula rompe el suelo'),
  (3, 'Crecimiento vegetativo', 'Desarrollo activo'),
  (4, 'Floración', 'Aparición de flores'),
  (5, 'Fructificación', 'Formación de frutos'),
  (6, 'Maduración', 'Maduración del cultivo'),
  (7, 'Cosecha', 'Momento óptimo'),
  (8, 'Senescencia', 'Final del ciclo')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ============================================================
-- STAGE_HISTORY
-- ============================================================
INSERT INTO stage_history (id, start_date, end_date, stage_id, plot_id)
VALUES
  (1, '2025-01-10', '2025-01-25', 1, 1),
  (2, '2025-01-26', '2025-02-10', 2, 1),
  (3, '2025-02-11', NULL, 3, 1)
ON CONFLICT (id) DO UPDATE SET
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  stage_id = EXCLUDED.stage_id,
  plot_id = EXCLUDED.plot_id;

-- ============================================================
-- SENSOR_TYPE
-- ============================================================
INSERT INTO sensor_type (name, unit)
VALUES
  ('temperatura', '°C'),
  ('humedad', '%'),
  ('presion', 'hPa'),
  ('altitud', 'm'),
  ('extra', 'unidad_extra')
ON CONFLICT (name) DO UPDATE SET
  unit = EXCLUDED.unit;

-- ============================================================
-- SINCRONIZAR SECUENCIAS
-- ============================================================
SELECT setval(pg_get_serial_sequence('role', 'id'), COALESCE((SELECT MAX(id) FROM role), 1), true);
SELECT setval(pg_get_serial_sequence('permission', 'id'), COALESCE((SELECT MAX(id) FROM permission), 1), true);
SELECT setval(pg_get_serial_sequence('app_user', 'id'), COALESCE((SELECT MAX(id) FROM app_user), 1), true);
SELECT setval(pg_get_serial_sequence('property_type', 'id'), COALESCE((SELECT MAX(id) FROM property_type), 1), true);
SELECT setval(pg_get_serial_sequence('property', 'id'), COALESCE((SELECT MAX(id) FROM property), 1), true);
SELECT setval(pg_get_serial_sequence('crop', 'id'), COALESCE((SELECT MAX(id) FROM crop), 1), true);
SELECT setval(pg_get_serial_sequence('plot', 'id'), COALESCE((SELECT MAX(id) FROM plot), 1), true);
SELECT setval(pg_get_serial_sequence('stage_history', 'id'), COALESCE((SELECT MAX(id) FROM stage_history), 1), true);
SELECT setval(pg_get_serial_sequence('phenological_stage', 'id'), COALESCE((SELECT MAX(id) FROM phenological_stage), 1), true);
SELECT setval(pg_get_serial_sequence('location', 'id'), COALESCE((SELECT MAX(id) FROM location), 1), true);
SELECT setval(pg_get_serial_sequence('plot_condition', 'id'), COALESCE((SELECT MAX(id) FROM plot_condition), 1), true);
SELECT setval(pg_get_serial_sequence('sensor_type', 'id'), COALESCE((SELECT MAX(id) FROM sensor_type), 1), true);

-- Forzar que las tablas vacías de hardware y telemetría arranquen de forma estricta desde el ID 1
SELECT setval(pg_get_serial_sequence('esp32_master', 'id'), 1, false);
SELECT setval(pg_get_serial_sequence('esp32_slave', 'id'), 1, false);
SELECT setval(pg_get_serial_sequence('measurement_data', 'id'), 1, false);