import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Besso Ranch website and purchasing our products.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative py-12 bg-gradient-to-br from-warm-brown/90 via-warm-brown/75 to-forest-green/80">
          <div className="container-custom text-center">
            <h1 className="font-display text-4xl text-cream">Terms of Service</h1>
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
              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using the Besso Ranch website (bessoranch.com) and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
              </p>

              <h2>Products and Availability</h2>
              <p>
                All products listed on our website are subject to availability. We reserve the right to limit quantities, discontinue products, or modify pricing at any time without prior notice. Product descriptions and images are provided for informational purposes and may vary slightly from the actual product due to the handmade and natural nature of our goods.
              </p>
              <ul>
                <li><strong>Eggs:</strong> Natural products that may vary in size, color, and shape. This is normal and a sign of genuine farm fresh eggs.</li>
                <li><strong>Live Poultry:</strong> Sold as-is. We guarantee the health of birds at the time of pickup but cannot guarantee egg production, temperament, or gender accuracy for young birds.</li>
                <li><strong>Fertile Hatching Eggs:</strong> Fertility rates are estimates based on our flock&apos;s performance. We cannot guarantee hatch rates as incubation conditions are outside our control.</li>
                <li><strong>Goat Milk Products:</strong> Handcrafted in small batches. Slight variations in appearance, scent, and texture are normal.</li>
              </ul>

              <h2>Orders and Payment</h2>
              <p>
                All orders are processed through Stripe, a secure third-party payment processor. By placing an order, you represent that the payment information you provide is accurate and that you are authorized to use the payment method.
              </p>
              <p>
                We reserve the right to refuse or cancel any order for any reason, including suspected fraud, product unavailability, or pricing errors. If your order is cancelled, you will receive a full refund.
              </p>

              <h2>Pricing</h2>
              <p>
                All prices are listed in US dollars. Prices are subject to change without notice. Delivery fees, if applicable, will be displayed at checkout before payment.
              </p>

              <h2>Pickup and Delivery</h2>
              <p>
                <strong>Local Pickup:</strong> Available at our ranch in Yucca Valley, CA. Pickup times will be coordinated after your order is placed.
              </p>
              <p>
                <strong>Local Delivery:</strong> Available within our delivery radius (approximately 25 miles, covering Joshua Tree and Twentynine Palms). A delivery fee may apply.
              </p>
              <p>
                <strong>Live Animals:</strong> Must be picked up in person at our ranch. We do not ship live animals.
              </p>
              <p>
                Please see our <Link href="/shipping">Shipping &amp; Returns</Link> page for full details.
              </p>

              <h2>Intellectual Property</h2>
              <p>
                All content on this website — including text, images, logos, and design — is the property of Besso Ranch and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use our content without written permission.
              </p>

              <h2>User Conduct</h2>
              <p>
                You agree not to use our website for any unlawful purpose or in any way that could damage, disable, or impair the website. You agree not to attempt to gain unauthorized access to any part of the website or its systems.
              </p>

              <h2>Disclaimer of Warranties</h2>
              <p>
                Our website and products are provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of harmful components.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Besso Ranch shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount you paid for the product(s) in question.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms of Service are governed by the laws of the State of California. Any disputes arising from these terms or your use of our website shall be resolved in the courts of San Bernardino County, California.
              </p>

              <h2>Changes to These Terms</h2>
              <p>
                We may update these Terms of Service from time to time. Changes will be posted on this page with an updated date. Your continued use of the website after changes are posted constitutes acceptance of the updated terms.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:hello@bessoranch.com">hello@bessoranch.com</a></li>
                <li><strong>Phone:</strong> (818) 732-1248</li>
                <li><strong>Location:</strong> Yucca Valley, CA 92284</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
