// src/components/common/Footer.jsx
import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiGithub,
  FiArrowUpRight,
  FiMusic,
} from "react-icons/fi";
import { FaGithub, FaTelegramPlane } from "react-icons/fa";

const linkCls =
  "flex items-center gap-2 text-white/70 hover:text-[#e0a0c0] transition-all duration-200 group";

// ✅ Social Links ពិតប្រាកដ
const SOCIALS = [
  {
    icon: <FiFacebook />,
    href: "https://www.facebook.com/share/1DiHMV5DLf/",
    label: "Facebook",
    color: "hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-500/10",
  },
  {
    icon: <FiInstagram />,
    href: "https://instagram.com/imusic.app",
    label: "Instagram",
    color: "hover:text-pink-400 hover:border-pink-400/30 hover:bg-pink-500/10",
  },

  {
    icon: <FiGithub />,
    href: "https://github.com/penbora97-hash", 
    label: "GitHub",
    color: "hover:text-white hover:border-white/30 hover:bg-white/10",
  },
  {
    icon: <FaTelegramPlane />,
    href: "https://t.me/pen_bora",
    label: "Telegram",
    color: "hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-500/10",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-3 mt-16 mb-6">
      {/* ===== Main Footer Card ===== */}
      <div
        className="max-w-7xl mx-auto rounded-3xl px-8 py-10
                   bg-white/10 backdrop-blur-2xl border border-white/20
                   shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                   grid gap-10 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* ===== Brand Column ===== */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-lg bg-white/15 border border-white/20 grid place-items-center text-white group-hover:bg-white/25 transition-all">
              <FiMusic className="text-base" />
            </span>
            <span className="text-[22px] font-extrabold tracking-tight leading-none">
              i<span className="text-orange-500">Music</span>
            </span>
          </Link>

          <p className="mt-4 text-[15px] leading-relaxed text-white/65">
            Music connects emotions, tells stories, and brings people together.
            Discover sounds that move your soul.
          </p>

          {/* ===== Social Icons ===== */}
          <div className="flex items-center gap-2.5 mt-6 flex-wrap">
            {SOCIALS.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                aria-label={s.label}
                className={`w-10 h-10 rounded-full bg-white/10 border border-white/15
                           grid place-items-center text-white/70 ${s.color}
                           hover:-translate-y-0.5
                           transition-all duration-200`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ===== Quick Links ===== */}
        <div>
          <h4 className="text-[15px] font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#e0a0c0] to-[#b07a9a]" />
            Quick Links
          </h4>
          <ul className="space-y-3">
            {[
              ["/", "Home"],
              ["/artists", "Artist"],
              ["/playlist", "Playlist"],
              ["/favorites", "Favorites"],
            ].map(([to, l]) => (
              <li key={to}>
                <Link to={to} className={linkCls}>
                  <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-[#e0a0c0] group-hover:w-3 transition-all" />
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Music Hub ===== */}
        <div>
          <h4 className="text-[15px] font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#e0a0c0] to-[#b07a9a]" />
            Music Hub
          </h4>
          <ul className="space-y-3">
            {[
              ["/about", "About Us"],
              ["/", "Latest Releases"],
              ["/register", "Sign up free"],
              ["/admin", "Dashboard"],
            ].map(([to, l]) => (
              <li key={to}>
                <Link to={to} className={linkCls}>
                  <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-[#e0a0c0] group-hover:w-3 transition-all" />
                  {l}
                  <FiArrowUpRight className="text-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Contact ===== */}
        <div>
          <h4 className="text-[15px] font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#e0a0c0] to-[#b07a9a]" />
            Contact Us
          </h4>
          <ul className="space-y-3">
            <li>
              <a href="mailto:musicworld@gmail.com" className={linkCls}>
                <span className="w-9 h-9 rounded-full bg-white/10 border border-white/15 grid place-items-center text-[#e0a0c0] group-hover:bg-[#b07a9a]/30 transition-all shrink-0">
                  <FiMail className="text-sm" />
                </span>
                <span className="text-[14px] truncate">
                  musicworld@gmail.com
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://t.me/pen_bora"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                <span className="w-9 h-9 rounded-full bg-white/10 border border-white/15 grid place-items-center text-sky-400 group-hover:bg-sky-500/20 transition-all shrink-0">
                  <FaTelegramPlane className="text-sm" />
                </span>
                <span className="text-[14px] truncate">@pen_bora</span>
              </a>
            </li>
            <li>
              <span className="flex items-center gap-2 text-white/70">
                <span className="w-9 h-9 rounded-full bg-white/10 border border-white/15 grid place-items-center text-[#e0a0c0] shrink-0">
                  <FiMapPin className="text-sm" />
                </span>
                <span className="text-[14px]">Phnom Penh, Cambodia</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== Copyright Bar ===== */}
      <div
        className="max-w-7xl mx-auto mt-4 rounded-full px-6 py-4
                   bg-white/5 backdrop-blur-xl border border-white/10
                   flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <p className="text-[13px] text-white/50 text-center sm:text-left">
          © {year}{" "}
          <span className="font-bold text-white">
            i<span className="text-orange-500">Music</span>
          </span>
          . All rights reserved.
        </p>

        <div className="flex items-center gap-5 text-[13px] text-white/50 flex-wrap justify-center">
          <Link
            to="/privacy"
            className="hover:text-[#e0a0c0] transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <Link to="/terms" className="hover:text-[#e0a0c0] transition-colors">
            Terms of Service
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <Link
            to="/contact"
            className="hover:text-[#e0a0c0] transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
