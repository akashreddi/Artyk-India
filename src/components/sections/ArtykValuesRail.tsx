"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Artyk — "Our Values" horizontal rail (embeddable homepage block).
 *
 * A self-contained section that lives inside the page. Values scroll SIDEWAYS,
 * one panel at a time: native trackpad swipe / touch drag, wheel-to-horizontal
 * stepping (boundary-aware, so it never traps the page), arrows, dots, and
 * keyboard ← →. Honours prefers-reduced-motion.
 *
 * Ported from Downloads/ArtykValuesRail.jsx and adapted to the project:
 *  • Palette mapped to the site tokens — forest (#2E4033) panel, corten
 *    (#A85838) accent — instead of the reference's brass gold.
 *  • Typography reuses the bundled local font variables (Palatino Linotype /
 *    Creato Display Regular) rather than injecting external web fonts.
 *  • The demo page-bands were dropped; only the embeddable rail remains.
 *  • CSS scoped under `.artyk-values-rail` so the generic `.rail`/`.panel`
 *    selectors don't leak site-wide.
 */

type Value = {
  id: string;
  title: string;
  body: string;
  wide?: boolean;
};

const VALUES: Value[] = [
  {
    id: "01",
    title: "Design with Purpose",
    body: "We believe good design should be both beautiful and meaningful.",
  },
  {
    id: "02",
    title: "Craftsmanship Matters",
    body: "We value authenticity, quality, and the skill behind every detail.",
  },
  {
    id: "03",
    title: "Timeless Over Temporary",
    body: "We champion enduring design that transcends trends.",
  },
  {
    id: "04",
    title: "Relationships First",
    body: "The best projects are built on trust, collaboration, and shared vision.",
  },
  {
    id: "05",
    title: "An Address for Design",
    wide: true,
    body:
      "Artyk is where global design meets local understanding. A place where craftsmanship is celebrated, ideas are explored, and exceptional spaces begin. Whether furnishing a private residence, designing a workplace, or creating a hospitality destination, we partner with our clients to bring thoughtful design to life.",
  },
];

export default function ArtykValuesRail({ values = VALUES }: { values?: Value[] }) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const lockRef = useRef(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(values.length - 1, idx));
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: clamped * scroller.clientWidth, behavior: "smooth" });
    setActive(clamped);
  };

  // Track the centred panel.
  useEffect(() => {
    const root = scrollerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { root, threshold: 0.55 }
    );
    panelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [values.length]);

  // Wheel → horizontal stepping, one panel per gesture, boundary-aware.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 6) return;
      const dir = delta > 0 ? 1 : -1;
      const next = activeRef.current + dir;
      // At an edge in the scroll direction → let the page scroll normally.
      if (next < 0 || next >= values.length) return;
      e.preventDefault();
      if (lockRef.current) return;
      lockRef.current = true;
      goTo(next);
      setTimeout(() => (lockRef.current = false), 820);
    };
    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.length]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <div className="artyk-values-rail">
      <style>{CSS}</style>

      <section
        className="rail"
        aria-roledescription="carousel"
        aria-label="Our Values"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="rail__grain" aria-hidden="true" />

        <div className="rail__scroller" ref={scrollerRef}>
          {values.map((v, i) => (
            <article
              key={v.id}
              data-index={i}
              data-active={active === i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className={`panel${v.wide ? " panel--wide" : ""}`}
              aria-roledescription="slide"
              aria-label={`${v.id} of ${values.length}: ${v.title}`}
              aria-hidden={active !== i}
            >
              <div className="panel__inner">
                <div className="panel__content">
                  <div className="panel__eyebrow">
                    <span className="panel__index">{v.id}</span>
                    <span className="panel__rule" aria-hidden="true" />
                    <span className="panel__label">Our Values</span>
                  </div>
                  <h2 className="panel__title">{v.title}</h2>
                  <p className="panel__body">{v.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          className="rail__arrow rail__arrow--prev"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Previous value"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          className="rail__arrow rail__arrow--next"
          onClick={() => goTo(active + 1)}
          disabled={active === values.length - 1}
          aria-label="Next value"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <div className="rail__foot">
          <div className="rail__dots" role="tablist" aria-label="Select value">
            {values.map((v, i) => (
              <button
                key={v.id}
                className="rail__dot"
                data-on={active === i}
                onClick={() => goTo(i)}
                aria-label={`Go to ${v.title}`}
                aria-selected={active === i}
                role="tab"
              />
            ))}
          </div>
          <div className="rail__cue" aria-hidden="true">
            <span>Scroll</span>
            <span className="rail__cue-track" />
          </div>
        </div>
      </section>
    </div>
  );
}

const CSS = `
.artyk-values-rail{
  --forest:#B59B87;
  --ivory:#F4F1E9;
  --accent:#A85838;
  color:var(--ivory);
  font-family:var(--font-sans),serif;
  -webkit-font-smoothing:antialiased;
}

/* --- the embeddable block --- */
.artyk-values-rail .rail{
  position:relative;
  height:min(86vh,760px);
  background:var(--forest);
  color:var(--ivory);
  overflow:hidden;
  isolation:isolate;
}
.artyk-values-rail .rail__grain{
  pointer-events:none;
  position:absolute;inset:0;z-index:2;opacity:.05;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:artyk-grain 18s steps(6) infinite;
}
@keyframes artyk-grain{
  0%,100%{transform:translate3d(0,0,0)}
  50%{transform:translate3d(-2%,1.5%,0)}
}

.artyk-values-rail .rail__scroller{
  position:relative;z-index:3;
  height:100%;
  display:flex;
  overflow-x:scroll;
  overflow-y:hidden;
  scroll-snap-type:x mandatory;
  scrollbar-width:none;
  scroll-behavior:smooth;
}
.artyk-values-rail .rail__scroller::-webkit-scrollbar{display:none}

.artyk-values-rail .panel{
  flex:0 0 100%;
  min-width:100%;
  height:100%;
  scroll-snap-align:start;
  display:flex;
  align-items:center;
  padding:0 clamp(28px,8vw,150px);
  box-sizing:border-box;
}
.artyk-values-rail .panel__inner{max-width:720px;width:100%}
.artyk-values-rail .panel--wide .panel__inner{max-width:920px}

.artyk-values-rail .panel__content{
  opacity:0;
  transform:translateY(40px);
  transition:opacity 850ms cubic-bezier(0.22,1,0.36,1),
             transform 850ms cubic-bezier(0.22,1,0.36,1);
  will-change:opacity,transform;
}
.artyk-values-rail .panel[data-active='true'] .panel__content{opacity:1;transform:translateY(0)}
.artyk-values-rail .panel[data-active='true'] .panel__label{transition-delay:60ms}
.artyk-values-rail .panel[data-active='true'] .panel__title{transition-delay:140ms}
.artyk-values-rail .panel[data-active='true'] .panel__body{transition-delay:240ms}

.artyk-values-rail .panel__eyebrow{display:flex;align-items:center;gap:16px;margin-bottom:clamp(18px,3vh,32px)}
.artyk-values-rail .panel__index{font-size:13px;letter-spacing:.2em;color:var(--accent)}
.artyk-values-rail .panel__rule{height:1px;width:46px;background:var(--accent);opacity:.6}
.artyk-values-rail .panel__label{font-size:12px;letter-spacing:.4em;text-transform:uppercase;color:var(--accent)}
.artyk-values-rail .panel__title{
  font-family:var(--font-display),serif;
  font-weight:300;line-height:1.02;letter-spacing:-0.01em;
  margin:0 0 clamp(20px,4vh,36px);
  font-size:clamp(42px,6vw,84px);
}
.artyk-values-rail .panel__body{
  font-weight:300;line-height:1.7;opacity:.86;
  max-width:56ch;font-size:clamp(16px,1.3vw,20px);
}
.artyk-values-rail .panel--wide .panel__body{max-width:70ch;font-size:clamp(17px,1.5vw,22px)}

/* controls */
.artyk-values-rail .rail__arrow{
  position:absolute;top:50%;transform:translateY(-50%);
  z-index:6;
  width:46px;height:46px;border-radius:999px;
  background:transparent;border:1px solid rgba(168,88,56,.5);
  color:var(--accent);cursor:pointer;
  display:grid;place-items:center;
  transition:background-color 400ms ease,border-color 400ms ease,opacity 400ms ease;
}
.artyk-values-rail .rail__arrow:hover{background:rgba(168,88,56,.12);border-color:var(--accent)}
.artyk-values-rail .rail__arrow:disabled{opacity:.2;cursor:default}
.artyk-values-rail .rail__arrow--prev{left:clamp(14px,2.5vw,34px)}
.artyk-values-rail .rail__arrow--next{right:clamp(14px,2.5vw,34px)}

.artyk-values-rail .rail__foot{
  position:absolute;left:0;right:0;bottom:clamp(20px,4vh,40px);
  z-index:6;display:flex;flex-direction:column;align-items:center;gap:16px;
}
.artyk-values-rail .rail__dots{display:flex;gap:12px}
.artyk-values-rail .rail__dot{
  width:30px;height:2px;border:0;padding:0;cursor:pointer;
  background:rgba(168,88,56,.35);
  transition:background-color 500ms cubic-bezier(0.22,1,0.36,1);
}
.artyk-values-rail .rail__dot[data-on='true']{background:var(--accent)}
.artyk-values-rail .rail__cue{
  display:flex;align-items:center;gap:12px;
  font-size:11px;letter-spacing:.4em;text-transform:uppercase;color:var(--accent);
}
.artyk-values-rail .rail__cue-track{width:40px;height:1px;background:rgba(168,88,56,.4);position:relative;overflow:hidden}
.artyk-values-rail .rail__cue-track::after{
  content:"";position:absolute;top:0;left:0;height:100%;width:40%;
  background:var(--accent);
  animation:artyk-slide 2.4s cubic-bezier(0.22,1,0.36,1) infinite;
}
@keyframes artyk-slide{
  0%{transform:translateX(-100%);opacity:0}
  35%{opacity:1}
  100%{transform:translateX(280%);opacity:0}
}

@media(max-width:640px){
  .artyk-values-rail .panel{padding:0 24px}
  .artyk-values-rail .panel__title{font-size:clamp(42px,12vw,52px)}
  .artyk-values-rail .rail__arrow{display:none}
}

.artyk-values-rail :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media(prefers-reduced-motion:reduce){
  .artyk-values-rail .rail__scroller{scroll-behavior:auto}
  .artyk-values-rail .panel__content{transition:opacity 300ms linear;transform:none}
  .artyk-values-rail .panel[data-active='true'] .panel__content{transform:none}
  .artyk-values-rail .rail__grain,
  .artyk-values-rail .rail__cue-track::after{animation:none}
}
`;
