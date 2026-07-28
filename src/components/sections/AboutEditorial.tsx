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
    root.querySelectorAll(".rv, .split, .js-clip, .draw").forEach((el) => io.observe(el));
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

    /* philosophy: the image plane leans toward the pointer with inertia and a
       travelling sheen; the text drifts a touch for parallax depth. On touch
       devices (no pointer) a slow auto-lean keyframe carries the 3D instead. */
    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!reduce && finePointer) {
      const scene = root.querySelector<HTMLElement>(".philo2");
      const plane = root.querySelector<HTMLElement>(".philo2-inner");
      const text = root.querySelector<HTMLElement>(".philo2-text");
      if (scene && plane) {
        const MAX = 2.6;
        let tRx = 0, tRy = 0, tMx = 50, tMy = 38;
        let rx = 0, ry = 0, mx = 50, my = 38;
        let raf = 0;
        const step = () => {
          rx += (tRx - rx) * 0.07;
          ry += (tRy - ry) * 0.07;
          mx += (tMx - mx) * 0.07;
          my += (tMy - my) * 0.07;
          plane.style.setProperty("--rx", rx.toFixed(3) + "deg");
          plane.style.setProperty("--ry", ry.toFixed(3) + "deg");
          plane.style.setProperty("--mx", mx.toFixed(2) + "%");
          plane.style.setProperty("--my", my.toFixed(2) + "%");
          if (text) {
            text.style.transform =
              "translate3d(" + (ry * -1.5).toFixed(2) + "px," + (rx * 1.5).toFixed(2) + "px,0)";
          }
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
          tRy = nx * MAX;
          tRx = -ny * MAX;
          tMx = nx * 100 + 50;
          tMy = ny * 100 + 50;
          kick();
        };
        const leave = () => {
          tRx = 0;
          tRy = 0;
          tMx = 50;
          tMy = 38;
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

            <div className="support">
              <span className="rule-draw draw" aria-hidden="true" />
              <div className="support-grid">
                <div className="belief">
                  <span className="micro col-label rv">Our belief</span>
                  <div className="belief-cols">
                    <p className="rv d1">
                      We believe that exceptional interiors are not defined by individual pieces, but
                      by the harmony between craftsmanship, materiality, proportion, and purpose. Every
                      collection we present is chosen to inspire spaces that reflect the aspirations and
                      lifestyles of those who inhabit them.
                    </p>
                    <p className="rv d2">
                      At Artyk, every brand is selected with intention. We bring together globally
                      celebrated names in furniture, kitchens, wardrobes, lighting, rugs, and art —
                      united by a shared commitment to quality, innovation, and enduring design.
                    </p>
                  </div>
                </div>

                <aside className="serve rv d2">
                  <span className="micro col-label">Who we serve</span>
                  <ul className="clients">
                    <li><span>Homeowners</span></li>
                    <li><span>Architects &amp; Designers</span></li>
                    <li><span>Developers</span></li>
                    <li><span>Hospitality Partners</span></li>
                  </ul>
                </aside>
              </div>
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
            <div className="philoGroup">
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
        </div>

        <div className="philo2">
          <figure className="philo2-media js-clip">
            <div className="philo2-inner">
              <div className="philo2-clip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about/image-4.jpg"
                  alt="Inside the Artyk gallery — a curated living arrangement framed by floor-to-ceiling greenery"
                  loading="lazy"
                />
              </div>
              <span className="philo2-sheen" aria-hidden="true" />
              <span className="philo2-edge" aria-hidden="true" />
            </div>
            <span className="philo2-tag micro">The Gallery — Hyderabad</span>
          </figure>

          <div className="philo2-text">
            <span className="micro philo2-eyebrow rv">Artyk · Curated Living</span>
            <h2 className="display philo2-head split">
              Thoughtfully chosen,
              <br />
              beautifully <span className="accent">experienced</span>.
            </h2>
            <div className="philo2-copy">
              <p className="rv d1">
                At Artyk, we believe that exceptional interiors are shaped by thoughtful decisions,
                not overwhelming choices.
              </p>
              <p className="rv d2">
                Every brand we represent is selected for its distinct design philosophy,
                uncompromising craftsmanship, and enduring relevance — together forming a cohesive
                collection that celebrates authenticity, innovation, and timeless living.
              </p>
              <p className="rv d3">
                Our role is not simply to present beautiful products, but to help create spaces where
                every element feels considered, connected, and uniquely personal.
              </p>
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
.artyk-about .hero-inner h1{color:var(--ivory);font-size:clamp(2.5rem,4.5vw,4rem);line-height:1.08;letter-spacing:-0.01em}
.artyk-about .hero-sub{color:rgba(244,241,233,.78);font-style:italic;font-size:clamp(.98rem,1.4vw,1.15rem);max-width:34em;margin-top:20px}

/* ================= STANDFIRST ================= */
.artyk-about .standfirst .grid{display:block}
.artyk-about .standfirst .lead{max-width:62rem;font-size:clamp(1.5rem,2.9vw,2.5rem)}
.artyk-about .standfirst .lead .accent{font-style:italic;color:var(--corten)}

/* supporting block flows beneath the lead, filling the width */
.artyk-about .standfirst .support{margin-top:clamp(44px,6vw,96px)}
.artyk-about .standfirst .rule-draw{display:block;height:1px;width:100%;background:var(--line);transform:scaleX(0);transform-origin:left;transition:transform 1.5s var(--ease)}
.artyk-about .standfirst .rule-draw.in{transform:scaleX(1)}

.artyk-about .standfirst .support-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(30px,4vw,72px);margin-top:clamp(30px,3.4vw,50px)}
.artyk-about .standfirst .col-label{display:block;margin-bottom:clamp(18px,2vw,26px);position:relative;padding-left:20px}
.artyk-about .standfirst .col-label::before{content:"";position:absolute;left:0;top:.34em;width:9px;height:9px;border-radius:50%;background:var(--corten);opacity:.85}

.artyk-about .standfirst .belief{grid-column:1/9}
.artyk-about .standfirst .belief-cols{display:grid;grid-template-columns:1fr 1fr;gap:clamp(22px,2.6vw,46px)}
.artyk-about .standfirst .belief p{font-size:15.5px;line-height:1.78;color:rgba(31,36,32,.78)}

.artyk-about .standfirst .serve{grid-column:10/13}
.artyk-about .standfirst .clients{list-style:none}
.artyk-about .standfirst .clients li{border-top:1px solid var(--line);overflow:hidden}
.artyk-about .standfirst .clients li:last-child{border-bottom:1px solid var(--line)}
.artyk-about .standfirst .clients li span{display:block;padding:13px 2px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;font-weight:500;color:rgba(31,36,32,.62);transition:transform .55s var(--ease),color .55s var(--ease)}
.artyk-about .standfirst .clients li:hover span{transform:translateX(9px);color:var(--corten)}

@media(max-width:920px){
  .artyk-about .standfirst .belief{grid-column:1/13}
  .artyk-about .standfirst .belief-cols{grid-template-columns:1fr;gap:0}
  .artyk-about .standfirst .belief p + p{margin-top:18px}
  .artyk-about .standfirst .serve{grid-column:1/13;margin-top:10px}
}

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
.artyk-about .names{font-size:clamp(1.7rem,3.1vw,2.8rem);margin:14px 0 16px}
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
.artyk-about .marquee{padding:8px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;background:var(--stone)}
.artyk-about .track{display:flex;width:max-content;animation:aboutMq 36s linear infinite;gap:0}
.artyk-about .track span{font-family:var(--font-display),serif;font-weight:300;font-size:clamp(1.35rem,2.1vw,1.75rem);line-height:1.25;white-space:nowrap;padding-right:.6em}
.artyk-about .track .dot{color:var(--corten);padding:0 .6em}
.artyk-about .track i{font-style:italic}
@keyframes aboutMq{to{transform:translateX(-50%)}}

/* ================= GALLERY SPREAD ================= */
.artyk-about .gallery{padding-top:0}
.artyk-about .spreadimg{height:min(92vh,880px);min-height:420px;overflow:hidden;position:relative}
.artyk-about .spreadimg .par{position:absolute;left:0;right:0;top:-7%;height:114%;will-change:transform}
.artyk-about .gallery .below{display:grid;grid-template-columns:repeat(12,1fr);gap:clamp(20px,3vw,52px);margin-top:clamp(26px,3vw,44px);align-items:start}
.artyk-about .gallery .capL{grid-column:1/5}
.artyk-about .gallery .philoGroup{grid-column:6/13}
.artyk-about .gallery .philoT{font-size:clamp(1.5rem,2.9vw,2.5rem)}
.artyk-about .gallery .philoB{max-width:30rem;margin-top:clamp(18px,1.6vw,26px);color:rgba(31,36,32,.8)}
@media(max-width:920px){.artyk-about .gallery .capL{grid-column:1/13}.artyk-about .gallery .philoGroup{grid-column:1/13}}

/* ================= PHILOSOPHY — the dark editorial portrait ================= */
.artyk-about .philosophy{background:var(--onyx);color:var(--ivory);position:relative;padding:0}
/* a whisper of forest light from above, so the deep ink reads as green */
.artyk-about .philosophy::before{content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 70% at 78% -6%, rgba(126,154,110,.14), rgba(126,154,110,0) 52%)}
.artyk-about .philosophy .wrap{position:relative;z-index:1;padding-top:clamp(64px,8vw,120px);padding-bottom:clamp(26px,3vw,44px)}
.artyk-about .philosophy .micro{color:rgba(244,241,233,.55)}
.artyk-about .philosophy .kicker .l{background:rgba(244,241,233,.16)}
.artyk-about .philosophy .kicker .r{color:rgba(244,241,233,.5)}

/* the split: a full-height plate flush to the edge, a statement alongside */
.artyk-about .philo2{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.02fr) minmax(0,1fr);align-items:stretch}
.artyk-about .philo2-media{position:relative;min-height:clamp(480px,74vh,780px);overflow:hidden;perspective:1600px}
/* the plane that leans toward the pointer, in 3D */
.artyk-about .philo2-inner{position:absolute;inset:0;transform-style:preserve-3d;
  transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .5s var(--ease);will-change:transform}
