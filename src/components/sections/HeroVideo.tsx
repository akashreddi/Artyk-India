"use client";

import { useEffect, useRef } from "react";
import { usePreloaderDone } from "@/components/ui/InitialLoadGate";

type Props = {
  src: string;
  poster: string;
};

/**
 * No `autoPlay` — the video sits paused on its poster frame while the
 * preloader covers the screen (still buffering via preload="auto", so it's
 * ready to go), then starts from frame 0 the instant the preloader lifts.
 * Without this, autoplay would start the clip the moment it mounts (hidden
 * behind the preloader), so by reveal it'd already be several seconds in.
 */
export default function HeroVideo({ src, poster }: Props) {
  const preloaderDone = usePreloaderDone();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!preloaderDone) return;
    videoRef.current?.play().catch(() => {
      // Some browsers still gate autoplay until first interaction.
    });
  }, [preloaderDone]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
