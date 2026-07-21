import ServicesExperience from "@/components/sections/ServicesExperience";
import EnquiryForm from "@/components/sections/EnquiryForm";

export const metadata = { title: "Interior & Furniture Services" };

export default function ConsultingPage() {
  return (
    <>
      <ServicesExperience />

      <section className="px-6 py-28 md:px-16 md:py-40 md:pb-44">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-forest">Begin a consultation</p>
          <h2 className="mt-3 font-display text-[30px] font-light text-onyx md:text-[50px]">
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
