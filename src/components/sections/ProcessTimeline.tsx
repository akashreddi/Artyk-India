"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * "Our Process" — the journey line.
 *
 * Five stations along one continuous serpentine: the line enters at the
 * top left beneath "the first meeting", travels through 01–03, sweeps a
 * wide 180° bend on the right, and returns through 04–05 to rest at
 * "the final reveal". The stroke inks itself in as the visitor scrolls,
 * a travelling point riding its tip; each station fills the moment the
 * ink reaches it. Below md the serpentine becomes a single vertical
 * rail with the same stations.
 *
 * Geometry is measured from the DOM via offset chains (immune to the
 * entrance transforms of framer-motion cells) and redrawn on resize, so
 * the SVG always threads exactly through the rendered nodes. Station
 * fractions along the path are computed analytically — every station
 * sits on one of the two straight runs, so only the arc length needs
 * an approximation (Ramanujan's half-ellipse perimeter).
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    no: "01",
    title: "Discover",
    body: "Understanding your project, aspirations, and functional requirements.",
  },
  {
    no: "02",
    title: "Design",
    body: "Developing layouts, product specifications, and tailored solutions.",
  },
  {
    no: "03",
    title: "Curate",
    body: "Selecting the right brands, collections, materials, and finishes.",
  },
  {
    no: "04",
    title: "Deliver",
    body: "Managing procurement, logistics, installation, and final execution with meticulous attention to detail.",
  },
  {
    no: "05",
    title: "Experience",
    body: "A space that reflects your vision, celebrates design, and enhances the way you live.",
  },
];

type Step = (typeof STEPS)[number];

/** Layout position of an element's centre within `root`, via offset
    chains — unaffected by any in-flight transform animations. */
function centerWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
}

/** Stations the ink has passed for a given progress. Nothing lights
    before the line has visibly begun to draw. */
function reachedCount(fractions: number[], p: number) {
  if (p <= 0.002) return 0;
  let count = 0;
  for (const f of fractions) if (f <= p + 0.004) count += 1;
  return count;
}

/* ---------------- the station node ---------------- */

