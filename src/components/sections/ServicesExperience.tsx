"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * The Services page experience: hero, standfirst, the three practice
 * plaques (pointer-tilt 3D), the What We Offer index with its
 * cursor-chasing image plane, the sticky Process deck, and the closing
 * CTA banner. The existing "Begin a consultation" form block follows
 * this component on the page, untouched.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------- content ---------------- */

const AUDIENCES = [
  { numeral: "i", label: "Residential Interiors" },
  { numeral: "ii", label: "Hospitality & Commercial Projects" },
  { numeral: "iii", label: "Developer Partnerships" },
];

const PILLARS = [
  {
    no: "01",
    title: "Design Consultation",
    lead: "Every successful project begins with thoughtful planning.",
    body: "Our team works closely with clients and design professionals to understand project objectives, recommend suitable brands and collections, and curate solutions that align with both vision and functionality.",
    image: "/images/services/service-consulting.jpg",
    alt: "The Artyk signage plinth — furniture, sourcing, consulting",
  },
  {
    no: "02",
    title: "Bespoke Solutions",
    lead: null,
    body: null,
    image: "/images/services/showcase-4.jpg",
    alt: "Hands adjusting a timber furniture frame — craftsmanship in detail",
  },
  {
    no: "03",
    title: "Procurement & Project Coordination",
    lead: "Managing multiple international brands requires precision.",
    body: "From product specifications and quotations to logistics, delivery, and installation, we coordinate every stage to ensure a seamless experience from concept to completion.",
    image: "/images/services/service-sourcing.jpg",
    alt: "The corten brand wall at Artyk — international design houses side by side",
  },
];

const OFFERINGS = [
  {
    numeral: "i",
    title: "Furniture",
    body: "Curated collections from globally renowned brands.",
    image: "/images/services/showcase-1.jpg",
    alt: "A curated living composition at Artyk",
  },
  {
    numeral: "ii",
    title: "Kitchens",
    body: "Bespoke Italian kitchens designed around the way you live.",
    image: "/images/services/showcase-3.jpg",
    alt: "A dark timber kitchen display in the Artyk gallery",
  },
  {
    numeral: "iii",
    title: "Wardrobes",
    body: "Custom storage systems balancing elegance and functionality.",
    image: "/images/showroom/dining.jpg",
    alt: "Timber cabinetry with glass vitrines",
  },
  {
    numeral: "iv",
    title: "Lighting",
    body: "Decorative and architectural lighting that enhances atmosphere.",
    image: "/images/showroom/gallery.jpg",
    alt: "A pendant cluster over a kitchen island",
  },
  {
    numeral: "v",
    title: "Rugs & Textiles",
    body: "Handcrafted pieces that add warmth, texture, and depth.",
    image: "/images/showroom/living-2.jpg",
    alt: "A living arrangement grounded by a handcrafted rug",
  },
  {
    numeral: "vi",
    title: "Art & Accessories",
    body: "Thoughtfully selected objects that complete a space.",
    image: "/images/services/showcase-2.jpg",
    alt: "Objects and books styled on a lacquered table",
  },
];

const STEPS = [
  {
    no: "01",
    title: "Discover",
    body: "Understanding your project, aspirations, and functional requirements.",
    tone: "bg-ivory",
  },
  {
    no: "02",
    title: "Design",
    body: "Developing layouts, product specifications, and tailored solutions.",
    tone: "bg-oat",
  },
  {
    no: "03",
    title: "Curate",
    body: "Selecting the right brands, collections, materials, and finishes.",
    tone: "bg-mist",
  },
  {
    no: "04",
    title: "Deliver",
    body: "Managing procurement, logistics, installation, and final execution with meticulous attention to detail.",
    tone: "bg-ivory",
  },
  {
    no: "05",
    title: "Experience",
    body: "A space that reflects your vision, celebrates design, and enhances the way you live.",
    tone: "bg-camel",
  },
];

