# Cuidarte+

Caso académico de seguridad y calidad. La instancia Docker de este repositorio utiliza exclusivamente datos sintéticos.

## Arranque local

En PowerShell, genera una configuración local nueva si todavía no existe:

```powershell
if (!(Test-Path .env)) {
  @("POSTGRES_PASSWORD=$([Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(24)))",
    "JWT_SECRET=$([Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)))",
    "QA_PASSWORD=$([Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(20)))") |
    Set-Content -LiteralPath .env
}
docker compose up -d --build --wait
```

En copias con un `.env` anterior, completa las tres variables con valores generados para QA. La web usa http://localhost:3334 y la API http://localhost:4445/docs, salvo configuración distinta. Las cuentas sintéticas admin, medico y paciente usan el valor local de QA_PASSWORD. Si recreas la semilla, usa un volumen QA nuevo.

## Pruebas

Jest usa Supertest y PostgreSQL QA. Carga las variables de tu archivo de entorno en el proceso y configura DATABASE_URL con el puerto local de PostgreSQL. Ejecuta `npm ci` y `npm test` en BACKEND. El LCOV se escribe en BACKEND/coverage/lcov.info.

En pruebas-e2e ejecuta `npm ci`, `npx playwright install chromium` y `npx playwright test`. Configura WEB_URL y QA_PASSWORD en el proceso. El script carga.js sirve para k6 con perfil humo o carga de 200 VU. El URL de la API se define en API_URL.

Los workflows de GitHub incluyen Gitleaks, Hadolint, Jest, Playwright, axe-core, k6, ZAP y CodeQL. SonarQube se analiza en una instancia local con el archivo sonar-project.properties y el LCOV generado.
