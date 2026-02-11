import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Pickup, delivery, and return policies for Besso Ranch products.",
};

export default function ShippingReturnsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative py-12 bg-gradient-to-br from-warm-brown/90 via-warm-brown/75 to-forest-green/80">
          <div className="container-custom text-center">
            <h1 className="font-display text-4xl text-cream">Shipping &amp; Returns</h1>
            <p className="text-cream/70 mt-2 text-sm">Last updated: February 10, 2026</p>
          </div>
        </section>

        <section className="section bg-cream">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto prose prose-lg prose-warm-brown
              prose-headings:font-display prose-headings:text-warm-brown
              prose-p:text-charcoal-400 prose-p:leading-relaxed
              prose-li:text-charcoal-400
              prose-strong:text-warm-brown
              prose-a:text-barn-red
            ">
              <h2>How We Fulfill Orders</h2>
              <p>
                Besso Ranch is a small family farm in Yucca Valley, California. Because we sell fresh, perishable, and live products, we do not ship via traditional carriers. Instead, we offer <strong>local pickup</strong> and <strong>local delivery</strong> within the High Desert area.
              </p>

              <h2>Local Pickup</h2>
              <p>
                All orders can be picked up at our ranch in Yucca Valley, CA 92284. After placing your order, we&apos;ll contact you to arrange a convenient pickup time. Pickup is available most days — we&apos;ll work with your schedule.
              </p>
              <ul>
                <li>Orders are typically ready within 1–2 business days</li>
                <li>You&apos;ll receive a confirmation text or email when your order is ready</li>
                <li>Please pick up within 3 days of the scheduled date</li>
              </ul>

              <h2>Local Delivery</h2>
              <p>
                We offer delivery within approximately <strong>25 miles</strong> of our ranch, covering the greater Yucca Valley, Joshua Tree, and Twentynine Palms areas. A delivery fee may apply depending on your location and order size.
              </p>
              <ul>
                <li>Delivery days and times will be coordinated after checkout</li>
                <li>A delivery fee (if applicable) will be displayed at checkout</li>
                <li>Someone must be available to receive the order at the delivery address</li>
              </ul>

              <h2>Live Animals</h2>
              <p>
                All live poultry and animal purchases <strong>must be picked up in person</strong> at our ranch. We do not deliver or ship live animals. This ensures the safety and well-being of the animals during transfer.
              </p>
              <ul>
                <li>Please bring an appropriate carrier or box for transport</li>
                <li>We&apos;ll provide care instructions at the time of pickup</li>
                <li>Live animal sales are final (see Returns section below)</li>
              </ul>

              <h2>Fertile Hatching Eggs</h2>
              <p>
                Fertile hatching eggs are available for local pickup only. Due to the delicate nature of fertile eggs and the importance of temperature control, we do not ship them.
              </p>
              <ul>
                <li>Fertility rates are estimates and not guaranteed</li>
                <li>Hatch rates depend on incubation conditions, which are outside our control</li>
                <li>Fertile egg sales are final</li>
              </ul>

              <h2>Returns &amp; Refunds</h2>
              <p>
                We stand behind the quality of our products. If you&apos;re not satisfied with your order, please contact us within <strong>24 hours</strong> of pickup or delivery so we can make it right.
              </p>

              <h3>Eligible for Refund or Exchange</h3>
              <ul>
                <li><strong>Eggs:</strong> If eggs arrive damaged or are of unsatisfactory quality, contact us within 24 hours with photos. We&apos;ll replace them or issue a refund.</li>
                <li><strong>Goat Milk Products:</strong> If you receive a defective or incorrect product, contact us within 24 hours. We&apos;ll replace it or issue a refund.</li>
              </ul>

              <h3>Not Eligible for Refund</h3>
              <ul>
                <li><strong>Live Animals:</strong> All live animal sales are final. We guarantee the health of the animal at the time of pickup, but we cannot accept returns after the animal leaves our property.</li>
                <li><strong>Fertile Hatching Eggs:</strong> Due to the nature of fertile eggs and the many variables in incubation, we cannot guarantee hatch rates. Sales are final.</li>
                <li><strong>Change of Mind:</strong> We do not offer refunds for change of mind purchases.</li>
              </ul>

              <h2>Order Cancellations</h2>
              <p>
                If you need to cancel an order, please contact us as soon as possible. Orders that have not yet been prepared can be cancelled for a full refund. Once an order has been prepared or fulfilled, our standard return policy applies.
              </p>

              <h2>Damaged or Incorrect Orders</h2>
              <p>
                If you receive a damaged or incorrect order, please contact us immediately at <a href="mailto:hello@bessoranch.com">hello@bessoranch.com</a> or call <a href="tel:+18187321248">(818) 732-1248</a>. Please include photos of the issue so we can resolve it quickly.
              </p>

              <h2>Contact Us</h2>
              <p>
                For any questions about shipping, delivery, or returns, please reach out:
              </p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:hello@bessoranch.com">hello@bessoranch.com</a></li>
                <li><strong>Phone:</strong> (818) 732-1248</li>
                <li><strong>Location:</strong> Yucca Valley, CA 92284</li>
              </ul>

              <p className="text-sm text-charcoal-300 mt-8">
                See also our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
