// src/pages/admin/ArtistDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as songService from "../../services/songService";
import { asset } from "../../services/api";
import SongList from "../../components/song/SongList";
import { FiArrowLeft, FiMusic, FiPlus, FiCalendar } from "react-icons/fi";

export default function ArtistDetail() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    songService
      .getArtist(id)
      .then(setArtist)
      .catch(() => setArtist(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-white/60">កំពុងផ្ទុក...</div>;
  }

  if (!artist) {
    return (
      <div className="py-20 text-center">
        <FiMusic className="text-white/30 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">រកមិនឃើញ Artist</h2>
        <Link
          to="/admin/artists"
          className="text-[#e0a0c0] hover:underline text-sm"
        >
          ត្រលប់ទៅ Artists
        </Link>
      </div>
    );
  }

  const img = asset(artist.image_url);
  const songs = artist.songs || [];

  return (
    <div className="space-y-6">
      <Link
        to="/admin/artists"
        className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 
                   hover:text-[#e0a0c0] transition-colors group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        ត្រលប់ទៅ Artists
      </Link>

      <div className="relative overflow-hidden rounded-3xl p-8
                      bg-gradient-to-br from-[#b07a9a]/20 via-[#7a4a68]/10 to-transparent
                      border border-white/10">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#b07a9a]/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#b07a9a]/30 shadow-2xl shadow-[#b07a9a]/30 shrink-0">
            {img ? (
              <img
                src={img}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center bg-gradient-to-br from-[#b07a9a] to-[#7a4a68] text-white font-bold text-5xl">
                {artist.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {artist.name}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <FiMusic className="text-[#e0a0c0]" />
                {songs.length} ចម្រៀង
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

            <div className="mt-5 flex justify-center md:justify-start">
              <Link
                to="/admin/upload"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                           bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a]
                           shadow-lg shadow-[#b07a9a]/30 hover:from-[#c08aaa] transition-all"
              >
                <FiPlus />
                Upload ចម្រៀងថ្មី
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FiMusic className="text-[#e0a0c0]" />
            ចម្រៀងរបស់ {artist.name}
          </h2>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/60">
            {songs.length} បទ
          </span>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-white/5 border border-dashed border-white/10">
            <FiMusic className="text-white/20 text-4xl mx-auto mb-3" />
            <p className="text-white/50 text-sm mb-4">មិនទាន់មានចម្រៀងទេ</p>
            <Link
              to="/admin/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                         bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a] shadow-lg shadow-[#b07a9a]/30"
            >
              <FiPlus />
              Upload ចម្រៀងដំបូង
            </Link>
          </div>
        ) : (
          <SongList songs={songs} />
        )}
      </div>
    </div>
  );
}