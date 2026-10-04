// src/components/common/Skeleton.jsx

// ===== Base =====
export function SkeletonBox({ className = "" }) {
  return <div className={`bg-white/5 rounded-lg animate-pulse ${className}`} />;
}

// ===== Song Card =====
export function SkeletonSongCard() {
  return (
    <div className="glass rounded-3xl p-4">
      <div className="aspect-square rounded-2xl bg-white/5 mb-3 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonSongGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonSongCard key={i} />
      ))}
    </div>
  );
}

// ===== Artist Card =====
export function SkeletonArtistCard() {
  return (
    <div className="glass rounded-3xl p-4 text-center">
      <div className="w-28 h-28 mx-auto rounded-full bg-white/5 mb-3 animate-pulse" />
      <div className="h-4 w-2/3 mx-auto rounded bg-white/10 animate-pulse" />
      <div className="h-3 w-1/2 mx-auto rounded bg-white/5 mt-2 animate-pulse" />
    </div>
  );
}

export function SkeletonArtistGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonArtistCard key={i} />
      ))}
    </div>
  );
}

// ===== ✅ Playlist Card (ថ្មី) =====
export function SkeletonPlaylistCard() {
  return (
    <div className="rounded-3xl p-5 bg-white/5 border border-white/10 animate-pulse">
      <div className="flex items-center gap-4">
        {/* Skeleton Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-white/10 shrink-0" />

        {/* Skeleton Info */}
        <div className="flex-1 space-y-3">
          {/* Label */}
          <div className="h-3 w-16 rounded bg-white/10" />
          {/* Title */}
          <div className="h-5 w-32 rounded bg-white/10" />
          {/* Songs Count */}
          <div className="h-3 w-20 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonPlaylistGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonPlaylistCard key={i} />
      ))}
    </div>
  );
}

// ===== Hero =====
export function SkeletonHero() {
  return (
    <div className="relative rounded-3xl p-8 bg-white/5 animate-pulse h-64" />
  );
}

// ===== List =====
export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 animate-pulse"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-white/10" />
            <div className="h-2 w-1/2 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
