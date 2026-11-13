#!/bin/sh
set -eu
psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -v ON_ERROR_STOP=1 -v qa_password="$QA_PASSWORD" <<'SQL'
CREATE EXTENSION IF NOT EXISTS pgcrypto;
INSERT INTO usuarios (nombre_usuario, contrasena, correo)
SELECT cuenta, crypt(:'qa_password', gen_salt('bf', 10)), cuenta || '@example.invalid'
FROM (VALUES ('admin'), ('medico'), ('paciente')) AS cuentas(cuenta);
INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id FROM usuarios u JOIN roles r ON r.nombre = u.nombre_usuario;
INSERT INTO pacientes (rut, primer_nombre, apellido_paterno, fecha_nacimiento, sexo, email, usuario_id)
SELECT '11111111-1', 'Persona', 'De Prueba', '1950-01-01', 'O', correo, id
FROM usuarios WHERE nombre_usuario = 'paciente';
INSERT INTO examen_medico (tipo_examen_medico_id, paciente_id, diagnosis)
SELECT 1, id, 'Resultado ficticio' FROM pacientes;
SQL
