// src/components/common/SearchSuggestions.jsx
import { Link } from "react-router-dom";
import { asset } from "../../services/api";
import { FiMusic, FiSearch, FiArrowRight, FiPlay } from "react-icons/fi";

export default function SearchSuggestions({
  results = [],
  query,
  onClose,
  loading,
}) {
  if (!query?.trim()) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden
                 bg-[#1a1520]/95 backdrop-blur-2xl border border-white/20
                 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50"
    >
      {loading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-white/10" />
                <div className="h-2 w-20 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 grid place-items-center mx-auto mb-3">
            <FiSearch className="text-white/40 text-xl" />
          </div>
          <p className="text-sm text-white/60">រកមិនឃើញចម្រៀង "{query}"</p>
        </div>
      ) : (
        <>
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              ចម្រៀងដែលពាក់ព័ន្ធ
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((song) => {
              // ✅ ទាញ Cover ពី cover_url ឬ artist.image_url
              const cover =
                asset(song.cover_url) || asset(song.artist?.image_url);

              return (
                <Link
                  key={song.id}
                  to={`/song/${song.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-xl
                             hover:bg-white/10 transition-all group"
                >
                  {/* Cover */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-[#b07a9a]/30 to-[#7a4a68]/30 border border-white/10 grid place-items-center relative">
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
                      <FiMusic className="text-white/50 text-lg" />
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 grid place-items-center transition-opacity">
                      <FiPlay className="text-white text-sm" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-white truncate group-hover:text-[#e0a0c0] transition-colors">
                      {song.title}
                    </p>
                    <p className="text-[12px] text-white/50 truncate">
                      {song.artist?.name || "Unknown Artist"}
                    </p>
                  </div>

                  <FiArrowRight className="text-white/30 group-hover:text-[#e0a0c0] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>

          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="flex items-center justify-between gap-2 px-4 py-3 
                       border-t border-white/10 bg-gradient-to-r from-[#b07a9a]/20 to-transparent
                       hover:from-[#b07a9a]/30 transition-all group"
          >
            <span className="text-[13px] font-semibold text-white flex items-center gap-2">
              <FiSearch className="text-[#e0a0c0]" />
              មើលលទ្ធផលទាំងអស់ ({results.length})
            </span>
            <FiArrowRight className="text-[#e0a0c0] group-hover:translate-x-1 transition-transform" />
          </Link>
        </>
      )}
    </div>
  );
}
