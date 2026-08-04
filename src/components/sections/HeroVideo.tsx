"use client";

import { useEffect, useRef } from "react";
import { usePreloaderDone } from "@/components/ui/InitialLoadGate";

type Props = {
  src: string;
};

/**
 * No `autoPlay` and no `poster` — a poster attribute would show a
 * different static image over the video's own already-buffered first
 * frame. The video sits on frame 0 while the preloader covers the screen
 * (buffering via preload="auto"), then starts the instant it lifts.
 */
export default function HeroVideo({ src }: Props) {
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
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
