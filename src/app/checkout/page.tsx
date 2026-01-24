'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { ShoppingBag, Truck, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: 'CA',
    deliveryZip: '',
    deliveryNotes: '',
  });

  const deliveryFee = formData.deliveryMethod === 'delivery' ? 5 : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-display font-bold text-warm-brown mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-forest-green text-white px-6 py-3 rounded-lg font-medium hover:bg-forest-green-600 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="container-custom">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-forest-green mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-display font-bold text-warm-brown mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-warm-brown mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-warm-brown mb-4">
                Delivery Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.deliveryMethod === 'pickup'
                      ? 'border-forest-green bg-forest-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={formData.deliveryMethod === 'pickup'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <MapPin className="h-6 w-6 text-forest-green" />
                  <div>
                    <p className="font-medium">Pickup</p>
                    <p className="text-sm text-gray-500">Free</p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.deliveryMethod === 'delivery'
                      ? 'border-forest-green bg-forest-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="delivery"
                    checked={formData.deliveryMethod === 'delivery'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Truck className="h-6 w-6 text-forest-green" />
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-gray-500">$5.00</p>
                  </div>
                </label>
              </div>

              {formData.deliveryMethod === 'pickup' && (
                <div className="mt-4 p-4 bg-cream rounded-lg">
                  <p className="font-medium text-warm-brown">Pickup Location</p>
                  <p className="text-gray-600">Besso Ranch, Yucca Valley, CA</p>
                  <p className="text-sm text-gray-500 mt-2">
                    We&apos;ll email you when your order is ready for pickup.
                  </p>
                </div>
              )}

              {formData.deliveryMethod === 'delivery' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="deliveryCity"
                        name="deliveryCity"
                        value={formData.deliveryCity}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                      />
                    </div>
                    <div>
                      <label htmlFor="deliveryZip" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="deliveryZip"
                        name="deliveryZip"
                        value={formData.deliveryZip}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{5}"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Notes
                    </label>
                    <textarea
                      id="deliveryNotes"
                      name="deliveryNotes"
                      value={formData.deliveryNotes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Gate code, special instructions, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green"
                    />
                  </div>
                  <p className="text-sm text-amber-600">
                    * Delivery available within 25 miles of Yucca Valley
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-forest-green text-white py-4 rounded-xl font-semibold text-lg hover:bg-forest-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              You&apos;ll be redirected to Stripe for secure payment
            </p>
          </form>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-warm-brown mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-warm-brown">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.unit} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-warm-brown pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
