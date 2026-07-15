import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import EnquiryForm from "@/components/sections/EnquiryForm";

export const metadata = { title: "Interior & Furniture Services" };

export default function ConsultingPage() {
  return (
    <>
      <section className="relative h-[72vh] min-h-[460px] w-full overflow-hidden">
        <Image src="/images/services/consulting.jpg" alt="ARTYK consulting" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-onyx/45" />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-ivory/80">Interior &amp; Furniture</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,7rem)] font-light leading-none text-ivory">Services</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <Reveal>
          <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-light leading-[1.3] text-onyx">
            Considered guidance for the whole space — composition, material, and light, in quiet
            dialogue with your architecture. We compose rooms the way the gallery is composed: with
            restraint, and with time.
          </p>
        </Reveal>
      </section>

      <section className="px-6 pb-28 md:px-16 md:pb-40">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-forest">Begin a consultation</p>
          <h2 className="mt-3 font-display text-[30px] font-light text-onyx md:text-[60px]">
            Tell us about your space.
          </h2>
          <div className="mt-12">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
