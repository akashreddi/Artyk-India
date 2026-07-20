"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const cursorFollowX = useSpring(cursorX, { stiffness: 500, damping: 36, mass: 0.3 });
  const cursorFollowY = useSpring(cursorY, { stiffness: 500, damping: 36, mass: 0.3 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(media.matches);
    if (media.matches) {
      document.body.classList.add("custom-cursor-enabled");
    }

    const move = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };
    const enter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setActive(Boolean(target.closest("a, button, input, textarea, select, [role='button']")));
    };

    const update = () => {
      const isEnabled = media.matches;
      setEnabled(isEnabled);
      if (isEnabled) {
        document.body.classList.add("custom-cursor-enabled");
      } else {
        document.body.classList.remove("custom-cursor-enabled");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", enter);
    media.addEventListener("change", update);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", enter);
      media.removeEventListener("change", update);
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, []);

  if (!enabled) return null;

  return (
    <motion.img
      src="/images/about/Artyk Logo 04.png"
      alt=""
      draggable={false}
      className="pointer-events-none fixed left-0 top-0 z-[9999] select-none"
      style={{
        x: cursorFollowX,
        y: cursorFollowY,
        translateX: "-50%",
        translateY: "-50%",
        /* the mark is near-black and sits in heavy transparent padding, so on
           dark photography it disappears. The ivory halo traces its strokes on
           dark grounds; the soft dark shadow gives it weight on light ones. */
        filter:
          "drop-shadow(0 0 4px rgba(244,241,233,.95)) drop-shadow(0 0 10px rgba(244,241,233,.5)) drop-shadow(0 2px 5px rgba(31,36,32,.35))",
      }}
      animate={{
        width: active ? 116 : 96,
        opacity: 1,
      }}
      transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.8 }}
    />
  );
}
