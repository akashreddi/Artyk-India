"use client";

import { useState } from "react";

const TYPES = ["Showroom Visit", "Services", "Sourcing", "General"];

const fieldCls =
  "w-full border-b border-cognac/30 bg-transparent py-3 text-onyx placeholder-cognac/50 outline-none transition focus:border-forest";
const labelCls = "mb-1 block font-sans text-[11px] uppercase tracking-[0.22em] text-cognac";

export default function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-forest/30 bg-forest/5 px-8 py-14 text-center">
        <p className="font-display text-3xl font-light text-onyx">Thank you.</p>
        <p className="mt-3 text-cognac">
          Your enquiry has reached us — we&apos;ll be in touch shortly to prepare your visit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="name">Name</label>
          <input id="name" name="name" required className={fieldCls} placeholder="Your name" />
        </div>
        <div>
          <label className={labelCls} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className={fieldCls} placeholder="you@example.com" />
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className={fieldCls} placeholder="+91" />
        </div>
        <div>
          <label className={labelCls} htmlFor="type">Enquiry</label>
          <select id="type" name="type" defaultValue={TYPES[0]} className={`${fieldCls} cursor-pointer`}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="message">Tell us about your space</label>
        <textarea id="message" name="message" rows={4} className={`${fieldCls} resize-none`} placeholder="A few words on what you're composing…" />
      </div>

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-onyx px-9 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition hover:bg-[#212121] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Enquiry"}
        </button>
        {status === "error" && (
          <p className="text-sm text-corten">
            Something went wrong — please email{" "}
            <a href="mailto:hello@artykindia.com" className="underline">hello@artykindia.com</a>.
          </p>
        )}
      </div>
    </form>
  );
}
