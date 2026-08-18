'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Footer({ locale }) {
  const isArabic = locale === 'ar';
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: isArabic ? 'الرئيسية' : 'Home', href: `/${locale}` },
      { name: isArabic ? 'القائمة' : 'Menu', href: `/${locale}/menu` },
      { name: isArabic ? 'عن المطعم' : 'About', href: `/${locale}/about` },
      { name: isArabic ? 'اتصل بنا' : 'Contact', href: `/${locale}/contact` },
    ],
    support: [
      { name: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy', href: `/${locale}/privacy` },
      { name: isArabic ? 'الشروط والأحكام' : 'Terms & Conditions', href: `/${locale}/terms` },
      { name: isArabic ? 'سياسة الاسترجاع' : 'Return Policy', href: `/${locale}/returns` },
      { name: isArabic ? 'الأسئلة الشائعة' : 'FAQ', href: `/${locale}/faq` },
    ]
  };

  const socialLinks = [
    { icon: <FaInstagram />, href: 'https://instagram.com/tahinihouse', label: 'Instagram' },
    { icon: <FaWhatsapp />, href: 'https://wa.me/966500000000', label: 'WhatsApp' },
    { icon: <FaFacebook />, href: 'https://facebook.com/tahinihouse', label: 'Facebook' },
    { icon: <FaTwitter />, href: 'https://twitter.com/tahinihouse', label: 'Twitter' },
  ];

  return (
    <footer className="bg-tahini-dark text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Tahini House" className="h-12 w-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isArabic 
                ? 'ثلث كيلوغرام - أفضل المأكولات السعودية في جدة. نقدم لكم أشهى الأطباق التقليدية بلمسة عصرية.'
                : 'One-third Kilogram - The best Saudi cuisine in Jeddah. We serve traditional dishes with a modern touch.'
              }
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-tahini-gold flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-tahini-gold">
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-tahini-gold transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-tahini-gold">
              {isArabic ? 'الدعم' : 'Support'}
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-tahini-gold transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-tahini-gold">
              {isArabic ? 'معلومات الاتصال' : 'Contact Info'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <FaMapMarkerAlt className="text-tahini-gold mt-1 flex-shrink-0" />
                <span>
                  {isArabic 
                    ? 'السلامة، جدة، المملكة العربية السعودية'
                    : 'As Salamah, Jeddah, Saudi Arabia'
                  }
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FaPhone className="text-tahini-gold flex-shrink-0" />
                <a href="tel:+966506771331" className="hover:text-tahini-gold transition-colors">
                  +966 50 677 1331
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FaEnvelope className="text-tahini-gold flex-shrink-0" />
                <a href="mailto:admin@iszltd.com" className="hover:text-tahini-gold transition-colors">
                  admin@iszltd.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              &copy; {currentYear} Tahini House. 
              {isArabic ? ' جميع الحقوق محفوظة' : ' All rights reserved.'}
            </p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <span>{isArabic ? 'صنع بإتقان' : 'Made with'} ❤️</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}