import EnquiryForm from "@/components/sections/EnquiryForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="px-6 pt-36 pb-32 md:px-16 md:pt-44 md:pb-44">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <h1 className="font-display text-[32px] font-light leading-[1.1] text-onyx md:text-[50px]">
            Visit ARTYK.
          </h1>
          <div className="mt-10 space-y-4 text-sm text-cognac">
            <p>
              Plot No. 839/A, Road No. 44,
              <br />
              Jubilee Hills, Hyderabad 500033
            </p>
            <p>
              <a href="mailto:contact@artyk.in" className="underline-sweep">contact@artyk.in</a>
            </p>
            <p>
              <a href="tel:+919032989555" className="underline-sweep">+91 90329 89555</a>
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
