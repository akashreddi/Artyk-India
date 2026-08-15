"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * The editorial chapters that follow "Our Philosophy" on the About page:
 * Vision → Mission → What Sets Us Apart (card deck) → Values → the finale.
 *
 * Mounted inside AboutEditorial's `.artyk-about` root, so it inherits the
 * page's scoped design language (kicker / micro / display / rv / split) and
 * the parent's word-mask + IntersectionObserver reveal engine. Framer Motion
 * adds the scroll-linked work: layered parallax planes, the stacking card
 * deck, and the settling full-bleed finale.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------- content ---------------- */

const APART = [
  {
    no: "01",
    title: "Curated, Not Collected",
    body: "Every brand within the Artyk portfolio is selected with purpose. We believe that meaningful choices create better spaces.",
    tone: "t-ivory",
  },
  {
    no: "02",
    title: "Expertise Beyond Retail",
    body: "Our team collaborates with homeowners, architects, designers and developers to support projects from concept through execution.",
    tone: "t-oat",
  },
  {
    no: "03",
    title: "A Complete Design Journey",
    body: "From furniture and kitchens to wardrobes, finishes, and bespoke solutions, Artyk offers a seamless experience tailored to each project’s unique requirements.",
    tone: "t-mist",
  },
  {
    no: "04",
    title: "An Immersive Gallery Experience",
    body: "Our gallery is designed to inspire. Through thoughtfully curated displays, material exploration, and personalised consultations, clients experience design in a way that goes beyond traditional retail.",
    tone: "t-camel",
  },
];

const VALUES = [
  {
    no: "No. 01",
    title: "Design with Purpose",
    body: "We believe good design should be both beautiful and meaningful.",
  },
  {
    no: "No. 02",
    title: "Craftsmanship Matters",
    body: "We value authenticity, quality, and the skill behind every detail.",
  },
  {
    no: "No. 03",
    title: "Timeless Over Temporary",
    body: "We champion enduring design that transcends trends.",
  },
  {
    no: "No. 04",
    title: "Relationships First",
    body: "The best projects are built on trust, collaboration, and shared vision.",
  },
];

/* ---------------- building blocks ---------------- */

/**
 * An image plane floating over an offset hairline frame. The photograph and
 * the frame drift on opposite parallax vectors, so scrolling separates the
 * two layers — quiet depth, no theatrics. The image unveils through a
 * bottom-up mask while it settles from a gentle overscale.
 */
