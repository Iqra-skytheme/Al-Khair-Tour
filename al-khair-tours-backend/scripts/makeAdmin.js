// Usage: npm run make-admin -- admin@example.com super_admin
//
// IMPORTANT: This does NOT create the login/password — that user must already
// exist in Supabase (Dashboard -> Authentication -> Users -> Add user).
// This script only grants that email admin access inside MongoDB.
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/db.js";
import { AdminRole } from "../src/models/AdminRole.js";

async function main() {
  const [, , email, role = "super_admin"] = process.argv;

  if (!email) {
    console.error("Usage: npm run make-admin -- admin@example.com super_admin");
    process.exit(1);
  }

  await connectDB();

  const doc = await AdminRole.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { $addToSet: { roles: role } },
    { upsert: true, new: true },
  );

  console.log(`Admin access granted: ${doc.email} (roles: ${doc.roles.join(", ")})`);
  console.log("Make sure this same email also exists as a Supabase Auth user with a password set.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
