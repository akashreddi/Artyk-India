"use client";

import { useEffect, useRef } from "react";
import AboutChapters from "@/components/sections/AboutChapters";

/**
 * Editorial "The Design Issue" About page — a faithful port of the standalone
 * design in ARTYK-ABOUT-US-PAGE-HTML.html. All bespoke CSS is scoped under
 * `.artyk-about` so the reference's bare `*`, `section`, `img` and `body`
 * selectors don't leak into the rest of the site. Fonts reuse the project's
 * bundled local font variables (--font-display = Palatino Linotype,
 * --font-sans = Creato Display Regular) and the palette matches the Tailwind
 * tokens.
 *
 * The reference's vanilla-JS behaviours (word-mask headline reveal, scroll-scrub
 * quote, parallax spreads, count-up) are ported into the effect below, scoped to
 * this component's root so they don't touch other pages.
 */
export default function AboutEditorial() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    /* split headlines into masked words with stagger */
    root.querySelectorAll<HTMLElement>(".split").forEach((el) => {
      const nodes = Array.prototype.slice.call(el.childNodes) as ChildNode[];
      el.textContent = "";
      let idx = 0;
      const addWords = (text: string, target: HTMLElement | Element) => {
        text.split(/(\s+)/).forEach((part) => {
          if (/^\s+$/.test(part)) {
            target.appendChild(document.createTextNode(" "));
            return;
          }
          if (!part) return;
          const mask = document.createElement("span");
          mask.className = "wline";
          const w = document.createElement("span");
          w.textContent = part;
          w.style.transitionDelay = idx * 0.045 + "s";
          idx++;
          mask.appendChild(w);
          target.appendChild(mask);
        });
      };
      nodes.forEach((n) => {
        if (n.nodeType === 3) {
          addWords(n.textContent || "", el);
        } else if (n.nodeType === 1) {
          const holder = (n as Element).cloneNode(false) as Element;
          el.appendChild(holder);
          addWords(n.textContent || "", holder);
        }
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    root.querySelectorAll(".rv, .split, .js-clip").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* scroll-scrub quote: words brighten as it moves through the viewport */
    const q = root.querySelector<HTMLElement>(".js-scrub");
    if (q) {
      const words = (q.textContent || "").split(/(\s+)/);
      q.textContent = "";
      const ws: HTMLElement[] = [];
      words.forEach((part) => {
        if (/^\s+$/.test(part)) {
          q.appendChild(document.createTextNode(" "));
          return;
        }
        if (!part) return;
        const s = document.createElement("span");
        s.className = "w";
        s.textContent = part;
        q.appendChild(s);
        ws.push(s);
      });
      if (reduce) {
        ws.forEach((s) => s.classList.add("on"));
      } else {
        const scrub = () => {
          const r = q.getBoundingClientRect();
          let p = 1 - (r.top - innerHeight * 0.25) / (innerHeight * 0.55);
          p = Math.max(0, Math.min(1.15, p));
          const n = Math.floor(p * ws.length);
          ws.forEach((s, i) => s.classList.toggle("on", i < n));
        };
        document.addEventListener("scroll", scrub, { passive: true });
        scrub();
        cleanups.push(() => document.removeEventListener("scroll", scrub));
      }
    }

    /* parallax on the gallery spread */
    if (!reduce) {
      const par = root.querySelector<HTMLElement>(".js-par");
      if (par) {
        const wrap = par.parentElement as HTMLElement;
        const px = () => {
          const r = wrap.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          const t = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          par.style.transform = "translateY(" + t * -5 + "%)";
        };
        document.addEventListener("scroll", px, { passive: true });
        px();
        cleanups.push(() => document.removeEventListener("scroll", px));
      }
    }

    /* founders photo: gentle inner parallax */
    if (!reduce) {
      const fimg = root.querySelector<HTMLElement>(".feature .frame .clip img");
      if (fimg) {
        const fwrap = root.querySelector<HTMLElement>(".feature .frame");
        const fpx = () => {
          if (!fwrap) return;
          const r = fwrap.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          const t = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          fimg.style.setProperty("--py", t * -3.2 + "%");
        };
        document.addEventListener("scroll", fpx, { passive: true });
        fpx();
        cleanups.push(() => document.removeEventListener("scroll", fpx));
      }
    }

    /* count-up for the 20+ stat */
    const cEl = root.querySelector<HTMLElement>(".js-count");
    if (cEl) {
      const target = parseInt(cEl.getAttribute("data-count") || "0", 10);
      if (reduce) {
        cEl.textContent = String(target);
      } else {
        cEl.textContent = "0";
        const ioC = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              ioC.unobserve(cEl);
              let t0: number | null = null;
              const dur = 1400;
              const step = (ts: number) => {
                if (!t0) t0 = ts;
                let p = Math.min(1, (ts - t0) / dur);
                p = 1 - Math.pow(1 - p, 3);
                cEl.textContent = String(Math.round(p * target));
                if (p < 1) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
            });
          },
          { threshold: 0.5 }
        );
        ioC.observe(cEl);
        cleanups.push(() => ioC.disconnect());
      }
    }

    /* philosophy plaque: subtle 3D tilt with inertia + a pointer-lit sheen */
    if (!reduce) {
      const scene = root.querySelector<HTMLElement>(".js-tilt");
      const card = root.querySelector<HTMLElement>(".js-tilt-card");
      if (scene && card) {
        const MAX_TILT = 2.4;
        let tRx = 0, tRy = 0, tMx = 50, tMy = 40;
        let rx = 0, ry = 0, mx = 50, my = 40;
        let raf = 0;
        const step = () => {
          rx += (tRx - rx) * 0.065;
          ry += (tRy - ry) * 0.065;
          mx += (tMx - mx) * 0.065;
          my += (tMy - my) * 0.065;
          card.style.setProperty("--rx", rx.toFixed(3) + "deg");
          card.style.setProperty("--ry", ry.toFixed(3) + "deg");
          card.style.setProperty("--mx", mx.toFixed(2) + "%");
          card.style.setProperty("--my", my.toFixed(2) + "%");
          const settled =
            Math.abs(tRx - rx) + Math.abs(tRy - ry) < 0.002 &&
            Math.abs(tMx - mx) + Math.abs(tMy - my) < 0.05;
          raf = settled ? 0 : requestAnimationFrame(step);
        };
        const kick = () => {
          if (!raf) raf = requestAnimationFrame(step);
        };
        const move = (e: PointerEvent) => {
          const r = scene.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          tRy = nx * MAX_TILT;
          tRx = -ny * MAX_TILT;
          tMx = nx * 100 + 50;
          tMy = ny * 100 + 50;
          kick();
        };
        const leave = () => {
          tRx = 0;
          tRy = 0;
          tMx = 50;
          tMy = 40;
          kick();
        };
        scene.addEventListener("pointermove", move);
        scene.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          scene.removeEventListener("pointermove", move);
          scene.removeEventListener("pointerleave", leave);
          if (raf) cancelAnimationFrame(raf);
        });
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="artyk-about" ref={rootRef}>
      <style>{CSS}</style>

      {/* ================= CINEMATIC HERO ================= */}
      <header className="hero">
        <div className="im">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/about/image-1.jpg"
            alt="The Artyk gallery entrance in Hyderabad — timber slat facade amid dense greenery"
            fetchPriority="high"
          />
        </div>
        <div className="shade" />
        <div className="hero-top">
          <span className="micro wm">Artyk</span>
          <span className="micro loc">Hyderabad</span>
        </div>
        <div className="hero-inner">
          <h1 className="display split">
            An address
            <br />
            for design.
          </h1>
          <p className="hero-sub rv d3">
            A curated gallery of international design — furniture, kitchens, lighting, rugs and art,
            under one roof.
          </p>
        </div>
      </header>

      {/* ================= STANDFIRST ================= */}
      <section className="standfirst">
        <div className="wrap">
          <div className="kicker rv">
            <span className="micro k">The House</span>
            <span className="l" />
            <span className="r">Design, curated thoughtfully</span>
          </div>
          <div className="grid">
            <p className="display lead split">
              Artyk was created with a singular vision — to curate the world&apos;s finest design and{" "}
              <span className="accent">transform</span> the way people experience their spaces.
            </p>
            <div className="aside">
              <hr className="rule rv" />
              <p className="rv d1">
                We believe that exceptional interiors are not defined by individual pieces, but by
                the harmony between craftsmanship, materiality, proportion, and purpose. Every
                collection we present is chosen to inspire spaces that reflect the aspirations and
                lifestyles of those who inhabit them.
                <br />
                <br />
                At Artyk, every brand is selected with intention. We bring together globally
                celebrated names in furniture, kitchens, wardrobes, lighting, rugs, and art — united
                by a shared commitment to quality, innovation, and enduring design.
              </p>
              <ul className="clients rv d2">
                <li>Homeowners</li>
                <li>Architects &amp; Designers</li>
                <li>Developers</li>
                <li>Hospitality Partners</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOUNDERS FEATURE ================= */}
      <section className="founders">
        <div className="wrap">
          <div className="kicker rv">
            <span className="micro k">The Founders</span>
            <span className="l" />
            <span className="r">A profile</span>
          </div>

          <div className="feature">
            <figure className="photo js-clip">
              <div className="frame">
                <div className="clip">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about/image-2.jpg"
                    alt="Prachi and Avinash Agarwal seated on an ivory modular sofa beneath a large abstract artwork"
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption>
                <span className="cap">Prachi &amp; Avinash Agarwal at the Artyk gallery, Hyderabad.</span>
                <span className="micro">Photograph — Artyk Archive</span>
              </figcaption>
            </figure>
            <div className="txt">
              <span className="micro rv">Two decades in luxury interiors</span>
              <h2 className="display names split">
                Prachi <span className="amp">&amp;</span> Avinash Agarwal
              </h2>
              <p className="deck rv d1">
                One shared conviction: that world-class design belongs in Hyderabad — experienced
                firsthand, not imported from a catalogue.
              </p>
              <hr className="rule txtrule rv d1" />
              <blockquote className="scrub js-scrub">
                &ldquo;Every remarkable interior begins with a conversation, not a catalogue.&rdquo;
              </blockquote>
              <div className="stats rv d2">
                <div className="rv d1">
                  <b>
                    <em className="js-count" data-count="20">
                      20
                    </em>
                    + years
                  </b>
                  <span>Luxury interior project management</span>
                </div>
                <div className="rv d2">
                  <b>
                    <em>One</em> roof
                  </b>
                  <span>Furniture · kitchens · lighting · rugs · art</span>
                </div>
                <div className="rv d3">
                  <b>
                    <em>Three</em> worlds
                  </b>
                  <span>Residential · commercial · hospitality</span>
                </div>
              </div>
            </div>
          </div>

          <div className="well">
            <div className="story rv">
              <div className="cols">
                <p>
                  Artyk was founded by Prachi and Avinash Agarwal with a shared vision: to create
                  Hyderabad&apos;s destination for exceptional contemporary design.
                </p>
                <p>
                  With over two decades of experience in luxury interior projects, Avinash brings
                  extensive expertise in design execution, project management, and global sourcing.
                  Complementing this is Prachi&apos;s intuitive understanding of aesthetics,
                  meticulous attention to detail, and passion for creating meaningful spaces.
                </p>
                <p>
                  Together, they envisioned more than a furniture gallery. They created a destination
                  where homeowners, architects, designers, and developers can experience
                  internationally acclaimed brands through thoughtfully curated environments rather
                  than catalogues.
                </p>
                <p>
                  Today, Artyk represents a carefully selected portfolio of furniture, kitchens,
                  lighting, wardrobes, rugs, art, and bespoke interior solutions—united by one
                  philosophy: timeless design, exceptional craftsmanship, and spaces that enrich the
                  way we live.
                </p>
              </div>
            </div>
            <figure className="insetfig rv d2">
              <div className="f">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about/image-3.jpg"
                  alt="Avinash Agarwal standing behind Prachi Agarwal, seated at a table in the Artyk gallery"
                  loading="lazy"
                />
              </div>
              <figcaption>
                <span className="cap">In the gallery — where every collection begins with a conversation.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="marquee" aria-hidden="true">
        <div className="track">
          <span>
            Curated, <i>not collected</i>
          </span>
          <span className="dot">·</span>
          <span>
            Timeless <i>over temporary</i>
          </span>
          <span className="dot">·</span>
          <span>
            Craftsmanship <i>matters</i>
          </span>
          <span className="dot">·</span>
          <span>
            Design <i>with purpose</i>
          </span>
          <span className="dot">·</span>
          <span>
            Curated, <i>not collected</i>
          </span>
          <span className="dot">·</span>
          <span>
            Timeless <i>over temporary</i>
          </span>
          <span className="dot">·</span>
          <span>
            Craftsmanship <i>matters</i>
          </span>
          <span className="dot">·</span>
          <span>
            Design <i>with purpose</i>
          </span>
          <span className="dot">·</span>
        </div>
      </div>

      {/* ================= GALLERY SPREAD + PHILOSOPHY ================= */}
      <section className="gallery">
        <div className="spreadimg rv">
          <div className="par js-par">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about/image-4.jpg"
              alt="Inside the Artyk gallery — a curated living arrangement framed by floor-to-ceiling windows and dense greenery"
              loading="lazy"
            />
          </div>
        </div>
        <div className="wrap">
          <div className="below">
            <figcaption className="capL rv">
              <span className="cap">
                Inside the gallery — collections experienced, not displayed. Floor-to-ceiling glass
                frames the greenery beyond.
              </span>
              <span className="micro">The Gallery, Hyderabad</span>
            </figcaption>
            <h2 className="display philoT split">Exceptional design begins with discernment.</h2>
            <p className="philoB rv d1">
              Our approach is guided by a deep appreciation for detail, proportion, material, and
              craftsmanship. Rather than offering endless choices, we focus on a carefully selected
              portfolio of brands and collections representing the highest standards of contemporary
              design — a balance of style, comfort, and quality. The result is a design experience
              that is personal, purposeful, and enduring.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className="philosophy">
        <div className="wrap">
          <div className="kicker rv">
            <span className="micro k">Our Philosophy</span>
            <span className="l" />
            <span className="r">A quiet conviction</span>
          </div>

          <div className="philo-scene js-tilt">
            <div className="philo-float">
              <div className="philo-card js-tilt-card">
                <span className="philo-frame" aria-hidden="true" />
                <span className="philo-frame philo-frame--inner" aria-hidden="true" />
                <span className="philo-sheen" aria-hidden="true" />

                <span className="micro philo-eyebrow rv">Artyk · Curated Living</span>

                <h2 className="display philo-head split">
                  Thoughtfully Chosen.
                  <br />
                  Beautifully Experienced.
                </h2>

                <div className="philo-orn rv d1" aria-hidden="true">
                  <span className="ln" />
                  <span className="gem">
                    <i />
                  </span>
                  <span className="ln" />
                </div>

                <div className="philo-copy">
                  <p className="rv d1">
                    At Artyk, we believe that exceptional interiors are shaped by thoughtful
                    decisions, not overwhelming choices.
                  </p>
                  <p className="rv d2">
                    Every brand we represent is selected for its distinct design philosophy,
                    uncompromising craftsmanship, and enduring relevance. Together, they form a
                    cohesive collection that celebrates authenticity, innovation, and timeless
                    living.
                  </p>
                  <p className="rv d3">
                    Our role is not simply to present beautiful products, but to help create spaces
                    where every element feels considered, connected, and uniquely personal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE CHAPTERS ================= */}
      <AboutChapters />
    </div>
  );
}

