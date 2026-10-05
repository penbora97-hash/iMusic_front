// src/pages/admin/UploadSong.jsx
import { useState, useEffect, useRef } from "react";
import { Card, inputCls, btnCls } from "../../components/admin/ui";
import * as songService from "../../services/songService";
import { asset } from "../../services/api";
import {
  FiMusic,
  FiImage,
  FiUser,
  FiX,
  FiUpload,
  FiSearch,
  FiCheck,
} from "react-icons/fi";

export default function UploadSong() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [artistName, setArtistName] = useState("");
  const [artists, setArtists] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const suggestionRef = useRef(null);

  useEffect(() => {
    songService
      .artists()
      .then((data) => setArtists(Array.isArray(data) ? data : []))
      .catch(() => setArtists([]));
  }, []);

  useEffect(() => {
    if (!artistName.trim()) {
      setFilteredArtists([]);
      return;
    }
    const filtered = artists
      .filter((a) => a.name.toLowerCase().includes(artistName.toLowerCase()))
      .slice(0, 5);
    setFilteredArtists(filtered);
  }, [artistName, artists]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const selectArtist = (artist) => {
    setArtistName(artist.name);
    setShowSuggestions(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setBusy(true);
    setMsg("");

    try {
      const fd = new FormData(form);
      fd.set("artist", artistName);
      if (cover) fd.set("cover", cover);

      await songService.upload(fd);
      form.reset();
      setArtistName("");
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

        {/* ✅ Artist with Suggestions */}
        <div className="relative" ref={suggestionRef}>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-1.5">
            <FiUser className="text-[#e0a0c0]" />
            សិល្បករ <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              className={inputCls + " pr-10"}
              value={artistName}
              onChange={(e) => {
                setArtistName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="វាយឈ្មោះ ឬជ្រើសពី List"
              required
            />
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>

          {showSuggestions && filteredArtists.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-2 z-50
                         bg-[#1a1520]/95 backdrop-blur-2xl border border-white/20
                         rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="px-4 pt-3 pb-1">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  Artists ដែលមានស្រាប់
                </p>
              </div>
              {filteredArtists.map((a) => {
                const img = asset(a.image_url);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => selectArtist(a)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10 bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] grid place-items-center text-white font-bold">
                      {img ? (
                        <img
                          src={img}
                          alt={a.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        a.name?.[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">
                        {a.name}
                      </p>
                      <p className="text-[11px] text-white/50">
                        {a.songs_count || 0} ចម្រៀង
                      </p>
                    </div>
                    {artistName === a.name && (
                      <FiCheck className="text-[#e0a0c0]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

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
                className="w-32 h-32 rounded-2xl object-cover border-2 border-[#b07a9a]/50"
              />
              <button
                type="button"
                onClick={clearCover}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 grid place-items-center text-white"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-[#b07a9a]/60 cursor-pointer transition-all">
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

        <button
          className={btnCls + " flex items-center justify-center gap-2 w-full"}
          disabled={busy}
        >
          <FiUpload />
          {busy ? "កំពុង Upload..." : "Upload"}
        </button>

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
