# Besso Ranch Website — Testing & QA Checklist

**Tester:** _______________
**Date:** _______________
**Environment:** bessoranch.com (Production)
**Browsers to test:** Chrome, Safari, Firefox (desktop + mobile)

---

## 1. Public Pages — Load & Display

| # | Test | Pass? |
|---|------|-------|
| 1.1 | Home page loads with hero, introduction, featured products, meet the animals, newsletter sections | |
| 1.2 | About page loads with subpage links | |
| 1.3 | Our Story page loads with timeline content | |
| 1.4 | The Land page loads with land description and images | |
| 1.5 | Our Practices page loads with practices details | |
| 1.6 | Meet the Animals page loads with animal profiles from DB | |
| 1.7 | Products landing page loads with category filters | |
| 1.8 | Eggs product page loads with product grid and "Why Our Eggs" section with icons | |
| 1.9 | Fertile Hatching Eggs page loads (or shows "Coming Soon" if no products) | |
| 1.10 | Live Poultry page loads with product grid and info section with icons | |
| 1.11 | Goat Milk Products page loads with product grid and "Why Goat Milk" section with icons | |
| 1.12 | Farm Journal (blog) page loads with posts and category filters | |
| 1.13 | Individual blog post page loads with markdown content rendered | |
| 1.14 | Blog category filter buttons work (filter posts by category) | |
| 1.15 | Gallery page loads with Instagram photos | |
| 1.16 | Gallery social follow strip shows Instagram + Facebook buttons | |
| 1.17 | Contact page loads with info cards, form, map, FAQ | |
| 1.18 | Privacy Policy page loads with all sections | |
| 1.19 | Terms of Service page loads with all sections | |
| 1.20 | Shipping & Returns page loads with all sections | |
| 1.21 | Cart page loads (empty state when no items) | |
| 1.22 | Checkout page loads (redirects or empty state when no items) | |

---

## 2. Navigation

| # | Test | Pass? |
|---|------|-------|
| 2.1 | Header logo links to home page | |
| 2.2 | All header nav links work (Home, About, Products, Farm Journal, Gallery, Contact) | |
| 2.3 | Products dropdown shows all 4 categories (Eggs, Fertile Eggs, Poultry, Goat Milk) | |
| 2.4 | About dropdown shows all subpages | |
| 2.5 | Mobile hamburger menu opens and all links work | |
| 2.6 | Cart icon in header opens CartDrawer | |
| 2.7 | Footer quick links all work | |
| 2.8 | Footer product links all work (including Fertile Hatching Eggs) | |
| 2.9 | Footer legal links all work (Privacy, Terms, Shipping) | |
| 2.10 | Footer social icons link to correct Instagram and Facebook pages | |
| 2.11 | Footer email link opens mailto | |
| 2.12 | Footer phone link opens tel dialer | |
| 2.13 | Privacy page cross-links to Terms and Shipping | |
| 2.14 | Terms page cross-links to Shipping | |
| 2.15 | Shipping page cross-links to Privacy and Terms | |

---

## 3. Shopping Cart

| # | Test | Pass? |
|---|------|-------|
| 3.1 | "Add to Cart" button on a product detail page adds item to cart | |
| 3.2 | CartDrawer slides open when item is added | |
| 3.3 | CartDrawer shows correct item name, price, quantity, image | |
| 3.4 | CartDrawer quantity +/- buttons work (respects maxQuantity) | |
| 3.5 | CartDrawer remove button removes item | |
| 3.6 | CartDrawer subtotal calculates correctly | |
| 3.7 | CartDrawer "Proceed to Checkout" links to /checkout | |
| 3.8 | CartDrawer closes with X button | |
| 3.9 | CartDrawer closes with Escape key | |
| 3.10 | CartDrawer closes when clicking backdrop | |
| 3.11 | Cart icon badge shows correct item count | |
| 3.12 | `/cart` page shows same items as CartDrawer (not mock data) | |
| 3.13 | `/cart` page quantity +/- buttons work | |
| 3.14 | `/cart` page remove button works | |
| 3.15 | `/cart` page "Continue Shopping" links to /products | |
| 3.16 | `/cart` page "Proceed to Checkout" links to /checkout | |
| 3.17 | Cart persists after page refresh (localStorage) | |
| 3.18 | Cart shows empty state when all items removed | |
| 3.19 | Pre-order items show "(Pre-Order)" badge | |

---

## 4. Checkout & Payments (Stripe)

