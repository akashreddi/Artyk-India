"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { sampleImages } from "@/lib/sampleImages";

const EnquiryDrawer = dynamic(() => import("./EnquiryDrawer").then((mod) => mod.EnquiryDrawer));

export function ProductPageClient({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const [selected, setSelected] = useState(product.images[0]);
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-ivory px-6 pb-14 pt-8 md:pb-20 md:pt-14">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="relative h-[360px] overflow-hidden rounded-[1rem] md:h-[540px]">
            <AnimatePresence mode="wait">
              <motion.div key={selected?.asset?._ref} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <Image src={selected ? urlForImage(selected).width(1000).height(1200).url() : sampleImages.collectionBedroom} alt={product.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {product.images.map((image) => (
              <button key={image.asset?._ref} onClick={() => setSelected(image)} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                <Image src={urlForImage(image).width(150).height(150).url()} alt={product.title} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">{product.brand?.name}</p>
          <h1 className="mt-3 font-display text-4xl italic leading-none text-onyx md:text-[50px]">{product.title}</h1>
          <p className="mt-6 text-sm font-light text-cognac">Materials: {product.materials ?? "Available on request"}</p>
          <p className="mt-2 text-sm font-light text-cognac">Finishes: {product.finishes ?? "Available on request"}</p>
          <div className="mt-6">
            <PortableTextContent value={product.description} />
          </div>
          <button onClick={() => setOpen(true)} className="mt-8 border border-brass px-8 py-3 text-xs uppercase tracking-[0.2em] text-brass">
            Request a Quote
          </button>
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-7xl md:mt-20">
        <h2 className="mb-6 font-display text-[30px] italic md:mb-8 md:text-[50px]">Related Products</h2>
        <div className="flex gap-6 overflow-x-auto">
          {relatedProducts.map((item) => (
            <article key={item._id} className="min-w-[220px] md:min-w-72">
              <div className="relative h-56 overflow-hidden rounded-[1rem] md:h-64">
                <Image src={item.images[0] ? urlForImage(item.images[0]).width(500).height(500).url() : sampleImages.collectionDining} alt={item.title} fill sizes="(max-width: 768px) 220px, 288px" className="object-cover" />
              </div>
              <p className="mt-3 font-display text-xl italic md:text-2xl">{item.title}</p>
            </article>
          ))}
        </div>
      </div>
      <EnquiryDrawer open={open} onClose={() => setOpen(false)} productTitle={product.title} />
    </section>
  );
}
