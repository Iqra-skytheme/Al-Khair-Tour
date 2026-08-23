// import { apiFetch } from "@/lib/api";

// // These now hit the Express API (server/), which reads from Supabase using
// // the service role key and re-applies the same public filters RLS used to.

// export async function getVehicles() {
//   return apiFetch("/api/vehicles");
// }

// export async function getVehicleById(id) {
//   try {
//     return await apiFetch(`/api/vehicles/${id}`);
//   } catch {
//     return null;
//   }
// }

// export async function getZiyaratPackages() {
//   return apiFetch("/api/ziyarat");
// }

// export async function getZiyaratPackageById(id) {
//   try {
//     return await apiFetch(`/api/ziyarat/${id}`);
//   } catch {
//     return null;
//   }
// }


import { apiFetch } from "@/lib/api";

export async function getVehicles() {
  return apiFetch("/api/vehicles", { revalidate: 60 });
}

export async function getVehicleById(id) {
  try {
    return await apiFetch(`/api/vehicles/${id}`, { revalidate: 60 });
  } catch {
    return null;
  }
}

export async function getZiyaratPackages() {
  return apiFetch("/api/ziyarat", { revalidate: 60 });
}

export async function getZiyaratPackageById(id) {
  try {
    return await apiFetch(`/api/ziyarat/${id}`, { revalidate: 60 });
  } catch {
    return null;
  }
}