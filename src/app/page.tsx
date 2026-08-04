import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SignatureLine from "@/components/ui/SignatureLine";
import BrandsTeaser from "@/components/sections/BrandsTeaser";
import ArtykDifference from "@/components/sections/ArtykDifference";
import HeroIntroImage from "@/components/sections/HeroIntroImage";
import HeroVideo from "@/components/sections/HeroVideo";
import ImmersiveShowroom from "@/components/sections/ImmersiveShowroom";
import MobileHomeScrollReset from "@/components/ui/MobileHomeScrollReset";

export default function HomePage() {
  return (
    <>
      <MobileHomeScrollReset />

      {/* ───────────────────────── HERO (kept) ───────────────────────── */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        <HeroVideo src="/videos/Website Landing_1080.mp4" poster="/images/featured/entrance.jpg" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-onyx/40" />
      </section>

      {/* ───────────────── Editorial intro ───────────────── */}
      <section className="px-6 pt-20 pb-10 md:px-16 md:pt-32 md:pb-14">
        <div className="mx-auto grid max-w-7xl items-start gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-8">
            <h2 className="font-display text-[32px] font-light leading-[1.12] tracking-[-0.01em] text-onyx md:text-[50px]">
              Artyk — Experience{" "}
              <span className="not-italic text-onyx">Curated Luxury</span>.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-cognac md:text-lg">
              Artyk brings you sprawling galleries of designer furniture by top-tier international
              brands. Walk into an immersive experience of living spaces that reflect fine aesthetics
              and sophistication. Interact face-to-face with furniture pieces and notice the symbiosis
              of craftsmanship and design.
            </p>

            {/* signature pull-quote */}
            <Reveal delay={0.15}>
              <div className="mt-8 h-px w-12 bg-corten" />
              <SignatureLine />
            </Reveal>
          </Reveal>

          <HeroIntroImage />
        </div>
      </section>

      {/* ───────────────── The Artyk Difference ───────────────── */}
      <section className="px-6 py-16 md:px-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-baseline gap-4 md:mb-14">
            <div className="hidden h-px w-6 shrink-0 translate-y-[-0.4rem] bg-corten sm:block" />
            <Reveal>
              <h2 className="font-display text-[32px] font-light leading-[1.1] tracking-[-0.01em] text-onyx md:text-[50px]">
                The Artyk Difference.
              </h2>
            </Reveal>
          </div>
          <ArtykDifference />
        </div>
      </section>

      {/* ───────────────── Brands (teaser) ───────────────── */}
      <section className="px-6 pt-16 pb-10 md:px-16 md:pt-24 md:pb-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-baseline gap-4">
              <div className="hidden h-px w-6 shrink-0 translate-y-[-0.4rem] bg-corten sm:block" />
              <Reveal>
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-corten">
                  Our Collection
                </p>
                <h2 className="mt-3 max-w-3xl font-display text-[32px] font-light leading-[1.1] tracking-[-0.01em] text-onyx md:text-[50px]">
                  A World of Exceptional Design
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-cognac md:text-lg">
                  From iconic Italian craftmanship to contemporary Indian design, our portfolio
                  represents brands celebrated for innovation, quality, and timeless aesthetics.
                </p>
              </Reveal>
            </div>
            <Link href="/brands" className="underline-sweep font-sans text-[11px] uppercase tracking-[0.24em] text-forest">
              View all brands
            </Link>
          </div>
          <div className="mt-6 md:mt-8">
            <BrandsTeaser />
          </div>
        </div>
      </section>

      {/* ───────────────── Showroom (asymmetric mosaic) ───────────────── */}
      <section className="px-6 pt-10 pb-28 md:px-16 md:pt-14 md:pb-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl font-display text-[32px] font-light leading-[1.08] tracking-[-0.01em] text-onyx md:text-[50px]">
              An Immersive Design Experience
            </h2>
          </div>

          <ImmersiveShowroom />
        </div>
      </section>

      {/* ───────────────── CTA (invitation) ───────────────── */}
      <section className="relative h-[72vh] min-h-[480px] w-full overflow-hidden">
        <Image src="/images/about/_1HK2392.jpg" alt="The entrance to ARTYK" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-onyx/60" />
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h2 className="font-display text-[32px] font-light leading-[1.1] tracking-[-0.01em] text-ivory md:text-[50px]">
            An invitation, beyond the threshold.
          </h2>
          <Link
            href="/contact"
            className="mt-9 rounded-full bg-ivory px-9 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-onyx transition hover:bg-[#212121] hover:text-ivory"
          >
            Request a Visit
          </Link>
        </div>
      </section>
    </>
  );
}
