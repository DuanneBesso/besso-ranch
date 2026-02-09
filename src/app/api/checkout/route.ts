import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryZip?: string;
  deliveryNotes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    // Validate items
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Fetch products from database
    const productIds = body.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Validate all products exist and are in stock
    const productMap = new Map(products.map((p) => [p.id, p]));
    const lineItems: {
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
        };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    let subtotal = 0;

    for (const item of body.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (!product.inStock || product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} is out of stock or has insufficient quantity` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: `${product.unit}${product.description ? ' - ' + product.description.substring(0, 100) : ''}`,
          },
          unit_amount: Math.round(product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });
    }

    // Calculate delivery fee
    let deliveryFee = 0;
    if (body.deliveryMethod === 'delivery') {
      const deliveryFeeSetting = await prisma.setting.findUnique({
        where: { key: 'delivery_fee' },
      });
      deliveryFee = deliveryFeeSetting ? parseFloat(deliveryFeeSetting.value) : 5;

      // Add delivery as a line item
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Delivery Fee',
            description: 'Local delivery',
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `BR-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`;

    // Create pending order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: body.customerEmail,
        customerName: body.customerName,
        customerPhone: body.customerPhone || null,
        deliveryMethod: body.deliveryMethod,
        deliveryAddress: body.deliveryAddress || null,
        deliveryCity: body.deliveryCity || null,
        deliveryState: body.deliveryState || null,
        deliveryZip: body.deliveryZip || null,
        deliveryNotes: body.deliveryNotes || null,
        subtotal,
        deliveryFee,
        tax: 0, // No tax for now
        total: subtotal + deliveryFee,
        status: 'pending',
        items: {
          create: body.items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: product.id,
              productName: product.name,
              productPrice: product.price,
              quantity: item.quantity,
              total: product.price * item.quantity,
            };
          }),
        },
      },
    });

    // Create or find customer
    let customer = await prisma.customer.findUnique({
      where: { email: body.customerEmail },
    });

    if (!customer) {
      const nameParts = body.customerName.split(' ');
      customer = await prisma.customer.create({
        data: {
          email: body.customerEmail,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: body.customerPhone || null,
          address: body.deliveryAddress || null,
          city: body.deliveryCity || null,
          state: body.deliveryState || null,
          zipCode: body.deliveryZip || null,
        },
      });
    }

    // Update order with customer ID
    await prisma.order.update({
      where: { id: order.id },
      data: { customerId: customer.id },
    });

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?order=${order.orderNumber}&method=${body.deliveryMethod}`,
      cancel_url: `${baseUrl}/checkout/cancel?order=${order.orderNumber}`,
      customer_email: body.customerEmail,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      shipping_address_collection:
        body.deliveryMethod === 'delivery'
          ? {
              allowed_countries: ['US'],
            }
          : undefined,
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: session.id },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
