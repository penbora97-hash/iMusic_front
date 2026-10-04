import Avatar from "../components/common/Avatar";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiMusic,
  FiMic,          // ✅ បន្ថែម
  FiUploadCloud,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiArrowLeft,
  FiBell,
  FiSearch,
} from "react-icons/fi";

const items = [
  { path: "/admin", label: "Dashboard", icon: <FiGrid />, end: true },
  { path: "/admin/songs", label: "Songs", icon: <FiMusic /> },
  { path: "/admin/artists", label: "Artists", icon: <FiMic /> },   // ✅ បន្ថែម
  { path: "/admin/upload", label: "Upload", icon: <FiUploadCloud /> },
  { path: "/admin/users", label: "Users", icon: <FiUsers /> },
  { path: "/admin/settings", label: "Settings", icon: <FiSettings /> },
];

const cls = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
    isActive
      ? "bg-gradient-to-r from-[#b07a9a]/40 to-transparent text-white border-l-2 border-[#b07a9a]"
      : "text-white/60 hover:bg-white/5 hover:text-white"
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#0d0b10] text-white font-sans selection:bg-[#b07a9a] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#15111a] border-r border-white/5 p-5 hidden md:flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#b07a9a]/10 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] grid place-items-center font-bold text-lg">
            i
          </div>
          <div>
            <p className="text-xl font-extrabold leading-none">
              i<span className="text-orange-500">Music</span>
            </p>
            <span className="text-[10px] font-normal text-white/40 tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1 relative z-10">
          {items.map(({ path, label, icon, end }) => (
            <NavLink key={path} to={path} end={!!end} className={cls}>
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="space-y-1 pt-5 border-t border-white/5 relative z-10">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
          >
            <FiArrowLeft />
            Back to site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all text-left"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 bg-[#0d0b10]/80 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
          <div>
            <h1 className="text-xl font-semibold">
              Welcome, <span className="text-[#d8a0c0]">{user.username}</span>
            </h1>
            <p className="text-xs text-white/50 mt-0.5">
              Here's your music platform overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/5 focus-within:border-[#b07a9a]/50 transition-colors">
              <FiSearch className="text-white/40 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 w-40"
              />
            </div>

            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/5 grid place-items-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <FiBell />
            </button>

            <Link
              to="/admin/settings"
              title="Edit Profile"
              className="flex items-center gap-3 pl-2 border-l border-white/10 group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white group-hover:text-[#d8a0c0] transition-colors">
                  {user.username}
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Admin
                </p>
              </div>
              <div className="rounded-full ring-2 ring-[#b07a9a]/30 group-hover:ring-[#b07a9a]/60 transition-all">
                <Avatar user={user} size={40} />
              </div>
            </Link>
          </div>
        </header>

        {/* Mobile Nav */}
        <nav className="md:hidden flex gap-2 overflow-x-auto px-6 py-3 bg-[#15111a] border-b border-white/5">
          {items.map(({ path, label, icon, end }) => (
            <NavLink key={path} to={path} end={!!end} className={cls}>
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}