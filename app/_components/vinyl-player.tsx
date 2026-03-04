"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PlaylistTrack = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
};

type PlaylistPayload = {
  version: number;
  tracks: PlaylistTrack[];
};

const EMPTY_LIST_MESSAGE = "播放列表为空，请先在 public/music/playlist.json 添加歌曲。";
const LOAD_ERROR_MESSAGE = "音乐列表加载失败，请检查 public/music/playlist.json。";
const AUDIO_ERROR_MESSAGE = "当前音频无法播放，请检查文件路径。";
const AUTOPLAY_ERROR_MESSAGE = "浏览器阻止了自动播放，请手动点击播放。";

function isValidTrack(value: unknown): value is PlaylistTrack {
  if (!value || typeof value !== "object") return false;

  const track = value as Record<string, unknown>;

  return (
    typeof track.id === "string" &&
    typeof track.title === "string" &&
    typeof track.artist === "string" &&
    typeof track.src === "string" &&
    (typeof track.cover === "string" || typeof track.cover === "undefined")
  );
}

export default function VinylPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTrack = tracks[currentIndex] ?? null;

  const goToNext = useCallback(() => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  }, [tracks.length]);

  const goToPrev = useCallback(() => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  useEffect(() => {
    let cancelled = false;

    const loadPlaylist = async () => {
      try {
        const response = await fetch("/music/playlist.json", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to load playlist: ${response.status}`);
        }

        const payload = (await response.json()) as PlaylistPayload;
        const list = Array.isArray(payload?.tracks) ? payload.tracks.filter(isValidTrack) : [];

        if (cancelled) return;

        setTracks(list);
        setCurrentIndex(0);
        setIsPlaying(false);
        setError(list.length === 0 ? EMPTY_LIST_MESSAGE : null);
      } catch {
        if (cancelled) return;
        setTracks([]);
        setCurrentIndex(0);
        setIsPlaying(false);
        setError(LOAD_ERROR_MESSAGE);
      }
    };

    void loadPlaylist();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tracks.length === 0) {
      setCurrentIndex(0);
      setIsReady(false);
      setIsPlaying(false);
      return;
    }

    setCurrentIndex((prev) => (prev >= tracks.length ? 0 : prev));
  }, [tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      setIsReady(false);
      return;
    }

    audio.src = currentTrack.src;
    audio.load();
    setIsReady(false);
    if (error === AUDIO_ERROR_MESSAGE) {
      setError(null);
    }
  }, [currentTrack, error]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (!isPlaying) {
      audio.pause();
      return;
    }

    void audio.play().catch(() => {
      setIsPlaying(false);
      setError(AUTOPLAY_ERROR_MESSAGE);
    });
  }, [isPlaying, currentIndex, currentTrack?.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (tracks.length === 0) return;
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    };

    const handleCanPlay = () => {
      setIsReady(true);
    };

    const handleAudioError = () => {
      setIsReady(false);
      setIsPlaying(false);
      setError(AUDIO_ERROR_MESSAGE);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleAudioError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleAudioError);
    };
  }, [tracks.length]);

  const togglePlay = () => {
    if (!currentTrack) return;
    setError((prev) => (prev === AUTOPLAY_ERROR_MESSAGE ? null : prev));
    setIsPlaying((prev) => !prev);
  };

  const labelText = currentTrack?.title.trim().slice(0, 1).toUpperCase() || "♪";

  return (
    <section className="music-player" aria-label="Music player">
      <audio ref={audioRef} preload="metadata" loop={tracks.length === 1} />

      <div className={`vinyl-disc ${isPlaying ? "vinyl-spin" : ""}`} aria-hidden="true">
        {currentTrack?.cover ? <img className="vinyl-cover" src={currentTrack.cover} alt="" /> : null}
        <span className="vinyl-label">{labelText}</span>
      </div>

      <div className="music-meta" aria-live="polite">
        <p className="music-kicker">Now Playing</p>
        <p className="music-title">{currentTrack?.title ?? "暂无歌曲"}</p>
        <p className="music-artist">{currentTrack?.artist ?? "请添加播放列表"}</p>
        {currentTrack ? <p className="music-counter">{currentIndex + 1} / {tracks.length}</p> : null}
        {error ? <p className="music-status">{error}</p> : !isReady && currentTrack ? <p className="music-status">加载中...</p> : null}
      </div>

      <div className="music-controls">
        <button
          type="button"
          className="music-control-btn"
          onClick={goToPrev}
          disabled={tracks.length === 0}
          aria-label="上一首"
        >
          Prev
        </button>
        <button
          type="button"
          className="music-control-btn music-control-primary"
          onClick={togglePlay}
          disabled={!currentTrack}
          aria-label={isPlaying ? "暂停" : "播放"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className="music-control-btn"
          onClick={goToNext}
          disabled={tracks.length === 0}
          aria-label="下一首"
        >
          Next
        </button>
      </div>
    </section>
  );
}
