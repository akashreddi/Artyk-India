"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Services showcase — a port of ARTYK-SERVICES-PAGE-HTML.html, adapted for the
 * homepage ("From first vision to final detail." section, above Brands).
 *
 * Two distinct layouts:
 *  • Laptop / desktop (md+): the interactive editorial showcase — an image
 *    stage with an offset frame on the left, and a tab row + choreographed
 *    content pane on the right. Hovering or clicking a chapter crossfades the
 *    image and re-runs the title / description / list reveal.
 *  • Mobile: a fully-visible stacked layout (no hidden tab content), each
 *    chapter shown with its image, number, title, description and list.
 *
 * Bespoke choreography CSS is scoped under `.artyk-services` so the reference's
 * generic selectors don't leak site-wide. Fonts reuse the bundled local font
 * variables and the palette matches the Tailwind tokens.
 */

type Service = {
  n: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
  list: string[];
};

const DATA: Service[] = [
  {
    n: "01",
    title: "Imagine",
    desc: "Every exceptional space begins with a vision.",
    img: "/images/services/showcase-1.jpg",
    alt: "A dark, richly detailed living room — the starting point of a design vision",
    list: [
      "Interior Design Consultation",
      "Furniture Planning",
      "Space Layout",
      "3D Visualisation",
      "Material & Finish Selection",
    ],
  },
  {
    n: "02",
    title: "Curate",
    desc: "Selecting furniture, lighting and objects with timeless elegance.",
    img: "/images/services/showcase-2.jpg",
    alt: "A curated coffee table vignette with sculptural furniture and layered materials",
    list: ["Luxury Furniture", "Lighting", "Art & Accessories"],
  },
  {
    n: "03",
    title: "Craft",
    desc: "Creating bespoke solutions tailored to each project.",
    img: "/images/services/showcase-3.jpg",
    alt: "A bespoke luxury kitchen in walnut and black stone, custom-fitted",
    list: ["Bespoke Kitchens", "Wardrobes & Storage", "Custom Furniture", "Made-to-Order Pieces"],
  },
  {
    n: "04",
    title: "Realise",
    desc: "Delivering every detail with precision.",
    img: "/images/services/showcase-4.jpg",
    alt: "Precise on-site installation and assembly of custom furniture",
    list: ["Product Specification", "Technical Coordination", "Installation", "Site Coordination"],
  },
];

