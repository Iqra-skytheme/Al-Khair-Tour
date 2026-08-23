import jwt from "jsonwebtoken";

const SECRET = process.env.ADMIN_JWT_SECRET;
const EXPIRES_IN = process.env.ADMIN_JWT_EXPIRES_IN || "7d";

if (!SECRET) {
  console.warn("[jwt] ADMIN_JWT_SECRET not set. Set it in .env before logging in as admin.");
}

export function signAdminToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyAdminToken(token) {
  return jwt.verify(token, SECRET);
}
