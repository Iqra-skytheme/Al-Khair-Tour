import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./src/db.js";
import { publicRouter } from "./src/routes/public.js";
import { adminRouter } from "./src/routes/admin.js";

const app = express();
import "dotenv/config";
const PORT = process.env.PORT || 5000;
const origins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map((s) => s.trim());

app.use(cors({ origin: origins }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});


async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error(`[startup] ${err.message}`);
    console.error("[startup] The server will still start, but every request that needs the database will fail until MONGODB_URI is set correctly in .env");
  }

  app.listen(PORT, () => {
    console.log(`Al-Khair Tours API listening on http://localhost:${PORT}`);
  });
}

start();
