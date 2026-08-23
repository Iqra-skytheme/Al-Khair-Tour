import { verifyAdminToken } from "../lib/jwt.js";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing admin token." });
  }

  try {
    const payload = verifyAdminToken(token);
    req.admin = payload; // { sub, email, roles }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired admin token." });
  }
}
