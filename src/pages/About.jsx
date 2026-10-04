// src/pages/About.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMusic,
  FiMic,
  FiHeart,
  FiHeadphones,
  FiUsers,
  FiPlay,
  FiArrowRight,
  FiGithub,
  FiMail,
  FiInstagram,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function About() {
  // ✅ State សម្រាប់ Stats
  const [stats, setStats] = useState({
    songs: 0,
    artists: 0,
    plays: 0,
    loading: true,
  });

  // ✅ ទាញ Data ពិតពី API
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/songs`)
        .then((r) => r.json())
        .catch(() => []),
      fetch(`${API}/api/artists`)
        .then((r) => r.json())
        .catch(() => []),
    ])
      .then(([songsData, artistsData]) => {
        const songs = Array.isArray(songsData) ? songsData : [];
        const artists = Array.isArray(artistsData) ? artistsData : [];
        const totalPlays = songs.reduce(
          (sum, s) => sum + (s.play_count || 0),
          0,
        );

        setStats({
          songs: songs.length,
          artists: artists.length,
          plays: totalPlays,
          loading: false,
        });
      })
      .catch(() => setStats((s) => ({ ...s, loading: false })));
  }, []);

  // ✅ Format Numbers (1000 → 1K)
  const formatNumber = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  const statsDisplay = [
    { n: stats.loading ? "..." : formatNumber(stats.songs), l: "Songs" },
    { n: stats.loading ? "..." : formatNumber(stats.artists), l: "Artists" },
    { n: stats.loading ? "..." : formatNumber(stats.plays), l: "Plays" },
    { n: "24/7", l: "Available" },
  ];

  const features = [
    {
      icon: <FiMusic />,
      title: "Free Music",
      desc: "ស្តាប់ចម្រៀងដោយសេរី គ្មានការរឹតបន្តឹង",
    },
    {
      icon: <FiMic />,
      title: "Local Artists",
      desc: "គាំទ្រសិល្បករកម្ពុជា និងអន្តរជាតិ",
    },
    {
      icon: <FiHeart />,
      title: "Favorites",
      desc: "រក្សាចម្រៀងដែលអ្នកចូលចិត្តទុកមើលពេលក្រោយ",
    },
    {
      icon: <FiHeadphones />,
      title: "Any Device",
      desc: "ស្តាប់បានគ្រប់ឧបករណ៍ — ទូរស័ព្ទ កុំព្យូទ័រ តាប់ប្លេត",
    },
  ];

  // ✅ Contact List
  const contacts = [
    {
      icon: <FiMail />,
      href: "mailto:musicworld@gmail.com",
      label: "Email",
      value: "musicworld@gmail.com",
      color: "hover:text-[#e0a0c0]",
    },
    {
      icon: <FaTelegramPlane />,
      href: "https://t.me/pen_bora",
      target: "_blank",
      label: "Telegram",
      value: "@pen_bora",
      color: "hover:text-sky-400",
    },
    {
      icon: <FiInstagram />,
      href: "#",
      target: "_blank",
      label: "Instagram",
      value: "@imusic.app",
      color: "hover:text-pink-400",
    },
    {
      icon: <FiGithub />,
      href: "#",
      target: "_blank",
      label: "GitHub",
      value: "github.com/imusic",
      color: "hover:text-white",
    },
  ];

  return (
    <div className="relative py-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#b07a9a]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ===== HERO ===== */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl mb-6">
            <FiMusic className="text-[#e0a0c0] text-sm" />
            <span className="text-xs font-semibold text-white/80 tracking-wide">
              About iMusic
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#e0a0c0] via-[#d8a0c0] to-[#b07a9a] bg-clip-text text-transparent">
              Music for Everyone
            </span>
          </h1>

          <p className="mt-6 text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
            iMusic ជាវេទិកាស្តាប់តន្ត្រីដោយសេរី។ អ្នកអាចស្វែងរក ស្តាប់
            និងរក្សាចម្រៀងដែលអ្នកចូលចិត្ត — គ្រប់ពេលវេលា គ្រប់ទីកន្លែង។
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-bold text-white
                         bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                         hover:from-[#c08aaa] hover:to-[#9a6a8a]
                         shadow-lg shadow-[#b07a9a]/30 transition-all"
            >
              <FiPlay className="text-sm" />
              ចាប់ផ្តើមស្តាប់
            </Link>

            <Link
              to="/artists"
              className="group flex items-center gap-3 px-5 py-3 rounded-full text-[15px] font-semibold
                         bg-white/5 border border-white/15 text-white/85 backdrop-blur-xl
                         hover:bg-white/10 hover:border-white/30 transition-all"
            >
              មើលសិល្បករ
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {statsDisplay.map(({ n, l }) => (
            <div
              key={l}
              className="rounded-2xl p-5 text-center
                         bg-white/5 border border-white/10 backdrop-blur-xl
                         hover:bg-white/10 hover:border-[#b07a9a]/30 transition-all"
            >
              <p
                className={`text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] bg-clip-text text-transparent ${
                  stats.loading ? "animate-pulse" : ""
                }`}
              >
                {n}
              </p>
              <p className="text-[11px] text-white/50 tracking-wider font-semibold mt-2 uppercase">
                {l}
              </p>
            </div>
          ))}
        </section>

        {/* ===== FEATURES ===== */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              អ្វីដែលអ្នកទទួលបាន
            </h2>
            <p className="text-white/50 mt-2 text-sm">
              លក្ខណៈពិសេសដែលធ្វើឱ្យ iMusic ពិសេស
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl
                           bg-white/5 border border-white/10 backdrop-blur-xl
                           hover:bg-white/10 hover:border-[#b07a9a]/30 hover:-translate-y-0.5
                           transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] grid place-items-center text-white shadow-lg shadow-[#b07a9a]/30 shrink-0">
                  <span className="text-lg">{f.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">{f.title}</p>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== OUR STORY ===== */}
        <section className="mb-16">
          <div
            className="relative overflow-hidden rounded-3xl p-8 md:p-10
                          bg-gradient-to-br from-[#b07a9a]/20 via-[#7a4a68]/10 to-transparent
                          border border-white/10"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#b07a9a]/20 blur-3xl" />

            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
                <FiUsers className="text-[#e0a0c0] text-xs" />
                <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase">
                  Our Story
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                បេសកកម្មរបស់យើង
              </h2>

              <p className="text-white/70 leading-relaxed mb-4">
                iMusic ត្រូវបានបង្កើតឡើងដោយក្រុមអ្នកស្រលាញ់តន្ត្រី
                ក្នុងគោលបំណងចែករំលែកតន្ត្រីដ៏ស្រស់ស្អាតទៅកាន់មនុស្សគ្រប់រូប។
              </p>

              <p className="text-white/70 leading-relaxed">
                Admin ជាអ្នកគ្រប់គ្រង និង Upload ចម្រៀងថ្មីៗ — ដើម្បីធានាថា
                អ្នកប្រើប្រាស់ទទួលបានបទចម្រៀងដ៏ល្អបំផុតគ្រប់ពេលវេលា។
              </p>
            </div>
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <section className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white">
              ទំនាក់ទំនងយើង
            </h2>
            <p className="text-white/50 mt-2 text-sm">
              មានសំណួរ ឬចង់ផ្តល់យោបល់? ផ្ញើសារមកយើង
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contacts.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.target || "_self"}
                rel={c.target === "_blank" ? "noopener noreferrer" : undefined}
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl
                           bg-white/5 border border-white/10 backdrop-blur-xl
                           ${c.color}
                           hover:bg-white/10 hover:border-[#b07a9a]/30 hover:-translate-y-0.5
                           transition-all text-center`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] grid place-items-center text-white shadow-lg shadow-[#b07a9a]/30 group-hover:scale-110 transition-transform">
                  <span className="text-lg">{c.icon}</span>
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-[11px] font-semibold text-white/50 tracking-wider uppercase">
                    {c.label}
                  </p>
                  <p className="text-[12px] text-white font-medium mt-1 truncate">
                    {c.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="text-center py-10">
          <div
            className="relative overflow-hidden rounded-3xl p-10
                          bg-gradient-to-br from-[#b07a9a]/30 via-[#7a4a68]/20 to-transparent
                          border border-white/10"
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#b07a9a]/30 blur-3xl" />

            <div className="relative">
              <FiMusic className="text-[#e0a0c0] text-4xl mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                ត្រៀមខ្លួនស្តាប់ហើយឬនៅ?
              </h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                ចូលរួមជាមួយយើង ហើយស្វែងរកចម្រៀងដែលអ្នកចូលចិត្តឥឡូវនេះ
              </p>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-bold text-white
                           bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                           hover:from-[#c08aaa] hover:to-[#9a6a8a]
                           shadow-lg shadow-[#b07a9a]/30 transition-all"
              >
                <FiPlay className="text-sm" />
                ចាប់ផ្តើមស្តាប់ឥឡូវ
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
