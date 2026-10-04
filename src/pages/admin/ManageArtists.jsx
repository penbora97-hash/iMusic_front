// src/pages/admin/ManageArtists.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as songService from "../../services/songService";
import { asset } from "../../services/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMusic,
  FiX,
  FiImage,
  FiSave,
  FiUploadCloud,
  FiMic,
} from "react-icons/fi";

export default function ManageArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [form, setForm] = useState({ name: "", bio: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [busy, setBusy] = useState(false);

  // ===== Load =====
  const load = () => {
    setLoading(true);
    songService
      .artists()
      .then((data) => setArtists(Array.isArray(data) ? data : []))
      .catch(() => setArtists([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  // ===== Open Create =====
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", bio: "" });
    setImage(null);
    setImagePreview(null);
    setMsg({ type: "", text: "" });
    setShowModal(true);
  };

  // ===== Open Edit =====
  const openEdit = (a) => {
    setEditing(a);
    setForm({ name: a.name, bio: a.bio || "" });
    setImage(null);
    setImagePreview(asset(a.image_url));
    setMsg({ type: "", text: "" });
    setShowModal(true);
  };

  // ===== Pick Image =====
  const pickImage = (e) => {
    const f = e.target.files[0];
    if (f) {
      setImage(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  // ===== Submit =====
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMsg({ type: "error", text: "សូមបំពេញឈ្មោះ Artist" });
      return;
    }

    setBusy(true);
    setMsg({ type: "", text: "" });

    const fd = new FormData();
    fd.append("name", form.name);
    if (form.bio) fd.append("bio", form.bio);
    if (image) fd.append("image", image);

    try {
      if (editing) {
        await songService.updateArtist(editing.id, fd);
        setMsg({ type: "success", text: "✅ កែជោគជ័យ" });
      } else {
        await songService.createArtist(fd);
        setMsg({ type: "success", text: "✅ បង្កើតជោគជ័យ" });
      }
      setTimeout(() => {
        setShowModal(false);
        load();
      }, 600);
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + (err.message || "មានបញ្ហា") });
    } finally {
      setBusy(false);
    }
  };

  // ===== Delete =====
  const remove = async (a) => {
    if (!confirm(`លុប "${a.name}"? ចម្រៀងទាំងអស់នឹងលុបដែរ!`)) return;
    try {
      await songService.deleteArtist(a.id);
      setArtists((prev) => prev.filter((x) => x.id !== a.id));
    } catch (e) {
      alert("លុបបរាជ័យ: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiMic className="text-[#e0a0c0]" />
            Artists Management
          </h2>
          <p className="text-sm text-white/40 mt-1">
            គ្រប់គ្រងសិល្បករទាំងអស់ ({artists.length})
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white
                     bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                     hover:from-[#c08aaa] hover:to-[#9a6a8a]
                     shadow-lg shadow-[#b07a9a]/30 transition-all"
        >
          <FiPlus />
          បង្កើត Artist ថ្មី
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 border border-white/10 p-5 animate-pulse"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 mb-3" />
              <div className="h-3 w-3/4 rounded bg-white/10" />
              <div className="h-2 w-1/2 rounded bg-white/5 mt-2" />
            </div>
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white/5 border border-dashed border-white/10">
          <div className="w-20 h-20 rounded-full bg-white/5 grid place-items-center mx-auto mb-5">
            <FiMic className="text-white/30 text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            មិនទាន់មាន Artist ទេ
          </h3>
          <p className="text-white/50 text-sm mb-5">
            ចុច "បង្កើត Artist ថ្មី" ដើម្បីចាប់ផ្តើម
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white
                       bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                       shadow-lg shadow-[#b07a9a]/30"
          >
            <FiPlus />
            បង្កើត Artist ថ្មី
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((a) => {
            const img = asset(a.image_url);
            return (
              <div
                key={a.id}
                className="rounded-2xl bg-[#17131b] border border-white/5 p-5
                           hover:border-[#b07a9a]/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white/10">
                    {img ? (
                      <img
                        src={img}
                        alt={a.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] text-white font-bold text-xl">
                        {a.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{a.name}</p>
                    <p className="text-xs text-white/50 mt-0.5">
                      {a.songs_count || 0} ចម្រៀង
                    </p>
                  </div>
                </div>

                {a.bio && (
                  <p className="text-xs text-white/50 mt-3 line-clamp-2">
                    {a.bio}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <Link
                    to={`/admin/artists/${a.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                               text-xs font-semibold text-white/80
                               bg-white/5 border border-white/10
                               hover:bg-white/10 hover:text-white transition-all"
                  >
                    <FiMusic className="text-sm" />
                    ចម្រៀង
                  </Link>
                  <button
                    onClick={() => openEdit(a)}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10
                               grid place-items-center text-white/70
                               hover:text-[#e0a0c0] hover:bg-white/10 transition-all"
                    title="កែ"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => remove(a)}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10
                               grid place-items-center text-white/70
                               hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                    title="លុប"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm
                     flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[#17131b] border border-white/10
                       p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">
                {editing ? "កែ Artist" : "បង្កើត Artist ថ្មី"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 grid place-items-center
                           text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {/* Image */}
              <div className="flex flex-col items-center">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 border-2 border-dashed border-white/20 group-hover:border-[#b07a9a] transition-all">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-white/30">
                        <FiImage className="text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#b07a9a] grid place-items-center text-white shadow-lg">
                    <FiUploadCloud className="text-sm" />
                  </div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={pickImage}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-white/40 mt-2">រូប Artist</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  ឈ្មោះ <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                             text-sm text-white outline-none 
                             focus:border-[#b07a9a] focus:bg-white/[0.07] transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ឧ. Gmengz"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5">
                  ប្រវត្តិ (ជម្រើស)
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                             text-sm text-white outline-none resize-none
                             focus:border-[#b07a9a] focus:bg-white/[0.07] transition-all"
                  rows="3"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="ប្រវត្តិសង្ខេប..."
                />
              </div>

              {msg.text && (
                <p
                  className={`text-sm px-4 py-3 rounded-xl ${
                    msg.type === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                           text-sm font-bold text-white
                           bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                           hover:from-[#c08aaa] hover:to-[#9a6a8a]
                           shadow-lg shadow-[#b07a9a]/30 transition-all
                           disabled:opacity-50"
              >
                <FiSave />
                {busy ? "កំពុងរក្សាទុក..." : editing ? "រក្សាទុក" : "បង្កើត"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}