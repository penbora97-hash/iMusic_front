// src/services/api.js

// ✅ ទាញ API URL ពី Vite Environment
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

console.log("🔗 API URL:", API);

/**
 * ✅ asset() — គាំទ្រទាំង Local និង Cloudinary URLs
 *
 * - បើ URL ជា http/https (Cloudinary) → Return ដដែល
 * - បើ URL ជា relative (/storage/...) → បន្ថែម API Domain
 */
export const asset = (u) => {
  if (!u) return null;

  // ✅ បើ URL ជា http/https រួចហើយ (Cloudinary, Google, etc.) → Return ដដែល
  if (u.startsWith("http://") || u.startsWith("https://")) {
    return u;
  }

  // ✅ បើ URL ជា Relative (Local Storage) → បន្ថែម API Domain
  return API + u;
};

export async function api(path, { method = "GET", body, form } = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(API + "/api" + path, {
    method,
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: "Bearer " + token }),
      ...(body && { "Content-Type": "application/json" }),
    },
    body: form || (body && JSON.stringify(body)),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "មានបញ្ហា");
  return data;
}