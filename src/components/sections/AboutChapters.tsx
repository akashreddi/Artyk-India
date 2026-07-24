"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
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

/* ---------------- chapters ---------------- */

export default function AboutChapters() {
  const reduce = useReducedMotion() ?? false;

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

      {/* ================= WHAT SETS US APART — the deck ================= */}
      <section className="ch-apart">
        <div className="wrap">
          <div className="kicker kicker--draw rv">
            <span className="micro k">What Sets Us Apart</span>
            <span className="l" />
            <span className="r">Four convictions</span>
          </div>
          <div className="ch-apart-deck">
            {APART.map((a, i) => (
              <div key={a.no} className="ch-apart-stick" style={{ top: `calc(76px + ${i * 18}px)` }}>
                <motion.article
                  className={`ch-apart-card ${a.tone}`}
                  style={{ transformOrigin: "top center" }}
                  initial={reduce ? false : { opacity: 0, y: 70, rotateX: 9 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.05, ease: EASE }}
                >
                  <span className="ch-apart-no display">{a.no}</span>
                  <h3 className="display ch-apart-t">{a.title}</h3>
                  <p className="ch-apart-d">{a.body}</p>
                </motion.article>
              </div>
            ))}
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
.artyk-about .ch-lead{font-size:clamp(1.9rem,3.7vw,3.125rem);line-height:1.16}
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

/* ================= WHAT SETS US APART — the deck ================= */
/* the Services "Our Process" card language: tonal plaques that stack as
   you scroll — linear, quiet, no imagery */
.artyk-about .ch-apart{background:var(--stone)}
.artyk-about .ch-apart-deck{position:relative;perspective:1400px}
.artyk-about .ch-apart-stick{position:sticky}
.artyk-about .ch-apart-card{
  margin-bottom:32px;border:1px solid rgba(91,95,84,.2);
  padding:48px 28px;box-shadow:0 -24px 70px rgba(31,36,32,.1);
  display:grid;gap:14px;align-items:baseline;
}
.artyk-about .t-ivory{background:var(--ivory)}
.artyk-about .t-oat{background:#ECE7DB}
.artyk-about .t-mist{background:#E8E2DA}
.artyk-about .t-camel{background:#B59B87}
.artyk-about .ch-apart-no{font-style:italic;font-size:clamp(2.6rem,5vw,4.6rem);line-height:1;color:rgba(168,88,56,.45)}
.artyk-about .t-camel .ch-apart-no{color:rgba(244,241,233,.85)}
.artyk-about .ch-apart-t{font-size:clamp(1.625rem,3vw,2.5rem);line-height:1.1}
.artyk-about .ch-apart-d{font-size:15px;line-height:1.75;color:rgba(91,95,84,1);max-width:46ch}
.artyk-about .t-camel .ch-apart-d{color:rgba(31,36,32,.8)}
@media(min-width:768px){
  .artyk-about .ch-apart-card{grid-template-columns:repeat(12,1fr);gap:32px;padding:64px 56px}
  .artyk-about .ch-apart-no{grid-column:span 2}
  .artyk-about .ch-apart-t{grid-column:span 4}
  .artyk-about .ch-apart-d{grid-column:span 6}
}

/* ================= VALUES ================= */
.artyk-about .ch-values{background:var(--ivory)}
.artyk-about .ch-val-list{list-style:none;margin-top:clamp(10px,2vw,24px)}
.artyk-about .ch-val{position:relative;max-width:760px;padding:clamp(44px,8vh,84px) 0;margin-right:auto}
.artyk-about .ch-val:nth-child(even){margin-left:auto;margin-right:0;text-align:right}
.artyk-about .ch-val-no{display:block;font-size:clamp(.95rem,1.3vw,1.1rem);color:rgba(31,36,32,.42);transition:color .5s var(--ease)}
.artyk-about .ch-val-t{font-size:clamp(2rem,4vw,3.125rem);line-height:1.06;margin-top:12px;
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
.artyk-about .ch-fin-title{margin-top:18px;color:var(--ivory);font-size:clamp(2rem,4vw,3.125rem);line-height:1.1}
.artyk-about .ch-fin-quote{font-family:var(--font-sans),sans-serif;font-style:normal;font-weight:400;
  font-size:clamp(1.2rem,1.8vw,1.625rem);line-height:1.7;color:rgba(244,241,233,.94);max-width:30em}
.artyk-about .ch-fin-quote + .ch-fin-quote{margin-top:clamp(22px,3.5vh,40px)}
.artyk-about .ch-fin-body{font-family:var(--font-sans),sans-serif;font-style:normal;font-weight:400;font-size:clamp(1.2rem,1.8vw,1.625rem);line-height:1.7;color:rgba(244,241,233,.9);max-width:30em}
.artyk-about .ch-fin-cta{margin-top:38px;color:var(--ivory)}
.artyk-about .ch-fin-cta::after{background:var(--ivory)}

/* colophon strip */
.artyk-about .ch-colo{background:var(--stone);padding:26px 0 clamp(150px,17vw,210px)}
.artyk-about .ch-colo .colophon{margin-top:0}

@media(prefers-reduced-motion:reduce){
  .artyk-about .kicker--draw .l{transform:scaleX(1);transition:none}
  .artyk-about .ch-val-t,.artyk-about .ch-val .ch-val-t{opacity:1;transform:none;filter:none;transition:none}
  .artyk-about .ch-val-ln{transform:scaleX(1);transition:none}
}
`;
