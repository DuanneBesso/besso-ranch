import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order for farm fresh products from Besso Ranch. Secure checkout powered by Stripe.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
