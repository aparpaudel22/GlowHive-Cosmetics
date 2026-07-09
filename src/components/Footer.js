'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = {
  Shop: [
    { label: 'All Products',  href: '/products' },
    { label: 'Skincare',      href: '/products?category=skincare' },
    { label: 'Makeup',        href: '/products?category=makeup' },
    { label: 'New Arrivals',  href: '/new-arrivals' },
    { label: 'Best Sellers',  href: '/best-seller' },
  ],
  Help: [
    { label: 'About Us',      href: '/about' },
    { label: 'Contact',       href: '/contact' },
    { label: 'FAQs',          href: '/faq' },
    { label: 'Shipping',      href: '/shipping' },
    { label: 'Returns',       href: '/returns' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use',   href: '/terms' },
    { label: 'Cookie Policy',  href: '/cookies' },
  ],
};

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const socials = [
  { Icon: IconInstagram, href: '#', label: 'Instagram' },
  { Icon: IconTwitter,   href: '#', label: 'Twitter'   },
  { Icon: IconYoutube,   href: '#', label: 'YouTube'   },
  { Icon: IconFacebook,  href: '#', label: 'Facebook'  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#3d1f25', color: '#fff' }}>
      {/* Main footer */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '64px 28px 40px',
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr 1fr 1fr',
        gap: '48px',
      }}>
        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #b76e79, #e8a4b0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
            }}>🌸</div>
            <span style={{
              fontSize: '20px', fontWeight: 800,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}>
              GlowHive
            </span>
          </div>
          <p style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.60)',
            lineHeight: 1.75, marginBottom: '24px', maxWidth: '240px',
          }}>
            Premium skincare & makeup crafted for your natural beauty. 100% cruelty-free, always.
          </p>

          {/* Socials */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {socials.map(({ Icon, href, label }) => (
              <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.15, background: '#b76e79' }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <Icon />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 style={{
              fontSize: '13px', fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', color: '#b76e79',
              marginBottom: '20px',
            }}>
              {title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ textDecoration: 'none' }}>
                    <motion.span
                      whileHover={{ x: 4, color: '#e8a4b0' }}
                      style={{
                        fontSize: '14px', color: 'rgba(255,255,255,0.60)',
                        cursor: 'pointer', display: 'inline-block',
                        transition: 'color 0.2s',
                      }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.10)',
        padding: '18px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
          © 2026 GlowHive &nbsp;|&nbsp; About &nbsp; Contact &nbsp; Privacy Policy
        </p>
      </div>
    </footer>
  );
}