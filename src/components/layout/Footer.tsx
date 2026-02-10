"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const productLinks = [
  { name: "Eggs", href: "/products/eggs" },
  { name: "Live Poultry", href: "/products/poultry" },
  { name: "Goat Milk Products", href: "/products/goat-milk" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Shipping & Returns", href: "/shipping" },
];

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState("/images/logo.png");
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/bessoranch/");
  const [facebookUrl, setFacebookUrl] = useState("https://www.facebook.com/BessoRanch/");

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.site_logo) setLogoUrl(data.site_logo);
        if (data.instagram_profile_url) setInstagramUrl(data.instagram_profile_url);
        if (data.facebook_profile_url) setFacebookUrl(data.facebook_profile_url);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-warm-brown text-cream mt-auto">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image
                src={logoUrl}
                alt="Besso Ranch Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <span className="font-display text-2xl text-cream">Besso Ranch</span>
                <p className="text-xs text-cream/70 -mt-1">Yucca Valley, CA</p>
              </div>
            </Link>
            <p className="text-cream/80 text-sm leading-relaxed mb-4">
              Sustainable agriculture and regenerative farming in the heart of California&apos;s High Desert.
              Farm fresh eggs, live poultry, and handmade goat milk products.
            </p>
            <div className="flex space-x-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-soft-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 hover:text-soft-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-cream mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-soft-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading text-lg text-cream mb-4">Products</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-soft-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg text-cream mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@bessoranch.com"
                  className="flex items-center space-x-3 text-cream/70 hover:text-soft-gold transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>hello@bessoranch.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+18187321248"
                  className="flex items-center space-x-3 text-cream/70 hover:text-soft-gold transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>(818) 732-1248</span>
                </a>
              </li>
              <li>
                <div className="flex items-start space-x-3 text-cream/70 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Yucca Valley, CA 92284</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/60 text-sm">
              &copy; {new Date().getFullYear()} Besso Ranch. All rights reserved.
            </p>
            <ul className="flex flex-wrap justify-center gap-6">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-soft-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