| # | Test | Pass? |
|---|------|-------|
| 4.1 | Checkout page shows cart items and totals | |
| 4.2 | Customer info form validates required fields (name, email, phone) | |
| 4.3 | Delivery method toggle (pickup vs delivery) works | |
| 4.4 | Delivery address fields appear when "delivery" is selected | |
| 4.5 | Delivery fee is added when delivery is selected | |
| 4.6 | "Place Order" creates Stripe checkout session and redirects | |
| 4.7 | Stripe checkout page loads with correct items and total | |
| 4.8 | Successful payment redirects to /checkout/success with order number | |
| 4.9 | Cancelled payment redirects to /checkout/cancel | |
| 4.10 | Order is created in database after successful payment | |
| 4.11 | Product stock is decremented after successful payment | |
| 4.12 | Cart is cleared after successful checkout | |

> **Tip:** Use Stripe test card `4242 4242 4242 4242` with any future expiry and any CVC.

---

## 5. Email Notifications

| # | Test | Pass? |
|---|------|-------|
| 5.1 | Admin receives "New Order" email after successful checkout | |
| 5.2 | Order email contains correct items, totals, customer info | |
| 5.3 | Customer receives "Order Status Update" email when admin changes status | |
| 5.4 | Admin receives "Low Stock" warning when product drops below threshold | |
| 5.5 | Contact form submission sends email to admin | |
| 5.6 | Contact form email contains customer name, email, subject, message | |
| 5.7 | Contact form email has reply-to set to customer's email | |

> **Requires:** `GMAIL_USER` and `GMAIL_APP_PASSWORD` environment variables set in Vercel.

---

## 6. Contact Form

| # | Test | Pass? |
|---|------|-------|
| 6.1 | Form validates required fields (name, email, message) | |
| 6.2 | Subject dropdown has all options (Order, Product, Wholesale, Farm Visit, Other) | |
| 6.3 | Submit shows loading spinner | |
| 6.4 | Successful submit shows green "Message Sent!" confirmation | |
| 6.5 | Form clears after successful submission | |
| 6.6 | Error state shows red error banner if submission fails | |

---

## 7. Instagram Gallery

| # | Test | Pass? |
|---|------|-------|
| 7.1 | Gallery grid displays synced Instagram posts | |
| 7.2 | Clicking a photo opens lightbox | |
| 7.3 | Lightbox arrow keys navigate between photos | |
| 7.4 | Lightbox Escape key closes it | |
| 7.5 | Lightbox prev/next arrows work | |
| 7.6 | Video posts show play icon overlay | |
| 7.7 | Carousel/album posts show carousel icon overlay | |
| 7.8 | Hidden posts do NOT appear on public gallery | |
| 7.9 | Instagram follow button links to correct profile | |
| 7.10 | Facebook follow button links to correct page | |

---

## 8. Admin Dashboard

| # | Test | Pass? |
|---|------|-------|
| 8.1 | Admin login page loads at /admin/login | |
| 8.2 | Login with correct credentials succeeds | |
| 8.3 | Login with wrong credentials shows error | |
| 8.4 | Admin dashboard loads after login | |
| 8.5 | Sidebar navigation works for all sections | |

### Products (Admin)
| # | Test | Pass? |
|---|------|-------|
| 8.6 | Product list shows all products | |
| 8.7 | "New Product" form creates a product | |
| 8.8 | Edit product form loads with existing data | |
| 8.9 | Product updates save correctly | |
| 8.10 | Delete product works with confirmation | |
| 8.11 | Image upload works (Vercel Blob) | |
| 8.12 | Product categories include: eggs, poultry, goat-milk, fertile-eggs | |

### Orders (Admin)
| # | Test | Pass? |
|---|------|-------|
| 8.13 | Order list shows all orders | |
| 8.14 | Order detail page shows full order info | |
| 8.15 | Order status can be updated (pending → processing → ready → delivered) | |
| 8.16 | Status update triggers customer email notification | |

### Animals (Admin)
| # | Test | Pass? |
|---|------|-------|
| 8.17 | Animal list shows all animals | |
| 8.18 | New animal form creates an animal profile | |
| 8.19 | Edit animal form saves changes | |
| 8.20 | Delete animal works with confirmation | |

### Blog Posts (Admin)
| # | Test | Pass? |
|---|------|-------|
| 8.21 | Blog post list shows all posts | |
| 8.22 | New post form creates a post | |
| 8.23 | Edit post form saves changes | |
| 8.24 | Published/unpublished toggle works | |
| 8.25 | Post appears on public blog page when published | |

