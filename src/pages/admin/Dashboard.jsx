// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, LineChart, Badge } from "../../components/admin/ui";
import * as admin from "../../services/adminService";
import {
  FiMusic,
  FiUsers,
  FiMic,
  FiPlay,
  FiArrowRight,
  FiPlus,
} from "react-icons/fi";

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    admin
      .stats()
      .then(setS)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-rose-300">❌ {err}</p>;
  if (!s) return <p className="text-white/50">កំពុងផ្ទុក...</p>;

  // ✅ Stats ជាមួយ Icon និង Link
  const cards = [
    {
      label: "Songs",
      value: s.songs,
      icon: <FiMusic />,
      link: "/admin/songs",
      color: "from-[#b07a9a] to-[#7a4a68]",
    },
    {
      label: "Artists",
      value: s.artists,
      icon: <FiMic />,
      link: "/admin/artists",
      color: "from-[#7a4a68] to-[#b07a9a]",
    },
    {
      label: "Users",
      value: s.users,
      icon: <FiUsers />,
      link: "/admin/users",
      color: "from-[#b07a9a]/80 to-[#7a4a68]/80",
    },
    {
      label: "Total Plays",
      value: s.plays,
      icon: <FiPlay />,
      link: null,
      color: "from-[#7a4a68]/80 to-[#b07a9a]/80",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ===== Quick Actions ===== */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to="/admin/artists"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                     bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a] text-white
                     shadow-lg shadow-[#b07a9a]/30 hover:from-[#c08aaa] transition-all"
        >
          <FiMic />
          គ្រប់គ្រង Artists
        </Link>
        <Link
          to="/admin/upload"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                     bg-white/5 border border-white/10 text-white/80
                     hover:bg-white/10 hover:text-white transition-all"
        >
          <FiPlus />
          Upload ចម្រៀង
        </Link>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon, link, color }) => {
          const Wrapper = link ? Link : "div";
          return (
            <Wrapper
              key={label}
              {...(link ? { to: link } : {})}
              className={`block transition-all ${
                link ? "hover:-translate-y-0.5 cursor-pointer" : ""
              }`}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50">{label}</p>
                    <p className="text-3xl font-bold mt-1">
                      {Number(value).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color}
                                grid place-items-center text-lg text-white
                                shadow-lg shadow-[#b07a9a]/20`}
                  >
                    {icon}
                  </span>
                </div>
              </Card>
            </Wrapper>
          );
        })}
      </div>

      {/* ===== Chart + Top Songs ===== */}
      <div className="grid xl:grid-cols-3 gap-5">
        <Card title="New Users · last 14 days" className="xl:col-span-2">
          <LineChart data={s.signups} />
        </Card>

        <Card
          title="Most Played"
          right={
            <Link
              to="/admin/songs"
              className="text-xs text-[#d8a0c0] hover:text-[#e0a0c0] flex items-center gap-1"
            >
              See all <FiArrowRight />
            </Link>
          }
        >
          {s.top_songs?.length ? (
            <ul className="space-y-3">
              {s.top_songs.map((t, i) => (
                <li key={t.id} className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg grid place-items-center text-xs font-bold
                                ${
                                  i === 0
                                    ? "bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] text-white"
                                    : "bg-white/5 text-white/40"
                                }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {t.title}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {t.artist?.name}
                    </p>
                  </div>
                  <span className="text-xs text-[#d8a0c0] flex items-center gap-1">
                    <FiPlay className="text-[10px]" />
                    {t.play_count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/50 text-sm">មិនទាន់មានទិន្នន័យ</p>
          )}
        </Card>
      </div>

      {/* ===== Recent Users ===== */}
      <Card
        title="Recent Users"
        right={
          <Link
            to="/admin/users"
            className="text-xs text-[#d8a0c0] hover:text-[#e0a0c0] flex items-center gap-1"
          >
            See all <FiArrowRight />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/40 text-left">
              <tr>
                <th className="py-2 font-medium">Name</th>
                <th className="font-medium">Email</th>
                <th className="font-medium">Role</th>
                <th className="font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {s.recent_users.map((u) => (
                <tr key={u.id} className="border-t border-white/5">
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="text-white/60">{u.email}</td>
                  <td>
                    <Badge ok={u.role === "admin"}>{u.role}</Badge>
                  </td>
                  <td className="text-white/60">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
