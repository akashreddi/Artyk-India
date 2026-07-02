"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brands } from "@/data/brands";

const featuredBrands = brands.slice(0, 8);

const flagMap: Record<string, string> = {
  Italy: "/flags/italy-latest.png",
  India: "/flags/india.png",
  Switzerland: "/flags/switzerland.png",
};

export default function BrandsTeaser() {
  const reduce = useReducedMotion();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeItems = [...featuredBrands, ...featuredBrands];

  const scrollByAmount = (direction: "left" | "right") => {
    if (!marqueeRef.current) return;
    const amount = 320;
    marqueeRef.current.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

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
              const flagSrc = flagMap[b.origin.split(" · ")[0]] || "/flags/italy.png";

              return (
                <motion.div
                  key={`${b.slug}-${i}`}
                  whileHover={reduce ? undefined : { y: -6, scale: 1.03, transition: { duration: 0.3 } }}
                  className="group relative h-[420px] w-[250px] shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-cognac/20 bg-[#ece7de] sm:h-[520px] sm:w-[300px]"
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
                          <p className="text-[10px] uppercase tracking-[0.24em] text-[#efe7da]">Featured house</p>
                          <p className="mt-1 font-display text-[clamp(1.1rem,2.2vw,1.45rem)] leading-none text-white">
                            {b.name}
                          </p>
                        </div>
                        <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/40 bg-white/90 shadow-sm">
                          <Image src={flagSrc} alt="" fill sizes="28px" className="object-cover" />
                        </div>
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
