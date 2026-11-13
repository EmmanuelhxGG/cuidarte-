import http from "k6/http";
import { check, sleep } from "k6";

const base = __ENV.API_URL || "http://localhost:4446";
const smoke = __ENV.PROFILE !== "carga";
export const options = {
  vus: smoke ? 1 : 200,
  duration: smoke ? "5s" : "20s",
  thresholds: {
    "http_req_duration{operacion:lectura}": ["p(95)<300"],
    "http_req_failed{operacion:lectura}": ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};

export function setup() {
  const res = http.post(base + "/autenticacion/login", JSON.stringify({
    nombre_usuario: "paciente", password: __ENV.QA_PASSWORD,
  }), { headers: { "Content-Type": "application/json" } });
  if (res.status !== 200 || !res.json("token")) throw new Error("Falló la autenticación QA");
  return { token: res.json("token") };
}

export default function ({ token }) {
  const res = http.get(base + "/examenes", {
    headers: { Authorization: "Bearer " + token },
    tags: { operacion: "lectura" },
  });
  check(res, { "exámenes responden 200": r => r.status === 200 });
  sleep(0.5);
}
