import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | Besso Ranch",
  description: "Review your cart and proceed to checkout for farm fresh eggs, live poultry, and goat milk products from Besso Ranch.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