### Settings (Admin)
| # | Test | Pass? |
|---|------|-------|
| 8.26 | Settings page loads with all fields | |
| 8.27 | Settings save correctly | |
| 8.28 | Instagram Integration section visible with Sync Now / Refresh Token | |
| 8.29 | Facebook Page URL field is present | |
| 8.30 | Admin Notification Emails field is present | |
| 8.31 | "Manage Gallery Posts" section shows thumbnail grid | |
| 8.32 | Clicking a gallery post thumbnail toggles hidden/visible | |
| 8.33 | Hidden posts show at reduced opacity with eye-slash icon | |

---

## 9. Inline Editing

| # | Test | Pass? |
|---|------|-------|
| 9.1 | Edit mode toolbar appears at bottom-right when logged in as admin | |
| 9.2 | Clicking "Edit Website" activates edit mode | |
| 9.3 | Editable text elements highlight on hover in edit mode | |
| 9.4 | Clicking an editable element opens edit modal | |
| 9.5 | Editing text and clicking "Save" persists changes to database | |
| 9.6 | Pending changes counter shows correct count | |
| 9.7 | "Discard" button reverts unsaved changes | |
| 9.8 | Ctrl+S / Cmd+S saves changes | |
| 9.9 | Escape exits edit mode (with confirmation if unsaved changes) | |
| 9.10 | Toolbar can be collapsed/expanded | |

---

## 10. SEO & Metadata

| # | Test | Pass? |
|---|------|-------|
| 10.1 | Home page has unique title and description (view source or browser tab) | |
| 10.2 | All public pages have `<title>` tags | |
| 10.3 | OG image shows Yucca Valley ranch landscape (test via social link preview) | |
| 10.4 | `/sitemap.xml` loads and lists all public pages + products + blog posts | |
| 10.5 | `/robots.txt` loads, allows public pages, blocks /admin and /api | |
| 10.6 | Home page has LocalBusiness JSON-LD structured data (view source) | |
| 10.7 | Product detail pages have Product JSON-LD structured data | |
| 10.8 | Category pages have BreadcrumbList JSON-LD | |
| 10.9 | Contact page has FAQPage JSON-LD | |

---

## 11. Animations & Easter Eggs

| # | Test | Pass? |
|---|------|-------|
| 11.1 | Wandering farm animal silhouettes appear occasionally on desktop | |
| 11.2 | Hero section has floating nature particles | |
| 11.3 | Newsletter section has firefly glow effects | |
| 11.4 | Konami code (up up down down left right left right B A) triggers chicken parade | |
| 11.5 | Clicking the logo 5 times rapidly triggers confetti | |
| 11.6 | Animations respect `prefers-reduced-motion` (disabled when system setting is on) | |

---

## 12. Responsive Design

Test each of these at **mobile (375px)**, **tablet (768px)**, and **desktop (1280px)**:

| # | Test | Pass? |
|---|------|-------|
| 12.1 | Home page layout is correct at all breakpoints | |
| 12.2 | Product grid adjusts columns (1 → 2 → 3/4 columns) | |
| 12.3 | Navigation collapses to hamburger on mobile | |
| 12.4 | CartDrawer doesn't overflow on mobile | |
| 12.5 | Contact form is usable on mobile | |
| 12.6 | Checkout form is usable on mobile | |
| 12.7 | Gallery grid adjusts (2 → 3 → 4 columns) | |
| 12.8 | Gallery lightbox works on mobile (swipe or arrows) | |
| 12.9 | Blog posts are readable on mobile | |
| 12.10 | Legal pages (Privacy, Terms, Shipping) are readable on mobile | |
| 12.11 | Footer stacks properly on mobile | |
| 12.12 | Admin dashboard is usable on tablet+ (not required on phone) | |

---

## 13. Contact Info Consistency

| # | Test | Pass? |
|---|------|-------|
| 13.1 | Phone number is (818) 732-1248 on Contact page | |
| 13.2 | Phone number is (818) 732-1248 in Footer | |
| 13.3 | Phone number matches on Privacy, Terms, Shipping pages | |
| 13.4 | Email is hello@bessoranch.com everywhere | |
| 13.5 | Location is Yucca Valley, CA 92284 everywhere | |

---

## 14. Performance & Basics

| # | Test | Pass? |
|---|------|-------|
| 14.1 | No console errors on any public page (open DevTools → Console) | |
| 14.2 | No broken images (all images load or show proper placeholder) | |
| 14.3 | HTTPS is enforced (http redirects to https) | |
| 14.4 | Pages load in under 3 seconds on reasonable connection | |
| 14.5 | Favicon shows Besso Ranch icon in browser tab | |

---

## Sign-Off

| Role | Name | Date | Approved? |
|------|------|------|-----------|
| Developer | | | |
| Owner | Duanne Besso | | |

---

*Generated February 10, 2026 — Besso Ranch Website QA*
