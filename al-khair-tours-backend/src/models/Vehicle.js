import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  { label: String, priceSAR: Number },
  { _id: false },
);

const vehicleSchema = new mongoose.Schema(
  {
    _id: { type: String }, // human-readable slug, e.g. "economy-camry"
    name: { type: String, required: true },
    category: { type: String, required: true },
    seats: { type: Number, required: true },
    luggage: { type: Number, required: true },
    image: { type: String, default: null },
    routes: { type: [routeSchema], default: [] },
    features: { type: [String], default: [] },
    available: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false },
);

export const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
