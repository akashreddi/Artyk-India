export type Brand = {
  slug: string;
  name: string;
  origin: string; // display-ready origin line, e.g. "Italy · Since 1912"
  meta: string; // short craft tag for lists, e.g. "Italy · Leather"
  tagline: string; // one-line brand tagline (large display)
  description: string; // single-line summary (used by lists + collaborations pages)
  body: string[]; // multi-paragraph editorial (brand detail pages)
  category: string[]; // categories / disciplines
  instagram: string; // handle (no @)
  image: string; // placeholder — replace with brand product shots
  seo: {
    title: string;
    description: string; // ~150–160 chars
    keywords: string[];
  };
};

// NOTE: imagery is placeholder (ARTYK showroom shots) until brand product
// photography is supplied. Body copy is condensed from the Artyk Website Content
// doc (source copy, not invented). Instagram handles + SEO copy for the newer
// brands (Meridiani, Madheke, Pintark, Paarkhi) are best-effort and should be
// client-verified.
export const brands: Brand[] = [
  {
    slug: "poltrona-frau",
    name: "Poltrona Frau",
    origin: "Italy · Since 1912",
    meta: "Italy · Luxury Furniture",
    tagline: "Timeless Italian craftsmanship in leather and design.",
    description:
      "Synonymous with leather since 1912 — Italian sofas, seating and interiors in celebrated Pelle Frau® hides.",
    body: [
      "Since 1912, Poltrona Frau has stood as a beacon of excellence in Italian furniture design. Firmly rooted in its rich Italian heritage while embracing a global perspective, the brand epitomises the pinnacle of design, elegance, and the flawless perfection synonymous with Italian craftsmanship.",
      "Each creation by Poltrona Frau is a testament to the brand's unwavering commitment to uniqueness, featuring distinctively exquisite shapes, luxurious materials, and masterful hand-crafted artistry. The allure of Poltrona Frau lies in its ability to transform every space it touches into a haven of luxury and refinement.",
    ],
    category: ["Furniture", "Leather Seating"],
    instagram: "poltronafrauofficial",
    image: "/images/showroom/living-2.jpg",
    seo: {
      title: "Poltrona Frau in Hyderabad | Luxury Italian Leather Furniture — Artyk",
      description:
        "Discover Poltrona Frau at Artyk, Hyderabad — iconic Italian leather sofas and seating crafted since 1912, curated for luxury homes and interior projects.",
      keywords: [
        "Poltrona Frau Hyderabad",
        "Poltrona Frau India",
        "Italian leather sofas Hyderabad",
        "luxury furniture Hyderabad",
        "Poltrona Frau dealer India",
      ],
    },
  },
  {
    slug: "lema",
    name: "Lema",
    origin: "Italy",
    meta: "Italy · Modular Storage & Furniture",
    tagline: "Modular living redefined with understated Italian sophistication.",
    description:
      "Italian modular living systems and bespoke wardrobes, engineered to be configured around a life.",
    body: [
      "Lema's exquisite furniture collection is born from a harmonious blend of cutting-edge technology and time-honoured traditions, creating pieces that exude sophistication and timeless elegance.",
      "Renowned for their contemporary design and unparalleled craftsmanship, Lema's creations epitomise a seamless fusion of functionality and beauty. Their designs perfectly balance elegance with modernity, catering to the refined tastes of a sophisticated global audience.",
    ],
    category: ["Furniture", "Modular Systems", "Wardrobes"],
    instagram: "lemamobili",
    image: "/images/showroom/gallery.jpg",
    seo: {
      title: "Lema in Hyderabad | Luxury Italian Modular Furniture — Artyk",
      description:
        "Explore Lema at Artyk, Hyderabad — Italian modular living systems, bespoke wardrobes and contemporary furniture engineered for refined, considered homes.",
      keywords: [
        "Lema Hyderabad",
        "Lema India",
        "modular wardrobes Hyderabad",
        "Italian furniture Hyderabad",
        "Lema Mobili India",
      ],
    },
  },
  {
    slug: "meridiani",
    name: "Meridiani",
    origin: "Italy",
    meta: "Italy · Contemporary Furniture",
    tagline: "A refined expression of modern Italian living.",
    description:
      "Modern Italian furniture with clean architectural lines and quiet, enduring luxury.",
    body: [
      "Meridiani is a leading Italian furniture house known for its timeless aesthetic, exceptional craftsmanship and refined approach to contemporary living. Combining clean architectural lines with luxurious comfort, the brand creates complete interior environments that feel elegant, personal and enduring.",
      "Designed and manufactured in Italy, every Meridiani collection reflects a philosophy of understated luxury, where meticulous detail, material richness and effortless sophistication define the experience of home.",
    ],
    category: ["Furniture", "Living", "Outdoor"],
    instagram: "meridiani_official",
    image: "/images/hero/hero-living.jpg",
    seo: {
      title: "Meridiani in Hyderabad | Modern Italian Furniture — Artyk",
      description:
        "Discover Meridiani at Artyk, Hyderabad — modern Italian furniture with clean architectural lines and understated luxury for elegant, enduring interiors.",
      keywords: [
        "Meridiani Hyderabad",
        "Meridiani India",
        "Italian furniture Hyderabad",
        "luxury living furniture Hyderabad",
        "Meridiani dealer India",
      ],
    },
  },
  {
    slug: "de-sede",
    name: "de Sede",
    origin: "Switzerland",
    meta: "Swiss · Premium Leather Furniture",
    tagline: "Swiss craftsmanship. Iconic leather. Extraordinary comfort.",
    description:
      "Swiss leather craftsmanship at its most exacting — seating cut, folded and stitched by hand.",
    body: [
      "For over five decades, de Sede has been synonymous with exceptional leather craftsmanship and uncompromising Swiss quality. Founded on the principles of precision, innovation, and artisanal expertise, the brand has earned an international reputation for creating furniture that is as enduring as it is distinctive.",
      "Renowned for its iconic designs and technical innovation, de Sede's collections reflect a commitment to authentic materials, exceptional comfort, and timeless design. From sculptural seating to statement-making living spaces, de Sede represents the pinnacle of luxury furniture, creating pieces designed to be cherished for generations.",
    ],
    category: ["Leather Furniture", "Seating"],
    instagram: "desede",
    image: "/images/showroom/dining.jpg",
    seo: {
      title: "de Sede in Hyderabad | Swiss Leather Furniture — Artyk",
      description:
        "Experience de Sede at Artyk, Hyderabad — handcrafted Swiss leather sofas and sculptural seating built for extraordinary comfort and generations of use.",
      keywords: [
        "de Sede Hyderabad",
        "de Sede India",
        "Swiss leather sofa Hyderabad",
        "luxury leather furniture Hyderabad",
        "de Sede dealer India",
      ],
    },
  },
  {
    slug: "scic",
    name: "SCIC",
    origin: "Italy",
    meta: "Italy · Luxury Kitchens",
    tagline: "Bespoke Italian kitchens blending innovation with classic elegance.",
    description:
      "Italian kitchens conceived as architecture — precision cabinetry and considered surfaces.",
    body: [
      "SCIC stands as a paragon of premium kitchen manufacturing, celebrated for its technological innovation and impeccable workmanship. Renowned for their expertise in designing kitchens that marry modernity with functionality, SCIC meticulously tailors each creation to the unique needs of its clients, crafting every piece with the utmost attention to materials and techniques.",
      "SCIC's unwavering focus on design, quality, and technology has established it as a leader in the industry. Their philosophy embraces the kitchen as a sanctuary where design and practicality converge harmoniously.",
    ],
    category: ["Kitchens"],
    instagram: "scic.italia",
    image: "/images/showroom/kitchen.jpg",
    seo: {
      title: "SCIC Kitchens in Hyderabad | Bespoke Italian Kitchens — Artyk",
      description:
        "Discover SCIC at Artyk, Hyderabad — bespoke Italian kitchens blending technological innovation with classic elegance, tailored to each luxury home.",
      keywords: [
        "SCIC Hyderabad",
        "SCIC kitchens India",
        "Italian kitchens Hyderabad",
        "bespoke luxury kitchens Hyderabad",
        "SCIC dealer India",
      ],
    },
  },
  {
    slug: "madheke",
    name: "Madheke by Loco Design",
    origin: "India",
    meta: "India · Bespoke Furniture",
    tagline: "Where heritage meets contemporary luxury.",
    description:
      "Indian handcrafted furniture, lighting and accessories where heritage meets contemporary design.",
    body: [
      "Madheke by Loco Design creates refined furniture, lighting, and accessories that blend heritage craftsmanship with contemporary design. Rooted in timeless elegance and exceptional materiality, its collections celebrate detail, authenticity, and the enduring beauty of handcrafted luxury.",
      "Designed and crafted in India, Madheke embodies an elegant aesthetic where heritage meets innovation, creating enduring objects that bring character, warmth, and sophistication to modern interiors. The brand's distinctive design language is rooted in detail, proportion, and authenticity, resulting in collections that are as timeless as they are expressive.",
    ],
    category: ["Furniture", "Lighting", "Accessories"],
    instagram: "locodesignindia",
    image: "/images/services/service-furniture.jpg",
    seo: {
      title: "Madheke by Loco Design in Hyderabad | Handcrafted Furniture & Lighting — Artyk",
      description:
        "Explore Madheke by Loco Design at Artyk, Hyderabad — Indian handcrafted furniture, lighting and accessories where heritage meets contemporary luxury.",
      keywords: [
        "Madheke Hyderabad",
        "Madheke Loco Design India",
        "handcrafted furniture Hyderabad",
        "designer lighting Hyderabad",
        "Loco Design India",
      ],
    },
  },
  {
    slug: "pintark",
    name: "Pintark by Loco Design",
    origin: "India",
    meta: "India · Crafted Surfaces",
    tagline: "Architectural surfaces and crafted material solutions.",
    description:
      "Crafted architectural surfaces that turn walls, cabinetry and partitions into works of art.",
    body: [
      "Pintark is Loco Design's exploration of crafted surfaces, material innovation, and architectural expression. Blending traditional craftsmanship with advanced manufacturing techniques, the brand creates distinctive surface solutions that transform walls, cabinetry, wardrobes, partitions, and interior spaces into works of art.",
      "Through an extensive palette of textures, patterns, finishes, and bespoke compositions, Pintark offers designers and architects the freedom to create surfaces that are both visually striking and uniquely personal.",
    ],
    category: ["Surfaces", "Materials"],
    instagram: "locodesignindia",
    image: "/images/collections/partners.jpg",
    seo: {
      title: "Pintark by Loco Design in Hyderabad | Architectural Surfaces — Artyk",
      description:
        "Discover Pintark by Loco Design at Artyk, Hyderabad — crafted architectural surfaces and material solutions for walls, cabinetry, wardrobes and interiors.",
      keywords: [
        "Pintark Hyderabad",
        "Pintark Loco Design India",
        "architectural surfaces Hyderabad",
        "decorative surfaces India",
        "material solutions Hyderabad",
      ],
    },
  },
  {
    slug: "gandia-blasco",
    name: "Gandia Blasco",
    origin: "Spain · Valencia",
    meta: "Spain · Outdoor Furniture",
    tagline: "Architectural outdoor furniture inspired by Mediterranean minimalism.",
    description:
      "Spanish architectural outdoor furniture — clean geometry, honest materials, Mediterranean ease.",
    body: [
      "Founded amidst the vibrant spirit of Valencia, Spain, Gandia Blasco stands as an icon of modern luxury in outdoor furniture design. The essence of Gandia Blasco's creations lies in their purity of design, characterised by sleek architectural lines that embody a distinct personality.",
      "Each piece from Gandia Blasco harmonises form and function with effortless elegance, transforming outdoor spaces into veritable oases of style and comfort. Every collection resonates with a timeless allure, offering discerning clientele a blend of sophistication and practicality that transcends mere furniture to embody an elevated lifestyle.",
    ],
    category: ["Outdoor Furniture"],
    instagram: "gandiablasco_official",
    image: "/images/featured/entrance.jpg",
    seo: {
      title: "Gandia Blasco in Hyderabad | Luxury Outdoor Furniture — Artyk",
      description:
        "Explore Gandia Blasco at Artyk, Hyderabad — architectural outdoor furniture from Valencia, Spain, with Mediterranean minimalism for elevated open-air living.",
      keywords: [
        "Gandia Blasco Hyderabad",
        "Gandia Blasco India",
        "outdoor furniture Hyderabad",
        "luxury patio furniture Hyderabad",
        "Gandia Blasco dealer India",
      ],
    },
  },
  {
    slug: "neytt",
    name: "Neytt",
    origin: "India · Kerala",
    meta: "India · Handwoven Carpets",
    tagline: "Handwoven carpets, elevating spaces with texture, warmth, and artistry.",
    description:
      "Handwoven luxury rugs and flooring from Kerala, woven to order in natural fibres.",
    body: [
      "Neytt, a high-end floor coverings brand from Kerala, India, epitomises the fusion of traditional craftsmanship with contemporary design. Rooted in the rich cultural heritage of Kerala, Neytt brings to life carpets and rugs that are not only visually stunning but also intricately crafted.",
      "Each piece reflects the brand's commitment to preserving artisanal techniques while embracing modern aesthetics, resulting in products that lend warmth and sophistication to spaces.",
    ],
    category: ["Rugs", "Carpets", "Flooring"],
    instagram: "neytt.extraweave",
    image: "/images/services/service-sourcing.jpg",
    seo: {
      title: "Neytt in Hyderabad | Handwoven Luxury Rugs & Carpets — Artyk",
      description:
        "Discover Neytt at Artyk, Hyderabad — handwoven luxury rugs and carpets from Kerala, blending traditional artistry with contemporary design for refined spaces.",
      keywords: [
        "Neytt Hyderabad",
        "Neytt India",
        "handwoven rugs Hyderabad",
        "luxury carpets Hyderabad",
        "Neytt Extraweave India",
      ],
    },
  },
  {
    slug: "paarkhi",
    name: "Paarkhi Stoneware",
    origin: "India",
    meta: "India · Stoneware & Objects",
    tagline: "The art of stone, crafted for contemporary living.",
    description:
      "Natural stone reimagined — sculptural furniture, lighting and architectural elements.",
    body: [
      "Paarkhi Stoneware is a celebration of nature's artistry, transforming stone into timeless expressions of design and craftsmanship. Renowned for its expertise in natural stone, the brand creates distinctive furniture, lighting, accessories, and architectural elements that showcase the inherent beauty, texture, and character of each material.",
      "By combining traditional craftsmanship with modern techniques, Paarkhi reimagines stone beyond its conventional applications, creating sculptural pieces that are both functional and artistic. Every creation reflects a thoughtful balance of material integrity, contemporary design, and meticulous execution.",
    ],
    category: ["Stone", "Furniture", "Lighting", "Accessories"],
    instagram: "paarkhistoneware",
    image: "/images/featured/entrance-2.jpg",
    seo: {
      title: "Paarkhi Stoneware in Hyderabad | Natural Stone Design — Artyk",
      description:
        "Explore Paarkhi Stoneware at Artyk, Hyderabad — natural stone furniture, lighting and architectural elements crafted into timeless, sculptural design pieces.",
      keywords: [
        "Paarkhi Hyderabad",
        "Paarkhi Stoneware India",
        "natural stone furniture Hyderabad",
        "stone design India",
        "luxury stoneware Hyderabad",
      ],
    },
  },
];

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
