"use client";

import { useEffect } from "react";

/**
 * On mobile, a page reload should always land on the hero (top of the page)
 * rather than restoring the previous scroll position — which could drop the
 * visitor partway down (e.g. inside the values rail).
 *
 * Scoped to reloads only (via the Navigation Timing type), so back/forward
 * scroll restoration and fresh navigations are left untouched. Renders nothing.
 */
export default function MobileHomeScrollReset() {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (nav?.type === "reload") {
      // Stop the browser from re-restoring on the next reload of this entry…
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      // …and correct the current (already-restored) position back to the top.
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
