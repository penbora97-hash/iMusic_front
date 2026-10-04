// src/components/common/Navbar.jsx
import Avatar from "./Avatar";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext"; // ✅ បន្ថែម
import * as songService from "../../services/songService";
import SearchSuggestions from "./SearchSuggestions";
import {
  FiSearch,
  FiHeart,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
  FiLayout,
  FiLogIn,
  FiUserPlus,
  FiUserCheck,
  FiMusic,
  FiSun, // ✅ បន្ថែម
  FiMoon, // ✅ បន្ថែម
} from "react-icons/fi";

const links = [
  ["/", "Home"],
  ["/artists", "Artist"],
  ["/playlist", "Playlist"],
  ["/charts", "Charts"],
  ["/about", "About Us"],
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // ✅ បន្ថែម
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop = searchRef.current?.contains(e.target);
      const inMobile = mobileSearchRef.current?.contains(e.target);
      if (!inDesktop && !inMobile) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const all = await songService.list();
        const filtered = all
          .filter((s) =>
            `${s.title} ${s.artist?.name}`
              .toLowerCase()
              .includes(q.toLowerCase()),
          )
          .slice(0, 6);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [q]);

  const search = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav("/search?q=" + encodeURIComponent(q));
    setShowSuggestions(false);
    setMobileOpen(false);
  };

  const closeSuggestions = () => {
    setShowSuggestions(false);
    setMobileOpen(false);
  };

  const linkCls = ({ isActive }) =>
    `relative pb-1.5 text-[15px] font-semibold tracking-wide transition-colors ${
      isActive
        ? "text-white after:absolute after:left-0 after:right-0 after:-bottom-0 after:h-[2px] after:bg-gradient-to-r after:from-[#e0a0c0] after:to-[#b07a9a] after:rounded-full"
        : "text-white/75 hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-3 z-40 mx-3 mt-3">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 rounded-full
                   bg-white/10 backdrop-blur-2xl border border-white/20
                   shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 group"
          onClick={() => setMobileOpen(false)}
        >
          <span className="w-9 h-9 rounded-lg bg-white/15 border border-white/20 grid place-items-center text-white group-hover:bg-white/25 transition-all">
            <FiMusic className="text-base" />
          </span>
          <span className="text-[22px] font-extrabold tracking-tight leading-none">
            i<span className="text-orange-500">Music</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 ml-6">
          {links.map(([to, l]) => (
            <NavLink key={to} to={to} end className={linkCls}>
              {l}
            </NavLink>
          ))}
        </div>

        {/* Desktop Search */}
        <div ref={searchRef} className="ml-auto hidden md:block relative">
          <form onSubmit={search}>
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 text-lg pointer-events-none" />
            <input
              className="w-64 lg:w-80 pl-12 pr-5 py-3 rounded-full text-[15px] font-medium
                         bg-white/10 border border-white/20 text-white placeholder-white/50
                         outline-none backdrop-blur-xl
                         focus:bg-white/15 focus:border-[#e0a0c0]/60
                         transition-all duration-200"
              placeholder="Search songs..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => q.trim() && setShowSuggestions(true)}
            />
          </form>

          {showSuggestions && (
            <SearchSuggestions
              results={suggestions}
              query={q}
              loading={loadingSuggestions}
              onClose={closeSuggestions}
            />
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* ✅ Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            aria-label="Toggle Theme"
            className="w-11 h-11 rounded-full bg-white/10 border border-white/20 grid place-items-center
                       text-white/80 hover:text-[#e0a0c0] hover:bg-white/20 hover:border-[#b07a9a]/40 
                       transition-all active:scale-90"
          >
            {theme === "dark" ? (
              <FiSun className="text-lg" />
            ) : (
              <FiMoon className="text-lg" />
            )}
          </button>

          {user && (
            <>
              {/* ✅ Favorites Button */}
              <Link
                to="/favorites"
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 grid place-items-center
                           text-white/80 hover:text-pink-300 hover:bg-white/20 hover:border-pink-400/40 
                           transition-all"
                title="Favorites"
              >
                <FiHeart className="text-lg" />
              </Link>

              {/* ✅ Following Button */}
              <Link
                to="/following"
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 grid place-items-center
                           text-white/80 hover:text-[#e0a0c0] hover:bg-white/20 hover:border-[#b07a9a]/40 
                           transition-all"
                title="Following"
              >
                <FiUserCheck className="text-lg" />
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 h-11 rounded-full text-[14px] font-semibold
                         bg-white/10 border border-white/20 text-white/90
                         hover:bg-white/20 hover:border-white/30 transition-all"
            >
              <FiLayout className="text-base" />
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" title="Profile" className="group">
                <div className="rounded-full ring-2 ring-white/20 group-hover:ring-[#e0a0c0]/70 transition-all">
                  <Avatar user={user} size={42} />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 grid place-items-center
                           text-white/80 hover:text-red-300 hover:bg-red-500/15 hover:border-red-400/40 
                           transition-all"
                title="Logout"
              >
                <FiLogOut className="text-lg" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 h-11 rounded-full text-[14px] font-semibold
                           text-white/85 hover:text-white hover:bg-white/10 transition-all"
              >
                <FiLogIn className="text-base" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 h-11 rounded-full text-[14px] font-bold
                           text-white bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                           hover:from-[#c08aaa] hover:to-[#9a6a8a]
                           shadow-lg shadow-[#b07a9a]/30 hover:shadow-[#b07a9a]/50 transition-all"
              >
                <FiUserPlus className="text-base" />
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden ml-auto w-11 h-11 rounded-full bg-white/10 border border-white/20
                     grid place-items-center text-white/85 hover:bg-white/20 transition-all"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <FiX className="text-lg" />
          ) : (
            <FiMenu className="text-lg" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden max-w-7xl mx-auto mt-3 rounded-3xl p-5 space-y-4
                     bg-white/10 backdrop-blur-2xl border border-white/20
                     shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        >
          <div ref={mobileSearchRef} className="relative">
            <form onSubmit={search}>
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 text-lg pointer-events-none" />
              <input
                className="w-full pl-12 pr-5 py-3.5 rounded-full text-[15px] font-medium
                           bg-white/10 border border-white/20 text-white placeholder-white/50
                           outline-none focus:bg-white/15 focus:border-[#e0a0c0]/60 transition-all"
                placeholder="Search songs..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => q.trim() && setShowSuggestions(true)}
              />
            </form>

            {showSuggestions && (
              <SearchSuggestions
                results={suggestions}
                query={q}
                loading={loadingSuggestions}
                onClose={closeSuggestions}
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            {links.map(([to, l]) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-5 py-3 rounded-2xl text-[15px] font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#b07a9a]/40 to-transparent text-white border-l-2 border-[#e0a0c0]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {l}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-white/15 space-y-2">
            {/* ✅ Theme Toggle (Mobile) */}
            <button
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-[15px] font-semibold 
                         text-white/80 hover:bg-white/10 hover:text-white transition-all text-left"
            >
              {theme === "dark" ? (
                <>
                  <FiSun /> Light Mode
                </>
              ) : (
                <>
                  <FiMoon /> Dark Mode
                </>
              )}
            </button>

            {user ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[15px] font-semibold 
                               text-white/80 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <FiLayout /> Dashboard
                  </Link>
                )}

                {/* ✅ Favorites */}
                <Link
                  to="/favorites"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[15px] font-semibold 
                             text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  <FiHeart /> Favorites
                </Link>

                {/* ✅ Following */}
                <Link
                  to="/following"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[15px] font-semibold 
                             text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  <FiUserCheck /> Following
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[15px] font-semibold 
                             text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  <FiUser /> Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-[15px] font-semibold 
                             text-red-300 hover:bg-red-500/15 transition-all text-left"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[15px] font-semibold 
                             text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  <FiLogIn /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-[15px] 
                             font-bold text-white bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a] 
                             shadow-lg shadow-[#b07a9a]/30 transition-all"
                >
                  <FiUserPlus /> Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
