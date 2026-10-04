// src/components/player/AudioPlayer.jsx
import { usePlayer } from "../../context/PlayerContext";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiX,
  FiVolume2,
  FiVolumeX,
  FiRepeat,
  FiShuffle,
  FiList,
} from "react-icons/fi";

const API_BASE = "http://localhost:8000";

const buildUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

const formatTime = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export default function AudioPlayer() {
  const {
    current,
    queue,
    index,
    playing,
    currentTime,
    duration,
    volume,
    visible,
    repeat,
    shuffle,
    togglePlay,
    playNext,
    playPrev,
    toggleRepeat,
    toggleShuffle,
    closePlayer,
    setVolume,
    seek,
  } = usePlayer();

  if (!visible || !current) return null;

  const cover = buildUrl(current.cover_url || current.artist?.image_url);
  const artistName =
    current.artist?.name || current.artist_name || "Unknown Artist";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
      <div
        className="relative flex items-center gap-3 px-4 py-3 rounded-2xl
                   bg-gradient-to-r from-[#b07a9a] to-[#d8508a]
                   backdrop-blur-2xl border border-white/20
                   shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        {/* Close */}
        <button
          onClick={closePlayer}
          title="បិទ"
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full
                     bg-red-500 hover:bg-red-600 text-white
                     grid place-items-center shadow-lg z-10 transition-all hover:scale-110"
        >
          <FiX className="text-sm" />
        </button>

        {/* Cover */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/20">
          {cover ? (
            <img
              src={cover}
              alt={current.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-white/50">
              ♪
            </div>
          )}
        </div>

        {/* Info + Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-bold text-sm truncate flex-1">
              {current.title}
            </p>
            {/* ✅ Queue Info */}
            {queue.length > 1 && (
              <span className="flex items-center gap-1 text-[10px] text-white/70 bg-black/20 px-2 py-0.5 rounded-full shrink-0">
                <FiList className="text-[9px]" />
                {index + 1}/{queue.length}
              </span>
            )}
          </div>
          <p className="text-white/70 text-xs truncate">{artistName}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-white/70 tabular-nums w-8">
              {formatTime(currentTime)}
            </span>
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                seek(pct * (duration || 0));
              }}
              className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden cursor-pointer group"
            >
              <div
                className="h-full rounded-full bg-white group-hover:bg-white/90 transition-all"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-white/70 tabular-nums w-8 text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`hidden md:grid w-9 h-9 rounded-full place-items-center transition-all relative ${
              shuffle
                ? "bg-black/40 text-white ring-2 ring-white shadow-lg shadow-black/40"
                : "bg-white/10 hover:bg-white/20 text-white/60"
            }`}
          >
            <FiShuffle className="text-sm" />
            {shuffle && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white ring-2 ring-[#d8508a]" />
            )}
          </button>

          {/* Previous */}
          <button
            onClick={playPrev}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 
                       grid place-items-center text-white transition-all"
          >
            <FiSkipBack className="text-sm" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-white text-[#d8508a] 
                       grid place-items-center hover:scale-105 shadow-lg transition-all"
          >
            {playing ? (
              <FiPause className="text-lg" />
            ) : (
              <FiPlay className="text-lg ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 
                       grid place-items-center text-white transition-all"
          >
            <FiSkipForward className="text-sm" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`hidden md:grid w-9 h-9 rounded-full place-items-center transition-all relative ${
              repeat
                ? "bg-black/40 text-white ring-2 ring-white shadow-lg shadow-black/40"
                : "bg-white/10 hover:bg-white/20 text-white/60"
            }`}
          >
            <FiRepeat className="text-sm" />
            {repeat && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white ring-2 ring-[#d8508a]" />
            )}
          </button>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-1 ml-1">
            {volume > 0 ? (
              <FiVolume2 className="text-white/70 text-sm" />
            ) : (
              <FiVolumeX className="text-white/70 text-sm" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 accent-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
