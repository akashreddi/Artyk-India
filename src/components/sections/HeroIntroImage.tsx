"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Editorial-intro companion image.
 *
 * Layers a premium entrance: a bottom-up clip-path wipe uncovers the frame while
 * the image inside settles from a gentle over-scale (Ken Burns), a soft-light
 * sheen sweeps across once, and the whole plate drifts with scroll parallax.
 * Reduced-motion collapses everything to a quiet fade.
 *
 * The viewport observer sits on the unclipped wrapper — never on the clipped
 * element itself, whose clip-path would zero its IntersectionObserver geometry.
 */
export default function HeroIntroImage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const play = !reduce && inView;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // continuous drift as the section travels through the viewport
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className="relative w-full max-w-xs justify-self-center md:col-span-4 md:mt-6 md:max-w-sm md:justify-self-start">
      {/* offset corten frame accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2.5 -z-10 rounded-[2px] border border-corten/25 md:-inset-3.5"
      />

      <motion.figure
        className="relative m-0 aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-onyx/5 md:aspect-[3/4]"
        initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
        animate={
          reduce
            ? inView
              ? { opacity: 1 }
              : undefined
            : play
              ? { clipPath: "inset(0% 0 0 0)" }
              : undefined
        }
        transition={{ duration: reduce ? 0.5 : 1.25, ease: EASE }}
      >
        {/* parallax carrier — slightly oversized so the drift never exposes edges */}
        <motion.div
          className="absolute inset-0 h-[112%] w-full"
          style={reduce ? undefined : { y: imgY }}
        >
          {/* Ken Burns settle */}
          <motion.div
            className="relative h-full w-full"
            initial={reduce ? false : { scale: 1.14 }}
            animate={play ? { scale: 1 } : undefined}
            transition={{ duration: 2.2, ease: EASE }}
          >
            <Image
              src="/images/featured/poltrona-frau-vignette.jpg"
              alt="Poltrona Frau gallery vignette at Artyk — a curved lounge chair beside a corten-toned partition"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* grounding gradient for text-side balance */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/15 via-transparent to-transparent" />

        {/* one-pass sheen sweep on reveal */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
            }}
            initial={{ x: "-120%" }}
            animate={play ? { x: "120%" } : undefined}
            transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
          />
        )}
      </motion.figure>
    </div>
  );
}
