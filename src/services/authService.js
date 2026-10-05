import { api } from "./api";

export const login = (email, password) =>
  api("/auth/login", { method: "POST", body: { email, password } });

export const register = (b) =>
  api("/auth/register", { method: "POST", body: b });

export const me = () => api("/auth/me");

export const updateProfile = (form) =>
  api("/profile", { method: "POST", form });