const CSS = `
.artyk-about{
  --onyx:#1F2420; --corten:#A85838; --forest:#2E4033;
  --ivory:#F4F1E9; --stone:#E6E3DA;
  --line:rgba(31,36,32,.16);
  --ease:cubic-bezier(.22,1,.36,1);
  background:var(--stone); color:var(--onyx);
  font-family:var(--font-sans),serif; font-weight:300;
  font-size:17px; line-height:1.7;
  /* clip, not hidden: overflow-x:hidden would make this a scroll container
     and silently break every position:sticky descendant (the exhibition
     plane and the finale backdrop) */
  -webkit-font-smoothing:antialiased; overflow-x:clip;
}
.artyk-about *{margin:0;padding:0;box-sizing:border-box}
.artyk-about .display{font-family:var(--font-display),serif;font-weight:300;line-height:1.02;letter-spacing:-0.012em}
.artyk-about .it{font-family:var(--font-display),serif;font-style:italic;font-weight:300}
.artyk-about .micro{
  font-family:var(--font-sans),serif;font-weight:500;
  font-size:11px;letter-spacing:.3em;text-transform:uppercase;
  color:rgba(31,36,32,.62);
}
.artyk-about .wrap{max-width:1320px;margin:0 auto;padding:0 clamp(20px,5vw,72px)}
.artyk-about .rule{border:none;border-top:1px solid var(--line)}
.artyk-about img{display:block;width:100%;height:100%;object-fit:cover}
.artyk-about a{color:inherit}
.artyk-about section{padding:clamp(64px,8vw,120px) 0}

/* kicker: editorial section opener (no chapter numbering) */
.artyk-about .kicker{display:flex;align-items:center;gap:18px;margin-bottom:clamp(32px,4.5vw,60px)}
.artyk-about .kicker .k{white-space:nowrap}
.artyk-about .kicker .l{flex:1;height:1px;background:var(--line)}
.artyk-about .kicker .r{font-family:var(--font-display),serif;font-style:italic;font-size:14px;color:rgba(31,36,32,.5);white-space:nowrap}

/* ---------- generic reveals ---------- */
.artyk-about .rv{opacity:0;transform:translateY(26px);transition:opacity 1s var(--ease),transform 1s var(--ease)}
.artyk-about .rv.in{opacity:1;transform:none}
.artyk-about .rv.d1{transition-delay:.09s}.artyk-about .rv.d2{transition-delay:.18s}.artyk-about .rv.d3{transition-delay:.27s}

/* word-mask reveal for headlines (JS wraps words) */
.artyk-about .split .wline{display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em;margin-bottom:-.08em}
.artyk-about .split .wline>span{display:inline-block;transform:translateY(110%);transition:transform 1.1s var(--ease)}
.artyk-about .names.split .wline>span{filter:blur(7px);opacity:.4;transition:transform 1.15s var(--ease),filter 1.15s var(--ease),opacity 1.15s var(--ease)}
.artyk-about .names.split.in .wline>span{filter:blur(0);opacity:1}
.artyk-about .split.in .wline>span{transform:translateY(0)}

/* ================= CINEMATIC HERO ================= */
.artyk-about .hero{position:relative;height:100svh;min-height:600px;overflow:hidden;background:var(--onyx);padding:0}
.artyk-about .hero .im{position:absolute;inset:0;transform:scale(1.12);animation:aboutSettle 14s var(--ease) forwards;will-change:transform}
@keyframes aboutSettle{to{transform:scale(1)}}
.artyk-about .hero .shade{position:absolute;inset:0;background:
  linear-gradient(to bottom,rgba(31,36,32,.42) 0%,rgba(31,36,32,0) 26%),
  linear-gradient(to top,rgba(31,36,32,.78) 0%,rgba(31,36,32,.22) 42%,rgba(31,36,32,0) 68%)}
.artyk-about .hero-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:baseline;padding:clamp(22px,3vw,40px) clamp(20px,5vw,72px)}
.artyk-about .hero-top .micro{color:rgba(244,241,233,.8)}
.artyk-about .hero-top .wm{font-size:13px;letter-spacing:.42em}
.artyk-about .hero-inner{position:absolute;left:0;right:0;bottom:0;padding:clamp(28px,5vw,72px) clamp(20px,5vw,72px)}
.artyk-about .hero-inner h1{color:var(--ivory);font-size:clamp(3rem,8.6vw,7.6rem)}
.artyk-about .hero-sub{color:rgba(244,241,233,.78);font-style:italic;font-size:clamp(.98rem,1.4vw,1.15rem);max-width:34em;margin-top:20px}

/* ================= STANDFIRST ================= */
.artyk-about .standfirst .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(24px,3vw,52px)}
.artyk-about .standfirst .lead{grid-column:1/9;font-size:clamp(1.9rem,4vw,3.6rem)}
.artyk-about .standfirst .lead .accent{font-style:italic;color:var(--corten)}
.artyk-about .standfirst .aside{grid-column:10/13;align-self:end}
.artyk-about .standfirst .aside p{font-size:15.5px;color:rgba(31,36,32,.75)}
.artyk-about .standfirst .aside .rule{margin-bottom:16px}
.artyk-about .clients{list-style:none;margin-top:22px}
.artyk-about .clients li{padding:11px 2px;border-top:1px solid var(--line);font-size:11px;letter-spacing:.3em;text-transform:uppercase;font-weight:500;color:rgba(31,36,32,.62)}
.artyk-about .clients li:last-child{border-bottom:1px solid var(--line)}
@media(max-width:920px){.artyk-about .standfirst .lead{grid-column:1/13}.artyk-about .standfirst .aside{grid-column:1/13;max-width:520px;margin-top:28px}}

/* ================= FOUNDERS FEATURE ================= */
.artyk-about .founders{background:var(--ivory);position:relative}
.artyk-about .feature{display:grid;grid-template-columns:repeat(12,1fr);gap:0 clamp(20px,3vw,48px);align-items:center}
.artyk-about .feature .photo{grid-column:1/7;grid-row:1;position:relative;z-index:1}
.artyk-about .feature .frame{aspect-ratio:4/5;overflow:hidden}
.artyk-about .feature .frame .clip{position:absolute;inset:-6% 0;clip-path:inset(100% 0 0 0);transition:clip-path 1.5s var(--ease)}
.artyk-about .feature .frame .clip img{transform:scale(1.16) translateY(var(--py,0));transition:transform 1.9s var(--ease);will-change:transform}
.artyk-about .feature .photo.in .clip img{transform:scale(1.02) translateY(var(--py,0))}
.artyk-about .feature .frame{position:relative}
.artyk-about .feature .photo.in .clip{clip-path:inset(0 0 0 0)}
.artyk-about figcaption{margin-top:14px}
.artyk-about .feature figcaption{opacity:0;transform:translateY(12px);transition:opacity .9s var(--ease) .7s,transform .9s var(--ease) .7s}
.artyk-about .feature .photo.in figcaption{opacity:1;transform:none}
.artyk-about figcaption .cap{font-family:var(--font-display),serif;font-style:italic;font-weight:300;font-size:15px;color:rgba(31,36,32,.75)}
.artyk-about figcaption .micro{display:block;margin-top:6px}
.artyk-about .feature .txt{grid-column:7/13;grid-row:1;position:relative;z-index:2}
.artyk-about .names{font-size:clamp(2.6rem,5.6vw,5rem);margin:14px 0 16px}
.artyk-about .names .amp{font-style:normal;font-weight:300;color:var(--corten);font-size:.68em}
@media(max-width:920px){
  .artyk-about .feature .photo{grid-column:1/13;grid-row:auto;max-width:520px}
  .artyk-about .feature .txt{grid-column:1/13;grid-row:auto;padding-top:30px}
}
.artyk-about .deck{font-style:italic;font-size:1.06rem;color:rgba(31,36,32,.72);max-width:34em}
.artyk-about .txtrule{margin:26px 0}
/* scroll-scrub quote */
.artyk-about .scrub{font-family:var(--font-display),serif;font-style:italic;font-weight:300;font-size:clamp(1.35rem,2.4vw,1.9rem);line-height:1.45}
.artyk-about .scrub .w{opacity:.3;transition:opacity .35s linear}
.artyk-about .scrub .w.on{opacity:1}
.artyk-about .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(18px,2.4vw,36px);margin-top:34px}
.artyk-about .stats div{position:relative;padding-top:14px}
.artyk-about .stats div::before{content:"";position:absolute;top:0;left:0;height:1px;width:100%;background:var(--line);transform:scaleX(0);transform-origin:left;transition:transform 1.2s var(--ease)}
.artyk-about .stats.in div::before{transform:scaleX(1)}
.artyk-about .stats div:nth-child(2)::before{transition-delay:.15s}.artyk-about .stats div:nth-child(3)::before{transition-delay:.3s}
.artyk-about .stats div{flex:0 1 auto}
.artyk-about .stats b{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(1.9rem,2.6vw,2.5rem);display:block;line-height:1;margin-bottom:10px}
.artyk-about .stats b em{font-style:italic;color:var(--corten);font-weight:300}
.artyk-about .stats span{display:block;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;color:rgba(31,36,32,.55);line-height:1.75}
@media(max-width:640px){.artyk-about .stats{grid-template-columns:1fr;gap:24px}}
.artyk-about .well{margin-top:clamp(40px,5vw,72px);display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(24px,4vw,64px)}
.artyk-about .well .story{grid-column:1/9}
.artyk-about .well .insetfig{grid-column:9/13;margin-top:8px}
@media(min-width:1024px){.artyk-about .well .cols{columns:2;column-gap:52px}}
.artyk-about .well p{margin-bottom:1.2em;color:rgba(31,36,32,.85);text-align:justify;hyphens:auto}
.artyk-about .well .cols>p:first-child::first-letter{
  font-family:var(--font-display),serif;font-weight:300;color:var(--corten);
  float:left;font-size:4.6em;line-height:.78;padding:6px 12px 0 0;
}
.artyk-about .insetfig .f{aspect-ratio:3/4;overflow:hidden}
@media(max-width:920px){.artyk-about .well .story{grid-column:1/13}.artyk-about .well .insetfig{grid-column:1/13;max-width:380px}}

/* ================= MARQUEE ================= */
.artyk-about .marquee{padding:clamp(18px,2.4vw,30px) 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;background:var(--stone)}
.artyk-about .track{display:flex;width:max-content;animation:aboutMq 36s linear infinite;gap:0}
.artyk-about .track span{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(1.3rem,2.6vw,2rem);white-space:nowrap;padding-right:.6em}
.artyk-about .track .dot{color:var(--corten);padding:0 .6em}
.artyk-about .track i{font-style:italic}
@keyframes aboutMq{to{transform:translateX(-50%)}}

/* ================= GALLERY SPREAD ================= */
.artyk-about .gallery{padding-top:0}
.artyk-about .spreadimg{height:min(92vh,880px);min-height:420px;overflow:hidden;position:relative}
.artyk-about .spreadimg .par{position:absolute;left:0;right:0;top:-7%;height:114%;will-change:transform}
.artyk-about .gallery .below{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(20px,3vw,52px);margin-top:clamp(26px,3vw,44px)}
.artyk-about .gallery .capL{grid-column:1/5}
.artyk-about .gallery .philoT{grid-column:6/13;font-size:clamp(1.7rem,3.4vw,3rem)}
.artyk-about .gallery .philoB{grid-column:6/11;margin-top:26px;color:rgba(31,36,32,.8)}
@media(max-width:920px){.artyk-about .gallery .capL{grid-column:1/13}.artyk-about .gallery .philoT,.artyk-about .gallery .philoB{grid-column:1/13}}

/* ================= PHILOSOPHY (the sweet spot) ================= */
.artyk-about .philosophy{
  background:#B69B87;color:var(--onyx);position:relative;overflow:hidden;
  padding:clamp(96px,13vw,170px) 0;
}
/* quiet depth: light falls from above, the floor recedes below */
.artyk-about .philosophy::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(110% 80% at 50% 0%, rgba(244,241,233,.20), rgba(244,241,233,0) 55%),
    radial-gradient(130% 100% at 50% 118%, rgba(31,36,32,.16), rgba(31,36,32,0) 58%);
}
.artyk-about .philosophy .micro{color:rgba(31,36,32,.55)}
.artyk-about .philosophy .kicker .l{background:rgba(31,36,32,.22)}
.artyk-about .philosophy .kicker .r{color:rgba(31,36,32,.55)}

/* the stage: true perspective; the plaque floats and leans toward the cursor */
.artyk-about .philo-scene{position:relative;perspective:1500px;margin-top:clamp(8px,1.6vw,20px)}
.artyk-about .philo-float{animation:philoFloat 12s ease-in-out infinite;will-change:transform}
@keyframes philoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}

.artyk-about .philo-card{
  position:relative;max-width:980px;margin:0 auto;text-align:center;
  padding:clamp(52px,7vw,100px) clamp(26px,6vw,92px);
  transform-style:preserve-3d;
  transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));
  will-change:transform;
}

/* double hairline frame — a gallery plaque in relief, each line at its own depth */
.artyk-about .philo-frame{position:absolute;inset:0;border:1px solid rgba(244,241,233,.55);pointer-events:none;transform:translateZ(10px)}
.artyk-about .philo-frame--inner{inset:12px;border-color:rgba(31,36,32,.22);transform:translateZ(18px)}

/* specular light that travels across the plaque with the pointer */
.artyk-about .philo-sheen{
  position:absolute;inset:0;pointer-events:none;transform:translateZ(4px);
  background:radial-gradient(58% 46% at var(--mx,50%) var(--my,40%), rgba(255,252,244,.4), rgba(255,252,244,0) 68%);
  mix-blend-mode:soft-light;
}

.artyk-about .philo-eyebrow{display:block;transform:translateZ(32px);letter-spacing:.34em}

/* letterpress heading, floating highest above the plaque */
.artyk-about .philo-head{
  position:relative;margin-top:clamp(20px,2.6vw,30px);
  font-size:clamp(2rem,5vw,4.15rem);
  transform:translateZ(54px);
  text-shadow:0 -1px 1px rgba(31,36,32,.15),0 1px 1px rgba(244,241,233,.3);
}

/* lozenge ornament — a slowly turning jewel between headline and copy */
.artyk-about .philo-orn{display:flex;align-items:center;justify-content:center;gap:16px;margin:clamp(28px,3.6vw,44px) auto;transform:translateZ(40px)}
.artyk-about .philo-orn .ln{width:64px;height:1px;background:linear-gradient(to right,rgba(31,36,32,0),rgba(31,36,32,.4))}
.artyk-about .philo-orn .ln:last-child{background:linear-gradient(to right,rgba(31,36,32,.4),rgba(31,36,32,0))}
.artyk-about .philo-orn .gem{position:relative;width:11px;height:11px;perspective:220px}
.artyk-about .philo-orn .gem i{position:absolute;inset:0;border:1px solid rgba(244,241,233,.9);background:rgba(244,241,233,.14);animation:philoGem 9s linear infinite}
@keyframes philoGem{from{transform:rotateY(0deg) rotate(45deg)}to{transform:rotateY(360deg) rotate(45deg)}}

.artyk-about .philo-copy{position:relative;max-width:620px;margin:0 auto;display:flex;flex-direction:column;gap:1.35em;transform:translateZ(30px)}
.artyk-about .philo-copy p{font-size:15.5px;line-height:1.9;color:rgba(31,36,32,.84)}
.artyk-about .philo-copy p:first-child{
  font-family:var(--font-display),serif;font-style:italic;font-weight:300;
  font-size:clamp(1.08rem,1.8vw,1.35rem);line-height:1.65;color:rgba(31,36,32,.95);
}

/* touch devices have no cursor — let the plaque turn on its own, very slowly */
@keyframes philoIdle{
  0%,100%{transform:rotateX(0deg) rotateY(0deg)}
  25%{transform:rotateX(1.1deg) rotateY(-1.5deg)}
  60%{transform:rotateX(-1deg) rotateY(1.4deg)}
}
@media(hover:none){.artyk-about .philo-card{animation:philoIdle 18s ease-in-out infinite}}

@media(max-width:640px){
  .artyk-about .philo-card{padding:56px 22px 60px}
  .artyk-about .philo-frame--inner{inset:8px}
  .artyk-about .philo-orn .ln{width:40px}
}

/* ================= SWEEP LINK + COLOPHON (shared with the chapters) ================= */
.artyk-about .sweep{
  font-family:var(--font-sans),serif;font-weight:500;font-size:12px;letter-spacing:.26em;text-transform:uppercase;
  color:var(--corten);text-decoration:none;position:relative;padding-bottom:8px;
}
.artyk-about .sweep::after{content:'';position:absolute;left:0;bottom:0;height:1px;width:100%;background:var(--corten);transform-origin:right;transition:transform .5s var(--ease)}
@media(hover:hover){.artyk-about .sweep:hover::after{transform:scaleX(0);transform-origin:left}}
.artyk-about .colophon{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--onyx);margin-top:clamp(72px,9vw,120px);padding-top:14px;flex-wrap:wrap;gap:8px}
.artyk-about .colophon .it{font-size:14px;color:rgba(31,36,32,.55)}

.artyk-about :focus-visible{outline:2px solid var(--corten);outline-offset:2px}
@media(prefers-reduced-motion:reduce){
  .artyk-about .rv{opacity:1;transform:none;transition:none}
  .artyk-about .split .wline>span{transform:none;transition:none}
  .artyk-about .hero .im{animation:none;transform:none}
  .artyk-about .feature .frame .clip{clip-path:inset(0 0 0 0);transition:none}
  .artyk-about .feature .frame .clip img{transform:none;transition:none}
  .artyk-about .feature figcaption{opacity:1;transform:none;transition:none}
  .artyk-about .names.split .wline>span{filter:none;opacity:1}
  .artyk-about .stats div::before{transform:scaleX(1);transition:none}
  .artyk-about .track{animation:none}
  .artyk-about .spreadimg .par{top:0;height:100%}
  .artyk-about .scrub .w{opacity:1}
  .artyk-about .philo-float{animation:none}
  .artyk-about .philo-card{animation:none;transform:none}
  .artyk-about .philo-orn .gem i{animation:none;transform:rotate(45deg)}
  .artyk-about .philo-sheen{display:none}
}
`;
