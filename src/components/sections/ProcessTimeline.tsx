"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
 * ink reaches it.
 *
 * Geometry is measured from the DOM via offset chains (immune to the
 * entrance transforms of framer-motion cells) and redrawn on resize, so
 * the SVG always threads exactly through the rendered nodes. Station
 * fractions along the path are computed analytically — every station
 * sits on a straight run, so only the bend lengths need an
 * approximation (Ramanujan's half-ellipse perimeter).
 *
 * Below md the serpentine keeps its snake form, compressed to three
 * runs of two columns: 01–02 outbound, a right bend, 03–04 returning,
 * a left bend, then 05 running out to the final reveal.
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

/** Half-ellipse arc length (Ramanujan) — the length of one 180° bend. */
function halfEllipse(rx: number, ry: number) {
  return (Math.PI / 2) * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
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
  compact = false,
}: {
  step: Step;
  active: boolean;
  reduce: boolean;
  nodeRef: (el: HTMLElement | null) => void;
  delay: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={`group ${className}`}>
      {/* measured wrapper — kept free of transforms */}
      <span
        ref={nodeRef}
        className={`block ${compact ? "h-9 w-9" : "h-12 w-12"}`}
      >
        <motion.span
          className="block h-full w-full"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE, delay }}
        >
          <Station
            no={step.no}
            active={active}
            reduce={reduce}
            className={compact ? "h-9 w-9 text-[11px]" : "h-12 w-12 text-[15px]"}
          />
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
          className={`block w-0 border-l border-dotted border-cognac/50 transition-colors duration-700 group-hover:border-forest/70 ${
            compact ? "ml-[17px] mt-1.5 h-6" : "ml-6 mt-2 h-9"
          }`}
        />
        <h3
          className={`font-display font-light text-onyx transition-transform duration-700 ease-luxury group-hover:translate-x-1 ${
            compact
              ? "ml-[17px] mt-3 text-[21px] leading-[1.15]"
              : "ml-6 mt-4 text-[clamp(1.3rem,1.7vw,1.6rem)] leading-[1.12]"
          }`}
        >
          {step.title}
        </h3>
        <p
          className={`leading-relaxed text-cognac ${
            compact ? "ml-[17px] mt-2 text-[13px]" : "ml-6 mt-3 max-w-[34ch] text-sm"
          }`}
        >
          {step.body}
        </p>
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

    // station fractions: outbound run, bend, return run
    const l1 = xa - 2;
    const la = halfEllipse(rx, ry);
    const total = l1 + la + (xa - e.x);
    fractionsRef.current = [
      ...c.slice(0, 3).map((p) => (p.x - 2) / total),
      ...c.slice(3, 5).map((p) => (l1 + la + (xa - p.x)) / total),
      1,
    ];
    if (!reduce) {
      setReached((prev) => {
        const count = reachedCount(fractionsRef.current, progress.get());
        return prev === count ? prev : count;
      });
    }
    // preserve identity when nothing changed so downstream effects stay quiet
    setGeom((prev) => (prev && prev.d === d && prev.w === w && prev.h === h ? prev : { d, w, h, y1 }));
  }, [progress, reduce]);

  useLayoutEffect(() => {
    measure();
    const root = containerRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  // Under reduced motion the journey renders complete. Setting this via
  // state (not a render-time branch on `reduce`) lets React reconcile the
  // SSR markup, which is rendered without knowing the motion preference —
  // otherwise the hydration mismatch leaves stale station classes behind.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot post-hydration sync with the OS motion preference; SSR cannot know it
    if (reduce) setReached(6);
  }, [reduce]);

  // the browser's true path length feeds the travelling tip
  useLayoutEffect(() => {
    const path = inkRef.current;
    if (!geom || !path) return;
    totalRef.current = path.getTotalLength();
  }, [geom]);

  useMotionValueEvent(progress, "change", (p) => {
    if (reduce) return;
    const path = inkRef.current;
    if (path && totalRef.current > 0) {
      const pt = path.getPointAtLength(Math.min(Math.max(p, 0), 1) * totalRef.current);
      tipX.set(pt.x);
      tipY.set(pt.y);
    }
    const count = reachedCount(fractionsRef.current, p);
    setReached((prev) => (prev === count ? prev : count));
  });

  const active = (i: number) => i < reached;
  const endReached = reached >= 6;

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

/* ---------------- mobile: the compressed serpentine ---------------- */

