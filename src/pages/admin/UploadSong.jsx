// src/pages/admin/UploadSong.jsx
import { useState } from "react";
import { Card, inputCls, btnCls } from "../../components/admin/ui";
import * as songService from "../../services/songService";
import { FiMusic, FiImage, FiUser, FiX, FiUpload } from "react-icons/fi";

export default function UploadSong() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const pickCover = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const clearCover = () => {
    setCover(null);
    setCoverPreview(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setBusy(true);
    setMsg("");

    try {
      const fd = new FormData(form);
      // ✅ បន្ថែម Cover ដោយដៃ (ព្រោះ Input File ត្រូវបាន Clear)
      if (cover) fd.set("cover", cover);

      await songService.upload(fd);
      form.reset();
      clearCover();
      setMsg("✅ Upload ជោគជ័យ");
    } catch (x) {
      setMsg("❌ " + (x.message || "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Upload ចម្រៀងថ្មី" className="max-w-xl">
      <form onSubmit={submit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm text-white/60 mb-1.5">
            ឈ្មោះចម្រៀង
          </label>
          <input
            className={inputCls}
            name="title"
            placeholder="ឧ. Angel"
            required
          />
        </div>

        {/* Artist */}
        <div>
          <label className="block text-sm text-white/60 mb-1.5">សិល្បករ</label>
          <input
            className={inputCls}
            name="artist"
            placeholder="ឧ. Gmengz"
            required
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm text-white/60 mb-1.5">
            ប្រភេទ (ជម្រើស)
          </label>
          <input
            className={inputCls}
            name="genre"
            placeholder="ឧ. Pop, Rock..."
          />
        </div>

        {/* Audio */}
        <div>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-1.5">
            <FiMusic className="text-[#e0a0c0]" />
            Audio (mp3) <span className="text-red-400">*</span>
          </label>
          <input
            className={inputCls}
            type="file"
            name="audio"
            accept=".mp3,audio/mpeg"
            required
          />
        </div>

        {/* ✅ Cover ចម្រៀង (ថ្មី) */}
        <div>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-1.5">
            <FiImage className="text-[#e0a0c0]" />
            រូបចម្រៀង (Cover)
          </label>

          {coverPreview ? (
            <div className="relative inline-block">
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-32 h-32 rounded-2xl object-cover border-2 border-[#b07a9a]/50 shadow-lg shadow-[#b07a9a]/20"
              />
              <button
                type="button"
                onClick={clearCover}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 
                           grid place-items-center text-white shadow-lg transition-all"
                title="លុបរូប"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          ) : (
            <label
              className="flex items-center gap-3 px-4 py-3 rounded-xl 
                         bg-white/5 border border-dashed border-white/20 
                         hover:border-[#b07a9a]/60 hover:bg-white/[0.07]
                         cursor-pointer transition-all"
            >
              <FiImage className="text-[#e0a0c0] text-lg shrink-0" />
              <span className="text-sm text-white/60">
                ជ្រើសរើសរូបចម្រៀង (jpg/png/webp)
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={pickCover}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Artist Image (ជម្រើស) */}
        <div>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-1.5">
            <FiUser className="text-[#e0a0c0]" />
            រូបសិល្បករ (ជម្រើស)
          </label>
          <input
            className={inputCls}
            type="file"
            name="artist_image"
            accept="image/png,image/jpeg,image/webp"
          />
          <p className="text-[11px] text-white/40 mt-1.5">
            ⚠️ បើជ្រើស Artist ដែលមានស្រាប់ រូបនឹង Update ទាំងអស់
          </p>
        </div>

        {/* Submit */}
        <button
          className={btnCls + " flex items-center justify-center gap-2 w-full"}
          disabled={busy}
        >
          <FiUpload />
          {busy ? "កំពុង Upload..." : "Upload"}
        </button>

        {/* Message */}
        {msg && (
          <p
            className={`text-sm px-4 py-3 rounded-xl ${
              msg.startsWith("✅")
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {msg}
          </p>
        )}
      </form>
    </Card>
  );
}
