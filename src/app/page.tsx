import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SignatureLine from "@/components/ui/SignatureLine";
import BrandsTeaser from "@/components/sections/BrandsTeaser";
import ServicesShowcase from "@/components/sections/ServicesShowcase";
import ArtykValuesRail from "@/components/sections/ArtykValuesRail";
import MobileHomeScrollReset from "@/components/ui/MobileHomeScrollReset";

export default function HomePage() {
  return (
    <>
      <MobileHomeScrollReset />

      {/* ───────────────────────── HERO (kept) ───────────────────────── */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/featured/entrance.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* TODO: swap for a short, compressed /videos/hero-loop.mp4 */}
          <source src="/videos/artyk-intro-desktop.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-onyx/40" />
      </section>

      {/* ───────────────── Editorial intro ───────────────── */}
      <section className="px-6 py-28 md:px-16 md:py-44">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-9">
            <h2 className="font-display text-[clamp(2.1rem,4.8vw,4.1rem)] font-light leading-[1.12] tracking-[-0.01em] text-onyx">
              Artyk — Where{" "}
              <span className="not-italic text-corten">Art</span>{" "}
              <span className="italic">Meets Living</span>, &{" "}
              <span className="not-italic text-corten">Design</span>{" "}
              <span className="italic">Meets Distinction</span>.
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
        </div>
      </section>

      {/* ───────────────── Values (horizontal rail) ───────────────── */}
      <section className="pt-28 md:pt-40">
        <div className="mx-auto mb-12 max-w-7xl px-6 md:mb-16 md:px-16">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.2vw,3.4rem)] font-light leading-[1.1] tracking-[-0.01em] text-onyx">
              What we believe.
            </h2>
          </Reveal>
        </div>
        <ArtykValuesRail />
      </section>

      {/* ───────────────── Services (from vision to installation) ───────────────── */}
      <section className="px-6 py-28 md:px-16 md:py-40">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-14 flex items-baseline gap-4 md:mb-20">
            <div className="hidden h-px w-6 shrink-0 translate-y-[-0.4rem] bg-corten sm:block" />
            <Reveal>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-corten">
                Our Services
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,4.2vw,3.4rem)] font-light leading-[1.1] tracking-[-0.01em] text-onyx">
                From first vision to final detail.
              </h2>
            </Reveal>
          </div>
          <ServicesShowcase />
        </div>
      </section>

      {/* ───────────────── Brands (teaser) ───────────────── */}
      <section className="px-6 py-28 md:px-16 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.2vw,3.4rem)] font-light leading-[1.1] tracking-[-0.01em] text-onyx">
                Brands we curate.
              </h2>
            </Reveal>
            <Link href="/brands" className="underline-sweep font-sans text-[11px] uppercase tracking-[0.24em] text-forest">
              View all brands
            </Link>
          </div>
          <div className="mt-12 md:mt-16">
            <BrandsTeaser />
          </div>
        </div>
      </section>

      {/* ───────────────── Showroom (asymmetric mosaic) ───────────────── */}
      <section className="px-6 py-28 md:px-16 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4.2vw,3.6rem)] font-light leading-[1.08] tracking-[-0.01em] text-onyx">
              Twenty-five thousand square feet, composed like a gallery.
            </h2>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-6">
            <Reveal className="md:col-span-7">
              <div className="group relative aspect-[4/5] overflow-hidden">
                <Image src="/images/showroom/gallery.jpg" alt="ARTYK gallery floor" fill sizes="(max-width:768px) 100vw, 58vw" className="object-cover transition duration-[1.2s] ease-out group-hover:scale-105" />
              </div>
            </Reveal>
            <div className="grid gap-4 md:col-span-5 md:gap-6">
              <Reveal delay={0.1}>
                <div className="group relative aspect-[4/3] overflow-hidden">
                  <Image src="/images/showroom/living-2.jpg" alt="ARTYK living composition" fill sizes="(max-width:768px) 100vw, 42vw" className="object-cover transition duration-[1.2s] ease-out group-hover:scale-105" />
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="group relative aspect-[4/3] overflow-hidden">
                  <Image src="/images/showroom/dining.jpg" alt="ARTYK dining composition" fill sizes="(max-width:768px) 100vw, 42vw" className="object-cover transition duration-[1.2s] ease-out group-hover:scale-105" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── CTA (invitation) ───────────────── */}
      <section className="relative h-[72vh] min-h-[480px] w-full overflow-hidden">
        <Image src="/images/featured/entrance-2.jpg" alt="The entrance to ARTYK" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-onyx/60" />
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-ivory/75">By appointment</p>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-light leading-[1.05] text-ivory">
            An invitation, beyond the threshold.
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-ivory/80">
            We receive a small number of guests each week. Tell us about your space, and we will
            prepare the gallery for your visit.
          </p>
          <Link
            href="/contact"
            className="mt-9 rounded-full bg-ivory px-9 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-onyx transition hover:bg-forest hover:text-ivory"
          >
            Request a Visit
          </Link>
        </div>
      </section>
    </>
  );
}
