// import { Router } from "express";
// import { z } from "zod";
// import { Vehicle } from "../models/Vehicle.js";
// import { ZiyaratPackage } from "../models/ZiyaratPackage.js";
// import { Booking } from "../models/Booking.js";

// export const publicRouter = Router();

// // // ---------- Vehicles ----------
// // publicRouter.get("/vehicles", async (req, res) => {
// //   try {
// //     const vehicles = await Vehicle.find({ available: true }).sort({ sort_order: 1 }).lean();
// //     res.json(vehicles);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // publicRouter.get("/vehicles/:id", async (req, res) => {
// //   try {
// //     const vehicle = await Vehicle.findOne({ _id: req.params.id, available: true }).lean();
// //     if (!vehicle) return res.status(404).json({ error: "Vehicle not found." });
// //     res.json(vehicle);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // ---------- Vehicles ----------
// publicRouter.get("/vehicles", async (req, res) => {
//   try {
//     const vehicles = await Vehicle.find({ available: true }).sort({ sort_order: 1 }).lean();
//     res.json(vehicles.map((v) => ({ ...v, id: v._id })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // // ---------- Ziyarat packages ----------
// // publicRouter.get("/ziyarat", async (req, res) => {
// //   try {
// //     const packages = await ZiyaratPackage.find({ published: true }).sort({ sort_order: 1 }).lean();
// //     res.json(packages);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // publicRouter.get("/ziyarat/:id", async (req, res) => {
// //   try {
// //     const pkg = await ZiyaratPackage.findOne({ _id: req.params.id, published: true }).lean();
// //     if (!pkg) return res.status(404).json({ error: "Package not found." });
// //     res.json(pkg);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });
// // ---------- Ziyarat packages ----------
// publicRouter.get("/ziyarat", async (req, res) => {
//   try {
//     const packages = await ZiyaratPackage.find({ published: true }).sort({ sort_order: 1 }).lean();
//     res.json(packages.map((p) => ({ ...p, id: p._id })));
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // ---------- Bookings ----------
// const bookingSchema = z.object({
//   customer_name: z.string().min(2).max(80),
//   customer_phone: z.string().min(4).max(30),
//   customer_email: z.string().email().optional().nullable(),
//   service_type: z.enum(["ride", "ziyarat"]),
//   vehicle_id: z.string().nullable().optional(),
//   package_id: z.string().nullable().optional(),
//   pickup: z.string().nullable().optional(),
//   dropoff: z.string().nullable().optional(),
//   scheduled_at: z.string().nullable().optional(),
//   passengers: z.number().int().min(1).max(50).nullable().optional(),
//   notes: z.string().max(1000).nullable().optional(),
//   source: z.string().optional(),
// });

// publicRouter.post("/bookings", async (req, res) => {
//   const parsed = bookingSchema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid booking data." });
//   }

//   try {
//     const booking = await Booking.create({ ...parsed.data, source: parsed.data.source ?? "website" });
//     res.status(201).json({ id: booking._id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
import { Router } from "express";
import { z } from "zod";
import { Vehicle } from "../models/Vehicle.js";
import { ZiyaratPackage } from "../models/ZiyaratPackage.js";
import { Booking } from "../models/Booking.js";

export const publicRouter = Router();

// ---------- Vehicles ----------
publicRouter.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ available: true }).sort({ sort_order: 1 }).lean();
    res.json(vehicles.map((v) => ({ ...v, id: v._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicRouter.get("/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, available: true }).lean();
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found." });
    res.json({ ...vehicle, id: vehicle._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Ziyarat packages ----------
publicRouter.get("/ziyarat", async (req, res) => {
  try {
    const packages = await ZiyaratPackage.find({ published: true }).sort({ sort_order: 1 }).lean();
    res.json(packages.map((p) => ({ ...p, id: p._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

publicRouter.get("/ziyarat/:id", async (req, res) => {
  try {
    const pkg = await ZiyaratPackage.findOne({ _id: req.params.id, published: true }).lean();
    if (!pkg) return res.status(404).json({ error: "Package not found." });
    res.json({ ...pkg, id: pkg._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Bookings ----------
const bookingSchema = z.object({
  customer_name: z.string().min(2).max(80),
  customer_phone: z.string().min(4).max(30),
  customer_email: z.string().email().optional().nullable(),
  service_type: z.enum(["ride", "ziyarat"]),
  vehicle_id: z.string().nullable().optional(),
  package_id: z.string().nullable().optional(),
  pickup: z.string().nullable().optional(),
  dropoff: z.string().nullable().optional(),
  scheduled_at: z.string().nullable().optional(),
  passengers: z.number().int().min(1).max(50).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  source: z.string().optional(),
});

publicRouter.post("/bookings", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid booking data." });
  }

  try {
    const booking = await Booking.create({ ...parsed.data, source: parsed.data.source ?? "website" });
    res.status(201).json({ id: booking._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});