"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    children: [
      { name: "Our Story", href: "/about/our-story" },
      { name: "The Land", href: "/about/the-land" },
      { name: "Our Practices", href: "/about/our-practices" },
      { name: "Meet the Animals", href: "/about/animals" },
    ],
  },
  {
    name: "Products",
    href: "/products",
    children: [
      { name: "Eggs", href: "/products/eggs" },
      { name: "Live Poultry", href: "/products/poultry" },
      { name: "Goat Milk Products", href: "/products/goat-milk" },
    ],
  },
  { name: "Farm Journal", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm shadow-sm">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-barn-red rounded-full flex items-center justify-center">
              <span className="text-white font-display text-xl font-bold">BR</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-2xl text-warm-brown">Besso Ranch</span>
              <p className="text-xs text-charcoal-400 -mt-1">Yucca Valley, CA</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-charcoal hover:text-barn-red transition-colors font-medium"
                >
                  <span>{item.name}</span>
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-3 text-charcoal hover:bg-cream hover:text-barn-red transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-charcoal hover:text-barn-red transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-barn-red text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            <button
              className="lg:hidden p-2 text-charcoal"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-charcoal hover:bg-white hover:text-barn-red rounded-lg transition-colors font-medium"
                      onClick={() => !item.children && setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="pl-6 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-charcoal-400 hover:text-barn-red transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
