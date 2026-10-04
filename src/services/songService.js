// src/services/songService.js
import { api } from "./api";

// ===== Songs =====
export const list = (q = "") => api("/songs?q=" + encodeURIComponent(q));
export const play = (id) => api(`/songs/${id}/play`, { method: "POST" });

// ===== Favorites =====
export const favorites = () => api("/favorites");
export const toggleFav = (id) => api("/favorites/" + id, { method: "POST" });

// ===== Admin - Songs =====
export const upload = (form) => api("/admin/songs", { method: "POST", form });
export const remove = (id) => api("/admin/songs/" + id, { method: "DELETE" });
export const rename = (id, title) =>
  api("/admin/songs/" + id, { method: "PUT", body: { title } });

// ===== Admin - Artists =====
export const artists = () => api("/admin/artists");
export const getArtist = (id) => api(`/admin/artists/${id}`);
export const createArtist = (form) =>
  api("/admin/artists", { method: "POST", form });
export const updateArtist = (id, form) =>
  api(`/admin/artists/${id}`, { method: "POST", form });
export const deleteArtist = (id) =>
  api(`/admin/artists/${id}`, { method: "DELETE" });

// ✅ ===== Follow (ថ្មី) =====
export const checkFollow = (artistId) => api(`/artists/${artistId}/follow`);
export const toggleFollow = (artistId) =>
  api(`/artists/${artistId}/follow`, { method: "POST" });
export const following = () => api("/following");

export const topCharts = () => api('/songs/top');