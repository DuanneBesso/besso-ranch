import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bessoranch.com"),
  title: {
    default: "Besso Ranch | Farm Fresh Eggs & Sustainable Agriculture | Yucca Valley, CA",
    template: "%s | Besso Ranch",
  },
  description:
    "Besso Ranch offers farm fresh eggs, live poultry, and handmade goat milk products from our sustainable farm in Yucca Valley, California. Experience regenerative agriculture at its finest.",
  keywords: [
    "farm fresh eggs",
    "organic eggs",
    "Yucca Valley farm",
    "sustainable agriculture",
    "regenerative farming",
    "duck eggs",
    "goose eggs",
    "turkey eggs",
    "live poultry",
    "goat milk soap",
    "California farm",
    "High Desert farm",
  ],
  authors: [{ name: "Besso Ranch" }],
  creator: "Besso Ranch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bessoranch.com",
    siteName: "Besso Ranch",
    title: "Besso Ranch | Farm Fresh Eggs & Sustainable Agriculture",
    description:
      "Farm fresh eggs, live poultry, and handmade goat milk products from our sustainable farm in Yucca Valley, California.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Besso Ranch - Sustainable Farm in Yucca Valley",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Besso Ranch | Farm Fresh Eggs & Sustainable Agriculture",
    description:
      "Farm fresh eggs, live poultry, and handmade goat milk products from Yucca Valley, California.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8B2500" />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