/* ---------------- building blocks ---------------- */

/** Editorial kicker: micro label — hairline — italic note. */
function Kicker({ label, note, dark = false }: { label: string; note: string; dark?: boolean }) {
  return (
    <div className="mb-12 flex items-center gap-5 md:mb-16">
      <span
        className={`whitespace-nowrap font-sans text-[11px] font-medium uppercase tracking-[0.3em] ${
          dark ? "text-ivory/55" : "text-forest"
        }`}
      >
        {label}
      </span>
      <span className={`h-px flex-1 ${dark ? "bg-ivory/15" : "bg-cognac/25"}`} />
      <span
        className={`whitespace-nowrap font-display text-sm font-light italic ${
          dark ? "text-ivory/45" : "text-cognac/70"
        }`}
      >
        {note}
      </span>
    </div>
  );
}

/** Image plane that unveils bottom-up and settles from overscale.
    The viewport observer sits on the unclipped wrapper — never on the
    clipped element itself (clip-path zeroes its IO geometry). */
function PlateImage({
  src,
  alt,
  ratio,
  className = "",
}: {
  src: string;
  alt: string;
  ratio: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const play = !reduce && inView;

  return (
    <div ref={ref} className={`relative overflow-hidden bg-onyx/5 ${className}`} style={{ aspectRatio: ratio }}>
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
        animate={play ? { clipPath: "inset(0% 0 0 0)" } : undefined}
        transition={{ duration: 1.3, ease: EASE }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          initial={reduce ? false : { scale: 1.15 }}
          animate={play ? { scale: 1.04 } : undefined}
          transition={{ duration: 1.9, ease: EASE }}
        />
      </motion.div>
    </div>
  );
}

/** A plaque that leans toward the cursor with sprung inertia and carries a
    specular sheen across its face. Children float at their own depths. */
function TiltCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion() ?? false;
  const mvRx = useMotionValue(0);
  const mvRy = useMotionValue(0);
  const mvSx = useMotionValue(50);
  const mvSy = useMotionValue(38);
  const rx = useSpring(mvRx, { stiffness: 120, damping: 18, mass: 0.35 });
  const ry = useSpring(mvRy, { stiffness: 120, damping: 18, mass: 0.35 });
  const sx = useSpring(mvSx, { stiffness: 120, damping: 20, mass: 0.35 });
  const sy = useSpring(mvSy, { stiffness: 120, damping: 20, mass: 0.35 });
  const sheen = useMotionTemplate`radial-gradient(58% 46% at ${sx}% ${sy}%, rgba(255,252,244,.4), rgba(255,252,244,0) 68%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    mvRy.set(nx * 3.2);
    mvRx.set(-ny * 3.2);
    mvSx.set(nx * 100 + 50);
    mvSy.set(ny * 100 + 50);
  };
  const onLeave = () => {
    mvRx.set(0);
    mvRy.set(0);
    mvSx.set(50);
    mvSy.set(38);
  };

  return (
    <motion.div
      className="h-full [perspective:1200px]"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full border border-cognac/20 bg-ivory"
      >
        {/* inner hairline, floating just above the face */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-cognac/15"
          style={{ transform: "translateZ(14px)" }}
        />
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{ background: sheen, transform: "translateZ(6px)" }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ---------------- sections ---------------- */

function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const lines = ["Design Solutions,", "Thoughtfully Delivered."];

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-onyx">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: imgY }}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          <Image
            src="/images/services/consulting.jpg"
            alt="The Artyk gallery hall — living compositions before floor-to-ceiling greenery"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(31,36,32,.42) 0%, rgba(31,36,32,0) 30%), linear-gradient(to top, rgba(31,36,32,.8) 0%, rgba(31,36,32,.24) 46%, rgba(31,36,32,0) 70%)",
        }}
      />
      {/* the headline holds full strength and simply scrolls away with the
          section — no scroll-linked fade */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-20 md:px-16 md:pb-28">
        <motion.p
          className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-ivory/75"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
        >
          Our Services
        </motion.p>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,6.8vw,5.8rem)] font-light leading-[1.04] text-ivory">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "112%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.35 + i * 0.14 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}

function Standfirst() {
  return (
    <section className="px-6 py-24 md:px-16 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-8">
            <p className="font-display text-[clamp(1.5rem,2.9vw,2.5rem)] font-light leading-[1.35] text-onyx">
              At Artyk, every project begins with understanding how a space should be{" "}
              <span className="italic text-corten">experienced</span>. From private residences to
              hospitality destinations and corporate environments, we curate exceptional products
              and provide end-to-end support to bring each vision to life.
            </p>
          </Reveal>
          <div className="md:col-span-4 md:self-end">
            <ul>
              {AUDIENCES.map((a, i) => (
                <Reveal key={a.numeral} delay={0.1 + i * 0.09}>
                  <li className="group flex items-baseline gap-4 border-t border-cognac/25 py-4 last:border-b">
                    <span className="font-display text-sm font-light italic text-corten/70">
                      {a.numeral}.
                    </span>
                    <span className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-onyx transition-colors duration-500 group-hover:text-forest">
                      {a.label}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Practice() {
  return (
    <section className="px-6 pb-28 md:px-16 md:pb-40">
      <div className="mx-auto max-w-7xl">
        <Kicker label="The Practice" note="Three disciplines, one standard" />
        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {PILLARS.map((p, i) => (
            <TiltCard key={p.no} delay={i * 0.12}>
              <div className="flex h-full flex-col p-7 pb-9 md:p-6 md:pb-8 lg:p-8 lg:pb-10">
                <div style={{ transform: "translateZ(26px)" }}>
                  <PlateImage src={p.image} alt={p.alt} ratio="4 / 3" />
                </div>
                <div className="mt-8 flex items-baseline gap-4" style={{ transform: "translateZ(40px)" }}>
                  <span className="font-display text-2xl font-light italic text-corten/70">{p.no}</span>
                  <h3 className="font-display text-[clamp(1.35rem,1.8vw,1.7rem)] font-light leading-[1.15] text-onyx">
                    {p.title}
                  </h3>
                </div>
                <div className="mt-5 flex-1" style={{ transform: "translateZ(22px)" }}>
                  {p.no === "02" ? (
                    <p className="text-sm leading-relaxed text-cognac">
                      Many of our collections offer extensive possibilities for customisation—from
                      dimensions and configurations to finishes, materials, colours, and
                      detailing—allowing every piece to feel{" "}
                      <span className="font-display italic text-corten">uniquely yours</span>.
                    </p>
                  ) : (
                    <>
                      <p className="font-display text-[15px] font-light italic leading-relaxed text-onyx/85">
                        {p.lead}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-cognac">{p.body}</p>
                    </>
                  )}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offerings() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  return (
    <section className="bg-onyx px-6 py-24 text-ivory md:px-16 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Kicker label="What We Offer" note="Six rooms of one house" dark />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* the index */}
          <ol className="lg:col-span-7">
            {OFFERINGS.map((o, i) => (
              <Reveal key={o.numeral} delay={i * 0.06}>
                <li
                  className="group flex items-baseline gap-5 border-t border-ivory/12 py-7 last:border-b md:py-8"
                  onMouseEnter={() => setActive(i)}
                >
                  <span
                    className={`w-8 shrink-0 font-display text-base font-light italic transition-colors duration-500 ${
                      active === i ? "text-corten" : "text-corten/55"
                    }`}
                  >
                    {o.numeral}.
                  </span>
                  <div className="min-w-0">
                    <h3
                      className={`font-display text-[clamp(1.7rem,3vw,2.6rem)] font-light leading-[1.08] transition-all duration-700 ease-luxury group-hover:translate-x-2 ${
                        active === i ? "translate-x-2 text-ivory" : "text-ivory/80"
                      }`}
                    >
                      {o.title}
                    </h3>
                    <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ivory/55">
                      {o.body}
                    </p>
                    <div
                      className="mt-5 block overflow-hidden border border-ivory/15 lg:hidden"
                      style={{ aspectRatio: "16 / 10" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={o.image} alt={o.alt} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          {/* the viewing plate — stationary, sticky beside the index; images
              crossfade in place so nothing ever warps or chases the cursor */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[10vh]">
              <Reveal>
                <div className="relative overflow-hidden border border-ivory/20" style={{ aspectRatio: "4 / 5" }}>
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={active}
                      src={OFFERINGS[active].image}
                      alt={OFFERINGS[active].alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE }}
                    />
                  </AnimatePresence>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(31,36,32,.42), rgba(31,36,32,0) 36%)" }}
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="relative block h-5 overflow-hidden">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.span
                        key={active}
                        className="block whitespace-nowrap font-display text-sm font-light italic text-ivory/70"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      >
                        {OFFERINGS[active].numeral}. {OFFERINGS[active].title}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="whitespace-nowrap font-sans text-[10px] font-medium uppercase tracking-[0.26em] text-ivory/40">
                    The Collection
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const reduce = useReducedMotion() ?? false;
  return (
    <section className="px-6 py-24 md:px-16 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Kicker label="Our Process" note="From first meeting to final reveal" />
        <div className="relative [perspective:1400px]">
          {STEPS.map((s, i) => (
            <div key={s.no} className="sticky" style={{ top: `calc(76px + ${i * 18}px)` }}>
              <motion.article
                className={`${s.tone} mb-8 border border-cognac/20 px-7 py-12 shadow-[0_-24px_70px_rgba(31,36,32,.1)] md:px-14 md:py-16`}
                style={{ transformOrigin: "top center" }}
                initial={reduce ? false : { opacity: 0, y: 70, rotateX: 9 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.05, ease: EASE }}
              >
                <div className="grid items-baseline gap-4 md:grid-cols-12 md:gap-8">
                  <span
                    className={`font-display text-[clamp(2.6rem,5vw,4.6rem)] font-light italic leading-none md:col-span-2 ${
                      s.tone === "bg-camel" ? "text-ivory/85" : "text-corten/45"
                    }`}
                  >
                    {s.no}
                  </span>
                  <h3
                    className={`font-display text-[clamp(1.9rem,3.6vw,3.1rem)] font-light leading-[1.05] md:col-span-4 ${
                      s.tone === "bg-camel" ? "text-onyx" : "text-onyx"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`max-w-[46ch] text-[15px] leading-relaxed md:col-span-6 ${
                      s.tone === "bg-camel" ? "text-onyx/80" : "text-cognac"
                    }`}
                  >
                    {s.body}
                  </p>
                </div>
              </motion.article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Invitation() {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.16, 1]);

  return (
    <section ref={ref} className="relative min-h-[78vh] w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { scale }}>
        <Image
          src="/images/services/showcase-1.jpg"
          alt="A living composition at Artyk before floor-to-ceiling greenery"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-onyx/60" />
      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-3xl flex-col items-center justify-center px-6 py-28 text-center">
        <Reveal>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.32em] text-ivory/70">
            The Invitation
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5.4vw,4.4rem)] font-light leading-[1.08] text-ivory">
            Let&rsquo;s Create Something Exceptional
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl leading-relaxed text-ivory/80">
            Whether you&rsquo;re designing a private residence, a luxury hospitality destination, or
            a landmark commercial project, our team is here to help bring your vision to life
            through thoughtful curation and world-class design.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function ServicesExperience() {
  return (
    <>
      <Hero />
      <Standfirst />
      <Practice />
      <Offerings />
      <Process />
      <Invitation />
    </>
  );
}
