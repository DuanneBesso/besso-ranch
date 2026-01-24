'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Suspense } from 'react';

function CancelContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container-custom">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="text-3xl font-display font-bold text-warm-brown mb-4">
              Payment Cancelled
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Your payment was cancelled. Don&apos;t worry - your cart items are still saved.
            </p>

            {orderNumber && (
              <p className="text-sm text-gray-500 mb-6">
                Reference: {orderNumber}
              </p>
            )}

            <div className="bg-amber-50 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm">
                If you experienced any issues during checkout, please contact us at{' '}
                <a href="mailto:hello@bessoranch.com" className="font-medium underline">
                  hello@bessoranch.com
                </a>
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-forest-green text-white py-3 rounded-lg font-medium hover:bg-forest-green-600 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Return to Checkout
              </Link>
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full border-2 border-forest-green text-forest-green py-3 rounded-lg font-medium hover:bg-forest-green/5 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
