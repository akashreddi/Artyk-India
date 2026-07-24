import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import InviteCTA from "@/components/sections/InviteCTA";

export const metadata = { title: "Furniture" };

const gallery = [
  "/images/showroom/gallery.jpg",
  "/images/showroom/living-2.jpg",
  "/images/showroom/dining.jpg",
  "/images/showroom/kitchen.jpg",
];

export default function FurniturePage() {
  return (
    <>
      <section className="relative h-[72vh] min-h-[460px] w-full overflow-hidden">
        <Image src="/images/services/service-furniture.jpg" alt="ARTYK showroom" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-onyx/45" />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-16 md:pb-24">
          <h1 className="font-display text-[32px] font-light leading-[1.1] text-ivory md:text-[50px]">Furniture</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-36">
        <Reveal>
          <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-light leading-[1.3] text-onyx">
            Twenty-five thousand square feet in Jubilee Hills, Hyderabad — arranged like an
            exhibition and changed like one. Collectible European furniture and lighting, composed
            and re-composed so each piece keeps its silence.
          </p>
        </Reveal>
      </section>

      <section className="px-6 pb-28 md:px-16 md:pb-40">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 md:gap-6">
          {gallery.map((src, i) => (
            <Reveal key={src} delay={i * 0.05}>
              <div className="group relative aspect-[4/3] overflow-hidden">
                <Image src={src} alt="ARTYK showroom composition" fill sizes="(max-width:640px) 100vw, 50vw" className="object-cover transition duration-[1.2s] ease-out group-hover:scale-105" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <InviteCTA />
    </>
  );
}