/* the reveal rides on the UNCLIPPED figure (a fully clipped element never
   reports as intersecting, so the inner plane is what actually clips).
   Slightly overscaled inset so the 3D tilt never bares an edge. */
.artyk-about .philo2-clip{position:absolute;inset:-3%;overflow:hidden;
  clip-path:inset(103% 0 0 0);transition:clip-path 1.7s var(--ease)}
.artyk-about .philo2-media.in .philo2-clip{clip-path:inset(0 0 0 0)}
.artyk-about .philo2-clip img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transform:scale(1.14);transition:transform 2.6s var(--ease);will-change:transform}
.artyk-about .philo2-media.in .philo2-clip img{transform:scale(1.05)}
/* specular light that travels with the pointer, floating above the plane */
.artyk-about .philo2-sheen{position:absolute;inset:0;pointer-events:none;transform:translateZ(28px);
  background:radial-gradient(54% 42% at var(--mx,50%) var(--my,38%), rgba(255,252,244,.30), rgba(255,252,244,0) 68%);
  mix-blend-mode:soft-light}
/* a hairline frame lifted off the surface — quiet gallery-plaque depth */
.artyk-about .philo2-edge{position:absolute;inset:clamp(16px,1.6vw,26px);pointer-events:none;
  border:1px solid rgba(244,241,233,.28);transform:translateZ(46px)}
