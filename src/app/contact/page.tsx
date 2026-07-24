import EnquiryForm from "@/components/sections/EnquiryForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="px-6 pt-36 pb-32 md:px-16 md:pt-44 md:pb-44">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-forest">By appointment</p>
          <h1 className="mt-4 font-display text-[32px] font-light leading-[1.1] text-onyx md:text-[50px]">
            Visit ARTYK.
          </h1>
          <p className="mt-6 max-w-sm leading-relaxed text-cognac">
            We receive a small number of guests each week. Tell us about your space, and we will
            prepare the gallery for your visit.
          </p>
          <div className="mt-10 space-y-4 text-sm text-cognac">
            <p>
              Plot No. 839/A, Road No. 44,
              <br />
              Jubilee Hills, Hyderabad 500033
            </p>
            <p>
              <a href="mailto:hello@artykindia.com" className="underline-sweep">hello@artykindia.com</a>
            </p>
            <p>
              <a href="tel:+919866022070" className="underline-sweep">+91 98660 22070</a>
            </p>
            <p>
              <a href="https://instagram.com/artykindia" target="_blank" rel="noopener noreferrer" className="underline-sweep">
                @artykindia
              </a>
            </p>
          </div>
        </div>
        <div className="md:col-span-7">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
