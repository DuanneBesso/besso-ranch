import { NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import { notifyNewOrder } from '@/lib/notifications';

export async function POST() {
  const admin = await getAdminFromToken();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await notifyNewOrder({
      orderNumber: 'BR-TEST-0001',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '(555) 123-4567',
      deliveryMethod: 'pickup',
      subtotal: 24.00,
      deliveryFee: 0,
      tax: 0,
      total: 24.00,
      items: [
        { productName: 'Farm Fresh Chicken Eggs (Dozen)', quantity: 2, productPrice: 8.00, total: 16.00 },
        { productName: 'Lavender Goat Milk Soap', quantity: 1, productPrice: 8.00, total: 8.00 },
      ],
    });

    return NextResponse.json({ success: true, message: 'Test notification sent. Check your email.' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