function Station({
  no,
  active,
  reduce,
  className = "",
}: {
  no: string;
  active: boolean;
  reduce: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative flex items-center justify-center rounded-full border bg-ivory transition-colors duration-700 ${
        active ? "border-forest" : "border-cognac/40 group-hover:border-forest/60"
      } ${className}`}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-forest"
        initial={false}
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
      />
      {active && !reduce && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-forest/45"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.75, opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      )}
      <span
        className={`relative font-display font-light italic leading-none transition-colors duration-700 ${
          active ? "text-ivory" : "text-cognac"
        }`}
      >
        {no}
      </span>
    </span>
  );
}

/* ---------------- desktop: the serpentine ---------------- */

function StationCell({
  step,
  active,
  reduce,
  nodeRef,
  delay,
  className = "",
}: {
  step: Step;
  active: boolean;
  reduce: boolean;
  nodeRef: (el: HTMLElement | null) => void;
  delay: number;
  className?: string;
}) {
  return (
    <div className={`group ${className}`}>
      {/* measured wrapper — kept free of transforms */}
      <span
        ref={nodeRef}
        className="block h-12 w-12"
      >
        <motion.span
          className="block h-full w-full"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE, delay }}
        >
          <Station no={step.no} active={active} reduce={reduce} className="h-12 w-12 text-[15px]" />
        </motion.span>
      </span>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE, delay: delay + 0.08 }}
      >
        <span
          aria-hidden="true"
          className="ml-6 mt-2 block h-9 w-0 border-l border-dotted border-cognac/50 transition-colors duration-700 group-hover:border-forest/70"
        />
        <h3 className="ml-6 mt-4 font-display text-[clamp(1.3rem,1.7vw,1.6rem)] font-light leading-[1.12] text-onyx transition-transform duration-700 ease-luxury group-hover:translate-x-1">
          {step.title}
        </h3>
        <p className="ml-6 mt-3 max-w-[34ch] text-sm leading-relaxed text-cognac">{step.body}</p>
      </motion.div>
    </div>
  );
}

function Serpentine({ reduce }: { reduce: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inkRef = useRef<SVGPathElement | null>(null);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const endRef = useRef<HTMLElement | null>(null);
  const [geom, setGeom] = useState<{ d: string; w: number; h: number; y1: number } | null>(null);
  const fractionsRef = useRef<number[]>([]);
  const totalRef = useRef(0);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.5 });
  const tipX = useMotionValue(0);
  const tipY = useMotionValue(0);
  const tipOpacity = useTransform(progress, [0, 0.01, 0.97, 1], [0, 1, 1, 0]);

  const measure = useCallback(() => {
    const root = containerRef.current;
    if (!root || root.offsetWidth < 40) return;
    const nodes = nodeRefs.current.slice(0, 5);
    const end = endRef.current;
    if (nodes.some((n) => !n) || !end) return;
    const c = nodes.map((n) => centerWithin(n as HTMLElement, root));
    const e = centerWithin(end, root);
    const w = root.offsetWidth;
    const h = root.offsetHeight;
    const y1 = (c[0].y + c[1].y + c[2].y) / 3;
    const y2 = (c[3].y + c[4].y + e.y) / 3;
    const ry = Math.max((y2 - y1) / 2, 24);
    let rx = Math.min(ry, 250);
    let xa = w - rx - 2;
    const minXa = c[2].x + 48;
    if (xa < minXa) {
      xa = minXa;
      rx = Math.max(w - 2 - xa, 24);
    }
    const d = `M 2 ${y1} L ${xa} ${y1} A ${rx} ${ry} 0 0 1 ${xa} ${y2} L ${e.x} ${y2}`;

    // station fractions: outbound run, arc (Ramanujan), return run
    const l1 = xa - 2;
    const la = (Math.PI / 2) * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    const total = l1 + la + (xa - e.x);
    fractionsRef.current = [
      ...c.slice(0, 3).map((p) => (p.x - 2) / total),
      ...c.slice(3, 5).map((p) => (l1 + la + (xa - p.x)) / total),
      1,
    ];
    setReached((prev) => {
      const count = reachedCount(fractionsRef.current, progress.get());
      return prev === count ? prev : count;
    });
    // preserve identity when nothing changed so downstream effects stay quiet
    setGeom((prev) => (prev && prev.d === d && prev.w === w && prev.h === h ? prev : { d, w, h, y1 }));
  }, [progress]);

  useLayoutEffect(() => {
    measure();
    const root = containerRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  // the browser's true path length feeds the travelling tip
  useLayoutEffect(() => {
    const path = inkRef.current;
    if (!geom || !path) return;
    totalRef.current = path.getTotalLength();
  }, [geom]);

  useMotionValueEvent(progress, "change", (p) => {
    const path = inkRef.current;
    if (path && totalRef.current > 0) {
      const pt = path.getPointAtLength(Math.min(Math.max(p, 0), 1) * totalRef.current);
      tipX.set(pt.x);
      tipY.set(pt.y);
    }
    const count = reachedCount(fractionsRef.current, p);
    setReached((prev) => (prev === count ? prev : count));
  });

  const active = (i: number) => reduce || i < reached;
  const endReached = reduce || reached >= 6;

  return (
    <div ref={containerRef} className="relative hidden pt-14 md:block">
      {geom && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${geom.w} ${geom.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d={geom.d}
            fill="none"
            stroke="var(--ink-soft)"
            strokeOpacity={0.3}
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          />
          <motion.path
            ref={inkRef}
            d={geom.d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ pathLength: reduce ? 1 : progress }}
          />
          {!reduce && (
            <motion.g style={{ x: tipX, y: tipY, opacity: tipOpacity }}>
              <circle r={8} fill="var(--accent)" opacity={0.14} />
              <circle r={3} fill="var(--accent)" />
            </motion.g>
          )}
        </svg>
      )}

      {/* departure label, just above the line's entry */}
      {geom && (
        <motion.p
          className="absolute left-0 font-display text-sm font-light italic text-cognac"
          style={{ top: geom.y1 - 42 }}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          the first meeting
        </motion.p>
      )}

      {/* outbound: 01 → 03 */}
      <div className="relative grid grid-cols-3 gap-x-8 pl-[6%] pr-[13%] lg:gap-x-12">
        {STEPS.slice(0, 3).map((s, i) => (
          <StationCell
            key={s.no}
            step={s}
            active={active(i)}
            reduce={reduce}
            delay={i * 0.08}
            nodeRef={(el) => {
              nodeRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      <div className="h-20 lg:h-24" aria-hidden="true" />

      {/* return: 04 → 05 → the reveal. DOM stays in journey order for
          assistive tech; explicit column placement runs it right-to-left. */}
      <div className="relative grid grid-cols-3 gap-x-8 pl-[6%] pr-[13%] lg:gap-x-12">
        <StationCell
          className="col-start-3 row-start-1"
          step={STEPS[3]}
          active={active(3)}
          reduce={reduce}
          delay={0}
          nodeRef={(el) => {
            nodeRefs.current[3] = el;
          }}
        />
        <StationCell
          className="col-start-2 row-start-1"
          step={STEPS[4]}
          active={active(4)}
          reduce={reduce}
          delay={0.08}
          nodeRef={(el) => {
            nodeRefs.current[4] = el;
          }}
        />
        <div className="col-start-1 row-start-1">
          <span className="flex h-12 items-center">
            <span
              ref={endRef}
              className={`relative flex h-4 w-4 items-center justify-center rounded-full border bg-stone transition-colors duration-700 ${
                endReached ? "border-forest" : "border-cognac/50"
              }`}
            >
              <motion.span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-forest"
                initial={false}
                animate={{ scale: endReached ? 1 : 0, opacity: endReached ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              />
            </span>
          </span>
          <motion.p
            className="mt-4 font-display text-sm font-light italic text-cognac"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.16 }}
          >
            the final reveal
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- mobile: the rail ---------------- */

function Rail({ reduce }: { reduce: boolean }) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const [rail, setRail] = useState<{ top: number; height: number } | null>(null);
  const fractionsRef = useRef<number[]>([]);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.82", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.5 });

  const measure = useCallback(() => {
    const root = listRef.current;
    if (!root || root.offsetWidth < 10) return;
    const cs = nodeRefs.current
      .slice(0, 5)
      .filter((n): n is HTMLElement => Boolean(n))
      .map((n) => centerWithin(n, root));
    if (cs.length < 5) return;
    const top = cs[0].y;
    const height = Math.max(cs[4].y - cs[0].y, 1);
    fractionsRef.current = cs.map((c) => (c.y - top) / height);
    setReached((prev) => {
      const count = reachedCount(fractionsRef.current, progress.get());
      return prev === count ? prev : count;
    });
    setRail((prev) => (prev && prev.top === top && prev.height === height ? prev : { top, height }));
  }, [progress]);

  useLayoutEffect(() => {
    measure();
    const root = listRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  useMotionValueEvent(progress, "change", (p) => {
    const count = reachedCount(fractionsRef.current, p);
    setReached((prev) => (prev === count ? prev : count));
  });

  const active = (i: number) => reduce || i < reached;

  return (
    <div className="md:hidden">
      <motion.p
        className="font-display text-sm font-light italic text-cognac"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        the first meeting
      </motion.p>

      <div ref={listRef} className="relative mt-8">
        {rail && (
          <>
            <span
              aria-hidden="true"
              className="absolute w-px bg-cognac/30"
              style={{ left: 15.5, top: rail.top, height: rail.height }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute w-px origin-top bg-forest"
              style={{
                left: 15.5,
                top: rail.top,
                height: rail.height,
                scaleY: reduce ? 1 : progress,
              }}
            />
          </>
        )}

        <ol className="flex flex-col gap-12">
          {STEPS.map((s, i) => (
            <li key={s.no} className="relative pl-12">
              <span
                className="absolute left-0 top-0 block h-8 w-8"
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
              >
                <Station no={s.no} active={active(i)} reduce={reduce} className="h-8 w-8 text-[11px]" />
              </span>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.06 }}
              >
                <h3 className="pt-0.5 font-display text-[1.35rem] font-light leading-tight text-onyx">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-cognac">{s.body}</p>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>

      <motion.p
        className="mt-10 pl-12 font-display text-sm font-light italic text-cognac"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        the final reveal
      </motion.p>
    </div>
  );
}

export default function ProcessTimeline() {
  const reduce = useReducedMotion() ?? false;
  return (
    <>
      <Serpentine reduce={reduce} />
      <Rail reduce={reduce} />
    </>
  );
}
