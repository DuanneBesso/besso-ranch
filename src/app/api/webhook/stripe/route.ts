import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';
import prisma from '@/lib/db';
import Stripe from 'stripe';
import { notifyNewOrder, notifyLowStock } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutExpired(session);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error('Payment failed:', paymentIntent.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error('No orderId in session metadata');
    return;
  }

  try {
    // Get the order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.error('Order not found:', orderId);
      return;
    }

    // Update order status to paid
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'paid',
        paidAt: new Date(),
        stripePaymentId: session.payment_intent as string,
      },
    });

    // Deduct stock or increment preorder count for each item
    for (const item of order.items) {
      if (item.isPreorder) {
        // Pre-order: increment preorderCount, don't touch stock
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (product) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              preorderCount: {
                increment: item.quantity,
              },
            },
          });

          // Log pre-order
          await prisma.inventoryLog.create({
            data: {
              productId: item.productId,
              changeType: 'preorder',
              quantity: item.quantity,
              previousQty: product.preorderCount,
              newQty: product.preorderCount + item.quantity,
              source: 'order',
              notes: `Pre-order from ${order.orderNumber}`,
            },
          });
        }
      } else {
        // Normal order: deduct stock
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        // Check if stock is now low or out
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (product) {
          // Update inStock status if out of stock
          if (product.stockQuantity <= 0) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { inStock: false },
            });
          }

          // Log inventory change
          await prisma.inventoryLog.create({
            data: {
              productId: item.productId,
              changeType: 'order_deduct',
              quantity: -item.quantity,
              previousQty: product.stockQuantity + item.quantity,
              newQty: product.stockQuantity,
              source: 'order',
              notes: `Order ${order.orderNumber}`,
            },
          });

          // Notify admin if stock is low or out
          if (product.stockQuantity <= 0 || product.stockQuantity <= product.lowStockThreshold) {
            notifyLowStock(product).catch((err) =>
              console.error('[Notifications] Low stock notification failed:', err)
            );
          }
        }
      }
    }

    // Notify admin of new order (fire-and-forget)
    notifyNewOrder({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryMethod: order.deliveryMethod,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryState: order.deliveryState,
      deliveryZip: order.deliveryZip,
      deliveryNotes: order.deliveryNotes,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      total: order.total,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        productPrice: item.productPrice,
        total: item.total,
      })),
    }).catch((err) => console.error('[Notifications] New order notification failed:', err));

    // Order successfully marked as paid
  } catch (error) {
    console.error('Error handling checkout complete:', error);
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;

  if (!orderId) return;

  try {
    // Update order status to cancelled
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });

    // Order cancelled due to expired checkout
  } catch (error) {
    console.error('Error handling checkout expired:', error);
  }
}
