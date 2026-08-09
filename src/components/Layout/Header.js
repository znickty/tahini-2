'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';
import CartSidebar from '../Cart/CartSidebar';
import { FaShoppingCart, FaBars, FaTimes, FaUser } from 'react-icons/fa';

export default function Header({ locale }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const isArabic = locale === 'ar';
  const totalItems = getTotalItems();

  const getLocalizedPath = (path) => {
    return `/${locale}${path}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: isArabic ? 'الرئيسية' : 'Home', href: getLocalizedPath('/') },
    { name: isArabic ? 'القائمة' : 'Menu', href: getLocalizedPath('/menu') },
    { name: isArabic ? 'عن المطعم' : 'About', href: getLocalizedPath('/about') },
  ];

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href={getLocalizedPath('/')} className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Tahini House" 
                className="h-24 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-gray-700 hover:text-tahini-gold transition-colors ${
                    pathname === item.href ? 'text-tahini-gold font-semibold' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <LanguageSwitcher locale={locale} />
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 hover:text-tahini-gold transition-colors"
              >
                <FaShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tahini-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-gold">
                    {totalItems}
                  </span>
                )}
              </button>
              <button className="text-gray-700 hover:text-tahini-gold transition-colors">
                <FaUser className="text-xl" />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden space-x-4 rtl:space-x-reverse">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700"
              >
                <FaShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tahini-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t py-4">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-gray-700 hover:text-tahini-gold transition-colors px-4 ${
                      pathname === item.href ? 'text-tahini-gold font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-4">
                  <LanguageSwitcher locale={locale} />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        locale={locale}
      />
    </>
  );
}