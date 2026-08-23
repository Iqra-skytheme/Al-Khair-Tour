// import { createClient } from "@supabase/supabase-js";

// const url = process.env.SUPABASE_URL;
// const anonKey = process.env.SUPABASE_ANON_KEY;

// if (!url || !anonKey) {
//   console.warn(
//     "[supabase-auth] SUPABASE_URL / SUPABASE_ANON_KEY not set. Admin login will fail until .env is configured.",
//   );
// }

// // This client is used ONLY to verify admin email/password via Supabase Auth.
// // It never touches any Supabase database table — all app data lives in MongoDB.
// export const supabaseAuth = createClient(url, anonKey, {
//   auth: { persistSession: false, autoRefreshToken: false },
// });



import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
console.log("URL VALUE:",
   JSON.stringify(url));
const anonKey = process.env.SUPABASE_ANON_KEY;

let supabaseAuth = null;

if (!url || !anonKey) {
  console.warn(
    "[supabase-auth] SUPABASE_URL / SUPABASE_ANON_KEY not set. Admin login will fail until .env is configured.",
  );
} else {
  supabaseAuth = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export { supabaseAuth };