'use client';

import { useCart, CartItem } from '@/context/CartContext';
import { ShoppingCart, Check, Clock } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    stockQuantity: number;
    inStock: boolean;
    images?: string | null;
    preorderEnabled?: boolean;
    preorderLimit?: number;
    preorderCount?: number;
  };
  className?: string;
  showIcon?: boolean;
}

export default function AddToCartButton({
  product,
  className = '',
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const isPreorderMode = !product.inStock && product.preorderEnabled;
  const preorderRemaining = (product.preorderLimit || 0) - (product.preorderCount || 0);
  const maxQuantity = isPreorderMode ? preorderRemaining : product.stockQuantity;

  const existingItem = items.find((item) => item.id === product.id);
  const currentQuantity = existingItem?.quantity || 0;
  const canAddMore = currentQuantity < maxQuantity;

  const handleAddToCart = () => {
    if (isPreorderMode) {
      if (preorderRemaining <= 0 || !canAddMore) return;
    } else {
      if (!product.inStock || !canAddMore) return;
    }

    // Parse images if it's a JSON string
    let imageUrl: string | undefined;
    if (product.images) {
      try {
        const images = JSON.parse(product.images);
        imageUrl = images[0];
      } catch {
        imageUrl = product.images;
      }
    }

    const cartItem: Omit<CartItem, 'quantity'> = {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: imageUrl,
      maxQuantity,
      isPreorder: isPreorderMode,
    };

    addItem(cartItem);

    // Show added feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Out of stock with preorder enabled but limit reached
  if (isPreorderMode && preorderRemaining <= 0) {
    return (
      <button
        disabled
        className={`bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed ${className}`}
      >
        Pre-Order Limit Reached
      </button>
    );
  }

  // Out of stock with preorder enabled
  if (isPreorderMode) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={!canAddMore}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          added
            ? 'bg-green-500 text-white'
            : canAddMore
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } ${className}`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added!
          </>
        ) : canAddMore ? (
          <>
            {showIcon && <Clock className="h-5 w-5" />}
            Pre-Order
          </>
        ) : (
          'Max in Cart'
        )}
      </button>
    );
  }

  // Out of stock, no preorder
  if (!product.inStock) {
    return (
      <button
        disabled
        className={`bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  // In stock - normal flow
  return (
    <button
      onClick={handleAddToCart}
      disabled={!canAddMore}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        added
          ? 'bg-green-500 text-white'
          : canAddMore
          ? 'bg-forest-green text-white hover:bg-forest-green-600'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      } ${className}`}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          Added!
        </>
      ) : canAddMore ? (
        <>
          {showIcon && <ShoppingCart className="h-5 w-5" />}
          Add to Cart
        </>
      ) : (
        'Max in Cart'
      )}
    </button>
  );
}