function ParallaxFigure({
  src,
  alt,
  ratio,
  caption,
  note,
  className = "",
  frame = true,
  strength = 1,
  reduce,
  objectPosition,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  ratio: string;
  caption?: string;
  note?: string;
  className?: string;
  frame?: boolean;
  strength?: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  /* Observe the unclipped <figure>, never the clipped plane itself: Chrome
     computes IntersectionObserver geometry after clip-path, so a fully
     clipped element never reports as intersecting and the reveal would
     never fire. */
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const play = !reduce && inView;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useSpring(
    useTransform(scrollYProgress, [0, 1], [`${4.5 * strength}%`, `${-4.5 * strength}%`]),
    { stiffness: 70, damping: 24, mass: 0.4 }
  );
  const frameY = useSpring(
    useTransform(scrollYProgress, [0, 1], [`${-3 * strength}%`, `${3 * strength}%`]),
    { stiffness: 70, damping: 24, mass: 0.4 }
  );

  return (
    <figure ref={ref} className={`ch-fig ${className}`}>
      {/* frame hugs only the image plane, so its offset never reaches the
          caption below */}
      <div className={`ch-fig-plate${frame ? " has-frame" : ""}`}>
        {frame ? (
          <motion.span
            className="ch-frame"
            style={{ y: reduce ? 0 : frameY }}
            aria-hidden="true"
          />
        ) : null}
        <motion.div
          className="ch-fig-clip"
          style={{ aspectRatio: ratio, y: reduce ? 0 : imgY }}
          initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
          animate={play ? { clipPath: "inset(0% 0 0 0)" } : undefined}
          transition={{ duration: 1.5, ease: EASE }}
        >
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            style={objectPosition ? { objectPosition } : undefined}
            initial={reduce ? false : { scale: 1.16 }}
            animate={play ? { scale: 1.03 } : undefined}
            whileHover={reduce ? undefined : { scale: 1.055 }}
            transition={{ duration: 2, ease: EASE }}
          />
        </motion.div>
      </div>
      {caption ? (
        <figcaption>
          <span className="cap">{caption}</span>
          {note ? <span className="micro">{note}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

type ValueItem = { no: string; title: string; body: string };

/**
 * A timeline entry that stays blurred and watermarked until the scroll reaches
 * it, then resolves into focus — clarity is bought with scroll, not granted on
 * first paint. The rail dot brightens on the same progress.
 */
function TimelineRow({ v }: { v: ValueItem }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 55%"] });
  /* each row rises out of focus and resolves into clarity as it is scrolled to:
     a real blur that melts to sharp, paired with a fade. The blur lives on an
     inner element pinned to its own GPU layer (translateZ) so Safari repaints
     it cleanly and never leaves a stale ghost below the settled text. */
  const opacity = useSpring(useTransform(scrollYProgress, [0, 1], [0.3, 1]), { stiffness: 92, damping: 26 });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [26, 0]), { stiffness: 92, damping: 26 });
  const blurPx = useSpring(useTransform(scrollYProgress, [0, 1], [10, 0]), { stiffness: 90, damping: 28 });
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const dotScale = useSpring(useTransform(scrollYProgress, [0.12, 1], [0.4, 1]), { stiffness: 120, damping: 20 });
  const dotOpacity = useTransform(scrollYProgress, [0.12, 0.6], [0.25, 1]);

  return (
    <div className="tl-row" ref={ref}>
      <motion.div className="tl-titlewrap" style={reduce ? undefined : { opacity, y }}>
        <motion.div className="tl-blur" style={reduce ? undefined : { filter }}>
          <span className="tl-no it">{v.no}</span>
          <h3 className="display tl-title">{v.title}</h3>
        </motion.div>
      </motion.div>
      <motion.span
        className="tl-dot"
        aria-hidden="true"
        style={reduce ? undefined : { scale: dotScale, opacity: dotOpacity }}
      />
      <motion.div className="tl-bodywrap" style={reduce ? undefined : { opacity, y }}>
        <motion.p className="tl-body tl-blur" style={reduce ? undefined : { filter }}>
          {v.body}
        </motion.p>
      </motion.div>
    </div>
  );
}

type ApartItem = { no: string; title: string; body: string };

/**
 * One conviction in the index: a large watermark numeral behind, a drawn rule
 * above, and a hover state that warms the row — title to corten with a sweeping
 * underline, the numeral surfacing, an arrow arriving from the right.
 */
function ApartRow({ a }: { a: ApartItem }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      className="apart-row"
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.95, ease: EASE }}
    >
      <motion.span
        className="apart-rule"
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.3, ease: EASE }}
      />
      <span className="apart-ghost display" aria-hidden="true">
        {a.no}
      </span>
      <div className="apart-head">
        <h3 className="display apart-t">{a.title}</h3>
      </div>
      <p className="apart-d">{a.body}</p>
      <span className="apart-dot" aria-hidden="true" />
    </motion.div>
  );
}

/* ---------------- chapters ---------------- */

