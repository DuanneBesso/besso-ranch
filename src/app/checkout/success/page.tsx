'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowRight, CalendarClock } from 'lucide-react';
import { Suspense } from 'react';

const DEFAULT_SCHEDULING_URL = 'https://calendar.app.google/XVpedUgECpiEAdRL7';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const deliveryMethod = searchParams.get('method');
  const { clearCart } = useCart();
  const [schedulingUrl, setSchedulingUrl] = useState(DEFAULT_SCHEDULING_URL);

  // Clear cart on successful payment (run once on mount)
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch scheduling URL from settings (allows admin to update it)
  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((settings: Record<string, string>) => {
        if (settings.pickup_scheduling_url) {
          setSchedulingUrl(settings.pickup_scheduling_url);
        }
      })
      .catch(() => {});
  }, []);

  const isPickup = deliveryMethod === 'pickup';

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container-custom">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-display font-bold text-warm-brown mb-4">
              Thank You!
            </h1>

            <p className="text-lg text-gray-600 mb-2">Your order has been placed successfully.</p>

            {orderNumber && (
              <p className="text-forest-green font-semibold text-xl mb-6">
                Order #{orderNumber}
              </p>
            )}

            <div className="bg-cream rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-warm-brown mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-gray-600">
                      You&apos;ll receive an email confirmation with your order details.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Package className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Order Preparation</p>
                    <p className="text-sm text-gray-600">
                      We&apos;ll prepare your order and notify you when it&apos;s ready.
                    </p>
                  </div>
                </div>
                {isPickup && (
                  <div className="flex gap-3">
                    <CalendarClock className="h-5 w-5 text-forest-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Schedule Your Pickup</p>
                      <p className="text-sm text-gray-600">
                        Choose a convenient time to pick up your order at the ranch.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {isPickup && (
                <a
                  href={schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-barn-red text-white py-3 rounded-lg font-medium hover:bg-barn-red/90 transition-colors"
                >
                  <CalendarClock className="h-5 w-5" />
                  Schedule Your Pickup
                </a>
              )}
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full bg-forest-green text-white py-3 rounded-lg font-medium hover:bg-forest-green-600 transition-colors"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="block w-full text-gray-600 hover:text-forest-green py-2 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
