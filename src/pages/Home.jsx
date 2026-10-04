// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SongList from "../components/song/SongList";
import { SkeletonSongGrid } from "../components/common/Skeleton";  // ✅ បន្ថែម
import * as songService from "../services/songService";
import {
  FiMusic,
  FiMic,
  FiDisc,
  FiPlay,
  FiArrowRight,
  FiHeadphones,
  FiRadio,
  FiSmartphone,
  FiHeart,
} from "react-icons/fi";

export default function Home() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);  // ✅ បន្ថែម
  const [heroOk, setHeroOk] = useState(true);

  useEffect(() => {
    setLoading(true);
    songService
      .list()
      .then(setAll)
      .catch(() => {})
      .finally(() => setLoading(false));  // ✅ បន្ថែម
  }, []);

  // ✅ បង្ហាញត្រឹម 7 បទថ្មីបំផុត
  const songs = all.slice(0, 7);

  const stats = [
    { icon: <FiMusic />, n: all.length, l: "SONGS" },
    {
      icon: <FiMic />,
      n: new Set(all.map((s) => s.artist_id)).size,
      l: "ARTISTS",
    },
    {
      icon: <FiDisc />,
      n: new Set(all.map((s) => s.genre_id).filter(Boolean)).size,
      l: "GENRES",
    },
  ];

  const features = [
    {
      icon: <FiHeadphones />,
      title: "Millions of Songs",
      sub: "Enjoy unlimited",
    },
    { icon: <FiRadio />, title: "Podcasts & Shows", sub: "Listen anytime" },
    { icon: <FiSmartphone />, title: "Any Device", sub: "Play everywhere" },
    { icon: <FiHeart />, title: "Personalized", sub: "Made just for you" },
  ];

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#b07a9a]/10 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative grid md:grid-cols-2 gap-10 items-center py-12 md:py-16">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl mb-6">
            <FiMusic className="text-[#e0a0c0] text-sm" />
            <span className="text-xs font-semibold text-white/80 tracking-wide">
              Music for every moment
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
            <span className="bg-gradient-to-r from-[#e0a0c0] via-[#d8a0c0] to-[#b07a9a] bg-clip-text text-transparent">
              Feel the Music
            </span>
            <br />
            <span className="text-white">Live the Moment</span>
          </h1>

          <p className="mt-6 text-white/70 max-w-lg text-lg leading-relaxed">
            Discover, Stream, and Share a World of Music at Your Fingertips.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a
              href="#songs"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-bold text-white
                         bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                         hover:from-[#c08aaa] hover:to-[#9a6a8a]
                         shadow-lg shadow-[#b07a9a]/30 transition-all"
            >
              <FiPlay className="text-sm" />
              Listen Now
            </a>

            <Link
              to="/playlist"
              className="group flex items-center gap-3 px-5 py-3 rounded-full text-[15px] font-semibold
                         bg-white/5 border border-white/15 text-white/85 backdrop-blur-xl
                         hover:bg-white/10 hover:border-white/30 transition-all"
            >
              <span className="w-9 h-9 rounded-full bg-white/10 grid place-items-center group-hover:bg-[#b07a9a]/30 transition-all">
                <FiArrowRight className="text-sm" />
              </span>
              Browse Playlists
            </Link>
          </div>

          {/* Stats — ✅ បន្ថែម Skeleton */}
          <div className="flex flex-wrap gap-4 mt-10">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl
                               bg-white/5 border border-white/10 backdrop-blur-xl animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <div className="space-y-2">
                      <div className="h-5 w-12 rounded bg-white/10" />
                      <div className="h-2 w-16 rounded bg-white/5" />
                    </div>
                  </div>
                ))
              : stats.map(({ icon, n, l }) => (
                  <div
                    key={l}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl
                               bg-white/5 border border-white/10 backdrop-blur-xl
                               hover:bg-white/10 hover:border-[#b07a9a]/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] grid place-items-center text-white shadow-lg">
                      {icon}
                    </div>
                    <div>
                      <p className="text-xl font-extrabold text-white leading-none">
                        {n}
                      </p>
                      <p className="text-[10px] text-white/50 tracking-wider font-semibold mt-1">
                        {l}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Hero Image / Vinyl Record */}
        <div className="relative flex justify-center items-center">
          {/* Glow ខាងក្រោយ */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-[#b07a9a]/40 to-[#7a4a68]/20 blur-3xl" />
          </div>

          {heroOk ? (
            <img
              src="/hero.png"
              alt="Hero"
              onError={() => setHeroOk(false)}
              className="relative max-h-[480px] object-contain drop-shadow-2xl"
            />
          ) : (
            /* ✅ Vinyl Record ស្អាត */
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b07a9a]/40 to-[#7a4a68]/20 blur-2xl" />

              {/* Vinyl Disc (បង្វិលស្រាល) */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#1a1015] via-[#0d0b10] to-[#1a1015] border-4 border-[#2a1a25] shadow-2xl shadow-[#b07a9a]/20 animate-[spin_12s_linear_infinite]">
                {/* Grooves (រង្វង់ជាច្រើន) */}
                <div className="absolute inset-4 rounded-full border border-white/5" />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-12 rounded-full border border-white/5" />
                <div className="absolute inset-16 rounded-full border border-white/5" />
                <div className="absolute inset-20 rounded-full border border-white/5" />
                <div className="absolute inset-24 rounded-full border border-white/10" />
                <div className="absolute inset-28 rounded-full border border-white/5" />
                <div className="absolute inset-32 rounded-full border border-white/5" />

                {/* Center Label (ពណ៌ផ្កាឈូក) */}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#e0a0c0] via-[#b07a9a] to-[#7a4a68] grid place-items-center shadow-xl">
                    <FiMusic className="text-white text-3xl md:text-4xl drop-shadow-lg" />
                  </div>
                </div>

                {/* Center Hole (កណ្តាល) */}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#0a0a0c] border-2 border-white/20" />
                </div>

                {/* Shine Effect (ពន្លឺ) */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>

              {/* Floating Music Notes */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl grid place-items-center text-[#e0a0c0] animate-bounce [animation-duration:3s]">
                <FiMusic className="text-lg" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl grid place-items-center text-[#e0a0c0] animate-bounce [animation-duration:4s] [animation-delay:1s]">
                <FiMusic className="text-sm" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 py-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-2xl
                       bg-white/5 border border-white/10 backdrop-blur-xl
                       hover:bg-white/10 hover:border-[#b07a9a]/30 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b07a9a]/30 to-[#7a4a68]/20 border border-[#b07a9a]/30 grid place-items-center text-[#e0a0c0] shrink-0">
              {f.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{f.title}</p>
              <p className="text-[11px] text-white/50 truncate">{f.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Songs (Latest 7) */}
      <section id="songs" className="pt-8 scroll-mt-24">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
              <FiMusic className="text-[#e0a0c0] text-xs" />
              <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase">
                Fresh Picks
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Latest{" "}
              <span className="bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] bg-clip-text text-transparent">
                Songs
              </span>
            </h2>
            <p className="text-white/50 text-sm mt-2">
              {loading
                ? "កំពុងផ្ទុក..."
                : `បង្ហាញត្រឹម ${songs.length} បទថ្មីបំផុត`}
            </p>
          </div>

          {/* ✅ Link ទៅ Playlist */}
          <Link
            to="/playlist"
            className="flex items-center gap-2 text-sm font-semibold text-[#e0a0c0] hover:text-white transition-colors group"
          >
            មើលទាំងអស់ក្នុង Playlist
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ✅ SongList ជាមួយ loading prop */}
        {loading ? (
          <SkeletonSongGrid count={7} />
        ) : (
          <SongList songs={songs} />
        )}
      </section>
    </div>
  );
}