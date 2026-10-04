// src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SongList from "../components/song/SongList";
import { SkeletonSongGrid } from "../components/common/Skeleton"; // ✅ បន្ថែម
import * as songService from "../services/songService";
import { useAuth } from "../context/AuthContext";
import { FiHeart, FiArrowLeft } from "react-icons/fi";

export default function Favorites() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    songService
      .favorites()
      .then((data) => setSongs(Array.isArray(data) ? data : []))
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, [user]);

  // ===== Login Required =====
  if (!user) {
    return (
      <div className="py-20 text-center">
        <FiHeart className="text-white/30 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">
          សូម Login ដើម្បីមើល Favorites
        </h2>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full text-sm font-bold
                     text-white bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                     shadow-lg shadow-[#b07a9a]/30 transition-all"
        >
          Login ឥឡូវ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative py-8">
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
          <FiHeart className="text-pink-400 text-xs" />
          <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase">
            My Favorites
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          ចម្រៀងដែលខ្ញុំ{" "}
          <span className="bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] bg-clip-text text-transparent">
            ចូលចិត្ត
          </span>
        </h1>
        <p className="text-white/50 mt-3 text-[15px]">
          {loading ? (
            "កំពុងផ្ទុក..."
          ) : (
            <>
              មាន{" "}
              <span className="text-[#e0a0c0] font-bold">{songs.length}</span>{" "}
              ចម្រៀង
            </>
          )}
        </p>
      </div>

      {/* ✅ Skeleton Loading */}
      {loading ? (
        <SkeletonSongGrid count={8} />
      ) : songs.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 grid place-items-center mx-auto mb-5">
            <FiHeart className="text-white/30 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            មិនទាន់មានចម្រៀងចូលចិត្តទេ
          </h3>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            ចុចបេះដូងលើចម្រៀងដែលបងចូលចិត្ត វានឹងបង្ហាញនៅទីនេះ
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold
                       text-white bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                       shadow-lg shadow-[#b07a9a]/30 transition-all"
          >
            រកមើលចម្រៀង
          </Link>
        </div>
      ) : (
        <SongList
          songs={songs}
          onUnfav={(id) => setSongs((s) => s.filter((x) => x.id !== id))}
        />
      )}
    </div>
  );
}
