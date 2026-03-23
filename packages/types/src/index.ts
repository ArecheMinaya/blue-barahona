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

export type ProductSort =
  | "Newest"
  | "Featured"
  | "Price: Low to High"
  | "Price: High to Low";

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

export type BagLine = {
  slug: string;
  quantity: number;
};

export type CartLine = BagLine;

export type HydratedBagLine = BagLine & {
  product: Product;
  lineTotal: number;
};

export type HydratedCartLine = HydratedBagLine;

export type ShippingMethod = {
  id: string;
  name: string;
  leadTime: string;
  description: string;
  price: number;
};

export type CheckoutValues = {
  fullName: string;
  phone: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type MaterialCard = {
  title: string;
  description: string;
  icon: "waves" | "sparkles" | "diamond";
};

export type PriceRangeOption = {
  id: string;
  label: string;
  min: number | null;
  max: number | null;
};

export type CollectionFilterState = {
  category: string;
  material: string;
  priceRange: string;
  sort: ProductSort;
};

export type Profile = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Address = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  postalCode: string;
  streetAddress: string;
  apartment: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressInput = Omit<
  Address,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type AddressSnapshot = Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;

export type PaymentStatus =
  | "awaiting_payment"
  | "paid"
  | "payment_failed"
  | "cancelled";

export type FulfillmentStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export type FulfillmentTimeline = Partial<Record<FulfillmentStatus, string>>;

export type OrderItem = {
  id: string;
  orderId: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot: Pick<Product, "slug" | "name" | "heroImage" | "materials" | "stone" | "metal">;
};

export type Order = {
  id: string;
  userId: string;
  status: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  fulfillmentTimeline: FulfillmentTimeline;
  subtotal: number;
  shippingAmount: number;
  total: number;
  currency: string;
  stripePaymentIntentId: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  estimatedDelivery: string | null;
  shippingAddressId: string | null;
  shippingAddressSnapshot: AddressSnapshot | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
};

export type CheckoutPayload = {
  lines: BagLine[];
  shippingMethodId: string;
  addressId?: string;
  address?: AddressInput;
  currency?: string;
};

export type CheckoutIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
  order: Order;
  shippingMethod: ShippingMethod;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
