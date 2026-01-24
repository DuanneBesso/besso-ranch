'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function CartButton() {
  const { toggleCart, itemCount } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-warm-brown hover:text-forest-green transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-barn-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
