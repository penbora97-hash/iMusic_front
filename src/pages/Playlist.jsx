// src/pages/Playlist.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { asset } from "../services/api";
import { SkeletonPlaylistGrid } from "../components/common/Skeleton"; // ✅ បន្ថែម
import {
  FiMusic,
  FiMic,
  FiPlay,
  FiArrowLeft,
  FiList,
  FiHeadphones,
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Playlist() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/artists`, { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((data) => setArtists(Array.isArray(data) ? data : []))
      .catch(() => setArtists([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative py-8">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#b07a9a]/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 
                     hover:text-[#e0a0c0] transition-colors mb-6 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          ត្រលប់ទៅទំព័រដើម
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
            <FiList className="text-[#e0a0c0] text-xs" />
            <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase">
              Playlists
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Artist{" "}
            <span className="bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] bg-clip-text text-transparent">
              Playlists
            </span>
          </h1>
          <p className="text-white/50 mt-3 text-[15px]">
            {loading ? (
              "កំពុងផ្ទុក..."
            ) : (
              <>
                មាន{" "}
                <span className="text-[#e0a0c0] font-bold">
                  {artists.length}
                </span>{" "}
                Playlist ពីសិល្បករ
              </>
            )}
          </p>
        </div>

        {/* ✅ Skeleton Loading */}
        {loading ? (
          <SkeletonPlaylistGrid count={6} />
        ) : artists.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 grid place-items-center mx-auto mb-5">
              <FiList className="text-white/30 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              មិនទាន់មាន Playlist ទេ
            </h3>
            <p className="text-white/50 text-sm">
              ពេលមានសិល្បករ Playlist នឹងបង្ហាញនៅទីនេះ
            </p>
          </div>
        ) : (
          /* Playlists Grid = Artists */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((a) => {
              const img = asset(a.image_url);
              return (
                <Link
                  key={a.id}
                  to={`/playlist/artist/${a.id}`}
                  className="group relative overflow-hidden rounded-3xl p-5
                             bg-gradient-to-br from-[#b07a9a]/20 via-[#7a4a68]/10 to-transparent
                             border border-white/10 hover:border-[#b07a9a]/50
                             transition-all hover:-translate-y-1"
                >
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#b07a9a]/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

                  <div className="relative flex items-center gap-4">
                    {/* Artist Avatar */}
                    <div className="relative w-20 h-20 shrink-0">
                      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[#b07a9a]/50 transition-all">
                        {img ? (
                          <img
                            src={img}
                            alt={a.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-2xl font-bold bg-gradient-to-br from-[#b07a9a]/60 to-[#7a4a68]/60 text-white">
                            {a.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Play Badge */}
                      <div
                        className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full
                                   bg-gradient-to-br from-[#b07a9a] to-[#7a4a68]
                                   grid place-items-center text-white shadow-lg
                                   opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
                                   transition-all"
                      >
                        <FiPlay className="text-xs ml-0.5" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-[#e0a0c0] tracking-wider uppercase mb-1 flex items-center gap-1">
                        <FiMic className="text-xs" />
                        Artist
                      </p>
                      <p className="text-xl font-extrabold text-white truncate">
                        {a.name}
                      </p>
                      <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                        <FiHeadphones className="text-xs" />
                        {a.songs_count || 0} ចម្រៀង
                      </p>
                    </div>

                    <FiPlay className="text-white/30 group-hover:text-[#e0a0c0] text-xl transition-colors shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}