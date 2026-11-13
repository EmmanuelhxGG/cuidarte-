const request = require("supertest");
const app = require("../src/app");
const { pool } = require("../src/db");

const api = request(app);
const password = process.env.QA_PASSWORD;
if (!password) throw new Error("Configure QA_PASSWORD con el entorno de prueba");

async function login(nombre_usuario) {
  const res = await api.post("/autenticacion/login").send({ nombre_usuario, password });
  expect(res.status).toBe(200);
  return res.body.token;
}

let admin;
let medico;
let paciente;
beforeAll(async () => {
  [admin, medico, paciente] = await Promise.all(["admin", "medico", "paciente"].map(login));
});
afterAll(() => pool.end());

test("la comprobación de salud incluye PostgreSQL", async () => {
  await api.get("/health").expect(200, { status: "ok" });
});
test("DEF-01: sin token se rechazan las operaciones administrativas", async () => {
  await api.delete("/usuarios/999999999").expect(401);
  await api.post("/roles").send({ nombre: "qa" }).expect(401);
});
test("DEF-01: un paciente no crea usuarios ni borra cuentas", async () => {
  await api.post("/usuarios").auth(paciente, { type: "bearer" }).send({}).expect(403);
  await api.delete("/usuarios/999999999").auth(paciente, { type: "bearer" }).expect(403);
});
test("un médico no puede modificar su propio rol", async () => {
  const { rows } = await pool.query("SELECT id FROM usuarios WHERE nombre_usuario='medico'");
  await api.put("/usuarios/" + rows[0].id).auth(medico, { type: "bearer" }).send({ rol_id: 1 }).expect(403);
});
test("un administrador autorizado recibe 404 para un usuario inexistente", async () => {
  await api.delete("/usuarios/999999999").auth(admin, { type: "bearer" }).expect(404);
});
test("el paciente consulta sus exámenes y no puede listar fichas", async () => {
  const res = await api.get("/examenes").auth(paciente, { type: "bearer" }).expect(200);
  expect(res.body).toHaveLength(1);
  await api.get("/pacientes").auth(paciente, { type: "bearer" }).expect(403);
});
test("las cuentas sintéticas almacenan hashes bcrypt", async () => {
  const { rows } = await pool.query("SELECT contrasena FROM usuarios WHERE nombre_usuario='paciente'");
  expect(rows[0].contrasena).toMatch(/^\$2[aby]\$\d{2}\$/);
  expect(rows[0].contrasena).not.toBe(password);
});
