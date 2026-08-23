import mongoose from "mongoose";

// Links a Supabase Auth user (identified by email) to admin permissions.
// The password itself is never stored here — Supabase Auth handles that.
const adminRoleSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    supabase_user_id: { type: String, default: null },
    roles: { type: [String], default: ["super_admin"] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const AdminRole = mongoose.models.AdminRole || mongoose.model("AdminRole", adminRoleSchema);
