const { test, expect } = require("@playwright/test");
const { AxeBuilder } = require("@axe-core/playwright");

test("sistema: protege el acceso directo a Mis Resultados", async ({ page }) => {
  await page.goto("/mis-resultados");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});

test("aceptación: paciente autenticado puede ver su examen ficticio", async ({ page }) => {
  // Dado un paciente de prueba con un examen asociado.
  await page.goto("/login");
  await page.locator('input[name="nombre_usuario"]').fill("paciente");
  await page.locator('input[name="password"]').fill(process.env.QA_PASSWORD);
  // Cuando ingresa y abre Mis Resultados.
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).not.toHaveURL(/\/login$/);
  await page.goto("/mis-resultados");
  // Entonces puede consultar el examen.
  await expect(page.getByRole("heading", { name: "Mis Resultados Médicos" })).toBeVisible();
  await expect(page.getByText("Hemograma completo", { exact: true })).toBeVisible();
});

test("accesibilidad: registra hallazgos WCAG A/AA en el inicio de sesión", async ({ page }, info) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  await info.attach("axe", { body: JSON.stringify(violations, null, 2), contentType: "application/json" });
  const critical = violations.filter(({ impact }) => impact === "critical");
  expect(critical.map(({ id }) => id)).toEqual([]);
});
