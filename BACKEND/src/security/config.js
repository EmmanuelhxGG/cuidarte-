require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
  throw new Error("JWT_SECRET debe tener al menos 32 bytes");
}

module.exports = { jwtSecret };
