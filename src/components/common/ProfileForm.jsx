// src/components/common/ProfileForm.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ បន្ថែម Link
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";
import Avatar from "./Avatar";
import { inputCls, btnCls } from "../admin/ui";
import {
  FiCamera,
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiX,
  FiHeart, // ✅ បន្ថែម
  FiUserCheck, // ✅ បន្ថែម
} from "react-icons/fi";

const V = {
  dark: {
    input: inputCls,
    btn: btnCls,
    card: "bg-[#17131b] border border-white/5 rounded-2xl p-6",
    pick: "bg-white/10 hover:bg-white/20",
  },
  glass: {
    input: "input",
    btn: "btn btn-primary py-3",
    card: "glass rounded-3xl p-8",
    pick: "btn",
  },
};

export default function ProfileForm({ variant = "dark" }) {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const v = V[variant];

  const [f, setF] = useState({
    name: user.username,
    email: user.email,
    current_password: "",
    password: "",
    password2: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const pick = (e) => {
    const x = e.target.files[0];
    if (x) {
      setFile(x);
      setPreview(URL.createObjectURL(x));
    }
  };

  const clearPreview = () => {
    setFile(null);
    setPreview(null);
  };

  const handleClose = () => {
    nav(-1);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (f.password && f.password !== f.password2) {
      return setMsg({ type: "error", text: "Password ថ្មីមិនដូចគ្នា" });
    }

    const fd = new FormData();
    fd.append("name", f.name);
    fd.append("email", f.email);
    if (file) fd.append("avatar", file);
    if (f.password) {
      fd.append("current_password", f.current_password);
      fd.append("password", f.password);
    }

    setBusy(true);
    try {
      setUser(await authService.updateProfile(fd));
      setF({ ...f, current_password: "", password: "", password2: "" });
      clearPreview();
      setMsg({ type: "success", text: "រក្សាទុកជោគជ័យ" });
    } catch (x) {
      setMsg({ type: "error", text: x.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* ✅ Quick Links — Favorites + Following */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/favorites"
          className="group flex items-center gap-3 px-5 py-4 rounded-2xl
                     bg-white/5 border border-white/10 backdrop-blur-xl
                     hover:bg-white/10 hover:border-pink-400/30 
                     hover:-translate-y-0.5 transition-all"
        >
          <div
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/30 to-pink-600/20 
                          border border-pink-400/30 grid place-items-center text-pink-300
                          group-hover:scale-110 transition-transform"
          >
            <FiHeart className="text-lg" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Favorites</p>
            <p className="text-[11px] text-white/50">ចម្រៀងចូលចិត្ត</p>
          </div>
        </Link>

        <Link
          to="/following"
          className="group flex items-center gap-3 px-5 py-4 rounded-2xl
                     bg-white/5 border border-white/10 backdrop-blur-xl
                     hover:bg-white/10 hover:border-[#b07a9a]/30 
                     hover:-translate-y-0.5 transition-all"
        >
          <div
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#b07a9a]/30 to-[#7a4a68]/20 
                          border border-[#b07a9a]/30 grid place-items-center text-[#e0a0c0]
                          group-hover:scale-110 transition-transform"
          >
            <FiUserCheck className="text-lg" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Following</p>
            <p className="text-[11px] text-white/50">សិល្បករតាមដាន</p>
          </div>
        </Link>
      </div>

      {/* Profile Form */}
      <form onSubmit={submit} className={`${v.card} space-y-6 relative`}>
        {/* ✅ Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          title="បិទ"
          className="absolute top-4 right-4 w-9 h-9 rounded-full 
                     bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20
                     grid place-items-center text-white/50 hover:text-white
                     transition-all active:scale-90 z-10"
        >
          <FiX className="text-base" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] grid place-items-center">
            <FiUser className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">កែប្រែ Profile</h2>
            <p className="text-xs text-white/40 mt-0.5">
              គ្រប់គ្រងព័ត៌មានគណនីរបស់អ្នក
            </p>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="relative group">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#b07a9a]/50 shadow-lg shadow-[#b07a9a]/20"
              />
            ) : (
              <div className="rounded-full ring-2 ring-[#b07a9a]/30">
                <Avatar user={user} size={96} />
              </div>
            )}

            {preview && (
              <button
                type="button"
                onClick={clearPreview}
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 
                           grid place-items-center text-white text-xs shadow-lg transition-all"
                title="លុបរូបភាព"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-medium text-white mb-1">
              រូបភាព Profile
            </p>
            <p className="text-xs text-white/40 mb-3">
              PNG, JPG ឬ WEBP (អតិបរមា 2MB)
            </p>
            <label
              className={`inline-flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2.5 
                         text-sm font-medium text-white transition-all ${v.pick}`}
            >
              <FiCamera className="text-base" />
              ប្តូររូប
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={pick}
              />
            </label>
          </div>
        </div>

        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
            <FiUser className="text-[#b07a9a]" />
            ព័ត៌មានផ្ទាល់ខ្លួន
          </h3>

          <label className="block text-sm text-white/60">
            ឈ្មោះ
            <div className="relative mt-1.5">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                className={v.input + " pl-11"}
                value={f.name}
                onChange={set("name")}
                placeholder="បញ្ចូលឈ្មោះ"
                required
              />
            </div>
          </label>

          <label className="block text-sm text-white/60">
            Email
            <div className="relative mt-1.5">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                className={v.input + " pl-11"}
                type="email"
                value={f.email}
                onChange={set("email")}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>
        </div>

        {/* Password Section */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
            <FiLock className="text-[#b07a9a]" />
            ប្តូរ Password
            <span className="text-[10px] font-normal text-white/40 normal-case tracking-normal">
              (ទុកទទេបើមិនចង់ប្តូរ)
            </span>
          </h3>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              className={v.input + " pl-11"}
              type="password"
              placeholder="Password បច្ចុប្បន្ន"
              value={f.current_password}
              onChange={set("current_password")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                className={v.input + " pl-11"}
                type="password"
                placeholder="Password ថ្មី (≥ 6 តួ)"
                value={f.password}
                onChange={set("password")}
                minLength={f.password ? 6 : undefined}
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                className={v.input + " pl-11"}
                type="password"
                placeholder="បញ្ជាក់ Password ថ្មី"
                value={f.password2}
                onChange={set("password2")}
              />
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {msg.text && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
              msg.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {msg.type === "success" ? (
              <FiCheckCircle className="text-lg shrink-0" />
            ) : (
              <FiAlertCircle className="text-lg shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-3 rounded-xl text-sm font-medium 
                       text-white/60 hover:text-white 
                       bg-white/5 hover:bg-white/10 border border-white/10
                       transition-all"
          >
            បោះបង់
          </button>

          <button
            type="submit"
            disabled={busy}
            className={`${v.btn} flex items-center justify-center gap-2 
                       disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]`}
          >
            {busy ? (
              <>
                <FiLoader className="animate-spin" />
                កំពុងរក្សាទុក...
              </>
            ) : (
              <>
                <FiSave />
                រក្សាទុក
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
