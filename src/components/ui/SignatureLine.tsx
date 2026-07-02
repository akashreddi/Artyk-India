"use client";

import { motion, useReducedMotion } from "framer-motion";

const phrases = [
  { lead: "We ", verb: "curate." },
  { lead: "We ", verb: "showcase." },
  { lead: "We ", verb: "consult." },
];

export default function SignatureLine() {
  const reduce = useReducedMotion();

  // Local (slower) timing so the signature line breathes without affecting the
  // shared staggerParent used by other sections. Under reduced motion the
  // stagger + rise are dropped, leaving a gentle fade.
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 1.0, delayChildren: reduce ? 0 : 0.3 },
    },
  };

  const popUp = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 2.2, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.p
      className="mt-6 font-display text-[clamp(1.4rem,2.9vw,2.3rem)] font-light italic leading-tight tracking-[-0.01em] text-onyx"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {phrases.map(({ lead, verb }) => (
        <motion.span key={verb} variants={popUp} className="mr-2 inline-block">
          {lead}
          <span className="text-corten">{verb}</span>
        </motion.span>
      ))}
    </motion.p>
  );
}
