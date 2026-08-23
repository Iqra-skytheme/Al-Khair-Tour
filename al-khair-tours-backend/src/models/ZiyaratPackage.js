import mongoose from "mongoose";

const ziyaratSchema = new mongoose.Schema(
  {
    _id: { type: String }, // human-readable slug, e.g. "makkah-half-day"
    city: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    duration: { type: String, default: null },
    price_sar: { type: Number, default: null },
    hero: { type: String, default: null },
    summary: { type: String, default: null },
    stops: { type: [String], default: [] },
    includes: { type: [String], default: [] },
    excludes: { type: [String], default: [] },
    guide_languages: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, _id: false },
);

export const ZiyaratPackage =
  mongoose.models.ZiyaratPackage || mongoose.model("ZiyaratPackage", ziyaratSchema);