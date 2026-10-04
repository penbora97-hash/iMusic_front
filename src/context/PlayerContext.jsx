// src/context/PlayerContext.jsx
import { createContext, useContext, useState, useRef, useEffect } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [visible, setVisible] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef(null);

  // ===== ✅ Play Song with Queue =====
  const playSong = (song, playlist = []) => {
    // បើគ្មាន Playlist បញ្ជូន → ប្រើ Song តែមួយ
    const list = playlist.length > 0 ? playlist : [song];

    setQueue(list);
    setOriginalQueue(list);

    // រក Index របស់ Song ក្នុង Queue
    const idx = list.findIndex((s) => s.id === song.id);
    setIndex(idx >= 0 ? idx : 0);
    setCurrent(song);
    setVisible(true);
    setPlaying(true);

    console.log(`🎵 Playing: ${song.title} (${idx + 1}/${list.length})`);
  };

  // ===== Play At Index =====
  const playAt = (list, idx) => {
    if (!list.length || idx < 0 || idx >= list.length) return;
    setIndex(idx);
    setCurrent(list[idx]);
    setPlaying(true);
  };

  // ===== ✅ Next Song =====
  const playNext = () => {
    if (!queue.length) return;

    // Shuffle Mode
    if (shuffle) {
      let nextIdx = index;
      while (nextIdx === index && queue.length > 1) {
        nextIdx = Math.floor(Math.random() * queue.length);
      }
      playAt(queue, nextIdx);
      return;
    }

    // Normal Mode
    let nextIdx = index + 1;
    if (nextIdx >= queue.length) {
      // អស់ Queue → Loop ទៅដើម
      nextIdx = 0;
    }
    playAt(queue, nextIdx);
  };

  // ===== Previous Song =====
  const playPrev = () => {
    if (!queue.length) return;

    const audio = audioRef.current;
    // បើលេង > 3s → ត្រលប់ដើមបទ
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIdx = index - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    playAt(queue, prevIdx);
  };

  // ===== Toggle Shuffle =====
  const toggleShuffle = () => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);

    if (newShuffle) {
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      const newIdx = shuffled.findIndex((s) => s.id === current?.id);
      setIndex(newIdx >= 0 ? newIdx : 0);
    } else {
      setQueue(originalQueue);
      const newIdx = originalQueue.findIndex((s) => s.id === current?.id);
      setIndex(newIdx >= 0 ? newIdx : 0);
    }
  };

  // ===== Toggle Repeat =====
  const toggleRepeat = () => setRepeat((r) => !r);

  // ===== Close Player =====
  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setCurrent(null);
    setQueue([]);
    setOriginalQueue([]);
    setIndex(-1);
    setVisible(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const togglePlay = () => setPlaying((p) => !p);

  // ===== ✅ Audio Element + Auto-Play Next =====
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);

    // ✅ Auto-Play Next ពេលចប់
    const onEnded = () => {
      console.log("🎵 Song ended, auto-playing next...");

      if (repeat) {
        // Repeat បទបច្ចុប្បន្ន
        audio.currentTime = 0;
        audio.play();
      } else if (queue.length > 1) {
        // លេងបទបន្ទាប់
        playNext();
      } else {
        // គ្មានបទបន្ទាប់
        setPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [queue, index, repeat, shuffle, current]);

  // ===== Play/Pause Control =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;

    const url = current.file_url?.startsWith("http")
      ? current.file_url
      : `http://localhost:8000${current.file_url}`;

    if (audio.src !== url) {
      audio.src = url;
    }

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, current]);

  // ===== Volume =====
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const value = {
    current,
    queue,
    index,
    playing,
    currentTime,
    duration,
    volume,
    visible,
    repeat,
    shuffle,
    playSong,
    playNext,
    playPrev,
    togglePlay,
    toggleRepeat,
    toggleShuffle,
    closePlayer,
    setVolume,
    seek,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
