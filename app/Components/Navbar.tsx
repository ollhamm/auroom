"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY < 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems = [
    { label: "Home", href: "#home" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Benefits", href: "#benefits" },
    { label: "Security", href: "#security" },
    { label: "Docs", href: "#docs" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isAtTop ? "bg-bg-card/80 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-primary">
              <Image src="/images/logo.png" alt="Logo" width={64} height={64} />
            </a>
          </div>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-text-secondary hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Launch App Button - Desktop */}
          <div className="hidden md:flex items-center">
            <a
              href="/app"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Launch App
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-primary hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Sidebar */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-bg-card shadow-2xl z-50 transform transition-transform duration-300 ease-out">
            {/* Close button */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-text-primary hover:text-primary transition-all duration-200 hover:rotate-90"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>

            {/* Menu items */}
            <div className="px-6 space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-text-secondary hover:text-primary hover:bg-bg-main rounded-lg transition-all duration-200 font-medium transform transition-transform"
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {/* Launch App Button */}
              <a
                href="/app"
                className="block mt-6 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-full font-semibold text-center transition-all duration-200 transform"
                style={{
                  animation: `slideIn 0.3s ease-out ${menuItems.length * 0.1}s both`,
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Launch App
              </a>
            </div>

            {/* Decorative bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
          </div>

          <style jsx>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateX(20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </>
      )}
    </nav>
  );
}
