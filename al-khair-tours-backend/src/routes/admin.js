import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { supabaseAuth } from "../supabaseAuth.js";
import { Vehicle } from "../models/Vehicle.js";
import { ZiyaratPackage } from "../models/ZiyaratPackage.js";
import { Booking } from "../models/Booking.js";
import { AdminRole } from "../models/AdminRole.js";
import { signAdminToken } from "../lib/jwt.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const adminRouter = Router();

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

// ---------- Auth ----------
// Step 1: verify the password against Supabase Auth (this is the ONLY thing Supabase is used for).
// Step 2: look up admin permissions in MongoDB (AdminRole), keyed by email.
adminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data: signInData, error: signInError } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError || !signInData?.user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  try {
    const role = await AdminRole.findOne({ email: email.toLowerCase().trim() });
    if (!role) {
      return res.status(403).json({ error: "This account has no admin access." });
    }

    // Keep the Supabase user id on file for reference (first successful login only).
    if (!role.supabase_user_id) {
      role.supabase_user_id = signInData.user.id;
      await role.save();
    }

    const token = signAdminToken({
      sub: signInData.user.id,
      email: signInData.user.email,
      roles: role.roles,
    });
    res.json({ token, user: { id: signInData.user.id, email: signInData.user.email, roles: role.roles } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/me", requireAdmin, (req, res) => {
  res.json({ user: req.admin });
});

// ---------- Overview ----------
adminRouter.get("/overview", requireAdmin, async (req, res) => {
  try {
    const [vehicleCount, ziyaratCount, pendingCount, totalBookings] = await Promise.all([
      Vehicle.countDocuments(),
      ZiyaratPackage.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments(),
    ]);
    res.json({ vehicleCount, ziyaratCount, pendingCount, totalBookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Image upload ----------
adminRouter.post("/upload", requireAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "al-khair-tours/vehicles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: uploadResult.secure_url, publicId: uploadResult.public_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Vehicles ----------
const vehicleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  category: z.string().min(1),
  seats: z.number().int().nonnegative(),
  luggage: z.number().int().nonnegative(),
  image: z.string().nullable().optional(),
  routes: z.array(z.any()).default([]),
  features: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

adminRouter.get("/vehicles", requireAdmin, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ sort_order: 1 }).lean();
    res.json(vehicles.map((v) => ({ ...v, id: v._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/vehicles/:id", requireAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).lean();
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found." });
    res.json({ ...vehicle, id: vehicle._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.post("/vehicles", requireAdmin, async (req, res) => {
  const parsed = vehicleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });

  const id = parsed.data.id?.trim() || slugify(parsed.data.name);
  try {
    const { id: _ignore, ...rest } = parsed.data;
    await Vehicle.create({ _id: id, ...rest });
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.put("/vehicles/:id", requireAdmin, async (req, res) => {
  const parsed = vehicleSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });

  const { id: _ignore, ...updates } = parsed.data;
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: "Vehicle not found." });
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.delete("/vehicles/:id", requireAdmin, async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Ziyarat packages ----------
const ziyaratSchema = z.object({
  id: z.string().optional(),
  city: z.string().min(1, "City is required"),
  title: z.string().min(1),
  duration: z.string().nullable().optional(),
  price_sar: z.number().nonnegative().nullable().optional(),
  hero: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  stops: z.array(z.string()).default([]),
  includes: z.array(z.string()).default([]),
  excludes: z.array(z.string()).default([]),
  guide_languages: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

adminRouter.get("/ziyarat", requireAdmin, async (req, res) => {
  try {
    const packages = await ZiyaratPackage.find().sort({ sort_order: 1 }).lean();
    res.json(packages.map((p) => ({ ...p, id: p._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/ziyarat/:id", requireAdmin, async (req, res) => {
  try {
    const pkg = await ZiyaratPackage.findById(req.params.id).lean();
    if (!pkg) return res.status(404).json({ error: "Package not found." });
    res.json({ ...pkg, id: pkg._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.post("/ziyarat", requireAdmin, async (req, res) => {
  const parsed = ziyaratSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });

  const id = parsed.data.id?.trim() || slugify(parsed.data.title);
  try {
    const { id: _ignore, ...rest } = parsed.data;
    await ZiyaratPackage.create({ _id: id, ...rest });
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.put("/ziyarat/:id", requireAdmin, async (req, res) => {
  const parsed = ziyaratSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message });

  const { id: _ignore, ...updates } = parsed.data;
  try {
    const updated = await ZiyaratPackage.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: "Package not found." });
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.delete("/ziyarat/:id", requireAdmin, async (req, res) => {
  try {
    await ZiyaratPackage.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Bookings ----------
adminRouter.get("/bookings", requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ created_at: -1 }).limit(100).lean();
    res.json(bookings.map((b) => ({ ...b, id: b._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.patch("/bookings/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  const allowed = ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled", "refunded"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status." });

  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: "Booking not found." });
    res.json({ id: req.params.id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.delete("/bookings/:id", requireAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});