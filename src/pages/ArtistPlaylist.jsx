// src/pages/ArtistPlaylist.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { asset } from "../services/api";
import SongList from "../components/song/SongList";
import FollowButton from "../components/artist/FollowButton";
import { SkeletonSongGrid } from "../components/common/Skeleton";
import {
  FiArrowLeft,
  FiMusic,
  FiCalendar,
  FiMic,
  FiList,
  FiUsers,
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ArtistPlaylist() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);

  // ✅ DEBUG LOG
  console.log("🔥 ArtistPlaylist RENDERED — ID:", id);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    console.log("🎵 Fetching artist:", `${API}/api/artists/${id}`);

    fetch(`${API}/api/artists/${id}`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => {
        console.log("📡 Response status:", r.status);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        console.log("✅ Artist data loaded:", data);
        setArtist(data);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setArtist(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ===== Loading Skeleton =====
  if (loading) {
    return (
      <div className="relative py-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Back skeleton */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-4 h-4 rounded bg-white/5 animate-pulse" />
            <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
          </div>

          {/* Header skeleton */}
          <div className="rounded-3xl p-8 mb-8 bg-white/5 border border-white/10 animate-pulse">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 shrink-0" />
              <div className="flex-1 w-full space-y-4">
                <div className="h-3 w-24 rounded bg-white/10 mx-auto md:mx-0" />
                <div className="h-12 md:h-16 w-3/4 rounded bg-white/10 mx-auto md:mx-0" />
                <div className="flex gap-4 justify-center md:justify-start">
                  <div className="h-4 w-24 rounded bg-white/5" />
                  <div className="h-4 w-28 rounded bg-white/5" />
                </div>
                <div className="h-10 w-32 rounded-full bg-white/10 mx-auto md:mx-0" />
              </div>
            </div>
          </div>

          {/* Songs skeleton */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 rounded bg-white/10" />
            <div className="h-6 w-64 rounded bg-white/10 animate-pulse" />
          </div>
          <SkeletonSongGrid count={8} />
        </div>
      </div>
    );
  }

  // ===== Not Found =====
  if (!artist) {
    return (
      <div className="py-20 text-center">
        <FiMusic className="text-white/30 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">រកមិនឃើញ Playlist</h2>
        <Link to="/artists" className="text-[#e0a0c0] hover:underline text-sm">
          ត្រលប់ទៅ Artists
        </Link>
      </div>
    );
  }

  const img = asset(artist.image_url);
  const songs = artist.songs || [];

  return (
    <div className="relative py-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        {img && (
          <div
            className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
            }}
          />
        )}
      </div>

      <div className="relative z-10">
        {/* Back */}
        <Link
          to="/artists"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 
                     hover:text-[#e0a0c0] transition-colors mb-6 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          ត្រលប់ទៅ Artists
        </Link>

        {/* Artist Header */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 mb-8
                     bg-gradient-to-br from-[#b07a9a]/20 via-[#7a4a68]/10 to-transparent
                     border border-white/10"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#b07a9a]/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#b07a9a]/30 shadow-2xl shadow-[#b07a9a]/30 shrink-0">
              {img ? (
                <img
                  src={img}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] text-white font-bold text-6xl">
                  {artist.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-[11px] font-semibold text-white/50 tracking-wider uppercase mb-2 flex items-center justify-center md:justify-start gap-1">
                <FiMic className="text-[#e0a0c0]" />
                Playlist • Artist
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                {artist.name}
              </h1>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <FiMusic className="text-[#e0a0c0]" />
                  {songs.length} ចម្រៀង
                </span>
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <FiUsers className="text-[#e0a0c0]" />
                  {followersCount.toLocaleString()} Followers
                </span>
                {artist.created_at && (
                  <span className="flex items-center gap-1.5 text-sm text-white/60">
                    <FiCalendar className="text-[#e0a0c0]" />
                    {new Date(artist.created_at).toLocaleDateString("km-KH")}
                  </span>
                )}
              </div>

              {artist.bio && (
                <p className="text-white/70 mt-4 max-w-2xl">{artist.bio}</p>
              )}

              {/* Follow Button */}
              <div className="mt-5 flex justify-center md:justify-start">
                <FollowButton
                  artistId={artist.id}
                  onCountChange={setFollowersCount}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Songs */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#e0a0c0] to-[#b07a9a]" />
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FiList className="text-[#e0a0c0]" />
                ចម្រៀងទាំងអស់របស់ {artist.name}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/60">
              {songs.length} បទ
            </span>
          </div>

          {songs.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-white/5 border border-dashed border-white/10">
              <FiMusic className="text-white/20 text-5xl mx-auto mb-4" />
              <p className="text-white/50">មិនទាន់មានចម្រៀងទេ</p>
            </div>
          ) : (
            <SongList songs={songs} />
          )}
        </div>
      </div>
    </div>
  );
}
