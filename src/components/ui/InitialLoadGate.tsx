"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArtykPreloader } from "@/components/ui/ArtykPreloader";

const STORAGE_KEY = "artyk-initial-preloader-complete";
const IS_DEV = process.env.NODE_ENV !== "production";

// Lets content held behind the preloader (e.g. the hero video, which
// should start from its first frame exactly as the logo finishes, not
// silently mid-playback by the time it's revealed) know the moment the
// preloader has actually lifted.
const PreloaderDoneContext = createContext(true);

export function usePreloaderDone() {
  return useContext(PreloaderDoneContext);
}

type InitialLoadGateProps = {
  children: ReactNode;
};

export function InitialLoadGate({ children }: InitialLoadGateProps) {
  const [showPreloader, setShowPreloader] = useState<boolean>(() => {
    if (IS_DEV) return true;
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(STORAGE_KEY) !== "1";
  });
  const reducedMotion = useReducedMotion();

  const handleComplete = useCallback(() => {
    if (!IS_DEV) {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    }
    setShowPreloader(false);
  }, []);

  return (
    <PreloaderDoneContext.Provider value={!showPreloader}>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {showPreloader ? <ArtykPreloader onComplete={handleComplete} /> : null}
      </AnimatePresence>
    </PreloaderDoneContext.Provider>
  );
}