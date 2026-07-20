"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * The editorial chapters that follow "Our Philosophy" on the About page:
 * Vision → Mission → What Sets Us Apart (exhibition) → Values → the finale.
 *
 * Mounted inside AboutEditorial's `.artyk-about` root, so it inherits the
 * page's scoped design language (kicker / micro / display / rv / split) and
 * the parent's word-mask + IntersectionObserver reveal engine. Framer Motion
 * adds the scroll-linked work: layered parallax planes, the sticky exhibition
 * crossfade, and the settling full-bleed finale.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------- content ---------------- */

const EXHIBITS = [
  {
    numeral: "i",
    title: "Curated, Not Collected",
    body: "Every brand within the Artyk portfolio is selected with purpose. We believe that meaningful choices create better spaces.",
    image: "/images/showroom/gallery.jpg",
    alt: "The Artyk gallery floor — curated furniture compositions in a sweeping hall",
  },
  {
    numeral: "ii",
    title: "Expertise Beyond Retail",
    body: "Our team collaborates with homeowners, architects, designers and developers to support projects from concept through execution.",
    image: "/images/showroom/living-2.jpg",
    alt: "A living composition at Artyk — sofa, lighting and art in conversation",
  },
  {
    numeral: "iii",
    title: "A Complete Design Journey",
    body: "From furniture and kitchens to wardrobes, finishes, and bespoke solutions, Artyk offers a seamless experience tailored to each project’s unique requirements.",
    image: "/images/showroom/kitchen.jpg",
    alt: "A bespoke kitchen display in the Artyk gallery",
  },
  {
    numeral: "iv",
    title: "An Immersive Gallery Experience",
    body: "Our gallery is designed to inspire. Through thoughtfully curated displays, material exploration, and personalised consultations, clients experience design in a way that goes beyond traditional retail.",
    image: "/images/about/image-4.jpg",
    alt: "Inside the Artyk gallery — floor-to-ceiling glass framing dense greenery",
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
}: {
  src: string;
  alt: string;
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

/** One exhibit in the sticky gallery; reports itself when it holds the viewport centre. */
function ExhibitRow({
  index,
  numeral,
  title,
  body,
  image,
  alt,
  onActive,
}: {
  index: number;
  numeral: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="ch-ex-row rv">
      <span className="micro no">Exhibit {numeral}</span>
      <h3 className="display t">{title}</h3>
      <p className="d">{body}</p>
      <div className="ch-ex-mimg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} loading="lazy" />
      </div>
    </li>
  );
}

/* ---------------- chapters ---------------- */

export default function AboutChapters() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  /* finale backdrop: settles from overscale as the chapter scrolls through */
  const finRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: finP } = useScroll({
    target: finRef,
    offset: ["start end", "end start"],
  });
  const finScale = useTransform(finP, [0, 0.55], [1.15, 1]);
  const finY = useTransform(finP, [0, 1], ["0%", "-3.5%"]);

  return (
    <>
      <style>{CSS}</style>

      {/* ================= OUR VISION ================= */}
      <section className="ch-vision">
        <div className="wrap">
          <div className="kicker kicker--draw rv">
            <span className="micro k">Our Vision</span>
            <span className="l" />
            <span className="r">The horizon</span>
          </div>
          <div className="ch-vision-grid">
            <div className="ch-vision-txt">
              <p className="display ch-lead split">
                To be India&rsquo;s leading destination for ultra-luxurious furniture, setting the
                standard for excellence in design, quality, and customer service. We aspire to
                create spaces that <span className="accent">inspire and captivate</span>, fostering
                a culture of refined elegance and sophistication.
              </p>
            </div>
            <ParallaxFigure
              className="ch-vision-fig"
              src="/images/featured/entrance-2.jpg"
              alt="The threshold of the Artyk gallery at dusk"
              ratio="3 / 4"
              caption="The address — where the aspiration begins."
              note="Jubilee Hills, Hyderabad"
              reduce={reduce}
            />
          </div>
        </div>
      </section>

      {/* ================= OUR MISSION ================= */}
      <section className="ch-mission">
        <div className="wrap">
          <div className="kicker kicker--draw rv">
            <span className="micro k">Our Mission</span>
            <span className="l" />
            <span className="r">The practice</span>
          </div>
          <div className="ch-mis-grid">
            <div className="ch-mis-media">
              <ParallaxFigure
                className="ch-mis-a"
                src="/images/showroom/dining.jpg"
                alt="A dining composition in the Artyk gallery"
                ratio="4 / 3"
                caption="Collections presented as rooms, not rows."
                reduce={reduce}
              />
              <ParallaxFigure
                className="ch-mis-b"
                src="/images/services/service-consulting.jpg"
                alt="A design consultation at Artyk — materials and drawings on the table"
                ratio="3 / 4"
                frame={false}
                strength={-1.6}
                reduce={reduce}
              />
            </div>
            <div className="ch-mis-txt">
              <p className="display ch-lead ch-lead--m split">
                To connect discerning clients with the world&rsquo;s finest design brands through
                thoughtful curation, expert guidance, and end-to-end project solutions.
              </p>
              <hr className="rule ch-rule rv d1" />
              <p className="ch-body rv d2">
                We are committed to delivering spaces that balance beauty, functionality, and
                longevity while fostering a deeper appreciation for design, craftsmanship, and
                material excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT SETS US APART — the exhibition ================= */}
      <section className="ch-ex">
        <div className="wrap">
          <div className="kicker kicker--draw rv">
            <span className="micro k">What Sets Us Apart</span>
            <span className="l" />
            <span className="r">A private exhibition</span>
          </div>
          <div className="ch-ex-grid">
            <div className="ch-ex-stick">
              <div className="ch-ex-stickin">
                <div className="ch-ex-media">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={EXHIBITS[active].image}
                      src={EXHIBITS[active].image}
                      alt={EXHIBITS[active].alt}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduce ? 0.2 : 1.15, ease: EASE }}
                    />
                  </AnimatePresence>
                  <span className="ch-ex-shade" aria-hidden="true" />
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                      key={active}
                      className="ch-ex-no display"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE }}
                    >
                      {String(active + 1).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="micro ch-ex-cap">The Artyk portfolio — in four rooms</p>
              </div>
            </div>
            <ol className="ch-ex-list">
              {EXHIBITS.map((ex, i) => (
                <ExhibitRow key={ex.numeral} index={i} onActive={setActive} {...ex} />
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ================= OUR VALUES — the museum wall ================= */}
      <section className="ch-values">
        <div className="wrap">
          <div className="kicker kicker--draw rv">
            <span className="micro k">Our Values</span>
            <span className="l" />
            <span className="r">Held quietly</span>
          </div>
          <ol className="ch-val-list">
            {VALUES.map((v) => (
              <li key={v.no} className="ch-val rv">
                <span className="ch-val-no it">{v.no}</span>
                <h3 className="display ch-val-t">{v.title}</h3>
                <p className="ch-val-d it">{v.body}</p>
                <span className="ch-val-ln" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= AN ADDRESS FOR DESIGN — the finale ================= */}
      <section className="ch-fin" ref={finRef}>
        <div className="ch-fin-sticky" aria-hidden="true">
          <motion.div
            className="ch-fin-bg"
            style={reduce ? undefined : { scale: finScale, y: finY }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/featured/entrance.jpg"
              alt=""
              loading="lazy"
            />
          </motion.div>
          <span className="ch-fin-shade" />
        </div>
        <div className="ch-fin-flow">
          <div className="ch-fin-block">
            <span className="micro rv">Artyk · Hyderabad</span>
            <h2 className="display ch-fin-title split">
              An Address
              <br />
              for Design.
            </h2>
          </div>
          <div className="ch-fin-block">
            <p className="ch-fin-quote split">
              Artyk is where global design meets local understanding.
            </p>
          </div>
          <div className="ch-fin-block">
            <p className="ch-fin-quote split">
              A place where craftsmanship is celebrated, ideas are explored, and exceptional
              spaces begin.
            </p>
          </div>
          <div className="ch-fin-block">
            <p className="ch-fin-body rv">
              Whether furnishing a private residence, designing a workplace, or creating a
              hospitality destination, we partner with our clients to bring thoughtful design to
              life.
            </p>
            <a className="sweep ch-fin-cta rv d2" href="/contact">
              Visit the Gallery — By Appointment
            </a>
          </div>
        </div>
      </section>

      {/* colophon — the imprint on the last page */}
      <div className="ch-colo">
        <div className="wrap">
          <div className="colophon rv">
            <span className="micro">Artyk</span>
            <span className="it">Hyderabad</span>
            <span className="micro">© Artyk</span>
          </div>
        </div>
      </div>
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
.artyk-about .ch-lead{font-size:clamp(1.9rem,3.6vw,3.3rem);line-height:1.16}
.artyk-about .ch-lead .accent{font-style:italic;color:var(--corten)}
.artyk-about .ch-lead--m{font-size:clamp(1.55rem,2.9vw,2.55rem)}
.artyk-about .ch-body{font-size:15.5px;color:rgba(31,36,32,.78);max-width:44ch}
.artyk-about .ch-rule{margin:clamp(24px,3vw,38px) 0}

/* ================= VISION ================= */
.artyk-about .ch-vision{background:var(--stone)}
.artyk-about .ch-vision-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(28px,4.5vw,72px);align-items:center}
.artyk-about .ch-vision-txt{grid-column:1/8}
.artyk-about .ch-vision-fig{grid-column:9/13}
@media(max-width:920px){
  .artyk-about .ch-vision-txt{grid-column:1/13}
  .artyk-about .ch-vision-fig{grid-column:2/13;max-width:420px;margin-top:34px}
}

/* ================= MISSION ================= */
.artyk-about .ch-mission{background:var(--ivory)}
.artyk-about .ch-mis-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(28px,4.5vw,72px);align-items:center}
.artyk-about .ch-mis-media{grid-column:1/8;position:relative;padding-bottom:clamp(56px,9vw,110px)}
.artyk-about .ch-mis-txt{grid-column:8/13}
.artyk-about .ch-mis-b{position:absolute;right:-4%;bottom:0;width:min(38%,240px);z-index:2}
.artyk-about .ch-mis-b .ch-fig-clip{border:8px solid var(--ivory);box-shadow:0 24px 60px rgba(31,36,32,.18)}
@media(max-width:920px){
  .artyk-about .ch-mis-media{grid-column:1/13}
  .artyk-about .ch-mis-txt{grid-column:1/13;margin-top:8px;max-width:560px}
  .artyk-about .ch-mis-b{right:0}
  .artyk-about .ch-mis-a figcaption{max-width:50%}
}

/* ================= EXHIBITION ================= */
.artyk-about .ch-ex{background:var(--onyx);color:var(--ivory);padding:clamp(80px,10vw,140px) 0}
.artyk-about .ch-ex .micro{color:rgba(244,241,233,.5)}
.artyk-about .ch-ex .kicker .l{background:rgba(244,241,233,.16)}
.artyk-about .ch-ex .kicker .r{color:rgba(244,241,233,.45)}
.artyk-about .ch-ex-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(24px,4vw,72px)}
.artyk-about .ch-ex-stick{grid-column:1/6}
.artyk-about .ch-ex-stickin{position:sticky;top:7vh}
.artyk-about .ch-ex-media{position:relative;aspect-ratio:4/5;max-height:80vh;overflow:hidden;border:1px solid rgba(244,241,233,.16)}
.artyk-about .ch-ex-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.artyk-about .ch-ex-shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(31,36,32,.55),rgba(31,36,32,0) 42%);pointer-events:none}
.artyk-about .ch-ex-no{position:absolute;left:clamp(16px,2vw,28px);bottom:clamp(6px,1.2vw,14px);font-style:italic;font-size:clamp(3rem,5.4vw,4.8rem);line-height:1;color:rgba(244,241,233,.92)}
.artyk-about .ch-ex-cap{margin-top:14px;letter-spacing:.26em}
.artyk-about .ch-ex-list{list-style:none;grid-column:6/13}
.artyk-about .ch-ex-row{min-height:76vh;display:flex;flex-direction:column;justify-content:center;padding:clamp(32px,4vw,56px) 0}
.artyk-about .ch-ex-row + .ch-ex-row{border-top:1px solid rgba(244,241,233,.12)}
.artyk-about .ch-ex-row .no{transition:color .5s var(--ease)}
.artyk-about .ch-ex-row .t{font-size:clamp(2rem,3.6vw,3.2rem);line-height:1.08;margin:16px 0 20px;transition:transform .7s var(--ease)}
.artyk-about .ch-ex-row .d{font-size:15.5px;line-height:1.85;color:rgba(244,241,233,.68);max-width:44ch}
@media(hover:hover){
  .artyk-about .ch-ex-row:hover .t{transform:translateX(12px)}
  .artyk-about .ch-ex-row:hover .no{color:var(--corten)}
}
.artyk-about .ch-ex-mimg{display:none}
@media(max-width:920px){
  .artyk-about .ch-ex-stick{display:none}
  .artyk-about .ch-ex-list{grid-column:1/13}
  .artyk-about .ch-ex-row{min-height:0;padding:clamp(44px,8vw,64px) 0}
  .artyk-about .ch-ex-mimg{display:block;position:relative;aspect-ratio:16/10;overflow:hidden;margin-top:26px;border:1px solid rgba(244,241,233,.16)}
  .artyk-about .ch-ex-mimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
}

/* ================= VALUES ================= */
.artyk-about .ch-values{background:var(--ivory)}
.artyk-about .ch-val-list{list-style:none;margin-top:clamp(10px,2vw,24px)}
.artyk-about .ch-val{position:relative;max-width:760px;padding:clamp(44px,8vh,84px) 0;margin-right:auto}
.artyk-about .ch-val:nth-child(even){margin-left:auto;margin-right:0;text-align:right}
.artyk-about .ch-val-no{display:block;font-size:clamp(.95rem,1.3vw,1.1rem);color:rgba(31,36,32,.42);transition:color .5s var(--ease)}
.artyk-about .ch-val-t{font-size:clamp(2rem,4.4vw,3.6rem);line-height:1.06;margin-top:12px;
  opacity:0;transform:translateY(26px);filter:blur(9px);
  transition:opacity 1.1s var(--ease) .05s,transform 1.1s var(--ease) .05s,filter 1.1s var(--ease) .05s}
.artyk-about .ch-val.in .ch-val-t{opacity:1;transform:none;filter:none}
.artyk-about .ch-val-d{font-size:clamp(1.02rem,1.5vw,1.28rem);color:rgba(31,36,32,.66);margin-top:16px}
.artyk-about .ch-val-ln{position:absolute;bottom:0;left:0;width:100%;height:1px;background:var(--line);
  transform:scaleX(0);transform-origin:left;transition:transform 1.4s var(--ease) .3s}
.artyk-about .ch-val:nth-child(even) .ch-val-ln{transform-origin:right}
.artyk-about .ch-val.in .ch-val-ln{transform:scaleX(1)}
@media(hover:hover){.artyk-about .ch-val:hover .ch-val-no{color:var(--corten)}}
@media(max-width:920px){
  .artyk-about .ch-val{max-width:none;padding:clamp(38px,7vh,60px) 0}
  .artyk-about .ch-val:nth-child(even){text-align:left}
  .artyk-about .ch-val:nth-child(even) .ch-val-ln{transform-origin:left}
}

/* ================= FINALE ================= */
.artyk-about .ch-fin{position:relative;background:var(--onyx);padding:0}
.artyk-about .ch-fin-sticky{position:sticky;top:0;height:100svh;overflow:hidden}
.artyk-about .ch-fin-bg{position:absolute;inset:0;will-change:transform}
.artyk-about .ch-fin-bg img{width:100%;height:100%;object-fit:cover}
.artyk-about .ch-fin-shade{position:absolute;inset:0;background:
  linear-gradient(to bottom,rgba(31,36,32,.52),rgba(31,36,32,.38) 34%,rgba(31,36,32,.38) 66%,rgba(31,36,32,.66));
}
.artyk-about .ch-fin-flow{position:relative;margin-top:-100svh}
.artyk-about .ch-fin-block{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 clamp(20px,6vw,72px)}
.artyk-about .ch-fin .micro{color:rgba(244,241,233,.62)}
.artyk-about .ch-fin-title{margin-top:18px;color:var(--ivory);font-size:clamp(3rem,8vw,6.6rem)}
.artyk-about .ch-fin-quote{font-family:var(--font-display),serif;font-style:italic;font-weight:300;
  font-size:clamp(1.5rem,3.1vw,2.55rem);line-height:1.5;color:rgba(244,241,233,.94);max-width:26em}
.artyk-about .ch-fin-body{font-size:clamp(.98rem,1.3vw,1.1rem);line-height:1.85;color:rgba(244,241,233,.82);max-width:38em}
.artyk-about .ch-fin-cta{margin-top:38px;color:var(--ivory)}
.artyk-about .ch-fin-cta::after{background:var(--ivory)}

/* colophon strip */
.artyk-about .ch-colo{background:var(--stone);padding:26px 0 clamp(150px,17vw,210px)}
.artyk-about .ch-colo .colophon{margin-top:0}

@media(prefers-reduced-motion:reduce){
  .artyk-about .kicker--draw .l{transform:scaleX(1);transition:none}
  .artyk-about .ch-val-t,.artyk-about .ch-val .ch-val-t{opacity:1;transform:none;filter:none;transition:none}
  .artyk-about .ch-val-ln{transform:scaleX(1);transition:none}
  .artyk-about .ch-ex-row .t{transition:none}
}
`;
