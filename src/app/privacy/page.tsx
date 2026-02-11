import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Besso Ranch collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="relative py-12 bg-gradient-to-br from-warm-brown/90 via-warm-brown/75 to-forest-green/80">
          <div className="container-custom text-center">
            <h1 className="font-display text-4xl text-cream">Privacy Policy</h1>
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
              <h2>Overview</h2>
              <p>
                Besso Ranch (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit bessoranch.com or make a purchase from us.
              </p>

              <h2>Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li><strong>Order Information:</strong> Name, email address, phone number, delivery address, and payment details when you place an order.</li>
                <li><strong>Contact Information:</strong> Name, email, and message content when you use our contact form.</li>
                <li><strong>Account Information:</strong> Email and name if you create an account (future feature).</li>
              </ul>
              <p>We also automatically collect certain information when you visit our website, including your IP address, browser type, and pages visited. This data is used solely for website analytics and improving your experience.</p>

              <h2>How We Use Your Information</h2>
              <p>We use your personal information to:</p>
              <ul>
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders, including status updates and delivery notifications</li>
                <li>Respond to your questions and contact form submissions</li>
                <li>Send order confirmations and receipts</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>

              <h2>Payment Processing</h2>
              <p>
                All payments are processed securely through <strong>Stripe</strong>. We do not store your credit card information on our servers. Stripe&apos;s privacy policy and security practices govern the handling of your payment data. You can review Stripe&apos;s privacy policy at <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.
              </p>

              <h2>Data Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information, including encrypted connections (HTTPS), secure password hashing for admin accounts, and secure payment processing through Stripe. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>Cookies</h2>
              <p>
                Our website uses essential cookies to maintain your shopping cart and admin session. We do not use third-party tracking cookies or advertising cookies.
              </p>

              <h2>Third-Party Services</h2>
              <p>We use the following third-party services that may collect data:</p>
              <ul>
                <li><strong>Stripe</strong> — Payment processing</li>
                <li><strong>Vercel</strong> — Website hosting and analytics</li>
                <li><strong>Instagram/Facebook</strong> — Social media integration (gallery display only; we do not share your data with these platforms)</li>
              </ul>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Request access to the personal information we hold about you</li>
                <li>Request correction or deletion of your personal information</li>
                <li>Opt out of any marketing communications</li>
              </ul>
              <p>To exercise any of these rights, please contact us at <a href="mailto:hello@bessoranch.com">hello@bessoranch.com</a>.</p>

              <h2>Children&apos;s Privacy</h2>
              <p>
                Our website is not directed at children under 13. We do not knowingly collect personal information from children under 13.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of our website after changes are posted constitutes acceptance of the updated policy.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:hello@bessoranch.com">hello@bessoranch.com</a></li>
                <li><strong>Phone:</strong> (818) 732-1248</li>
                <li><strong>Location:</strong> Yucca Valley, CA 92284</li>
              </ul>

              <p className="text-sm text-charcoal-300 mt-8">
                See also our <Link href="/terms">Terms of Service</Link> and <Link href="/shipping">Shipping &amp; Returns</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
