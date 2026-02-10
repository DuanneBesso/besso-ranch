import nodemailer from 'nodemailer';
import prisma from '@/lib/db';

// ============================================
// GMAIL SMTP CONFIGURATION
// ============================================

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bessoranch.com';

function createTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

// ============================================
// INTERNAL HELPERS
// ============================================

async function getAdminEmails(): Promise<string[]> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'admin_notification_emails' },
    });
    if (setting?.value) {
      const emails = setting.value.split(',').map((e) => e.trim()).filter(Boolean);
      if (emails.length > 0) return emails;
    }
  } catch {
    // fall through to fallback
  }

  try {
    const fallback = await prisma.setting.findUnique({
      where: { key: 'contact_email' },
    });
    if (fallback?.value) return [fallback.value.trim()];
  } catch {
    // fall through
  }

  return GMAIL_USER ? [GMAIL_USER] : [];
}

async function sendEmail({
  to,
  subject,
  html,
  type,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  type: string;
  replyTo?: string;
}) {
  const transporter = createTransporter();

  if (!transporter) {
    await prisma.notificationLog.create({
      data: {
        type,
        channel: 'email',
        recipient: to,
        subject,
        message: html.substring(0, 500),
        sent: false,
        error: 'Gmail SMTP not configured (GMAIL_USER or GMAIL_APP_PASSWORD missing)',
      },
    });
    console.warn(`[Notifications] Email not sent — Gmail SMTP not configured. Type: ${type}, To: ${to}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Besso Ranch" <${GMAIL_USER}>`,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    });

    await prisma.notificationLog.create({
      data: {
        type,
        channel: 'email',
        recipient: to,
        subject,
        message: html.substring(0, 500),
        sent: true,
        sentAt: new Date(),
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    await prisma.notificationLog.create({
      data: {
        type,
        channel: 'email',
        recipient: to,
        subject,
        message: html.substring(0, 500),
        sent: false,
        error: errorMessage,
      },
    });
    console.error(`[Notifications] Failed to send email. Type: ${type}, To: ${to}, Error: ${errorMessage}`);
  }
}

// ============================================
// HTML EMAIL TEMPLATES
// ============================================

function buildBaseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#FDF5E6;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF5E6;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#5C4033;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#FDF5E6;font-size:24px;font-weight:bold;font-family:Georgia,'Times New Roman',serif;">Besso Ranch</h1>
              <p style="margin:4px 0 0;color:#FDF5E6;font-size:13px;opacity:0.85;">Yucca Valley, California</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f3e8;padding:20px 32px;text-align:center;border-top:1px solid #e8ddd0;">
              <p style="margin:0;font-size:13px;color:#8B7355;">
                Besso Ranch &middot; Yucca Valley, CA
              </p>
              <p style="margin:6px 0 0;font-size:12px;">
                <a href="${SITE_URL}" style="color:#2D5016;text-decoration:none;">bessoranch.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface OrderForNotification {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  deliveryMethod: string;
  deliveryAddress?: string | null;
  deliveryCity?: string | null;
  deliveryState?: string | null;
  deliveryZip?: string | null;
  deliveryNotes?: string | null;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  items: {
    productName: string;
    quantity: number;
    productPrice: number;
    total: number;
  }[];
}

function buildNewOrderTemplate(order: OrderForNotification): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#333;">${item.productName}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#333;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ebe3;font-size:14px;color:#333;text-align:right;">$${item.total.toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const deliveryInfo =
    order.deliveryMethod === 'delivery'
      ? `<p style="margin:0;font-size:14px;color:#333;"><strong>Delivery to:</strong> ${order.deliveryAddress || ''}, ${order.deliveryCity || ''}, ${order.deliveryState || ''} ${order.deliveryZip || ''}</p>`
      : `<p style="margin:0;font-size:14px;color:#333;"><strong>Pickup</strong> at the ranch</p>`;

  const content = `
    <!-- Banner -->
    <div style="background-color:#2D5016;border-radius:6px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <h2 style="margin:0;color:#ffffff;font-size:20px;">New Order Received!</h2>
    </div>

    <!-- Order Info -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#666;">Order Number</td>
        <td style="padding:4px 0;font-size:14px;color:#333;font-weight:bold;text-align:right;">${order.orderNumber}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#666;">Total</td>
        <td style="padding:4px 0;font-size:14px;color:#2D5016;font-weight:bold;text-align:right;">$${order.total.toFixed(2)}</td>
      </tr>
    </table>

    <!-- Customer -->
    <h3 style="margin:0 0 8px;font-size:15px;color:#5C4033;">Customer</h3>
    <p style="margin:0 0 4px;font-size:14px;color:#333;">${order.customerName}</p>
    <p style="margin:0 0 4px;font-size:14px;color:#333;">${order.customerEmail}</p>
    ${order.customerPhone ? `<p style="margin:0 0 4px;font-size:14px;color:#333;">${order.customerPhone}</p>` : ''}

    <!-- Delivery -->
    <h3 style="margin:16px 0 8px;font-size:15px;color:#5C4033;">Fulfillment</h3>
    ${deliveryInfo}
    ${order.deliveryNotes ? `<p style="margin:4px 0 0;font-size:13px;color:#666;"><em>Note: ${order.deliveryNotes}</em></p>` : ''}

    <!-- Items -->
    <h3 style="margin:20px 0 8px;font-size:15px;color:#5C4033;">Items</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 0;border-bottom:2px solid #5C4033;font-size:12px;color:#666;text-transform:uppercase;">Item</td>
        <td style="padding:8px 0;border-bottom:2px solid #5C4033;font-size:12px;color:#666;text-transform:uppercase;text-align:center;">Qty</td>
        <td style="padding:8px 0;border-bottom:2px solid #5C4033;font-size:12px;color:#666;text-transform:uppercase;text-align:right;">Total</td>
      </tr>
      ${itemRows}
    </table>

    <!-- Totals -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#666;">Subtotal</td>
        <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">$${order.subtotal.toFixed(2)}</td>
      </tr>
      ${order.deliveryFee > 0 ? `
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#666;">Delivery Fee</td>
        <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">$${order.deliveryFee.toFixed(2)}</td>
      </tr>` : ''}
      ${order.tax > 0 ? `
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#666;">Tax</td>
        <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">$${order.tax.toFixed(2)}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:8px 0;font-size:16px;color:#5C4033;font-weight:bold;border-top:2px solid #5C4033;">Total</td>
        <td style="padding:8px 0;font-size:16px;color:#2D5016;font-weight:bold;text-align:right;border-top:2px solid #5C4033;">$${order.total.toFixed(2)}</td>
      </tr>
    </table>

    <!-- CTA -->
    <div style="text-align:center;margin-top:24px;">
      <a href="${SITE_URL}/admin/orders" style="display:inline-block;background-color:#2D5016;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">View in Admin Dashboard</a>
    </div>`;

  return buildBaseTemplate(content);
}

const STATUS_MESSAGES: Record<string, { headline: string; message: string }> = {
  processing: {
    headline: 'Your order is being prepared!',
    message: "We're working on getting your order ready. We'll let you know as soon as it's ready for pickup or on its way.",
  },
  ready: {
    headline: 'Your order is ready for pickup!',
    message: "Great news! Your order is packed and ready for you at the ranch. We can't wait to see you!",
  },
  shipped: {
    headline: 'Your order is on its way!',
    message: 'Your order has been shipped and is heading your way. You should receive it soon.',
  },
  delivered: {
    headline: 'Your order has been delivered!',
    message: 'Your order has been delivered. We hope you enjoy your farm-fresh products from Besso Ranch!',
  },
};

function buildStatusUpdateTemplate(
  order: { orderNumber: string; total: number; items: { productName: string; quantity: number }[] },
  newStatus: string
): string {
  const statusInfo = STATUS_MESSAGES[newStatus];
  if (!statusInfo) return '';

  const itemsList = order.items
    .map((item) => `<li style="padding:4px 0;font-size:14px;color:#333;">${item.productName} x ${item.quantity}</li>`)
    .join('');

  const content = `
    <!-- Banner -->
    <div style="background-color:#2D5016;border-radius:6px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <h2 style="margin:0;color:#ffffff;font-size:20px;">${statusInfo.headline}</h2>
    </div>

    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">${statusInfo.message}</p>

    <!-- Order Summary -->
    <div style="background-color:#f9f3e8;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:14px;color:#666;">Order <strong style="color:#333;">${order.orderNumber}</strong></p>
      <ul style="margin:0;padding:0 0 0 20px;">
        ${itemsList}
      </ul>
      <p style="margin:12px 0 0;font-size:15px;color:#5C4033;font-weight:bold;">Total: $${order.total.toFixed(2)}</p>
    </div>

    <p style="font-size:14px;color:#666;margin:0;">
      Questions about your order? <a href="${SITE_URL}/contact" style="color:#2D5016;text-decoration:none;font-weight:bold;">Contact us</a>
    </p>`;

  return buildBaseTemplate(content);
}

interface ProductForNotification {
  name: string;
  category: string;
  stockQuantity: number;
  lowStockThreshold: number;
}

function buildLowStockTemplate(product: ProductForNotification): string {
  const isOutOfStock = product.stockQuantity <= 0;
  const bannerColor = isOutOfStock ? '#8B2500' : '#B8860B';
  const bannerText = isOutOfStock ? 'Out of Stock!' : 'Low Stock Warning';
  const description = isOutOfStock
    ? 'This product has been automatically marked as out of stock on the website.'
    : 'Consider restocking this product soon to avoid missed sales.';

  const content = `
    <!-- Banner -->
    <div style="background-color:${bannerColor};border-radius:6px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <h2 style="margin:0;color:#ffffff;font-size:20px;">${bannerText}</h2>
    </div>

    <!-- Product Info -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Product</td>
        <td style="padding:6px 0;font-size:14px;color:#333;font-weight:bold;text-align:right;">${product.name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Category</td>
        <td style="padding:6px 0;font-size:14px;color:#333;text-align:right;">${product.category}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Current Stock</td>
        <td style="padding:6px 0;font-size:14px;color:${isOutOfStock ? '#8B2500' : '#B8860B'};font-weight:bold;text-align:right;">${product.stockQuantity}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Low Stock Threshold</td>
        <td style="padding:6px 0;font-size:14px;color:#333;text-align:right;">${product.lowStockThreshold}</td>
      </tr>
    </table>

    <p style="font-size:14px;color:#333;line-height:1.6;margin:0 0 24px;">${description}</p>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${SITE_URL}/admin/products" style="display:inline-block;background-color:#2D5016;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Manage Inventory</a>
    </div>`;

  return buildBaseTemplate(content);
}

// ============================================
// PUBLIC API
// ============================================

export async function notifyNewOrder(order: OrderForNotification): Promise<void> {
  const adminEmails = await getAdminEmails();
  const subject = `New Order ${order.orderNumber} — $${order.total.toFixed(2)}`;
  const html = buildNewOrderTemplate(order);

  for (const email of adminEmails) {
    await sendEmail({ to: email, subject, html, type: 'order_new' });
  }
}

export async function notifyOrderStatusUpdate(
  order: {
    orderNumber: string;
    customerEmail: string;
    total: number;
    items: { productName: string; quantity: number }[];
  },
  newStatus: string
): Promise<void> {
  if (!STATUS_MESSAGES[newStatus]) return;

  const subject = `Besso Ranch Order ${order.orderNumber} — ${STATUS_MESSAGES[newStatus].headline}`;
  const html = buildStatusUpdateTemplate(order, newStatus);
  if (!html) return;

  await sendEmail({
    to: order.customerEmail,
    subject,
    html,
    type: `order_${newStatus}`,
  });
}

export async function notifyLowStock(product: ProductForNotification): Promise<void> {
  const isOutOfStock = product.stockQuantity <= 0;
  const adminEmails = await getAdminEmails();
  const subject = isOutOfStock
    ? `Out of Stock: ${product.name}`
    : `Low Stock Warning: ${product.name} (${product.stockQuantity} remaining)`;
  const html = buildLowStockTemplate(product);
  const type = isOutOfStock ? 'out_of_stock' : 'low_stock';

  for (const email of adminEmails) {
    await sendEmail({ to: email, subject, html, type });
  }
}

// ============================================
// CONTACT FORM NOTIFICATION
// ============================================

const SUBJECT_LABELS: Record<string, string> = {
  order: 'Order Inquiry',
  products: 'Product Question',
  wholesale: 'Wholesale Inquiry',
  visit: 'Farm Visit / Tour',
  other: 'Other',
};

function buildContactFormTemplate(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const subjectLabel = SUBJECT_LABELS[data.subject] || 'General';

  const content = `
    <!-- Banner -->
    <div style="background-color:#2D5016;border-radius:6px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <h2 style="margin:0;color:#ffffff;font-size:20px;">New Contact Form Message</h2>
    </div>

    <!-- Customer Info -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Name</td>
        <td style="padding:6px 0;font-size:14px;color:#333;font-weight:bold;text-align:right;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Email</td>
        <td style="padding:6px 0;font-size:14px;color:#333;text-align:right;">
          <a href="mailto:${data.email}" style="color:#2D5016;text-decoration:none;">${data.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Subject</td>
        <td style="padding:6px 0;font-size:14px;color:#333;text-align:right;">${subjectLabel}</td>
      </tr>
    </table>

    <!-- Message -->
    <h3 style="margin:0 0 8px;font-size:15px;color:#5C4033;">Message</h3>
    <div style="background-color:#f9f3e8;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
    </div>

    <!-- Reply Button -->
    <div style="text-align:center;">
      <a href="mailto:${data.email}?subject=Re: ${subjectLabel} — Besso Ranch" style="display:inline-block;background-color:#2D5016;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Reply to ${data.name}</a>
    </div>`;

  return buildBaseTemplate(content);
}

export async function notifyContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const adminEmails = await getAdminEmails();
  const subjectLabel = SUBJECT_LABELS[data.subject];
  const emailSubject = subjectLabel
    ? `Contact Form: ${subjectLabel}`
    : 'New Contact Form Message';
  const html = buildContactFormTemplate(data);

  for (const email of adminEmails) {
    await sendEmail({
      to: email,
      subject: emailSubject,
      html,
      type: 'contact_form',
      replyTo: data.email,
    });
  }
}
