const { loginSchema } = require("../src/validations/auth");
const { normalizeRut } = require("../src/utils/rut");
const validate = require("../src/middleware/validate");
const yup = require("yup");

test("acepta una solicitud de inicio de sesión con los campos requeridos", async () => {
  await expect(loginSchema.isValid({ nombre_usuario: "paciente", password: "sintetica" })).resolves.toBe(true);
});
test("rechaza el inicio de sesión sin contraseña", async () => {
  await expect(loginSchema.isValid({ nombre_usuario: "paciente" })).resolves.toBe(false);
});
test("normaliza un RUT con puntos", () => {
  expect(normalizeRut("11.111.111-1")).toBe("11111111-1");
});
test("el middleware entrega al controlador el cuerpo saneado", async () => {
  const req = { body: { nombre: "Prueba", usuario_id: 1 } };
  const next = jest.fn();
  await validate(yup.object({ nombre: yup.string().required() }))(req, {}, next);
  expect(req.body).toEqual({ nombre: "Prueba" });
  expect(next).toHaveBeenCalledTimes(1);
});
test("el middleware devuelve HTTP 400 cuando falta un campo", async () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  await validate(yup.object({ nombre: yup.string().required() }))({ body: {} }, res, next);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(next).not.toHaveBeenCalled();
});
