import type { Metadata } from "next";
import { AccountView } from "@/components/account-view";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage orders, saved addresses, and secure account access for your Larimar collection.",
};

export default function AccountPage() {
  return <AccountView />;
}