function SerpentineMobile({ reduce }: { reduce: boolean }) {
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
    offset: ["start 0.85", "end 0.55"],
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
    const y1 = (c[0].y + c[1].y) / 2;
    const y2 = (c[2].y + c[3].y) / 2;
    const y3 = (c[4].y + e.y) / 2;
    const ry1 = Math.max((y2 - y1) / 2, 20);
    const ry2 = Math.max((y3 - y2) / 2, 20);

    // right bend: bulge to the container edge, never crowding station 02
    let rx1 = Math.min(ry1, 36);
    let xa = w - 2 - rx1;
    const minXa = c[1].x + 24;
    if (xa < minXa) {
      xa = minXa;
      rx1 = Math.max(w - 2 - xa, 12);
    }
    // left bend: mirror of the right, clearing station 04's node
    let rx2 = Math.min(ry2, 32);
    let xb = 2 + rx2;
    const maxXb = c[3].x - 24;
    if (xb > maxXb) {
      xb = Math.max(maxXb, 4);
      rx2 = Math.max(xb - 2, 12);
    }
    const d = `M 2 ${y1} L ${xa} ${y1} A ${rx1} ${ry1} 0 0 1 ${xa} ${y2} L ${xb} ${y2} A ${rx2} ${ry2} 0 0 0 ${xb} ${y3} L ${e.x} ${y3}`;

    // fractions: run 1, right bend, run 2, left bend, run 3
    const l1 = xa - 2;
    const a1 = halfEllipse(rx1, ry1);
    const l2 = xa - xb;
    const a2 = halfEllipse(rx2, ry2);
    const total = l1 + a1 + l2 + a2 + (e.x - xb);
    fractionsRef.current = [
      (c[0].x - 2) / total,
      (c[1].x - 2) / total,
      (l1 + a1 + (xa - c[2].x)) / total,
      (l1 + a1 + (xa - c[3].x)) / total,
      (l1 + a1 + l2 + a2 + (c[4].x - xb)) / total,
      1,
    ];
    if (!reduce) {
      setReached((prev) => {
        const count = reachedCount(fractionsRef.current, progress.get());
        return prev === count ? prev : count;
      });
    }
    setGeom((prev) => (prev && prev.d === d && prev.w === w && prev.h === h ? prev : { d, w, h, y1 }));
  }, [progress, reduce]);

  useLayoutEffect(() => {
    measure();
    const root = containerRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  // Under reduced motion the journey renders complete. Setting this via
  // state (not a render-time branch on `reduce`) lets React reconcile the
  // SSR markup, which is rendered without knowing the motion preference —
  // otherwise the hydration mismatch leaves stale station classes behind.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot post-hydration sync with the OS motion preference; SSR cannot know it
    if (reduce) setReached(6);
  }, [reduce]);

  // the browser's true path length feeds the travelling tip
  useLayoutEffect(() => {
    const path = inkRef.current;
    if (!geom || !path) return;
    totalRef.current = path.getTotalLength();
  }, [geom]);

  useMotionValueEvent(progress, "change", (p) => {
    if (reduce) return;
    const path = inkRef.current;
    if (path && totalRef.current > 0) {
      const pt = path.getPointAtLength(Math.min(Math.max(p, 0), 1) * totalRef.current);
      tipX.set(pt.x);
      tipY.set(pt.y);
    }
    const count = reachedCount(fractionsRef.current, p);
    setReached((prev) => (prev === count ? prev : count));
  });

  const active = (i: number) => i < reached;
  const endReached = reached >= 6;
  const row = "grid grid-cols-2 gap-x-4 pl-10 pr-6";

  return (
    <div ref={containerRef} className="relative pt-12 md:hidden">
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
              <circle r={6} fill="var(--accent)" opacity={0.14} />
              <circle r={2.5} fill="var(--accent)" />
            </motion.g>
          )}
        </svg>
      )}

      {/* departure label, just above the line's entry */}
      {geom && (
        <motion.p
          className="absolute left-0 font-display text-sm font-light italic text-cognac"
          style={{ top: geom.y1 - 38 }}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          the first meeting
        </motion.p>
      )}

      {/* run 1: 01 → 02 */}
      <div className={`relative ${row}`}>
        <StationCell
          compact
          step={STEPS[0]}
          active={active(0)}
          reduce={reduce}
          delay={0}
          nodeRef={(el) => {
            nodeRefs.current[0] = el;
          }}
        />
        <StationCell
          compact
          step={STEPS[1]}
          active={active(1)}
          reduce={reduce}
          delay={0.08}
          nodeRef={(el) => {
            nodeRefs.current[1] = el;
          }}
        />
      </div>

      <div className="h-12" aria-hidden="true" />

      {/* run 2: 03 → 04, travelling right to left. DOM stays in journey
          order for assistive tech; column placement mirrors the visual. */}
      <div className={`relative ${row}`}>
        <StationCell
          compact
          className="col-start-2 row-start-1"
          step={STEPS[2]}
          active={active(2)}
          reduce={reduce}
          delay={0}
          nodeRef={(el) => {
            nodeRefs.current[2] = el;
          }}
        />
        <StationCell
          compact
          className="col-start-1 row-start-1"
          step={STEPS[3]}
          active={active(3)}
          reduce={reduce}
          delay={0.08}
          nodeRef={(el) => {
            nodeRefs.current[3] = el;
          }}
        />
      </div>

      <div className="h-12" aria-hidden="true" />

      {/* run 3: 05 → the reveal */}
      <div className={`relative ${row}`}>
        <StationCell
          compact
          step={STEPS[4]}
          active={active(4)}
          reduce={reduce}
          delay={0}
          nodeRef={(el) => {
            nodeRefs.current[4] = el;
          }}
        />
        <div>
          <span className="flex h-9 items-center">
            <span
              ref={endRef}
              className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-stone transition-colors duration-700 ${
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
            className="mt-3 font-display text-sm font-light italic text-cognac"
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

export default function ProcessTimeline() {
  const reduce = useReducedMotion() ?? false;
  return (
    <>
      <Serpentine reduce={reduce} />
      <SerpentineMobile reduce={reduce} />
    </>
  );
}
