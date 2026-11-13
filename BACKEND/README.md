# API de Cuidarte+

Consulta el README de la raíz para arrancar el entorno local. La API escucha en el puerto 4000 dentro del contenedor y expone la documentación OpenAPI en /docs. El endpoint /health comprueba la conexión con PostgreSQL.

La configuración usa DATABASE_URL, JWT_SECRET y FRONTEND_URL. Ejecuta npm test con QA_PASSWORD y una conexión a PostgreSQL QA ya inicializada.
