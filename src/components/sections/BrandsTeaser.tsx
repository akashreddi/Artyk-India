"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brands } from "@/data/brands";

const featuredBrands = brands;

const flagMap: Record<string, string> = {
  Italy: "/flags/italy-latest.png",
  India: "/flags/india.png",
  Switzerland: "/flags/switzerland.png",
  Spain: "/flags/spain.svg",
};

export default function BrandsTeaser() {
  const reduce = useReducedMotion();
  const marqueeRef = useRef<HTMLDivElement>(null);
  // Shared pause flag: the auto-scroll loop, hover, and the manual arrow
  // buttons all read/write this so they don't fight over scrollLeft.
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Rendered twice so the strip can loop back seamlessly once the first set
  // has scrolled fully out of view.
  const marqueeItems = [...featuredBrands, ...featuredBrands];

  // Exact width of one full set (cards + gaps, including the trailing gap):
  // the left offset of the first card of the SECOND set. Using scrollWidth/2
  // is wrong because the gap count is odd, leaving it half a gap short and
  // causing a visible snap on each loop.
  const getLoopWidth = () => {
    const track = marqueeRef.current?.firstElementChild;
    const cards = track?.children;
    const first = cards?.[0] as HTMLElement | undefined;
    const secondSetStart = cards?.[featuredBrands.length] as HTMLElement | undefined;
    if (!first || !secondSetStart) return 0;
    return secondSetStart.offsetLeft - first.offsetLeft;
  };

  const scrollByAmount = (direction: "left" | "right") => {
    const el = marqueeRef.current;
    if (!el) return;
    // Pause the auto-scroll so its per-frame writes don't cancel the smooth
    // scroll, then resume shortly after the animation settles.
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    const amount = 320;
    const loop = getLoopWidth();
    // Near an edge, hop by one full set (visually identical thanks to the
    // duplicated content) so the arrow always has room to move.
    if (loop > 0 && direction === "left" && el.scrollLeft < amount) el.scrollLeft += loop;
    if (loop > 0 && direction === "right" && el.scrollLeft > loop) el.scrollLeft -= loop;
    el.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, 700);
  };

  // Continuous, seamless auto-scroll. Once the first set has fully scrolled
  // past, subtract one set's width so the strip loops forever with no snap.
  useEffect(() => {
    if (reduce) return;
    const el = marqueeRef.current;
    if (!el) return;

    let raf = 0;
    const speed = 0.5; // px per frame (~30px/s at 60fps)

    const step = () => {
      if (!pausedRef.current) {
        el.scrollLeft += speed;
        const loop = getLoopWidth();
        if (loop > 0 && el.scrollLeft >= loop) el.scrollLeft -= loop;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => (pausedRef.current = true);
    const resume = () => (pausedRef.current = false);
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
    };
  }, [reduce]);

  return (
    <div className="relative border-t border-cognac/20 pt-4 md:pt-6">
      <div className="absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-[#f4efe6] to-transparent md:block" />
      <div className="absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-[#f4efe6] to-transparent md:block" />

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-16 items-center pl-1 md:flex">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-cognac/25 bg-white/90 text-onyx shadow-[0_8px_24px_rgba(41,33,24,0.12)] backdrop-blur transition hover:-translate-x-0.5 hover:border-cognac/50 hover:bg-white"
            aria-label="Scroll brands left"
          >
            <span className="text-lg">←</span>
          </button>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-16 items-center justify-end pr-1 md:flex">
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-cognac/25 bg-white/90 text-onyx shadow-[0_8px_24px_rgba(41,33,24,0.12)] backdrop-blur transition hover:translate-x-0.5 hover:border-cognac/50 hover:bg-white"
            aria-label="Scroll brands right"
          >
            <span className="text-lg">→</span>
          </button>
        </div>

        <div ref={marqueeRef} className="overflow-x-auto overflow-y-hidden pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <motion.div className="flex w-max gap-3 md:gap-4" initial={false}>
            {marqueeItems.map((b, i) => {
              // Map the origin country to its flag; show none rather than
              // falling back to another country's flag if unmapped.
              const flagSrc = flagMap[b.origin.split(" · ")[0]];

              return (
                <motion.div
                  key={`${b.slug}-${i}`}
                  whileHover={reduce ? undefined : { y: -6, scale: 1.03, transition: { duration: 0.3 } }}
                  className="group relative h-[420px] w-[250px] shrink-0 snap-start overflow-hidden border border-cognac/20 bg-[#ece7de] sm:h-[520px] sm:w-[300px]"
                >
                  <Link href={`/brands/${b.slug}`} aria-label={`View brand: ${b.name}`} className="block h-full w-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={b.image}
                        alt={b.name}
                        fill
                        sizes="(max-width: 768px) 250px, 300px"
                        className="object-cover transition duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5">
                        <div>
                          <p className="font-display text-[clamp(1.1rem,2.2vw,1.45rem)] leading-none text-white">
                            {b.name}
                          </p>
                        </div>
                        {flagSrc ? (
                          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/40 bg-white/90 shadow-sm">
                            <Image src={flagSrc} alt="" fill sizes="28px" className="object-cover" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center gap-2 pt-3 md:hidden">
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-cognac/25 bg-white/80 text-onyx backdrop-blur transition hover:border-cognac/50 hover:bg-white"
          aria-label="Scroll brands left"
        >
          <span className="text-sm">←</span>
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-cognac/25 bg-white/80 text-onyx backdrop-blur transition hover:border-cognac/50 hover:bg-white"
          aria-label="Scroll brands right"
        >
          <span className="text-sm">→</span>
        </button>
      </div>
    </div>
  );
}
