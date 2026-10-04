// src/pages/Following.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { asset } from "../services/api";
import * as songService from "../services/songService";
import { SkeletonArtistGrid } from "../components/common/Skeleton"; // ✅ បន្ថែម
import { useAuth } from "../context/AuthContext";
import {
  FiArrowLeft,
  FiMic,
  FiMusic,
  FiPlay,
  FiUserPlus,
  FiSearch,
} from "react-icons/fi";

export default function Following() {
  const { user } = useAuth();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    songService
      .following()
      .then((data) => setArtists(Array.isArray(data) ? data : []))
      .catch(() => setArtists([]))
      .finally(() => setLoading(false));
  }, [user]);

  // ===== Login Required =====
  if (!user) {
    return (
      <div className="relative py-8">
        <div className="max-w-md mx-auto text-center py-20 glass rounded-3xl p-8">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 grid place-items-center mx-auto mb-5">
            <FiUserPlus className="text-white/30 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            សូម Login ដើម្បីមើល Following
          </h2>
          <p className="text-white/50 text-sm mb-6">
            ចុច Follow Artists ដែលអ្នកចូលចិត្ត ដើម្បីមើលនៅទីនេះ
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white
                       bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                       shadow-lg shadow-[#b07a9a]/30 transition-all"
          >
            Login ឥឡូវ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
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
            <FiUserPlus className="text-[#e0a0c0] text-xs" />
            <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase">
              Following
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Artists{" "}
            <span className="bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] bg-clip-text text-transparent">
              Following
            </span>
          </h1>
          <p className="text-white/50 mt-3 text-[15px]">
            {loading ? (
              "កំពុងផ្ទុក..."
            ) : (
              <>
                អ្នក Follow{" "}
                <span className="text-[#e0a0c0] font-bold">
                  {artists.length}
                </span>{" "}
                សិល្បករ
              </>
            )}
          </p>
        </div>

        {/* ✅ Skeleton Loading */}
        {loading ? (
          <SkeletonArtistGrid count={10} />
        ) : artists.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 grid place-items-center mx-auto mb-5">
              <FiMic className="text-white/30 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              មិនទាន់ Follow អ្នកណាទេ
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              ចូលទៅមើល Artists ហើយចុច Follow ដើម្បីតាមដានពួកគេ
            </p>
            <Link
              to="/artists"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white
                         bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                         shadow-lg shadow-[#b07a9a]/30 transition-all"
            >
              <FiSearch />
              រកមើល Artists
            </Link>
          </div>
        ) : (
          /* Artists Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artists.map((a) => {
              const img = asset(a.image_url);
              return (
                <Link
                  key={a.id}
                  to={`/playlist/artist/${a.id}`}
                  className="glass rounded-3xl p-4 text-center group
                             transition-all duration-300
                             hover:-translate-y-1 hover:bg-white/10
                             hover:ring-2 hover:ring-[#b07a9a]/40"
                >
                  {/* Avatar */}
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b07a9a]/40 to-[#7a4a68]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#b07a9a]/50 transition-all">
                      {img ? (
                        <img
                          src={img}
                          alt={a.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-4xl font-bold bg-gradient-to-br from-[#b07a9a]/60 to-[#7a4a68]/60 text-white">
                          {a.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Play Badge */}
                    <div
                      className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full
                                    bg-gradient-to-br from-[#b07a9a] to-[#7a4a68]
                                    grid place-items-center text-white
                                    shadow-lg shadow-[#b07a9a]/40
                                    opacity-0 group-hover:opacity-100
                                    scale-75 group-hover:scale-100
                                    transition-all duration-300"
                    >
                      <FiPlay className="text-sm ml-0.5" />
                    </div>
                  </div>

                  {/* Info */}
                  <p className="font-bold text-white truncate group-hover:text-[#e0a0c0] transition-colors">
                    {a.name}
                  </p>

                  <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                    <FiMusic className="text-[#e0a0c0] text-[10px]" />
                    <span className="text-[11px] text-white/60 font-medium">
                      {a.songs_count || 0} songs
                    </span>
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
