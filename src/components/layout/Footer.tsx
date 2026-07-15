import Link from "next/link";
import Image from "next/image";
import { brands } from "@/data/brands";

export function Footer() {
  return (
    <footer className="border-t border-cognac/20 bg-oat text-onyx">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Image
            src="/images/about/artyk-logo-cropped.png"
            alt="ARTYK — Curated Living"
            width={599}
            height={193}
            className="h-16 w-auto md:h-20"
          />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cognac">
            A private gallery of collectible European furniture and lighting in Jubilee Hills —
            where sourcing, consulting, and craftsmanship meet. By appointment.
          </p>
        </div>

        <div className="text-sm md:col-span-2">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.24em] text-forest">Explore</p>
          <ul className="space-y-2.5">
            <li><Link href="/about" className="underline-sweep">About</Link></li>
            <li><Link href="/brands" className="underline-sweep">Brands</Link></li>
            <li><Link href="/consulting" className="underline-sweep">Services</Link></li>
            <li><Link href="/contact" className="underline-sweep">Contact</Link></li>
          </ul>
        </div>

        <div className="text-sm md:col-span-2">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.24em] text-forest">Partner Houses</p>
          <ul className="space-y-2.5 text-cognac">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link href={`/brands/${b.slug}`} className="underline-sweep">{b.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm md:col-span-3">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.24em] text-forest">Visit</p>
          <p className="leading-relaxed text-cognac">
            Plot No. 839/A, Road No. 44,<br />
            Jubilee Hills, Hyderabad 500033
          </p>
          <p className="mt-3"><a href="mailto:hello@artykindia.com" className="underline-sweep">hello@artykindia.com</a></p>
          <p className="mt-1"><a href="tel:+919866022070" className="underline-sweep">+91 98660 22070</a></p>
        </div>
      </div>

      <div className="border-t border-cognac/15 px-6 pt-5 pb-28 text-[11px] tracking-[0.12em] text-cognac md:pb-24">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 uppercase">
          <p>© Artyk India {new Date().getFullYear()}</p>
          <p className="flex gap-5">
            <a href="https://instagram.com/artykindia" target="_blank" rel="noopener noreferrer" className="transition hover:text-forest">@artykindia</a>
            <a href="#" className="transition hover:text-forest">LinkedIn</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