export default function ServicesShowcase() {
  const [active, setActive] = useState(0);

  return (
    <div className="artyk-services">
      <style>{CSS}</style>

      {/* ============ DESKTOP / LAPTOP — interactive showcase ============ */}
      <div className="sc-top">
        {/* image stage with offset frame */}
        <div className="stagewrap">
          <div className="stage">
            {DATA.map((d, i) => (
              <figure key={d.title} className={i === active ? "active" : ""}>
                <Image
                  src={d.img}
                  alt={d.alt}
                  fill
                  sizes="(max-width:960px) 100vw, 52vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        </div>

        {/* right panel */}
        <div className="panel">
          <nav className="topnav" aria-label="Service chapters">
            {DATA.map((d, i) => (
              <button
                key={d.title}
                type="button"
                className={`tnitem${i === active ? " active" : ""}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                {d.title}
                <span className="u" />
              </button>
            ))}
          </nav>
          <div className="navdivider" />

          <div className="content">
            {DATA.map((d, i) => (
              <div key={d.title} className={`pane${i === active ? " active" : ""}`} aria-hidden={i !== active}>
                <span className="num">{d.n}</span>
                <h3 className="display ptitle">
                  <span>{d.title}</span>
                </h3>
                <p className="pdesc">{d.desc}</p>
                <ul className="plist">
                  {d.list.map((s) => (
                    <li key={s}>
                      <span className="arrow">&#8594;</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ MOBILE — horizontal snap rail ============ */}
      <div className="sc-mobile" role="list" aria-label="Our services">
        {DATA.map((d) => (
          <article className="m-item" role="listitem" key={d.title}>
            <div className="m-frame">
              <Image src={d.img} alt={d.alt} fill sizes="82vw" className="object-cover" />
            </div>
            <div className="m-head">
              <span className="num">{d.n}</span>
              <h3 className="display m-title">{d.title}</h3>
            </div>
            <p className="pdesc">{d.desc}</p>
            <ul className="plist">
              {d.list.map((s) => (
                <li key={s}>
                  <span className="arrow">&#8594;</span>
                  {s}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

const CSS = `
.artyk-services{
  --onyx:#1F2420; --corten:#A85838; --ivory:#F4F1E9; --stone:#E6E3DA;
  --ease:cubic-bezier(.22,1,.36,1);
  color:var(--onyx);
  font-family:var(--font-sans),serif;font-weight:300;
  -webkit-font-smoothing:antialiased;
}
.artyk-services .display{font-family:var(--font-display),serif;font-weight:300;line-height:1.05;letter-spacing:-0.01em}
.artyk-services .micro{font-family:var(--font-sans),serif;font-weight:500;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:rgba(31,36,32,.55)}

/* ---- shared list styling (desktop + mobile) ---- */
.artyk-services .pdesc{
  margin-top:16px;max-width:32ch;font-style:italic;
  font-size:clamp(1rem,1.3vw,1.2rem);line-height:1.55;color:rgba(31,36,32,.68);
}
.artyk-services .plist{list-style:none;margin:0;padding:0;margin-top:clamp(24px,3.4vw,38px)}
.artyk-services .plist li{
  display:flex;align-items:baseline;gap:16px;padding:14px 0;
  border-bottom:1px solid rgba(31,36,32,.1);
  font-size:14.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:500;color:rgba(31,36,32,.85);
}
.artyk-services .plist li:first-child{border-top:1px solid rgba(31,36,32,.1)}
.artyk-services .plist .arrow{color:var(--corten);font-family:var(--font-sans),serif;font-size:15px;flex:none;transition:transform .4s var(--ease)}
@media(hover:hover){.artyk-services .plist li:hover .arrow{transform:translateX(3px)}}
.artyk-services .num{
  font-family:var(--font-display),serif;font-style:italic;font-weight:300;
  font-size:clamp(2.2rem,3.4vw,3.2rem);line-height:1;color:var(--corten);display:block;
}

/* ================= DESKTOP SHOWCASE ================= */
.artyk-services .sc-top{display:none}
@media(min-width:768px){
  .artyk-services .sc-mobile{display:none}
  .artyk-services .sc-top{
    display:grid;grid-template-columns:52% 48%;gap:clamp(28px,4.5vw,64px);align-items:start;
  }
}

.artyk-services .stagewrap{position:relative}
.artyk-services .stagewrap::before{
  content:'';position:absolute;left:22px;top:22px;right:-22px;bottom:-22px;
  border:1px solid rgba(31,36,32,.22);z-index:0;
}
.artyk-services .stage{position:relative;aspect-ratio:16/11.2;overflow:hidden;background:var(--onyx);z-index:1}
.artyk-services .stage figure{position:absolute;inset:0;opacity:0;transform:scale(1.03);transition:opacity .6s var(--ease),transform .65s var(--ease)}
.artyk-services .stage figure.active{opacity:1;transform:scale(1);z-index:2}
.artyk-services .stage img{width:100%;height:100%;object-fit:cover;display:block}

.artyk-services .panel{display:flex;flex-direction:column}

/* top navigation: editorial tab row */
.artyk-services .topnav{display:flex;flex-wrap:wrap;gap:clamp(28px,4vw,48px);margin-top:clamp(4px,1vw,10px)}
.artyk-services .tnitem{
  background:none;border:none;cursor:pointer;padding:6px 0 12px;position:relative;
  font-family:var(--font-display),serif;font-weight:400;font-size:clamp(1.15rem,1.7vw,1.5rem);
  letter-spacing:.01em;color:rgba(31,36,32,.4);transition:color .4s var(--ease);
}
.artyk-services .tnitem .u{
  position:absolute;left:0;bottom:0;height:2px;width:100%;background:var(--corten);
  transform:scaleX(0);transform-origin:left;transition:transform .45s var(--ease);
}
.artyk-services .tnitem.active{color:var(--onyx);font-weight:500}
.artyk-services .tnitem.active .u{transform:scaleX(1)}
@media(hover:hover){
  .artyk-services .tnitem:hover{color:var(--onyx)}
  .artyk-services .tnitem:hover .u{transform:scaleX(1)}
}
.artyk-services .navdivider{height:1px;background:rgba(31,36,32,.16);margin-top:2px;margin-bottom:clamp(28px,3.6vw,40px)}

.artyk-services .content{display:grid}
.artyk-services .pane{grid-column:1;grid-row:1;opacity:0;pointer-events:none;min-width:0}
.artyk-services .pane.active{opacity:1;pointer-events:auto}

.artyk-services .pane .num{
  opacity:0;transform:translateY(10px);
  transition:opacity .5s var(--ease),transform .5s var(--ease);
}
.artyk-services .pane.active .num{opacity:1;transform:none;transition-delay:.03s}

.artyk-services .ptitle{overflow:hidden;padding-bottom:.14em;margin-bottom:-.14em;margin-top:0}
.artyk-services .ptitle span{
  display:block;font-size:clamp(2.6rem,5vw,4.5rem);line-height:1.12;
  transform:translateY(105%);transition:transform .65s var(--ease);
}
.artyk-services .pane.active .ptitle span{transform:translateY(0);transition-delay:.08s}

.artyk-services .pane .pdesc{opacity:0;transition:opacity .55s var(--ease)}
.artyk-services .pane.active .pdesc{opacity:1;transition-delay:.16s}

.artyk-services .pane .plist li{opacity:0;transform:translateX(10px);transition:opacity .5s var(--ease),transform .5s var(--ease)}
.artyk-services .pane.active .plist li{opacity:1;transform:none}
.artyk-services .pane.active .plist li:nth-child(1){transition-delay:.22s}
.artyk-services .pane.active .plist li:nth-child(2){transition-delay:.28s}
.artyk-services .pane.active .plist li:nth-child(3){transition-delay:.34s}
.artyk-services .pane.active .plist li:nth-child(4){transition-delay:.4s}
.artyk-services .pane.active .plist li:nth-child(5){transition-delay:.46s}

/* ================= MOBILE — horizontal snap rail ================= */
/* Scoped to max-width so it never overrides the desktop display:none,
   which is declared earlier in source order under min-width:768px. */
@media(max-width:767px){
  .artyk-services .sc-mobile{
    display:flex;
    gap:18px;
    overflow-x:auto;
    overflow-y:hidden;
    scroll-snap-type:x mandatory;
    scroll-padding-left:24px;
    -webkit-overflow-scrolling:touch;
    scrollbar-width:none;
    /* bleed past the section's 24px side padding to the screen edges */
    margin:0 -24px;
    padding:0 24px 6px;
  }
}
.artyk-services .sc-mobile::-webkit-scrollbar{display:none}
.artyk-services .m-item{
  flex:0 0 82%;
  min-width:82%;
  scroll-snap-align:start;
}
.artyk-services .m-frame{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--onyx)}
.artyk-services .m-head{display:flex;align-items:baseline;gap:14px;margin-top:18px}
.artyk-services .m-head .num{font-size:1.5rem}
.artyk-services .m-title{font-size:clamp(1.9rem,8vw,2.4rem);line-height:1}
.artyk-services .m-item .pdesc{margin-top:10px;max-width:none}
.artyk-services .m-item .plist{margin-top:20px}

.artyk-services :focus-visible{outline:2px solid var(--corten);outline-offset:2px}
@media(prefers-reduced-motion:reduce){
  .artyk-services .stage figure,
  .artyk-services .pane,
  .artyk-services .pane .num,
  .artyk-services .ptitle span,
  .artyk-services .pane .pdesc,
  .artyk-services .pane .plist li,
  .artyk-services .tnitem .u{transition:none !important}
}
`;
