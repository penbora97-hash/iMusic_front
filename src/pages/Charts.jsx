// src/pages/Charts.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { asset } from "../services/api";
import * as songService from "../services/songService";
import { SkeletonSongGrid } from "../components/common/Skeleton";
import { usePlayer } from "../context/PlayerContext";
import {
  FiTrendingUp,
  FiMusic,
  FiMic,
  FiPlay,
  FiAward,
  FiArrowLeft,
  FiHeadphones,
} from "react-icons/fi";

export default function Charts() {
  const [data, setData] = useState({ top_songs: [], top_artists: [] });
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    setLoading(true);
    songService
      .topCharts()
      .then((data) => setData(data))
      .catch(() => setData({ top_songs: [], top_artists: [] }))
      .finally(() => setLoading(false));
  }, []);

  const { top_songs, top_artists } = data;

  return (
    <div className="relative py-8">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#b07a9a]/20 blur-3xl" />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-[#b07a9a]/10 blur-3xl" />
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
            <FiTrendingUp className="text-[#e0a0c0] text-xs" />
            <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase">
              Top Charts
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Trending{" "}
            <span className="bg-gradient-to-r from-[#e0a0c0] to-[#b07a9a] bg-clip-text text-transparent">
              Now
            </span>
          </h1>
          <p className="text-white/50 mt-3 text-[15px]">
            ចម្រៀង និងសិល្បករពេញនិយមបំផុត
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <SkeletonSongGrid count={10} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ===== Top 10 Songs ===== */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#e0a0c0] to-[#b07a9a]" />
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiAward className="text-[#e0a0c0]" />
                  Top 10 Songs
                </h2>
              </div>

              {top_songs.length === 0 ? (
                <p className="text-white/50 text-sm">មិនទាន់មានទិន្នន័យ</p>
              ) : (
                <div className="space-y-2">
                  {top_songs.map((song, i) => {
                    const cover = asset(
                      song.cover_url || song.artist?.image_url,
                    );
                    return (
                      <div
                        key={song.id}
                        onClick={() => playSong(song, top_songs)}
                        className="group flex items-center gap-3 p-3 rounded-2xl
                                   bg-white/5 border border-white/10 backdrop-blur-xl
                                   hover:bg-white/10 hover:border-[#b07a9a]/30 
                                   cursor-pointer transition-all"
                      >
                        {/* Rank */}
                        <div
                          className={`w-8 h-8 rounded-lg grid place-items-center text-sm font-bold shrink-0 ${
                            i === 0
                              ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg"
                              : i === 1
                                ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                                : i === 2
                                  ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                                  : "bg-white/5 text-white/40"
                          }`}
                        >
                          {i + 1}
                        </div>

                        {/* Cover */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#b07a9a]/30 to-[#7a4a68]/30 border border-white/10 grid place-items-center shrink-0">
                          {cover ? (
                            <img
                              src={cover}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiMusic className="text-white/50" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate group-hover:text-[#e0a0c0] transition-colors">
                            {song.title}
                          </p>
                          <p className="text-xs text-white/50 truncate">
                            {song.artist?.name || "Unknown"}
                          </p>
                        </div>

                        {/* Play Count */}
                        <span className="flex items-center gap-1 text-xs text-[#d8a0c0] shrink-0">
                          <FiPlay className="text-[10px]" />
                          {song.play_count || 0}
                        </span>

                        {/* Play Icon on hover */}
                        <FiPlay className="text-white/30 group-hover:text-[#e0a0c0] transition-colors shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ===== Top Artists ===== */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#e0a0c0] to-[#b07a9a]" />
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiMic className="text-[#e0a0c0]" />
                  Top Artists
                </h2>
              </div>

              {top_artists.length === 0 ? (
                <p className="text-white/50 text-sm">មិនទាន់មានទិន្នន័យ</p>
              ) : (
                <div className="space-y-2">
                  {top_artists.map((artist, i) => {
                    const img = asset(artist.image_url);
                    return (
                      <Link
                        key={artist.id}
                        to={`/artists/${artist.id}`}
                        className="group flex items-center gap-3 p-3 rounded-2xl
                                   bg-white/5 border border-white/10 backdrop-blur-xl
                                   hover:bg-white/10 hover:border-[#b07a9a]/30 transition-all"
                      >
                        {/* Rank */}
                        <div
                          className={`w-6 h-6 rounded-md grid place-items-center text-xs font-bold shrink-0 ${
                            i === 0
                              ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
                              : i === 1
                                ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                                : i === 2
                                  ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                                  : "bg-white/5 text-white/40"
                          }`}
                        >
                          {i + 1}
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] grid place-items-center text-white font-bold shrink-0">
                          {img ? (
                            <img
                              src={img}
                              alt={artist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            artist.name?.[0]?.toUpperCase()
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate group-hover:text-[#e0a0c0] transition-colors text-sm">
                            {artist.name}
                          </p>
                          <p className="text-[11px] text-white/50 truncate flex items-center gap-1">
                            <FiHeadphones className="text-[10px]" />
                            {artist.total_plays} plays
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
