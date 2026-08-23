// // Small fetch helper for talking to the Express API (server/).
// // API_URL is used on the server (Server Components / Server Actions / middleware).
// const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// export function apiUrl(path) {
//   return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
// }

// export async function apiFetch(path, options = {}) {
//   const res = await fetch(apiUrl(path), {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     cache: options.cache ?? "no-store",
//   });

//   let body = null;
//   try {
//     body = await res.json();
//   } catch {
//     // no JSON body (e.g. 204 No Content)
//   }

//   if (!res.ok) {
//     throw new Error(body?.error || `Request failed (${res.status})`);
//   }

//   return body;
// }

// export function adminHeaders(token) {
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }


const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function apiUrl(path) {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const { revalidate, cache, headers, ...rest } = options;

  const fetchOptions = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  };

  if (revalidate !== undefined) {
    // Cache this fetch and background-refresh it every `revalidate` seconds
    fetchOptions.next = { revalidate };
  } else {
    fetchOptions.cache = cache ?? "no-store";
  }

  const res = await fetch(apiUrl(path), fetchOptions);

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body (e.g. 204 No Content)
  }

  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }

  return body;
}

export function adminHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}