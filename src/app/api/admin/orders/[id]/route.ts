import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import prisma from '@/lib/db';
import { notifyOrderStatusUpdate } from '@/lib/notifications';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromToken();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.status === 'paid' && !order.paidAt ? { paidAt: new Date() } : {}),
      },
      include: { items: true },
    });

    // Notify customer of status change (fire-and-forget)
    if (['processing', 'ready', 'shipped', 'delivered'].includes(body.status)) {
      notifyOrderStatusUpdate(
        {
          orderNumber: updatedOrder.orderNumber,
          customerEmail: updatedOrder.customerEmail,
          total: updatedOrder.total,
          items: updatedOrder.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
          })),
        },
        body.status
      ).catch((err) => console.error('[Notifications] Status update notification failed:', err));
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
