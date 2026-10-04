import { createContext, useContext, useEffect, useState } from "react";
import * as auth from "../services/authService";
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("token")) return setReady(true);
    auth
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setReady(true));
  }, []);
  const done = (r) => {
    localStorage.setItem("token", r.token);
    setUser(r.user);
  };
  const login = async (email, password) =>
    done(await auth.login(email, password));
  const register = async (b) => done(await auth.register(b));
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return ready ? (
    <Ctx.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </Ctx.Provider>
  ) : null;
}
