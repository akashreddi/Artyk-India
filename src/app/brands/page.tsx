import BrandsTeaser from "@/components/sections/BrandsTeaser";
import CollaborationsList from "@/components/sections/CollaborationsList";
import InviteCTA from "@/components/sections/InviteCTA";

export const metadata = { title: "Brands — Partner Houses" };

export default function BrandsPage() {
  return (
    <>
      {/* intro */}
      <section className="px-6 pt-12 pb-6 md:px-16 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-forest">Partner Houses</p>
          <h1 className="mt-4 max-w-3xl font-display text-[32px] font-light leading-[1.1] tracking-[-0.01em] text-onyx md:text-[50px]">
            Brands we curate
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed text-cognac">
            The houses we curate — Italian, Spanish, Swiss and Indian — shown not as catalogues, but
            as the company ARTYK keeps.
          </p>
        </div>
      </section>

      {/* featured cards — same visual language as the homepage brands section */}
      <section className="px-6 pb-10 md:px-16 md:pb-14">
        <div className="mx-auto max-w-7xl">
          <BrandsTeaser />
        </div>
      </section>

      {/* full index of partner houses */}
      <section className="px-6 pb-28 md:px-16 md:pb-36">
        <div className="mx-auto max-w-7xl">
          <CollaborationsList />
        </div>
      </section>

      <InviteCTA />
    </>
  );
}
