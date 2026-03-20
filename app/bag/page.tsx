import type { Metadata } from "next";
import { BagView } from "@/components/bag-view";

export const metadata: Metadata = {
  title: "Your Bag",
  description:
    "Review your reserved Larimar pieces before moving to insured checkout.",
};

export default function BagPage() {
  return <BagView />;
}
