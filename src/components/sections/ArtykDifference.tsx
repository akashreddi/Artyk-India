import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * "The Artyk Difference" — a four-part editorial rail.
 *
 * Normal document flow, no scroll-jacking / pinning: each item simply
 * fades and lifts into place (via Reveal) as it scrolls into view.
 *
 * Desktop (md+): items sit in a row. Mobile: items stack in a column.
 */

type DifferenceItem = {
  id: string;
  title: string;
  body: string;
  image: string;
};

const ITEMS: DifferenceItem[] = [
  {
    id: "01",
    title: "Curated Brands",
    body: "A carefully selected portfolio of globally renowned design brands.",
    image: "/images/showroom/gallery.jpg",
  },
  {
    id: "02",
    title: "Design Expertise",
    body: "Thoughtful guidance backed by decades of experience in luxury interiors.",
    image: "/images/services/service-consulting.jpg",
  },
  {
    id: "03",
    title: "Bespoke Solutions",
    body: "Tailored furniture, kitchens, wardrobes, and design solutions for every project.",
    image: "/images/showroom/kitchen.jpg",
  },
  {
    id: "04",
    title: "End-to-End Execution",
    body: "From concept to installation, ensuring a seamless design journey.",
    image: "/images/showroom/living-2.jpg",
  },
];

export default function ArtykDifference({ items = ITEMS }: { items?: DifferenceItem[] }) {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:gap-12">
      {items.map((item, i) => (
        <Reveal key={item.id} delay={i * 0.08} className="md:flex-1">
          <DifferenceCard item={item} />
        </Reveal>
      ))}
    </div>
  );
}

function DifferenceCard({ item }: { item: DifferenceItem }) {
  return (
    <div className="flex gap-6 md:flex-col md:gap-0">
      {/* image */}
      <div className="relative w-24 shrink-0 overflow-hidden rounded-md shadow-lg shadow-onyx/10 md:w-full">
        <div className="relative aspect-square w-full md:aspect-[4/5]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 25vw, 96px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/25 via-transparent to-transparent" />
        </div>
      </div>

      {/* connector: vertical rail on mobile, horizontal rail on desktop */}
      <div className="relative w-px shrink-0 bg-corten/25 md:mt-5 md:h-px md:w-full">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-corten md:left-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-0" />
      </div>

      {/* text */}
      <div className="min-w-0 flex-1 md:mt-5">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl italic font-light text-corten/70 md:text-3xl">
            {item.id}
          </span>
          <h3 className="font-display text-lg font-light leading-tight text-onyx md:text-xl">
            {item.title}
          </h3>
        </div>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-cognac md:mt-3">{item.body}</p>
      </div>
    </div>
  );
}
