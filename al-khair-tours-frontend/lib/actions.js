"use server";

import { apiFetch } from "@/lib/api";

// Server Action — call this directly from client components with `import { submitBooking } from "@/lib/actions"`.
// Next.js automatically turns this into a secure POST endpoint because of the "use server" directive above.
// The actual booking insert happens in the Express API (server/), which talks to Supabase.
export async function submitBooking(input) {
  const row = await apiFetch("/api/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return row;
}
