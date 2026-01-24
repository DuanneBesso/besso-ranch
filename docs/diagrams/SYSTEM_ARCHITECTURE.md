# Besso Ranch - System Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BESSO RANCH ECOSYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    CUSTOMERS                                                                 │
│    ─────────                                                                 │
│         │                                                                    │
│         ▼                                                                    │
│   ┌───────────────────────────────────────────────────────────────┐         │
│   │                    WEBSITE (bessoranch.com)                    │         │
│   │                         Next.js 14                             │         │
│   ├───────────────────────────────────────────────────────────────┤         │
│   │  PUBLIC PAGES          │  ADMIN DASHBOARD    │  API ROUTES    │         │
│   │  ────────────          │  ───────────────    │  ──────────    │         │
│   │  • Home                │  • /admin           │  • /api/       │         │
│   │  • Products            │  • Products CRUD    │    products    │         │
│   │  • About               │  • Orders View      │  • /api/       │         │
│   │  • Blog                │  • Inventory        │    orders      │         │
│   │  • Contact             │  • Blog Posts       │  • /api/       │         │
│   │  • Cart/Checkout       │  • Settings         │    inventory   │         │
│   └───────────────────────────────────────────────────────────────┘         │
│                              │                            ▲                  │
│                              │                            │                  │
│                              ▼                            │                  │
│   ┌───────────────────────────────────────────────────────────────┐         │
│   │                     SQLite DATABASE                            │         │
│   │                   (besso-ranch.db)                             │         │
│   ├───────────────────────────────────────────────────────────────┤         │
│   │  TABLES:                                                       │         │
│   │  • products        - All products & inventory                  │         │
│   │  • orders          - Customer orders                           │         │
│   │  • order_items     - Items in each order                       │         │
│   │  • customers       - Customer information                      │         │
│   │  • animals         - Farm animals                              │         │
│   │  • blog_posts      - Farm journal entries                      │         │
│   │  • admin_users     - Admin login credentials                   │         │
│   │  • settings        - Site configuration                        │         │
│   └───────────────────────────────────────────────────────────────┘         │
│                              ▲                                               │
│                              │                                               │
│                              │  API CONNECTION (Future)                      │
│                              │                                               │
│   ┌───────────────────────────────────────────────────────────────┐         │
│   │                    LIVESTOCK APP (Future)                      │         │
│   │                   Mobile/Desktop App                           │         │
│   ├───────────────────────────────────────────────────────────────┤         │
│   │  • Add/update products                                         │         │
│   │  • Log egg production                                          │         │
│   │  • Track animal inventory                                      │         │
│   │  • Manage stock levels                                         │         │
│   │  • Push updates to website database                            │         │
│   └───────────────────────────────────────────────────────────────┘         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW                                          │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │    CUSTOMER     │
                        └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌───────────┐ ┌───────────┐ ┌───────────┐
            │  Browse   │ │   Add to  │ │  Checkout │
            │ Products  │ │   Cart    │ │   Order   │
            └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                  │             │             │
                  ▼             ▼             ▼
            ┌─────────────────────────────────────┐
            │           WEBSITE API               │
            │     (Next.js API Routes)            │
            └─────────────────┬───────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────────┐
            │         SQLite DATABASE             │
            │                                     │
            │  ┌─────────┐  ┌─────────────────┐  │
            │  │Products │  │     Orders      │  │
            │  │ Stock   │◄─┤   Order Items   │  │
            │  └─────────┘  └─────────────────┘  │
            └─────────────────┬───────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────────┐
            │         NOTIFICATIONS               │
            │  • Email to owner (new order)       │
            │  • SMS alert (optional)             │
            │  • Email to customer (confirmation) │
            └─────────────────────────────────────┘


                        ┌─────────────────┐
                        │  RANCH OWNER    │
                        └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌───────────┐ ┌───────────┐ ┌───────────┐
            │   Admin   │ │ Livestock │ │   View    │
            │ Dashboard │ │    App    │ │  Orders   │
            │  (Now)    │ │ (Future)  │ │           │
            └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                  │             │             │
                  └─────────────┼─────────────┘
                                │
                                ▼
            ┌─────────────────────────────────────┐
            │           WEBSITE API               │
            │   POST /api/products                │
            │   PUT /api/inventory                │
            │   GET /api/orders                   │
            └─────────────────────────────────────┘