export default function AboutChapters() {
  const reduce = useReducedMotion() ?? false;

  /* finale backdrop: settles from overscale as the chapter scrolls through */
  const finRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: finBgP } = useScroll({
    target: finRef,
    offset: ["start end", "end start"],
  });
  const finScale = useTransform(finBgP, [0, 0.55], [1.15, 1]);
  const finY = useTransform(finBgP, [0, 1], ["0%", "-3.5%"]);

  /* finale copy: the frame pins and the three stages cross-fade in place —
     each one materialises at the exact same centre, so nothing ever travels
     up the screen. finP runs 0→1 across the pinned span only. */
  const { scrollYProgress: finP } = useScroll({
    target: finRef,
    offset: ["start start", "end end"],
  });
  const finS = useSpring(finP, { stiffness: 120, damping: 30, mass: 0.35 });

  const st0o = useTransform(finS, [0.0, 0.26, 0.34], [1, 1, 0]);
  const st0s = useTransform(finS, [0.0, 0.34], [1, 1.03]);
  const st1o = useTransform(finS, [0.3, 0.38, 0.62, 0.7], [0, 1, 1, 0]);
  const st1s = useTransform(finS, [0.3, 0.38, 0.7], [0.97, 1, 1.03]);
  const st2o = useTransform(finS, [0.66, 0.74, 1], [0, 1, 1]);
  const st2s = useTransform(finS, [0.66, 0.74], [0.97, 1]);

  /* values timeline: the rail draws down as the list scrolls through view */
  const valRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: valP } = useScroll({
    target: valRef,
    offset: ["start 82%", "end 62%"],
  });
  const railScaleY = useSpring(valP, { stiffness: 58, damping: 22, mass: 0.5 });

  /* "What Sets Us Apart": on desktop each row highlights on hover. Touch has
     no hover, so on mobile we drive the same active state from scroll — the
     row nearest the focus line lights up (corten title + underline, brighter
     numeral, dot), one at a time, progressing through all four. */
  const apartRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = apartRef.current;
    if (!el || typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 820px)").matches) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".apart-row"));
    if (!rows.length) return;
    let raf = 0;
    let current = -1;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.42;
      let best = 0;
      let bestDist = Infinity;
      rows.forEach((r, i) => {
        const b = r.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - line);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best !== current) {
        current = best;
        rows.forEach((r, i) => r.classList.toggle("is-active", i === best));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      document.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/* ================= VISION & MISSION — two panels ================= */}
      <section className="ch-vm">
        <div className="wrap">
          <div className="kicker kicker--draw rv">
            <span className="micro k">Vision &amp; Mission</span>
            <span className="l" />
            <span className="r">What drives us</span>
          </div>
          <div className="vm-stack">
            {/* Vision — horizontal card. Its top is a blank label tab: when the
                Mission card stacks over it, only this image-free strip peeks. */}
            <div className="vm-stick vm-stick-1">
              <motion.article
                className="vm-card vm-card--vision"
                initial={reduce ? false : { opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: EASE }}
              >
                <div className="vm-cap">
                  <span className="vm-eyebrow micro">
                    <span className="vm-dot" aria-hidden="true" />
                    Our Vision
                  </span>
                </div>
                <div className="vm-row">
                  <div className="vm-media">
                    <ParallaxFigure
                      className="vm-fig"
                      src="/images/about/Artzy Por ED-49.jpg"
                      alt="The threshold of the Artyk gallery at dusk"
                      ratio="5 / 4"
                      frame={false}
                      strength={0.6}
                      reduce={reduce}
                      objectPosition="center 80%"
                    />
                  </div>
                  <div className="vm-body">
                    <p className="display vm-lead">
                      To be India&rsquo;s leading destination for ultra-luxurious furniture — setting
                      the standard for excellence in design, quality, and service.
                    </p>
                    <p className="vm-note">
                      We create spaces that <span className="accent">inspire and captivate</span>,
                      fostering a culture of refined elegance and sophistication.
                    </p>
                  </div>
                </div>
              </motion.article>
            </div>

            {/* Mission — an editorial photo spread that stacks over Vision */}
            <div className="vm-stick vm-stick-2">
              <motion.article
                className="vm-card vm-card--mission"
                initial={reduce ? false : { opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1, ease: EASE }}
              >
                <span className="vm-eyebrow micro mis-eyebrow">
                  <span className="vm-dot" aria-hidden="true" />
                  Our Mission
                </span>

                <div className="mis-photos">
                  {[
                    { src: "/images/about/_1HK2374.jpg", alt: "A dining composition in the Artyk gallery", rot: -3.4 },
                    { src: "/images/about/L1032013.jpg", alt: "The Artyk gallery floor", rot: 1.6 },
                    { src: "/images/featured/_ART5240-Edit.jpg", alt: "A design consultation at Artyk", rot: -1.4 },
                  ].map((p, i) => (
                    <motion.div
                      key={p.src}
                      className="mis-photo"
                      initial={reduce ? false : { opacity: 0, y: 46, rotate: 0 }}
                      whileInView={{ opacity: 1, y: 0, rotate: p.rot }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1.05, ease: EASE, delay: 0.18 + i * 0.12 }}
                    >
                      <ParallaxFigure
                        className="mis-fig"
                        src={p.src}
                        alt={p.alt}
                        ratio="4 / 5"
                        frame={false}
                        strength={0.5}
                        reduce={reduce}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="mis-foot">
                  <p className="mis-body">
                    To connect discerning clients with the world&rsquo;s finest design brands through
                    thoughtful curation, expert guidance, and{" "}
                    <span className="accent">end-to-end</span> solutions — delivering spaces that
                    balance beauty, functionality, and longevity.
                  </p>
                  <span className="mis-mark micro">Artyk &middot; Hyderabad</span>
                </div>
              </motion.article>
            </div>

            {/* short trailing dwell — just enough for the stack to settle, then
                the scroll releases freely into the next section */}
            <div className="vm-spacer" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ================= WHAT SETS US APART — editorial index ================= */}
      <section className="ch-apart">
        <div className="wrap">
          <div className="kicker kicker--draw rv">
            <span className="micro k">What Sets Us Apart</span>
            <span className="l" />
            <span className="r">Four convictions</span>
          </div>
          <div className="apart-list" ref={apartRef}>
            {APART.map((a) => (
              <ApartRow key={a.no} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR VALUES — the straight timeline ================= */}
      <section className="ch-values">
        <div className="wrap">
          <div className="kicker kicker--draw rv">
            <span className="micro k">Our Values</span>
            <span className="l" />
            <span className="r">Held quietly</span>
          </div>
          <div className="tl" ref={valRef}>
            <span className="tl-track" aria-hidden="true" />
            <motion.span
              className="tl-rail"
              aria-hidden="true"
              style={{ scaleY: reduce ? 1 : railScaleY }}
            />
            {VALUES.map((v) => (
              <TimelineRow key={v.no} v={v} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= AN ADDRESS FOR DESIGN — the finale ================= */}
      {/* The frame pins for the whole section and the copy cross-fades in
          place: one stage dissolves as the next materialises on the very
          same centre line. Nothing scrolls past — only the words change. */}
      <section className="ch-fin" ref={finRef}>
        <div className="ch-fin-sticky">
          <motion.div
            className="ch-fin-bg"
            aria-hidden="true"
            style={reduce ? undefined : { scale: finScale, y: finY }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about/Area 8 (9).jpg"
              alt=""
              loading="lazy"
            />
          </motion.div>
          <span className="ch-fin-shade" aria-hidden="true" />

          <div className="ch-fin-stages">
            <motion.div
              className="ch-fin-stage"
              style={reduce ? undefined : { opacity: st0o, scale: st0s }}
            >
              <span className="micro rv">Artyk · Hyderabad</span>
              <h2 className="display ch-fin-title split">
                An Address
                <br />
                for Design.
              </h2>
            </motion.div>

            <motion.div
              className="ch-fin-stage"
              style={reduce ? undefined : { opacity: st1o, scale: st1s }}
            >
              <p className="ch-fin-quote">
                Artyk is where global design meets local understanding.
              </p>
              <p className="ch-fin-quote">
                A place where craftsmanship is celebrated, ideas are explored, and exceptional
                spaces begin.
              </p>
            </motion.div>

            <motion.div
              className="ch-fin-stage"
              style={reduce ? undefined : { opacity: st2o, scale: st2s }}
            >
              <p className="ch-fin-body">
                Whether furnishing a private residence, designing a workplace, or creating a
                hospitality destination, we partner with our clients to bring thoughtful design to
                life.
              </p>
              <a className="sweep ch-fin-cta" href="/contact">
                Visit the Gallery
              </a>
            </motion.div>
          </div>
        </div>
      </section>

    </>
  );
}

/* ---------------- scoped styles (under .artyk-about) ---------------- */

const CSS = `
/* kicker hairlines draw themselves open in the chapters */
.artyk-about .kicker--draw .l{transform:scaleX(0);transform-origin:left;transition:transform 1.6s var(--ease) .25s}
.artyk-about .kicker--draw.in .l{transform:scaleX(1)}

/* shared figure language: floating plane over an offset hairline frame */
.artyk-about .ch-fig{position:relative}
.artyk-about .ch-fig-plate{position:relative}
/* clear the caption past the frame's downward offset (26px) plus its
   parallax swing, so the two never collide */
.artyk-about .ch-fig-plate.has-frame{margin-bottom:clamp(40px,4.5vw,50px)}
.artyk-about .ch-frame{position:absolute;top:26px;left:26px;right:-26px;bottom:-26px;border:1px solid var(--line);pointer-events:none}
.artyk-about .ch-fig-clip{position:relative;overflow:hidden;background:rgba(31,36,32,.06)}
.artyk-about .ch-fig-clip img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform}

/* ================= VISION & MISSION — stacking cards ================= */
/* Two cards pinned in sequence: Vision sticks first, then the Mission spread
   rises and settles over it, leaving only Vision's blank label-tab (~2cm,
   image-free) peeking above — the card-stack gesture. */
.artyk-about .ch-vm{background:var(--stone)}
.artyk-about .vm-stack{position:relative;margin-top:clamp(18px,2.6vw,40px)}
.artyk-about .vm-stick{position:sticky}
.artyk-about .vm-stick-1{top:clamp(88px,10vh,116px);z-index:1}
.artyk-about .vm-stick-2{top:calc(clamp(88px,10vh,116px) + 78px);z-index:2;margin-top:clamp(40px,7vh,84px)}
/* short dwell so the stack settles, then releases — no long stuck feeling */
.artyk-about .vm-spacer{height:clamp(90px,16vh,220px)}
.artyk-about .vm-card{background:var(--paper);border:1px solid var(--line);
  box-shadow:0 -16px 46px rgba(31,36,32,.10),0 34px 80px rgba(31,36,32,.13);will-change:transform}

/* ---- Vision card: blank tab + horizontal content ---- */
.artyk-about .vm-card--vision{display:flex;flex-direction:column;padding:clamp(14px,1.2vw,20px)}
/* the tab that peeks — deliberately image-free, just the label on paper */
.artyk-about .vm-cap{min-height:clamp(84px,10vh,96px);display:flex;align-items:center;
  padding:0 clamp(8px,1vw,16px)}
.artyk-about .vm-row{display:grid;grid-template-columns:1.04fr 1fr;align-items:stretch;
  min-height:clamp(300px,38vh,420px)}
.artyk-about .vm-media{position:relative;overflow:hidden}
.artyk-about .vm-fig{height:100%}
.artyk-about .vm-fig .ch-fig-clip{height:100%}
.artyk-about .vm-body{display:flex;flex-direction:column;justify-content:center;
  padding:clamp(20px,2.4vw,44px) clamp(18px,2.4vw,48px)}
.artyk-about .vm-eyebrow{display:flex;align-items:center;gap:10px;color:rgba(31,36,32,.6)}
.artyk-about .vm-dot{width:8px;height:8px;border-radius:50%;background:var(--corten);opacity:.85;flex:none}
.artyk-about .vm-lead{font-size:clamp(1.3rem,1.9vw,1.8rem);line-height:1.22}
.artyk-about .vm-lead .accent{font-style:italic;color:var(--corten)}
.artyk-about .vm-note{font-size:15px;line-height:1.72;color:rgba(31,36,32,.72);margin-top:clamp(16px,1.6vw,22px);max-width:42ch}
.artyk-about .vm-note .accent{font-style:italic;color:var(--corten)}

/* ---- Mission card: an editorial three-photo spread (kept compact so it
   sits fully within the viewport while pinned) ---- */
.artyk-about .vm-card--mission{position:relative;padding:clamp(20px,2.2vw,34px) clamp(22px,3vw,56px) clamp(16px,2vw,28px)}
/* dot + label, top-left corner — matching the Vision card's tab */
.artyk-about .mis-eyebrow{margin-bottom:clamp(24px,3.2vw,44px);color:rgba(31,36,32,.6)}
.artyk-about .mis-photos{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(14px,2vw,30px);
  align-items:center;max-width:clamp(440px,54vw,600px);margin:0 auto}
.artyk-about .mis-photo{will-change:transform}
.artyk-about .mis-photo:nth-child(2){transform:translateY(-4%)}
.artyk-about .mis-fig .ch-fig-clip{border:7px solid #FBFAF5;box-shadow:0 20px 44px rgba(31,36,32,.18)}
.artyk-about .mis-foot{max-width:560px;margin:clamp(16px,2.2vw,30px) auto 0;text-align:center}
.artyk-about .mis-body{font-size:clamp(14.5px,1.2vw,16px);line-height:1.7;color:rgba(31,36,32,.78)}
.artyk-about .mis-body .accent{font-style:italic;color:var(--corten)}
.artyk-about .mis-mark{display:block;margin-top:clamp(14px,1.8vw,22px);letter-spacing:.34em;color:rgba(31,36,32,.5)}

@media(max-width:820px){
  /* the card-stack, on mobile too: both cards fixed to one viewport-fitting
     height so the Mission spread fully rises over and replaces the Vision
     card, leaving only Vision's image-free label tab peeking above */
  .artyk-about .vm-stick{position:sticky}
  .artyk-about .vm-stick-1{top:18px;margin-top:0;z-index:1}
  .artyk-about .vm-stick-2{top:70px;margin-top:clamp(30px,6vh,60px);z-index:2}
  .artyk-about .vm-spacer{display:block;height:34vh}

  .artyk-about .vm-card{height:min(66vh,600px)}

  /* Vision: the cap is the peek; the image fills the space above the text */
  .artyk-about .vm-cap{min-height:52px}
  .artyk-about .vm-row{display:flex;flex-direction:column;min-height:0;flex:1;overflow:hidden}
  .artyk-about .vm-media{flex:1;min-height:150px}
  .artyk-about .vm-fig,.artyk-about .vm-fig .ch-fig-clip{height:100%}
  .artyk-about .vm-body{flex:none;padding:clamp(16px,3.4vw,24px) clamp(14px,3vw,20px) clamp(4px,1.6vw,10px)}
  .artyk-about .vm-lead{font-size:clamp(1.18rem,4.6vw,1.5rem);line-height:1.2}
  .artyk-about .vm-note{font-size:13.5px;line-height:1.6;margin-top:9px}

  /* Mission: centre the editorial content within the same fixed height.
     NB: auto side-margins on a flex item cancel the stretch, so photos/foot
     must take full width explicitly or the grid collapses to ~0. */
  .artyk-about .vm-card--mission{display:flex;flex-direction:column;justify-content:center}
  .artyk-about .mis-eyebrow{margin-bottom:clamp(14px,3vw,24px)}
  .artyk-about .mis-photos{gap:9px;max-width:none;width:100%;margin:0}
  .artyk-about .mis-fig .ch-fig-clip{border-width:5px}
  .artyk-about .mis-foot{max-width:none;width:100%;margin:clamp(12px,3vw,20px) 0 0}
  .artyk-about .mis-body{font-size:14px;line-height:1.62}
}

/* ================= WHAT SETS US APART — the interactive index ================= */
.artyk-about .ch-apart{background:var(--ivory)}
.artyk-about .apart-list{margin-top:clamp(14px,2vw,30px)}
.artyk-about .apart-row{position:relative;display:grid;grid-template-columns:repeat(12,1fr);
  column-gap:clamp(28px,4vw,64px);row-gap:14px;align-items:center;
  padding:clamp(34px,4.8vw,60px) clamp(10px,1.6vw,28px);
  transition:background .7s var(--ease)}
.artyk-about .apart-rule{position:absolute;top:0;left:0;width:100%;height:1px;background:var(--line);transform-origin:left}
.artyk-about .apart-row:first-child .apart-rule{display:none}
/* the single numeral — a large soft watermark that reads as the index */
.artyk-about .apart-ghost{position:absolute;left:clamp(-2px,0vw,6px);top:50%;transform:translateY(-50%);
  font-style:italic;font-weight:300;font-size:clamp(3.4rem,5.6vw,5.6rem);line-height:1;
  color:rgba(168,88,56,.13);pointer-events:none;z-index:0;
  transition:color .7s var(--ease),transform .7s var(--ease)}
.artyk-about .apart-head{grid-column:1/6;padding-left:clamp(58px,6vw,108px);position:relative;z-index:1}
.artyk-about .apart-t{position:relative;display:inline;font-size:clamp(1.4rem,2.2vw,2.05rem);line-height:1.1;
  background-image:linear-gradient(var(--corten),var(--corten));
  background-repeat:no-repeat;background-position:0 100%;background-size:0% 1px;
  transition:color .5s var(--ease),background-size .55s var(--ease)}
.artyk-about .apart-d{grid-column:7/12;font-size:15.5px;line-height:1.75;color:rgba(91,95,84,1);max-width:46ch;position:relative;z-index:1}
.artyk-about .apart-dot{grid-column:12;justify-self:end;align-self:center;width:9px;height:9px;border-radius:50%;
  background:var(--corten);opacity:0;transform:scale(.35);position:relative;z-index:1;
  transition:opacity .5s var(--ease),transform .5s var(--ease)}
@media(hover:hover){
  .artyk-about .apart-row:hover{background:rgba(168,88,56,.035)}
  .artyk-about .apart-row:hover .apart-ghost{color:rgba(168,88,56,.22);transform:translateY(-50%) translateX(7px)}
  .artyk-about .apart-row:hover .apart-t{color:var(--corten);background-size:100% 1px}
  .artyk-about .apart-row:hover .apart-dot{opacity:1;transform:scale(1)}
}
/* scroll-driven active state — applied on touch (JS) where :hover can't fire.
   Only added on mobile, so these mirror the mobile numeral position. */
.artyk-about .apart-row.is-active{background:rgba(168,88,56,.05)}
.artyk-about .apart-row.is-active .apart-ghost{color:rgba(168,88,56,.26);transform:translateX(5px)}
.artyk-about .apart-row.is-active .apart-t{color:var(--corten);background-size:100% 1px}
.artyk-about .apart-row.is-active .apart-dot{opacity:1;transform:scale(1)}
@media(max-width:820px){
  .artyk-about .apart-row{padding-left:2px;padding-right:2px;align-items:start}
  .artyk-about .apart-head{grid-column:1/13;padding-left:56px}
  .artyk-about .apart-d{grid-column:1/13;padding-left:56px;margin-top:6px}
  /* the dot sits at the top-right and fades in for the active row */
  .artyk-about .apart-dot{display:block;position:absolute;right:6px;top:clamp(40px,6.5vw,58px);
    justify-self:auto;align-self:auto}
  .artyk-about .apart-ghost{font-size:3rem;top:clamp(30px,5vw,46px);transform:none}
}

/* ================= VALUES — the straight timeline ================= */
.artyk-about .ch-values{background:var(--stone)}
.artyk-about .tl{position:relative;margin-top:clamp(18px,3vw,42px);padding:clamp(8px,1.6vw,20px) 0}
.artyk-about .tl-track{position:absolute;left:50%;top:0;bottom:0;width:1px;transform:translateX(-50%);background:var(--line)}
.artyk-about .tl-rail{position:absolute;left:50%;top:0;bottom:0;width:1px;margin-left:-.5px;
  background:linear-gradient(var(--corten),rgba(168,88,56,.35));transform-origin:top}
.artyk-about .tl-row{position:relative;display:grid;grid-template-columns:1fr 0 1fr;align-items:center;
  column-gap:clamp(30px,4.5vw,70px);padding:clamp(30px,5.2vh,60px) 0}
.artyk-about .tl-titlewrap{grid-column:1;text-align:right;cursor:default;user-select:none;-webkit-user-select:none}
.artyk-about .tl-bodywrap{grid-column:3}
/* the blurred layer is pinned to its own GPU layer so Safari repaints the
   filter cleanly and never leaves a stale ghost when blur settles to 0 */
.artyk-about .tl-blur{-webkit-transform:translateZ(0);transform:translateZ(0);will-change:filter}
.artyk-about .tl-no{display:block;font-family:var(--font-display),serif;font-style:italic;font-weight:300;
  font-size:clamp(.9rem,1.2vw,1.05rem);color:rgba(31,36,32,.42);margin-bottom:8px}
.artyk-about .tl-title{font-size:clamp(1.4rem,2.4vw,2.1rem);line-height:1.08}
.artyk-about .tl-dot{position:absolute;left:50%;top:50%;width:11px;height:11px;border-radius:50%;
  transform:translate(-50%,-50%);background:var(--corten);
  box-shadow:0 0 0 5px var(--stone),0 0 0 6px rgba(168,88,56,.2)}
.artyk-about .tl-body{grid-column:3;text-align:left;font-size:clamp(1rem,1.4vw,1.2rem);line-height:1.6;
  color:rgba(31,36,32,.66);max-width:34ch;cursor:default;user-select:none;-webkit-user-select:none}
@media(max-width:820px){
  .artyk-about .tl-track,.artyk-about .tl-rail{left:6px}
  .artyk-about .tl-row{grid-template-columns:1fr;column-gap:0;row-gap:10px;padding-left:34px}
  .artyk-about .tl-titlewrap{grid-column:1;text-align:left}
  .artyk-about .tl-bodywrap{grid-column:1}
  .artyk-about .tl-body{grid-column:1;text-align:left;max-width:none}
  .artyk-about .tl-dot{left:6px;top:clamp(34px,5.6vh,52px)}
}

/* ================= FINALE — full-width band, bounded height ================= */
/* The backdrop runs full-bleed left to right, but its height is bounded so the
   page shows above and below it: a full-width section block, not a full-screen
   takeover and not a boxed card. The section is a runway of 3 frame-heights
   (the same page height the old stacked blocks occupied) and the frame stays
   pinned across all of it while the copy cross-fades in place. */
.artyk-about .ch-fin{position:relative;background:var(--stone);padding:0;--fin-h:min(80svh,760px);--fin-top:clamp(40px,9vh,96px);height:calc(3 * var(--fin-h))}
@media(max-width:640px){.artyk-about .ch-fin{--fin-h:min(65svh,600px)}}
.artyk-about .ch-fin-sticky{position:sticky;top:var(--fin-top);height:var(--fin-h);overflow:hidden}
.artyk-about .ch-fin-bg{position:absolute;inset:0;will-change:transform}
.artyk-about .ch-fin-bg img{width:100%;height:100%;object-fit:cover;filter:blur(2.4px);transform:scale(1.02)}
.artyk-about .ch-fin-shade{position:absolute;inset:0;background:
  linear-gradient(to bottom,rgba(31,36,32,.52),rgba(31,36,32,.38) 34%,rgba(31,36,32,.38) 66%,rgba(31,36,32,.66));
}
/* every stage is stacked on the same centre; only opacity separates them, so
   each line of copy arrives exactly where the last one left */
.artyk-about .ch-fin-stages{position:absolute;inset:0}
/* pointer-events:none keeps the faded-out stages from swallowing clicks; the
   last stage carries the only link, so it alone stays interactive */
.artyk-about .ch-fin-stage{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(32px,5vh,64px) clamp(16px,3vw,44px);will-change:opacity,transform;pointer-events:none}
.artyk-about .ch-fin-stage:last-child{pointer-events:auto}
.artyk-about .ch-fin .micro{color:rgba(244,241,233,.62)}
.artyk-about .ch-fin-title{margin-top:18px;color:var(--ivory);font-size:clamp(2.5rem,4.5vw,4rem);line-height:1.08;letter-spacing:-0.01em}
.artyk-about .ch-fin-quote{font-family:var(--font-sans),sans-serif;font-style:normal;font-weight:400;
  font-size:clamp(1.05rem,1.5vw,1.375rem);line-height:1.7;color:rgba(244,241,233,.94);max-width:28em}
.artyk-about .ch-fin-quote + .ch-fin-quote{margin-top:clamp(20px,3vh,34px)}
.artyk-about .ch-fin-body{font-family:var(--font-sans),sans-serif;font-style:normal;font-weight:400;font-size:clamp(1.05rem,1.5vw,1.375rem);line-height:1.7;color:rgba(244,241,233,.9);max-width:28em}
.artyk-about .ch-fin-cta{margin-top:34px;color:var(--ivory)}
.artyk-about .ch-fin-cta::after{background:var(--ivory)}

/* colophon strip */
.artyk-about .ch-colo{background:var(--stone);padding:26px 0 clamp(150px,17vw,210px)}
.artyk-about .ch-colo .colophon{margin-top:0}

@media(prefers-reduced-motion:reduce){
  .artyk-about .kicker--draw .l{transform:scaleX(1);transition:none}
  /* no pin, no cross-fade: the three stages simply stack down the page */
  .artyk-about .ch-fin{height:auto}
  .artyk-about .ch-fin-sticky{position:relative;height:auto}
  .artyk-about .ch-fin-stages{position:relative;inset:auto}
  .artyk-about .ch-fin-stage{position:relative;inset:auto;min-height:var(--fin-h);opacity:1;transform:none;pointer-events:auto}
}
`;
