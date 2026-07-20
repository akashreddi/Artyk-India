"use client";

import Link from "next/link";
import { brands } from "@/data/brands";

export default function CollaborationsList() {
  return (
    <div className="relative">
      <ul>
        {brands.map((b) => (
          <li key={b.slug} className="border-b border-cognac/20 first:border-t">
            {/* stacked on mobile so the longer origin tags never clip against
                the wrapping brand name; side-by-side from tablet up */}
            <Link
              href={`/brands/${b.slug}`}
              className="group flex flex-col items-start gap-2.5 py-7 md:flex-row md:items-baseline md:justify-between md:gap-6 md:py-10"
            >
              <span className="font-display text-3xl font-light leading-none tracking-[-0.01em] text-onyx transition-colors duration-300 group-hover:text-forest md:text-[60px]">
                {b.name}
              </span>
              <span className="shrink-0 font-sans text-[11px] uppercase tracking-[0.24em] text-cognac">
                {b.meta}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
