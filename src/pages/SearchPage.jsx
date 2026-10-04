// src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SongList from "../components/song/SongList";
import * as songService from "../services/songService";
import { FiSearch, FiArrowLeft, FiMusic } from "react-icons/fi";

export default function SearchPage() {
  const [sp] = useSearchParams();
  const q = (sp.get("q") || "").toLowerCase();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    songService
      .list()
      .then(setAll)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const songs = all.filter((s) =>
    `${s.title} ${s.artist?.name}`.toLowerCase().includes(q),
  );

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#b07a9a]/10 blur-3xl" />
      </div>

      <div className="relative z-10 py-8">
        {/* Back Button */}
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
            <FiSearch className="text-[#e0a0c0] text-xs" />
            <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase">
              Search Results
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            លទ្ធផលស្វែងរក{" "}
            <span className="bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] bg-clip-text text-transparent">
              "{sp.get("q")}"
            </span>
          </h1>

          <p className="text-white/50 mt-3 text-[15px]">
            រកឃើញ{" "}
            <span className="text-[#e0a0c0] font-bold">{songs.length}</span>{" "}
            ចម្រៀង
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-white/10" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-white/10" />
                  <div className="h-2 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : songs.length > 0 ? (
          <SongList songs={songs} />
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 grid place-items-center mx-auto mb-5">
              <FiMusic className="text-white/30 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              រកមិនឃើញចម្រៀង
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              គ្មានចម្រៀងដែលត្រូវនឹង "{sp.get("q")}" ទេ។
              សូមព្យាយាមស្វែងរកដោយពាក្យផ្សេង។
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold
                         text-white bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                         hover:from-[#c08aaa] hover:to-[#9a6a8a]
                         shadow-lg shadow-[#b07a9a]/30 transition-all"
            >
              ត្រលប់ទៅទំព័រដើម
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
