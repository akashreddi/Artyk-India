import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import { brands, getBrand } from "@/data/brands";
import { org } from "@/data/org";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) return { title: "Brand Not Found" };

  const path = `/brands/${b.slug}`;
  return {
    // `absolute` so the root "%s | Artyk India" template doesn't double-append.
    title: { absolute: b.seo.title },
    description: b.seo.description,
    keywords: b.seo.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: b.seo.title,
      description: b.seo.description,
      url: path,
      type: "website",
      images: [{ url: b.image, alt: b.name }],
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) notFound();

  // Brand nested under the Artyk FurnitureStore (LocalBusiness), located in Hyderabad.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `${org.url}/#store`,
    name: org.name,
    url: org.url,
    image: `${org.url}${b.image}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: org.address.streetAddress,
      addressLocality: org.address.addressLocality,
      addressRegion: org.address.addressRegion,
      postalCode: org.address.postalCode,
      addressCountry: org.address.addressCountry,
    },
    areaServed: org.address.addressLocality,
    brand: {
      "@type": "Brand",
      name: b.name,
      description: b.seo.description,
      slogan: b.tagline,
      image: `${org.url}${b.image}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* hero */}
      <section className="relative h-[74vh] min-h-[460px] w-full overflow-hidden">
        <Image src={b.image} alt={b.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-onyx/50" />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-ivory/80">{b.origin}</p>
          <h1 className="mt-4 font-display text-[32px] font-light leading-[1.1] text-ivory md:text-[50px]">
            {b.name}
          </h1>
          <p className="mt-4 max-w-xl font-display text-[clamp(1.2rem,2.4vw,1.8rem)] font-light italic leading-snug text-ivory/85">
            {b.tagline}
          </p>
        </div>
      </section>

      {/* body */}
      <section className="mx-auto max-w-4xl px-6 py-24 md:py-36">
        <Reveal>
          <p className="text-lg leading-relaxed text-onyx">
            {b.name} is curated at Artyk — the European furniture experience centre in Jubilee
            Hills, Hyderabad.
          </p>
          {b.body.map((para, i) => (
            <p key={i} className="mt-6 text-lg leading-relaxed text-cognac">
              {para}
            </p>
          ))}

          {/* categories — text-only inline list (no pill/badge style exists in the live system) */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {b.category.map((c) => (
              <span key={c} className="font-sans text-[11px] uppercase tracking-[0.2em] text-forest">
                {c}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-wrap gap-5">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-onyx px-8 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition hover:bg-[#212121]"
            >
              Discover {b.name} at Artyk, Hyderabad
            </Link>
            <a
              href={`https://instagram.com/${b.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-cognac/40 px-8 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-onyx transition hover:border-[#212121] hover:text-[#212121]"
            >
              @{b.instagram}
            </a>
          </div>
        </Reveal>
      </section>

      {/* footer strip */}
      <section className="border-t border-cognac/20 px-6 py-14 md:px-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/brands"
            className="underline-sweep font-sans text-[11px] uppercase tracking-[0.24em] text-forest"
          >
            ← Explore more brands
          </Link>
        </div>
      </section>
    </>
  );
}
