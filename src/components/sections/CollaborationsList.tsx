"use client";

import Link from "next/link";
import { brands } from "@/data/brands";

export default function CollaborationsList() {
  return (
    <div className="relative">
      <ul>
        {brands.map((b) => (
          <li key={b.slug} className="border-b border-cognac/20 first:border-t">
            <Link
              href={`/brands/${b.slug}`}
              className="group flex items-baseline justify-between gap-6 py-7 md:py-10"
            >
              <span className="font-display text-[clamp(1.9rem,6vw,4.5rem)] font-light leading-none tracking-[-0.01em] text-onyx transition-colors duration-300 group-hover:text-forest">
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
