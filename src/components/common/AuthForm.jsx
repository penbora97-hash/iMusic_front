// src/components/auth/AuthForm.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiX,
  FiMusic,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

// ✅ Field — Icon មាន Box + Padding ត្រូវ
function Field({ icon, children }) {
  return (
    <div className="relative">
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                   w-8 h-8 rounded-lg bg-white/5 border border-white/10
                   grid place-items-center text-white/50 text-sm
                   pointer-events-none"
      >
        {icon}
      </span>
      {children}
    </div>
  );
}

// ✅ Inline Style ឈ្នះ CSS Class
const inputStyle = { paddingLeft: "3.5rem" }; // 56px
const inputStylePwd = { paddingLeft: "3.5rem", paddingRight: "3rem" };

export default function AuthForm({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    const h = (e) => e.key === "Escape" && nav("/");
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setBusy(true);
    try {
      if (isLogin) await login(f.email, f.password);
      else await register(f);
      setSuccess("✅ ជោគជ័យ! កំពុងបញ្ជូន...");
      setTimeout(() => nav("/"), 600);
    } catch (x) {
      setErr(x.message || "មានបញ្ហា សូមព្យាយាមម្តងទៀត");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative py-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#b07a9a]/10 blur-3xl" />
      </div>

      <form
        onSubmit={submit}
        className="relative z-10 glass rounded-[2rem] p-8 sm:p-10 max-w-md mx-auto mt-10 flex flex-col gap-5"
      >
        {/* Close */}
        <button
          type="button"
          onClick={() => nav("/")}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full 
                     bg-white/10 hover:bg-white/25 border border-white/20 
                     text-white/60 hover:text-white transition-all active:scale-90"
        >
          <FiX className="text-sm" />
        </button>

        {/* Header */}
        <div className="text-center mb-2">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl grid place-items-center 
                       bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] 
                       shadow-xl shadow-[#b07a9a]/30"
          >
            <FiMusic className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? "ចូលគណនី" : "បង្កើតគណនី"}
          </h2>
          <p className="text-sm text-white/60 mt-1.5">
            {isLogin
              ? "សូមស្វាគមន៍ត្រឡប់មកវិញ 👋"
              : "ចូលរួមជាមួយ iMusic ឥឡូវនេះ"}
          </p>
        </div>

        {/* Username (Register only) */}
        {!isLogin && (
          <Field icon={<FiUser />}>
            <input
              className="input"
              style={inputStyle}
              placeholder="Username"
              value={f.username}
              onChange={set("username")}
              required
              autoComplete="username"
            />
          </Field>
        )}

        {/* Email */}
        <Field icon={<FiMail />}>
          <input
            className="input"
            style={inputStyle}
            type="email"
            placeholder="Email"
            value={f.email}
            onChange={set("email")}
            required
            autoComplete="email"
          />
        </Field>

        {/* Password */}
        <Field icon={<FiLock />}>
          <input
            className="input"
            style={inputStylePwd}
            type={show ? "text" : "password"}
            placeholder="Password (≥ 6 characters)"
            value={f.password}
            onChange={set("password")}
            minLength={6}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label="Toggle password"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                       w-8 h-8 rounded-lg grid place-items-center
                       text-white/50 hover:text-white/90 hover:bg-white/5 
                       transition-all"
          >
            {show ? (
              <FiEyeOff className="text-base" />
            ) : (
              <FiEye className="text-base" />
            )}
          </button>
        </Field>

        {/* Error */}
        {err && (
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl 
                          bg-red-500/10 border border-red-400/30 text-red-300 text-sm"
          >
            <FiAlertCircle className="shrink-0 mt-0.5 text-base" />
            <span>{err}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl 
                          bg-green-500/10 border border-green-400/30 text-green-300 text-sm"
          >
            <FiCheckCircle className="shrink-0 mt-0.5 text-base" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl 
                     font-bold text-white text-[15px]
                     bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                     hover:from-[#c08aaa] hover:to-[#9a6a8a]
                     shadow-lg shadow-[#b07a9a]/30 hover:shadow-[#b07a9a]/50
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all"
        >
          {busy ? (
            <>
              <FiLoader className="animate-spin" />
              សូមរង់ចាំ...
            </>
          ) : isLogin ? (
            "ចូលគណនី"
          ) : (
            "បង្កើតគណនី"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-white/40 text-xs">
          <span className="flex-1 h-px bg-white/10" />
          ឬ
          <span className="flex-1 h-px bg-white/10" />
        </div>

        {/* Switch */}
        <p className="text-center text-white/70 text-sm">
          {isLogin ? "មិនទាន់មានគណនី? " : "មានគណនីហើយ? "}
          <Link
            className="font-semibold text-[#e0a0c0] hover:text-[#f0b0d0] 
                       underline-offset-4 hover:underline transition-colors"
            to={isLogin ? "/register" : "/login"}
          >
            {isLogin ? "ចុះឈ្មោះ" : "ចូលគណនី"}
          </Link>
        </p>
      </form>
    </div>
  );
}
