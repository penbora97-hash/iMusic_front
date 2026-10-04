// src/components/song/SongCard.jsx
import { asset } from "../../services/api";
import { FiHeart, FiPlay } from "react-icons/fi";

export default function SongCard({ song, active, onPlay, liked, onFav }) {
  const img = asset(song.cover_url) || asset(song.artist?.image_url);

  // ✅ ទាញ Artist Name
  const artistName = song.artist?.name || song.artist_name || "Unknown";

  return (
    <div
      className={`glass rounded-3xl p-4 group transition hover:-translate-y-1 ${
        active ? "ring-2 ring-white/70" : ""
      }`}
    >
      <div
        className="relative aspect-square rounded-2xl overflow-hidden mb-3 cursor-pointer"
        onClick={onPlay}
      >
        {img ? (
          <img
            src={img}
            alt={song.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "grid";
            }}
          />
        ) : null}
        <div
          className="w-full h-full grid place-items-center text-6xl font-bold bg-gradient-to-br from-fuchsia-500/60 to-cyan-400/60"
          style={{ display: img ? "none" : "grid" }}
        >
          {song.title?.[0]}
        </div>

        <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
          <span className="glass rounded-full w-14 h-14 grid place-items-center text-white text-2xl">
            <FiPlay className="ml-0.5" />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{song.title}</p>
          <p className="text-sm text-fuchsia-300 truncate">
            {artistName}
            {song.genre && " • " + song.genre.name}
          </p>
        </div>

        {onFav && (
          <button
            onClick={onFav}
            className={`text-xl transition-all hover:scale-110 ${
              liked ? "text-pink-400" : "text-white/40 hover:text-pink-400"
            }`}
          >
            <FiHeart className={liked ? "fill-pink-400" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}