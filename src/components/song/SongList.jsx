// src/components/song/SongList.jsx
import { useEffect, useState } from "react";
import SongCard from "./SongCard";
import { SkeletonSongGrid } from "../common/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { usePlayer } from "../../context/PlayerContext";
import * as songService from "../../services/songService";

export default function SongList({ songs = [], loading = false, onUnfav }) {
  const { user } = useAuth();
  const { current, playSong } = usePlayer();
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    if (user) {
      songService
        .favorites()
        .then((f) => setFavs((f || []).map((s) => s.id)))
        .catch(() => setFavs([]));
    } else {
      setFavs([]);
    }
  }, [user]);

  const fav = async (id) => {
    try {
      const r = await songService.toggleFav(id);
      setFavs((f) => (r.liked ? [...f, id] : f.filter((x) => x !== id)));
      if (!r.liked) onUnfav?.(id);
    } catch (e) {
      console.error("Toggle favorite failed:", e);
    }
  };

  // ✅ Loading Skeleton
  if (loading) {
    return <SkeletonSongGrid count={8} />;
  }

  if (!songs.length) {
    return (
      <p className="text-center text-white/60 py-16">មិនទាន់មានចម្រៀងទេ</p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {songs.map((s) => (
        <SongCard
          key={s.id}
          song={s}
          active={current?.id === s.id}
          onPlay={() => playSong(s, songs)}
          liked={favs.includes(s.id)}
          onFav={user ? () => fav(s.id) : null}
        />
      ))}
    </div>
  );
}
