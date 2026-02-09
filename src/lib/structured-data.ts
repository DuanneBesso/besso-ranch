// JSON-LD Structured Data helpers for SEO rich snippets

const SITE_URL = 'https://bessoranch.com';

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Besso Ranch',
    description: 'Sustainable family farm in Yucca Valley, CA offering farm fresh eggs, live poultry, and handmade goat milk products.',
    url: SITE_URL,
    telephone: '(818) 732-1248',
    email: 'hello@bessoranch.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yucca Valley',
      addressRegion: 'CA',
      postalCode: '92284',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.1142,
      longitude: -116.4321,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '17:00',
      description: 'By appointment',
    },
    image: `${SITE_URL}/images/hero-yucca-valley.jpg`,
    priceRange: '$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card, Cash',
  };
}

export function productJsonLd(product: {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  category: string;
  images?: string | null;
  inStock: boolean;
}) {
  const imageUrls = parseImages(product.images);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} from Besso Ranch`,
    url: `${SITE_URL}/products/${product.category}/${product.slug}`,
    image: imageUrls.length > 0 ? imageUrls : `${SITE_URL}/images/hero-yucca-valley.jpg`,
    brand: {
      '@type': 'Brand',
      name: 'Besso Ranch',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'LocalBusiness',
        name: 'Besso Ranch',
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || '',
    url: `${SITE_URL}/blog/${article.slug}`,
    image: article.featuredImage || `${SITE_URL}/images/hero-blog.jpg`,
    datePublished: article.publishedAt?.toISOString() || article.updatedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Besso Ranch',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Besso Ranch',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };
}

function parseImages(images?: string | null): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}
