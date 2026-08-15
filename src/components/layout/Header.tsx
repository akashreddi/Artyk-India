"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/brands", label: "Brands" },
  { href: "/consulting", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:px-8"
    >
      <div className="glass-panel relative mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 text-onyx md:px-8">
        <Link href="/" aria-label="ARTYK home" className="shrink-0">
          <Image
            src="/images/about/artyk-logo-2.png"
            alt="ARTYK"
            width={953}
            height={262}
            priority
            className="h-6 w-auto md:h-8"
          />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="underline-sweep text-[11px] font-medium uppercase tracking-[0.22em] text-[#212121] transition hover:text-[#212121]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center border border-cognac/30 text-onyx md:hidden"
        >
          {/* staggered rules, left-aligned with rounded caps: short / long / medium */}
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
            <path
              d="M.75 1.5H8.5M.75 6H17.25M.75 10.5H12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-stone px-8 py-14 text-onyx md:hidden"
        >
          <button
            onClick={() => setOpen(false)}
            className="mb-12 rounded-full border border-cognac/30 px-4 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.2em]"
          >
            Close
          </button>
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {links.map((item) => (
              <motion.div
                key={item.href}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                className="mb-5 border-b border-cognac/15 pb-3"
              >
                <Link href={item.href} className="font-display text-[30px] leading-none" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
