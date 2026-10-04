// src/pages/SongDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import * as songService from "../services/songService";
import { useAuth } from "../context/AuthContext";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiHeart,
  FiShare2,
  FiArrowLeft,
  FiMusic,
  FiClock,
  FiUser,
  FiDownload,
  FiVolume2,
} from "react-icons/fi";

// ===== Helper =====
const API_BASE = "http://localhost:8000";

const buildUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getCover = (song) => {
  if (song?.cover_url) return buildUrl(song.cover_url);
  if (song?.artist?.image_url) return buildUrl(song.artist.image_url);
  return null;
};

const getAudio = (song) => buildUrl(song?.file_url);

export default function SongDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const audioRef = useRef(null);

  // ===== Fetch Song =====
  useEffect(() => {
    setLoading(true);
    songService
      .list()
      .then((all) => {
        const found = all.find((s) => String(s.id) === String(id));
        setSong(found || null);
      })
      .catch(() => setSong(null))
      .finally(() => setLoading(false));
  }, [id]);

  // ===== Fetch Favorites =====
  useEffect(() => {
    if (!user) {
      setLiked(false);
      return;
    }
    songService
      .favorites()
      .then((favs) => {
        const isFav = favs.some((f) => String(f.id) === String(id));
        setLiked(isFav);
      })
      .catch(() => setLiked(false));
  }, [id, user]);

  // ===== Audio Event Handlers =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [song]);

  // ===== Play/Pause =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  const togglePlay = () => setPlaying((p) => !p);

  // ===== ✅ Toggle Favorite (ប្រើ toggleFav) =====
  const toggleLike = async () => {
    if (!user) {
      alert("សូម Login ដើម្បីបន្ថែម Favorites");
      return;
    }
    if (likeBusy) return;

    // Optimistic Update
    const prev = liked;
    setLiked(!prev);
    setLikeBusy(true);

    try {
      const res = await songService.toggleFav(id); // ✅ ត្រូវនឹង Service
      setLiked(res.liked);
    } catch (e) {
      setLiked(prev);
      console.error("Toggle favorite failed:", e);
      if (e?.status === 401) {
        alert("Session ផុតកំណត់ សូម Login ម្តងទៀត");
      }
    } finally {
      setLikeBusy(false);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ===== Loading =====
  if (loading) {
    return <div className="py-20 text-center text-white/60">កំពុងផ្ទុក...</div>;
  }

  // ===== Not Found =====
  if (!song) {
    return (
      <div className="py-20 text-center">
        <FiMusic className="text-white/30 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">រកមិនឃើញចម្រៀង</h2>
        <Link to="/" className="text-[#e0a0c0] hover:underline text-sm">
          ត្រលប់ទៅទំព័រដើម
        </Link>
      </div>
    );
  }

  const cover = getCover(song);
  const audioUrl = getAudio(song);

  return (
    <div className="relative py-8">
      {/* Hidden Audio Element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        {cover && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
      </div>

      {/* Back */}
      <Link
        to="/"
        className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-white/60
                   hover:text-[#e0a0c0] transition-colors mb-8 group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        ត្រលប់ទៅទំព័រដើម
      </Link>

      {/* Main Player */}
      <div className="relative z-10 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Cover */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#b07a9a]/40 to-[#7a4a68]/20 blur-2xl" />
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-[#b07a9a]/30 to-[#7a4a68]/30 border border-white/10 shadow-2xl">
              {cover ? (
                <img
                  src={cover}
                  alt={song.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "grid";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full grid place-items-center"
                style={{ display: cover ? "none" : "grid" }}
              >
                <FiMusic className="text-white/30 text-7xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] bg-clip-text text-transparent">
              {song.title}
            </h1>
            <p className="text-white/70 mt-3 text-lg">
              {song.artist?.name || "Unknown Artist"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div
              onClick={handleSeek}
              className="relative h-1.5 rounded-full bg-white/10 overflow-hidden cursor-pointer group"
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] group-hover:from-[#f0b0d0] group-hover:to-[#c08aaa] transition-all"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/50 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/80 hover:bg-white/10 transition-all">
              <FiSkipBack className="text-lg" />
            </button>

            <button
              onClick={togglePlay}
              disabled={!audioUrl}
              className="w-16 h-16 rounded-full grid place-items-center text-white
                         bg-gradient-to-br from-[#b07a9a] to-[#7a4a68]
                         hover:from-[#c08aaa] hover:to-[#9a6a8a]
                         shadow-xl shadow-[#b07a9a]/30 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {playing ? (
                <FiPause className="text-2xl" />
              ) : (
                <FiPlay className="text-2xl ml-1" />
              )}
            </button>

            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/80 hover:bg-white/10 transition-all">
              <FiSkipForward className="text-lg" />
            </button>

            {/* Volume */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              <FiVolume2 className="text-white/50 text-lg" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  setVolume(e.target.value);
                  if (audioRef.current) {
                    audioRef.current.volume = e.target.value;
                  }
                }}
                className="w-24 accent-[#b07a9a]"
              />
            </div>

            <div className="flex-1" />

            {/* ✅ Heart Button */}
            <button
              onClick={toggleLike}
              disabled={likeBusy}
              title={liked ? "ដកចេញពី Favorites" : "បន្ថែមទៅ Favorites"}
              className={`w-11 h-11 rounded-full border grid place-items-center transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         ${
                           liked
                             ? "bg-pink-500/20 border-pink-400/50 text-pink-400 shadow-lg shadow-pink-500/20"
                             : "bg-white/5 border-white/10 text-white/70 hover:text-pink-400 hover:bg-white/10"
                         }`}
            >
              <FiHeart
                className={`text-lg transition-all ${
                  liked ? "fill-pink-400 scale-110" : ""
                }`}
              />
            </button>

            <button className="w-11 h-11 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/70 hover:text-[#e0a0c0] hover:bg-white/10 transition-all">
              <FiShare2 className="text-lg" />
            </button>

            {audioUrl && (
              <a
                href={audioUrl}
                download
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/70 hover:text-[#e0a0c0] hover:bg-white/10 transition-all"
              >
                <FiDownload className="text-lg" />
              </a>
            )}
          </div>

          {/* Meta */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-white/50">
                <FiUser className="text-[#e0a0c0]" /> Artist
              </span>
              <span className="text-white font-medium">
                {song.artist?.name || "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-white/50">
                <FiClock className="text-[#e0a0c0]" /> Duration
              </span>
              <span className="text-white font-medium">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Warning if no audio */}
          {!audioUrl && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm">
              ⚠️ រកមិនឃើញ Audio File សម្រាប់ចម្រៀងនេះ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