.artyk-about .philo2-tag{position:absolute;left:clamp(18px,2vw,30px);bottom:clamp(16px,2vw,28px);z-index:2;
  color:rgba(244,241,233,.92);letter-spacing:.28em;text-shadow:0 1px 12px rgba(0,0,0,.5)}

.artyk-about .philo2-text{display:flex;flex-direction:column;justify-content:center;will-change:transform;
  padding:clamp(48px,7vw,112px) clamp(24px,6vw,110px)}
.artyk-about .philo2-eyebrow{display:block;letter-spacing:.32em;margin-bottom:clamp(18px,2vw,28px)}
.artyk-about .philo2-head{font-size:clamp(1.5rem,2.9vw,2.5rem);line-height:1.16;letter-spacing:-0.005em;color:var(--ivory)}
.artyk-about .philo2-head .accent{font-style:italic;color:var(--corten)}
.artyk-about .philo2-copy{margin-top:clamp(22px,2.6vw,36px);display:flex;flex-direction:column;gap:1.25em;max-width:42ch}
.artyk-about .philo2-copy p{font-size:15.5px;line-height:1.85;color:rgba(244,241,233,.74)}
.artyk-about .philo2-copy p:first-child{font-family:var(--font-display),serif;font-style:italic;font-weight:300;
  font-size:clamp(1.1rem,1.7vw,1.4rem);line-height:1.6;color:rgba(244,241,233,.94)}

@media(max-width:900px){
  .artyk-about .philo2{grid-template-columns:1fr}
  .artyk-about .philo2-media{min-height:clamp(360px,52vh,520px)}
  .artyk-about .philo2-text{padding:clamp(40px,8vw,64px) clamp(22px,6vw,48px)}
  .artyk-about .philo2-edge{inset:12px}
}
/* touch devices have no pointer — the plane leans on its own, very slowly */
@media(hover:none){
  .artyk-about .philo2-inner{animation:philoLean 15s ease-in-out infinite}
}
@keyframes philoLean{
  0%,100%{transform:rotateX(0deg) rotateY(0deg)}
  28%{transform:rotateX(1.3deg) rotateY(-1.8deg)}
  62%{transform:rotateX(-1.1deg) rotateY(1.5deg)}
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
  .artyk-about .standfirst .rule-draw{transform:scaleX(1);transition:none}
  .artyk-about .track{animation:none}
  .artyk-about .spreadimg .par{top:0;height:100%}
  .artyk-about .scrub .w{opacity:1}
  .artyk-about .philo2-clip{clip-path:inset(0 0 0 0);transition:none}
  .artyk-about .philo2-clip img{transform:none;transition:none}
}
`;