```

## Order Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ORDER PROCESSING FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    Customer                    Website                     Owner
    ────────                    ───────                     ─────
        │                          │                          │
        │  1. Add items to cart    │                          │
        │─────────────────────────►│                          │
        │                          │                          │
        │  2. Enter info & pay     │                          │
        │─────────────────────────►│                          │
        │                          │                          │
        │                          │  3. Validate stock       │
        │                          │◄────────────────────────►│
        │                          │                          │
        │                          │  4. Process payment      │
        │                          │     (Stripe)             │
        │                          │                          │
        │                          │  5. Create order         │
        │                          │  6. Deduct inventory     │
        │                          │                          │
        │  7. Order confirmation   │                          │
        │◄─────────────────────────│                          │
        │     (email)              │                          │
        │                          │  8. New order alert      │
        │                          │─────────────────────────►│
        │                          │     (email + SMS)        │
        │                          │                          │
        │                          │  9. Owner fulfills       │
        │                          │◄─────────────────────────│
        │                          │     marks shipped        │
        │                          │                          │
        │  10. Shipping notice     │                          │
        │◄─────────────────────────│                          │
        │                          │                          │

    ORDER STATUSES:
    ───────────────
    • PENDING      - Just placed, awaiting payment
    • PAID         - Payment received, awaiting fulfillment
    • PROCESSING   - Being prepared
    • READY        - Ready for pickup/shipping
    • SHIPPED      - In transit (for delivery)
    • DELIVERED    - Complete
    • CANCELLED    - Order cancelled
    • REFUNDED     - Payment returned
```

## Inventory Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INVENTORY MANAGEMENT FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────┐
    │   LIVESTOCK APP   │  (Future - Primary inventory management)
    │   ───────────────│
    │  • Egg collection │──────┐
    │  • Animal tracking│      │
    │  • Production logs│      │
    └───────────────────┘      │
                               │
    ┌───────────────────┐      │
    │   ADMIN PANEL     │      │      ┌─────────────────────────┐
    │   ───────────────│      │      │                         │
    │  • Manual updates │──────┼─────►│     SQLite DATABASE     │
    │  • Price changes  │      │      │                         │
    │  • New products   │      │      │  products.stock_qty     │
    └───────────────────┘      │      │  products.in_stock      │
                               │      │  products.price         │
    ┌───────────────────┐      │      │                         │
    │   WEBSITE ORDERS  │      │      └───────────┬─────────────┘
    │   ───────────────│      │                  │
    │  • Auto-deduct on │──────┘                  │
    │    purchase       │                         │
    │  • Reserve on     │                         ▼
    │    cart add       │          ┌─────────────────────────┐
    └───────────────────┘          │   AUTOMATIC TRIGGERS    │
                                   │   ────────────────────  │
                                   │  • Low stock alert      │
                                   │    (when qty < 5)       │
                                   │  • Out of stock alert   │
                                   │    (when qty = 0)       │
                                   │  • Auto-disable product │
                                   │    display when out     │
                                   └─────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TECHNOLOGY STACK                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    FRONTEND                    BACKEND                     DATABASE
    ────────                    ───────                     ────────

    ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
    │  Next.js 14 │            │  Next.js    │            │   SQLite    │
    │  React 18   │◄──────────►│  API Routes │◄──────────►│   Prisma    │
    │  TypeScript │            │  TypeScript │            │     ORM     │
    └─────────────┘            └─────────────┘            └─────────────┘
          │                          │
          ▼                          ▼
    ┌─────────────┐            ┌─────────────┐
    │ Tailwind CSS│            │   Stripe    │
    │ Framer Motion│           │  (Payments) │
    │ Lucide Icons │           └─────────────┘
    └─────────────┘                  │
                                     ▼
                              ┌─────────────┐
                              │  SendGrid   │
                              │   (Email)   │
                              └─────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │   Twilio    │
                              │   (SMS)     │
                              └─────────────┘

    HOSTING                    DOMAIN
    ───────                    ──────

    ┌─────────────┐            ┌─────────────┐
    │   Vercel    │◄──────────►│ Squarespace │
    │  (Free SSL) │            │ (DNS Only)  │
    └─────────────┘            └─────────────┘
```

---

*Last Updated: January 2026*
*Document Version: 1.0*
