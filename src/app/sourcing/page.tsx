import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import InviteCTA from "@/components/sections/InviteCTA";
import { brands } from "@/data/brands";

export const metadata = { title: "International Sourcing" };

export default function SourcingPage() {
  return (
    <>
      <section className="relative h-[72vh] min-h-[460px] w-full overflow-hidden">
        <Image src="/images/services/service-sourcing.jpg" alt="ARTYK sourcing" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-onyx/50" />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-ivory/80">International</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,7rem)] font-light leading-none text-ivory">Sourcing</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <Reveal>
          <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-light leading-[1.3] text-onyx">
            Access to the rare and the made-to-order — sourced and brought to Hyderabad through a
            small circle of partner houses we know by hand.
          </p>
        </Reveal>
      </section>

      <section className="px-6 pb-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between border-t border-cognac/25 pt-8">
            <h2 className="font-display text-[26px] font-light text-onyx md:text-[50px]">Partner houses</h2>
            <Link href="/brands" className="font-sans text-[11px] uppercase tracking-[0.24em] text-forest underline-sweep">
              All brands →
            </Link>
          </div>
          <div className="mt-6">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="group flex items-center justify-between gap-6 border-b border-cognac/15 py-6"
              >
                <span className="font-display text-[clamp(1.4rem,3vw,2.2rem)] font-light text-onyx transition-colors group-hover:text-forest">
                  {b.name}
                </span>
                <span className="shrink-0 font-sans text-[11px] uppercase tracking-[0.24em] text-cognac">{b.meta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <InviteCTA />
    </>
  );
}
