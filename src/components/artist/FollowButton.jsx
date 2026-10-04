// src/components/artist/FollowButton.jsx
import { useEffect, useState } from "react";
import { FiUserPlus, FiUserCheck, FiLoader } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import * as songService from "../../services/songService";

export default function FollowButton({ artistId, onCountChange, size = "md" }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== ទាញ Follow Status =====
  useEffect(() => {
    if (!artistId) return;
    setLoading(true);
    songService
      .checkFollow(artistId)
      .then((data) => {
        setFollowing(data.following || false);
        onCountChange?.(data.followers_count || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [artistId]);

  // ===== Toggle Follow =====
  const toggle = async () => {
    if (!user) {
      alert("សូម Login ដើម្បី Follow");
      return;
    }
    if (busy) return;

    const prev = following;
    setFollowing(!prev);
    setBusy(true);

    try {
      const res = await songService.toggleFollow(artistId);
      setFollowing(res.following);
      onCountChange?.(res.followers_count);
    } catch (e) {
      setFollowing(prev);
      console.error("Follow failed:", e);
    } finally {
      setBusy(false);
    }
  };

  const sizes = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  if (loading) {
    return (
      <button
        disabled
        className={`rounded-full font-bold text-white bg-white/10 
                   border border-white/20 ${sizes[size]} 
                   flex items-center justify-center opacity-60`}
      >
        <FiLoader className="animate-spin" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-full font-bold transition-all flex items-center justify-center
                 ${sizes[size]}
                 ${
                   following
                     ? "bg-white/10 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-400/30 hover:text-red-300"
                     : "bg-gradient-to-r from-[#b07a9a] to-[#8a5a7a] text-white hover:from-[#c08aaa] hover:to-[#9a6a8a] shadow-lg shadow-[#b07a9a]/30"
                 }
                 disabled:opacity-50 disabled:cursor-not-allowed`}
      title={following ? "ឈប់ Follow" : "Follow"}
    >
      {busy ? (
        <FiLoader className="animate-spin" />
      ) : following ? (
        <>
          <FiUserCheck />
          <span>Following</span>
        </>
      ) : (
        <>
          <FiUserPlus />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}
