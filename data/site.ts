import type { ImageAsset, MaterialCard, NavItem } from "@/lib/types";

export const navItems: NavItem[] = [
  { label: "Collections", href: "/collection" },
  { label: "Story", href: "/#story" },
  { label: "Bespoke", href: "/collection#bespoke" },
];

export const footerLinks: NavItem[] = [
  { label: "Sustainability", href: "/collection" },
  { label: "Shipping", href: "/checkout" },
  { label: "Contact", href: "mailto:concierge@larimar.com" },
  { label: "Privacy", href: "/collection" },
];

export const homeHero = {
  title: ["The Ocean,", "Captured in Stone"],
  image: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcGQce28Ev8vKWAO-zO5ddOmCu_8loScq0LJrqrKBf3LGuPDOf5CDBaYc7URxMpfTpGx4L1mlPnqrLW1t-JpsVZF9tROvJh9Wrz361juuKEBuH3yjsWTv7IuRwSDq54uahOwkZIx2l6UHAU4itmQRAkt2qiGFyCUeHWUJOc1rQ4BzOpQfg9zHuOkcz_9YWafNKNhTH-hLiOdUuayZORrJPHoBkr8R19OWGz7OtTTkZJC87MND3rQPjCAAn2Au46pTvNyQdPGtyqm0",
    alt: "Cinematic macro shot of a Larimar necklace against a soft white linen background",
  } satisfies ImageAsset,
  cta: {
    label: "Discover the Collection",
    href: "/collection",
  },
};

export const homeOrigin = {
  eyebrow: "Ethereal Origins",
  title: "A gift from the Caribbean.",
  emphasis: "Rarity in every ripple.",
  description:
    "Mined from a single square kilometer in the mountains of Barahona, Larimar is the only pectolite in the world to mirror the azure depths of the sea.",
  image: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZpFXiwsEI7MKiHdW551omt21DNQ6k3EDaeDuN_IP6sJUgsekGg0Ls0Xq_yErQeNV-4a4BeTJGvOTDNNr88S-RzCRTQK4uTElXMhjS1XKTiG_5ywa_UDkW70OQCh2O1Ay0vffJnkc_kLUyck0mBjsOdiKjOG2PY2DF-H8ReguMG3Y5sfdewae_NDVOITIN9h6GrbINt-UTSaIrvNAtuOPCkn5EU4IbsElOp__pHKjrrG04Tce_c7txjoQb1x3ji4G7amKB_Lav0sA",
    alt: "Abstract macro texture of turquoise Larimar stone showing oceanic ripples",
  } satisfies ImageAsset,
};

export const craftsmanshipHighlights = [
  {
    title: "Forged in gold.",
    description:
      "Our 18k gold frames are recycled and refined to ensure that the beauty of our pieces does not come at the cost of the Earth.",
  },
  {
    title: "Set in silver.",
    description:
      "Hand-polished sterling silver provides a cool, luminous contrast to the warm depths of the volcanic stone.",
  },
  {
    title: "Defined by nature.",
    description:
      "No two stones are alike. Each piece carries a unique fingerprint of the Caribbean tide.",
  },
];

export const craftsmanshipImages: ImageAsset[] = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaBMVJDbDoh-OzD0ITbx99LoJvheXbT-5j-OJlTkSHOvdazYd9df7eVpSvnX5k_KU8zjcnDMxhz4MOtTBWYhFZCyKh2exT2hSA8tLt1a6dICFnHkAlAisIE7lpU5kHFKFn1Haxy-abR8dsAZxlw4c1ccrEBxk7MNTGB7E2yhg3uQ-Oen5MxQP-92RfeQkNEebK1iNplP1KBrNKgm1OKQKZZ0rTISIC2gKGjJia9l21yL-oxcVv71Kwyyn-nbndqKHj36CPD8Usz5k",
    alt: "Close up shot of polished 18k yellow gold texture",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCQTnhiyoXF1AdL22DCkC9n0RixFsibn10gQ6G1LjL8MB65--CVIJA-v3CLnDGD2KsFH01_CQTo5C6ZMNaPKoqG7HF3FbSI9p3twIhzgn36GR5u0egT04tAEIBIaIuHCAU_2JBgW9tyAHt76PWwKAap7pjcCuTk2zidgEhXMS0IGGQ4pWplk453TDin5SWk_FLQLOYqBCxqFleob0Tl_gEeKq7LGBLdSABj6St4Fwt-dicvMBZ148O_TLOXhqDYWoQJUWaxSoejS4",
    alt: "High quality sterling silver chain macro shot",
  },
];

export const storyQuote = {
  image: {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBM8hAw_bXoDELoNJ-QkPdlfciQfiZOUoE2neLk_p-DKpqMg2o01-fv5vwxYKoYnaTrja8v3FM-ypjYYlCNwULjX7FaO7Y93mcDZISgbKBKkA2IjR3-xI3N8AUJfB_AIsureIu3LUgTki0RChutryhe7S5KffJv5d3_xRBt33-qG1JnRtxYsui-AJ9wRzZWyQlZAqzyJBOu8jdFR6oI8vbZGoZc9cIz3_H5SD4QD_EVzYDK_zBjTYa8RzrN-tIb_c3V-2AiXtPOx_c",
    alt: "Wide shot of a Caribbean beach at dusk with soft turquoise waves",
  },
  quote:
    "Born from volcanic fire and cooled by the Caribbean sea, Larimar tells a story of transformation that spans millennia. It is the solid remnant of a tropical dream.",
};

export const homeElements: MaterialCard[] = [
  {
    title: "Larimar Stone",
    description:
      "Hand-selected from the mountain mines, every stone is graded for its volcanic blue depth and cloud-like inclusions.",
    icon: "waves",
  },
  {
    title: "18k Gold",
    description:
      "Certified recycled 18k gold, chosen for its warmth and lasting integrity against the salt-rich sea air.",
    icon: "sparkles",
  },
  {
    title: "Sterling Silver",
    description:
      "Fine .925 sterling silver, hand-beaten to create textures that mirror the shimmering surface of the lagoon.",
    icon: "diamond",
  },
];

export const homeCta = {
  title: "Begin Your Journey",
  description:
    "Connect with our concierge to explore bespoke designs or find your perfect piece from our signature collections.",
  primary: {
    label: "Explore Collections",
    href: "/collection",
  },
  secondary: {
    label: "Book Consultation",
    href: "mailto:concierge@larimar.com",
  },
};

export const collectionIntro = {
  title: "The Collection",
  description:
    "Ethically sourced Larimar stones, set in artisan-crafted precious metals. Each piece is as unique as the sea from which it draws its spirit.",
  storyEyebrow: "Origin Story",
  storyTitle: "The Gem of the Caribbean",
  storyDescription:
    "Found only in one square kilometer in the entire world, deep within the mountains of the Dominican Republic, Larimar captures the dancing reflections of sunlight on the Caribbean Sea.",
  storyLinkLabel: "Discover the Rarity",
  storyLinkHref: "/#story",
};

export const bagBenefits = [
  "Complimentary carbon-neutral shipping on all orders.",
  "Signature presentation box with authenticity certificate.",
  "Insured transit handled by premium concierge couriers.",
];
