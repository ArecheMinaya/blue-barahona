export type NavItem = {
  label: string;
  href: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
};

export type ProductCategory =
  | "Pendants"
  | "Rings"
  | "Earrings"
  | "Bracelets";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  collection: string;
  materials: string;
  metal: string;
  metalFamily: string;
  stone: string;
  price: number;
  description: string;
  tagline: string;
  story: string;
  craftNote: string;
  shippingNote: string;
  heroImage: ImageAsset;
  gallery: ImageAsset[];
  stonePalette: string[];
  launchOrder: number;
  relatedSlugs: string[];
};

export type CartLine = {
  slug: string;
  quantity: number;
};

export type HydratedCartLine = CartLine & {
  product: Product;
  lineTotal: number;
};

export type ShippingMethod = {
  id: string;
  name: string;
  leadTime: string;
  description: string;
  price: number;
};

export type CheckoutValues = {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

export type MaterialCard = {
  title: string;
  description: string;
  icon: "waves" | "sparkles" | "diamond";
};
