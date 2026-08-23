"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiFetch, adminHeaders } from "@/lib/api";

const COOKIE_NAME = "admin_token";

export async function getAdminToken() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) redirect("/admin/login");
  return token;
}

// ---------- Auth ----------
export async function loginAdmin(email, password) {
  let result;
  try {
    result = await apiFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    return { error: err.message };
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { error: null };
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect("/admin/login");
}

// ---------- Vehicles ----------
export async function createVehicle(formData) {
  const token = await getAdminToken();
  const routes = JSON.parse(formData.get("routes")?.toString() || "[]");
  const features = formData
    .get("features")
    ?.toString()
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    await apiFetch("/api/admin/vehicles", {
      method: "POST",
      headers: adminHeaders(token),
      body: JSON.stringify({
        id: formData.get("id")?.toString().trim() || undefined,
        name: formData.get("name"),
        category: formData.get("category"),
        seats: Number(formData.get("seats")),
        luggage: Number(formData.get("luggage")),
        image: formData.get("image") || null,
        routes,
        features: features?.length ? features : [],
        available: formData.get("available") === "on",
        sort_order: Number(formData.get("sort_order") || 0),
      }),
    });
  } catch (err) {
    return { error: err.message };
  }
  revalidatePath("/admin/vehicles");
  revalidatePath("/rides");
  redirect("/admin/vehicles");
}

export async function updateVehicle(id, formData) {
  const token = await getAdminToken();
  const routes = JSON.parse(formData.get("routes")?.toString() || "[]");
  const features = formData
    .get("features")
    ?.toString()
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    await apiFetch(`/api/admin/vehicles/${id}`, {
      method: "PUT",
      headers: adminHeaders(token),
      body: JSON.stringify({
        name: formData.get("name"),
        category: formData.get("category"),
        seats: Number(formData.get("seats")),
        luggage: Number(formData.get("luggage")),
        image: formData.get("image") || null,
        routes,
        features: features?.length ? features : [],
        available: formData.get("available") === "on",
        sort_order: Number(formData.get("sort_order") || 0),
      }),
    });
  } catch (err) {
    return { error: err.message };
  }
  revalidatePath("/admin/vehicles");
  revalidatePath("/rides");
  revalidatePath(`/rides/${id}`);
  redirect("/admin/vehicles");
}

export async function deleteVehicle(id) {
  const token = await getAdminToken();
  try {
    await apiFetch(`/api/admin/vehicles/${id}`, { method: "DELETE", headers: adminHeaders(token) });
  } catch (err) {
    return { error: err.message };
  }
  revalidatePath("/admin/vehicles");
  revalidatePath("/rides");
}

// ---------- Ziyarat packages ----------
export async function createZiyarat(formData) {
  const token = await getAdminToken();
  const arr = (key) =>
    formData
      .get(key)
      ?.toString()
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  try {
    await apiFetch("/api/admin/ziyarat", {
      method: "POST",
      headers: adminHeaders(token),
      body: JSON.stringify({
        id: formData.get("id")?.toString().trim() || undefined,
        city: formData.get("city"),
        title: formData.get("title"),
        duration: formData.get("duration"),
        price_sar: formData.get("price_sar") ? Number(formData.get("price_sar")) : null,
        hero: formData.get("hero") || null,
        summary: formData.get("summary"),
        stops: arr("stops"),
        includes: arr("includes"),
        excludes: arr("excludes"),
        guide_languages: arr("guide_languages"),
        published: formData.get("published") === "on",
        sort_order: Number(formData.get("sort_order") || 0),
      }),
    });
  } catch (err) {
    return { error: err.message };
  }
  revalidatePath("/admin/ziyarat");
  revalidatePath("/ziyarat");
  redirect("/admin/ziyarat");
}

export async function updateZiyarat(id, formData) {
  const token = await getAdminToken();
  const arr = (key) =>
    formData
      .get(key)
      ?.toString()
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  try {
    await apiFetch(`/api/admin/ziyarat/${id}`, {
      method: "PUT",
      headers: adminHeaders(token),
      body: JSON.stringify({
        city: formData.get("city"),
        title: formData.get("title"),
        duration: formData.get("duration"),
        price_sar: formData.get("price_sar") ? Number(formData.get("price_sar")) : null,
        hero: formData.get("hero") || null,
        summary: formData.get("summary"),
        stops: arr("stops"),
        includes: arr("includes"),
        excludes: arr("excludes"),
        guide_languages: arr("guide_languages"),
        published: formData.get("published") === "on",
        sort_order: Number(formData.get("sort_order") || 0),
      }),
    });
  } catch (err) {
    return { error: err.message };
  }
  revalidatePath("/admin/ziyarat");
  revalidatePath("/ziyarat");
  revalidatePath(`/ziyarat/${id}`);
  redirect("/admin/ziyarat");
}

export async function deleteZiyarat(id) {
  const token = await getAdminToken();
  try {
    await apiFetch(`/api/admin/ziyarat/${id}`, { method: "DELETE", headers: adminHeaders(token) });
  } catch (err) {
    return { error: err.message };
  }
  revalidatePath("/admin/ziyarat");
  revalidatePath("/ziyarat");
}

// ---------- Bookings ----------
export async function updateBookingStatus(id, status) {
  const token = await getAdminToken();
  try {
    await apiFetch(`/api/admin/bookings/${id}/status`, {
      method: "PATCH",
      headers: adminHeaders(token),
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    return { error: err.message };
  }
  revalidatePath("/admin/bookings");
}

export async function deleteBooking(id) {
  const token = await getAdminToken();
  try {
    await apiFetch(`/api/admin/bookings/${id}`, { method: "DELETE", headers: adminHeaders(token) });
  } catch (err) {
    return { error: err.message };
  }
  revalidatePath("/admin/bookings");
}