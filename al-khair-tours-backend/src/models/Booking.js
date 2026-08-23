import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    customer_email: { type: String, default: null },
    service_type: { type: String, enum: ["ride", "ziyarat"], required: true },
    vehicle_id: { type: String, default: null },
    package_id: { type: String, default: null },
    pickup: { type: String, default: null },
    dropoff: { type: String, default: null },
    scheduled_at: { type: Date, default: null },
    passengers: { type: Number, default: null },
    notes: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    price_sar: { type: Number, default: null },
    source: { type: String, default: "website" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
