import Link from "next/link";
import Image from "next/image";

export default function InviteCTA() {
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
      <Image src="/images/featured/entrance-2.jpg" alt="The entrance to ARTYK" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-onyx/60" />
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-ivory/75">By appointment</p>
        <h2 className="mt-6 font-display text-[clamp(2rem,5vw,4rem)] font-light leading-[1.05] text-ivory">
          An invitation, beyond the threshold.
        </h2>
        <Link
          href="/contact"
          className="mt-8 rounded-full bg-ivory px-9 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-onyx transition hover:bg-[#212121] hover:text-ivory"
        >
          Request a Visit
        </Link>
      </div>
    </section>
  );
}
