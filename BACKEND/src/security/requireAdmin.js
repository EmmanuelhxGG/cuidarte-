const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const { jwtSecret } = require("./config");

module.exports = async function requireAdmin(req, res, next) {
  const authorization = req.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado" });
  }
  try {
    req.actor = jwt.verify(authorization.slice(7), jwtSecret, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ error: "No autorizado" });
  }
  try {
    const { rowCount } = await pool.query(
      "SELECT 1 FROM usuario_roles ur JOIN roles r ON r.id = ur.rol_id WHERE ur.usuario_id = $1 AND r.nombre = 'admin'",
      [req.actor.usuarioId]
    );
    if (!rowCount) return res.status(403).json({ error: "Permisos insuficientes" });
    next();
  } catch (err) {
    next(err);
  }
};
