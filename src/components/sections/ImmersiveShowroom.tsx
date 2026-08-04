"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BIG = { src: "/AIDE/_1HK3296.jpg", alt: "ARTYK showroom — immersive gallery view" };
const PORTRAIT = { src: "/AIDE/_ART5296-Edit.jpg", alt: "ARTYK showroom — curated vignette" };
const LANDSCAPES = [
  { src: "/AIDE/_ART5422-HDR-Edit.jpg", alt: "ARTYK showroom — curated vignette" },
  { src: "/AIDE/_ART5593-HDR.jpg", alt: "ARTYK showroom — curated vignette" },
  { src: "/AIDE/_ART5054-Edit.jpg", alt: "ARTYK showroom — curated vignette" },
];

/**
 * "An Immersive Design Experience" mosaic.
 *
 * The 3 desktop columns are sized (1.73fr / 1.44fr / 1fr) so that each
 * column's height — derived purely from its own images' native aspect
 * ratios (4:5, 2:3, and three stacked 3:2 plates) — lines up flush with
 * no leftover space and no cropping. Each plate opens like a pair of
 * doors from its centerline as it enters view.
 */
export default function ImmersiveShowroom() {
  return (
    <div className="mt-14 grid grid-cols-1 items-start gap-4 md:grid-cols-[1.73fr_1.44fr_1fr] md:gap-6">
      <MosaicTile
        tile={BIG}
        index={0}
        className="aspect-[4/5]"
        sizes="(max-width: 768px) 100vw, 40vw"
      />
      <MosaicTile
        tile={PORTRAIT}
        index={1}
        className="aspect-[2/3]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {LANDSCAPES.map((tile, i) => (
          <MosaicTile
            key={tile.src}
            tile={tile}
            index={i + 2}
            className="aspect-[3/2]"
            sizes="(max-width: 768px) 100vw, 23vw"
          />
        ))}
      </div>
    </div>
  );
}

function MosaicTile({
  tile,
  index,
  className,
  sizes,
}: {
  tile: { src: string; alt: string };
  index: number;
  className: string;
  sizes: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const play = !reduce && inView;

  const delay = reduce ? 0 : 0.55 + index * 0.12;

  return (
    <div ref={ref} className={`group relative overflow-hidden bg-stone ${className}`}>
      <motion.div
        className="relative h-full w-full"
        initial={reduce ? false : { scale: 1.08 }}
        animate={play ? { scale: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE, delay: play ? delay + 0.2 : 0 }}
      >
        <Image src={tile.src} alt={tile.alt} fill sizes={sizes} className="object-cover" />
      </motion.div>

      {/* frame accent that draws inward on hover */}
      <div className="pointer-events-none absolute inset-3 border border-ivory/0 transition-all duration-500 ease-luxury group-hover:inset-2 group-hover:border-ivory/30" />

      {/* centerline "double-door" reveal */}
      {!reduce ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 bg-stone"
            style={{ transformOrigin: "left" }}
            initial={{ scaleX: 1 }}
            animate={play ? { scaleX: 0 } : undefined}
            transition={{ duration: 1.05, ease: EASE, delay }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 bg-stone"
            style={{ transformOrigin: "right" }}
            initial={{ scaleX: 1 }}
            animate={play ? { scaleX: 0 } : undefined}
            transition={{ duration: 1.05, ease: EASE, delay }}
          />
        </>
      ) : (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-stone"
          initial={{ opacity: 1 }}
          animate={inView ? { opacity: 0 } : undefined}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
}
